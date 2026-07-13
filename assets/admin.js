import { firebaseConfig, firebaseReady } from './firebase-config.js';
const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
let auth,db,storage,currentUser,role='teacher',FS,ST;
const privileged=['admin','gb','pkpentadbiran','pkkoku','pkhem'];
const toast=m=>{const n=document.createElement('div');n.className='toast';n.textContent=m;document.body.appendChild(n);setTimeout(()=>n.remove(),3200)};
const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const canManage=()=>privileged.includes(role);
if(!firebaseReady){$('#setupWarning')?.classList.remove('hidden');$('#loginForm button').disabled=true}

async function init(){
 if(!firebaseReady)return;
 const appMod=await import('https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js');
 const authMod=await import('https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js');
 FS=await import('https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js');
 ST=await import('https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js');
 const app=appMod.initializeApp(firebaseConfig); auth=authMod.getAuth(app); db=FS.getFirestore(app); storage=ST.getStorage(app);
 $('#loginForm')?.addEventListener('submit',async e=>{e.preventDefault();try{await authMod.signInWithEmailAndPassword(auth,$('#email').value,$('#password').value)}catch(err){toast('Log masuk gagal. Semak e-mel dan kata laluan.')}});
 $('#logoutBtn')?.addEventListener('click',()=>authMod.signOut(auth));
 authMod.onAuthStateChanged(auth,async user=>{
  if(!user){$('#loginPanel')?.classList.remove('hidden');$('#dashboardPanel')?.classList.add('hidden');return}
  currentUser=user; const snap=await FS.getDoc(FS.doc(db,'users',user.uid)); const u=snap.exists()?snap.data():{}; role=u.role||'teacher';
  $('#userLabel').textContent=(u.name||user.email)+' • '+role; $('#loginPanel')?.classList.add('hidden'); $('#dashboardPanel')?.classList.remove('hidden'); applyRole(); bindForms(); subscribeAll();
 });
}
function applyRole(){ $$('[data-roles]').forEach(el=>el.classList.toggle('hidden',!el.dataset.roles.split(',').includes(role))); }
let bound=false;
function bindForms(){ if(bound)return; bound=true;
 $('#announcementForm')?.addEventListener('submit',saveAnnouncement);
 $('#activityForm')?.addEventListener('submit',saveActivity);
 $('#settingsForm')?.addEventListener('submit',saveSettings);
 $('#quickForm')?.addEventListener('submit',saveQuickLink);
 $('#clearAnn')?.addEventListener('click',()=>resetAnnouncement());
 $('#clearQuick')?.addEventListener('click',()=>resetQuick());
}
async function saveAnnouncement(e){e.preventDefault(); if(!canManage())return toast('Tiada kebenaran.'); const id=$('#annId').value; const data={title:$('#annTitle').value.trim(),body:$('#annBody').value.trim(),published:$('#annPublished').checked,updatedAt:FS.serverTimestamp(),updatedBy:currentUser.uid}; try{if(id)await FS.updateDoc(FS.doc(db,'announcements',id),data);else await FS.addDoc(FS.collection(db,'announcements'),{...data,createdAt:FS.serverTimestamp(),createdBy:currentUser.uid}); resetAnnouncement();toast('Pengumuman disimpan.')}catch(err){toast(err.message)}}
function resetAnnouncement(){ $('#announcementForm')?.reset(); $('#annId').value=''; $('#annPublished').checked=true; $('#annSubmit').textContent='Simpan Pengumuman'; }
async function saveActivity(e){e.preventDefault(); const file=$('#activityImage').files[0]; if(!file)return toast('Pilih gambar dahulu.'); if(file.size>5*1024*1024)return toast('Saiz gambar maksimum 5MB.'); try{const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'_');const ref=ST.ref(storage,`activities/${currentUser.uid}/${Date.now()}-${safe}`);await ST.uploadBytes(ref,file,{contentType:file.type});const url=await ST.getDownloadURL(ref);await FS.addDoc(FS.collection(db,'activities'),{title:$('#actTitle').value.trim(),description:$('#actDescription').value.trim(),section:$('#actSection').value,activityDate:$('#actDate').value,imageUrl:url,storagePath:ref.fullPath,status:canManage()?'approved':'pending',createdAt:FS.serverTimestamp(),createdBy:currentUser.uid});e.target.reset();toast('Aktiviti berjaya dihantar.')}catch(err){toast(err.message)}}
async function saveSettings(e){e.preventDefault(); if(!canManage())return toast('Tiada kebenaran.'); const data={schoolName:$('#schoolName').value.trim(),tagline:$('#tagline').value.trim(),vision:$('#vision').value.trim(),mission:$('#mission').value.trim(),motto:$('#motto').value.trim(),address:$('#address').value.trim(),updatedAt:FS.serverTimestamp(),updatedBy:currentUser.uid}; try{await FS.setDoc(FS.doc(db,'settings','site'),data,{merge:true});toast('Profil portal dikemas kini.')}catch(err){toast(err.message)}}
async function saveQuickLink(e){e.preventDefault(); if(!canManage())return toast('Tiada kebenaran.'); const id=$('#quickId').value; const data={label:$('#quickLabel').value.trim(),url:$('#quickUrl').value.trim(),icon:$('#quickIcon').value.trim()||'🔗',order:Number($('#quickOrder').value||0),active:$('#quickActive').checked,updatedAt:FS.serverTimestamp()}; try{if(id)await FS.updateDoc(FS.doc(db,'quickLinks',id),data);else await FS.addDoc(FS.collection(db,'quickLinks'),{...data,createdAt:FS.serverTimestamp()}); resetQuick();toast('Quick Access disimpan.')}catch(err){toast(err.message)}}
function resetQuick(){ $('#quickForm')?.reset(); $('#quickId').value=''; $('#quickActive').checked=true; $('#quickSubmit').textContent='Simpan Pautan'; }
function subscribeAll(){
 FS.onSnapshot(FS.query(FS.collection(db,'announcements'),FS.orderBy('createdAt','desc')),s=>renderAnnouncements(s.docs.map(d=>({id:d.id,...d.data()}))));
 FS.onSnapshot(FS.query(FS.collection(db,'activities'),FS.orderBy('createdAt','desc')),s=>renderActivities(s.docs.map(d=>({id:d.id,...d.data()}))));
 FS.onSnapshot(FS.query(FS.collection(db,'quickLinks'),FS.orderBy('order','asc')),s=>renderQuick(s.docs.map(d=>({id:d.id,...d.data()}))));
 FS.onSnapshot(FS.doc(db,'settings','site'),s=>{if(s.exists())fillSettings(s.data())});
}
function renderAnnouncements(rows){$('#annRows').innerHTML=rows.map(x=>`<tr><td>${esc(x.title)}</td><td>${x.published?'Awam':'Draf'}</td><td><button class="btn btn-small" onclick="editAnnouncement('${x.id}')">Edit</button> <button class="btn btn-danger btn-small" onclick="deleteAnnouncement('${x.id}')">Padam</button></td></tr>`).join('')||'<tr><td colspan="3">Belum ada pengumuman.</td></tr>'; $('#countAnnouncements').textContent=rows.length; window._ann=rows;}
function renderActivities(rows){$('#activityRows').innerHTML=rows.map(x=>`<tr><td>${esc(x.title)}</td><td>${esc(x.section)}</td><td><span class="badge">${esc(x.status)}</span></td><td>${x.status==='pending'&&canManage()?`<button class="btn btn-green btn-small" onclick="approveActivity('${x.id}')">Lulus</button>`:''} ${canManage()?`<button class="btn btn-danger btn-small" onclick="deleteActivity('${x.id}','${esc(x.storagePath||'')}')">Padam</button>`:''}</td></tr>`).join('')||'<tr><td colspan="4">Belum ada aktiviti.</td></tr>'; $('#countActivities').textContent=rows.length; $('#countPending').textContent=rows.filter(x=>x.status==='pending').length;}
function renderQuick(rows){$('#quickRows').innerHTML=rows.map(x=>`<tr><td>${esc(x.icon||'🔗')} ${esc(x.label)}</td><td>${x.active?'Aktif':'Tutup'}</td><td><button class="btn btn-small" onclick="editQuick('${x.id}')">Edit</button> <button class="btn btn-danger btn-small" onclick="deleteQuick('${x.id}')">Padam</button></td></tr>`).join('')||'<tr><td colspan="3">Belum ada pautan.</td></tr>'; window._quick=rows;}
function fillSettings(x){$('#schoolName').value=x.schoolName||'Sekolah Kebangsaan Obah';$('#tagline').value=x.tagline||'Beluran, Sabah';$('#vision').value=x.vision||'';$('#mission').value=x.mission||'';$('#motto').value=x.motto||'';$('#address').value=x.address||'';}
window.editAnnouncement=id=>{const x=window._ann.find(v=>v.id===id);if(!x)return;$('#annId').value=id;$('#annTitle').value=x.title||'';$('#annBody').value=x.body||'';$('#annPublished').checked=!!x.published;$('#annSubmit').textContent='Kemas Kini';location.hash='announcement'};
window.deleteAnnouncement=async id=>{if(confirm('Padam pengumuman ini?'))await FS.deleteDoc(FS.doc(db,'announcements',id))};
window.approveActivity=async id=>{await FS.updateDoc(FS.doc(db,'activities',id),{status:'approved',approvedBy:currentUser.uid,approvedAt:FS.serverTimestamp()});toast('Aktiviti diluluskan.')};
window.deleteActivity=async(id,path)=>{if(!confirm('Padam aktiviti ini?'))return;await FS.deleteDoc(FS.doc(db,'activities',id));if(path)try{await ST.deleteObject(ST.ref(storage,path))}catch{}toast('Aktiviti dipadam.')};
window.editQuick=id=>{const x=window._quick.find(v=>v.id===id);if(!x)return;$('#quickId').value=id;$('#quickLabel').value=x.label||'';$('#quickUrl').value=x.url||'';$('#quickIcon').value=x.icon||'';$('#quickOrder').value=x.order||0;$('#quickActive').checked=!!x.active;$('#quickSubmit').textContent='Kemas Kini';location.hash='quick'};
window.deleteQuick=async id=>{if(confirm('Padam pautan ini?'))await FS.deleteDoc(FS.doc(db,'quickLinks',id))};
init();

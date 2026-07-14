import { firebaseConfig, firebaseReady } from './firebase-config.js';

const params=new URLSearchParams(location.search);
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const safeUrl=url=>{try{const u=new URL(url,location.href);return ['http:','https:'].includes(u.protocol)?u.href:'#'}catch{return '#'}};
const section=params.get('section')||'kurikulum';
const sectionNames={pentadbiran:'Pentadbiran',kurikulum:'Kurikulum',kokurikulum:'Kokurikulum',hem:'Hal Ehwal Murid'};
const backPages={pentadbiran:'pentadbiran.html',kurikulum:'kurikulum.html',kokurikulum:'kokurikulum.html',hem:'hem.html'};

function render(data={}){
  const title=data.title||params.get('title')||'Modul Sekolah';
  const description=data.description||params.get('description')||'';
  const content=data.content||description||'Maklumat lanjut untuk modul ini akan dikemas kini oleh pentadbir.';
  const url=data.url||params.get('url')||'';
  document.title=`${title} | SK Obah`;
  document.querySelector('#moduleSection').textContent=(sectionNames[data.section||section]||'Modul').toUpperCase();
  document.querySelector('#moduleTitle').textContent=title;
  document.querySelector('#moduleSummary').textContent=description;
  document.querySelector('#moduleIcon').textContent=data.icon||params.get('icon')||'📚';
  document.querySelector('#moduleContent').innerHTML=esc(content).split(/\n{2,}/).map(p=>`<p>${p.replace(/\n/g,'<br>')}</p>`).join('');
  const resource=document.querySelector('#moduleResource');
  if(url&&safeUrl(url)!=='#'){resource.href=safeUrl(url);resource.classList.remove('hidden')}
  document.querySelector('#moduleBack').href=backPages[data.section||section]||'index.html';
}

render();
const id=params.get('id');
if(firebaseReady&&id){
  try{
    const [{initializeApp},{getFirestore,doc,getDoc}]=await Promise.all([
      import('https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js')
    ]);
    const db=getFirestore(initializeApp(firebaseConfig));
    const snap=await getDoc(doc(db,'modules',id));
    if(snap.exists()&&snap.data().active!==false)render(snap.data());
  }catch(error){console.warn('Kandungan modul tidak dapat dimuatkan:',error.message)}
}

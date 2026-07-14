import { firebaseConfig, firebaseReady } from './firebase-config.js';
document.head.insertAdjacentHTML('beforeend','<link rel="stylesheet" href="assets/visual-settings.css">');

const defaults = {
  site: { schoolName:'Sekolah Kebangsaan Obah', shortName:'SK Obah', tagline:'Beluran, Sabah', motto:'Berilmu, Berbakti, Berjaya', facebookUrl:'', phone:'', email:'', address:'Beluran, Sabah' },
  announcements: [{ title:'Selamat datang ke Portal Digital SK Obah', body:'Pusat maklumat rasmi sekolah untuk warga SK Obah dan komuniti.', published:true, createdAt:new Date() }],
  news: [], events: [], activities: [],
  quickLinks: [
    {label:'IDME',url:'https://idme.moe.gov.my/',icon:'🪪',order:1,active:true},
    {label:'DELIMa',url:'https://d2.delima.edu.my/',icon:'🌐',order:2,active:true},
    {label:'HRMIS',url:'https://hrmis2.eghrmis.gov.my/',icon:'👨‍💼',order:3,active:true},
    {label:'PAJSK',url:'#',icon:'📊',order:4,active:true},
    {label:'SEGAK',url:'#',icon:'🏃',order:5,active:true},
    {label:'Google Drive',url:'https://drive.google.com/',icon:'📁',order:6,active:true},
    {label:'Google Calendar',url:'https://calendar.google.com/',icon:'📅',order:7,active:true},
    {label:'Gmail',url:'https://mail.google.com/',icon:'✉️',order:8,active:true},
    {label:'Google Meet',url:'https://meet.google.com/',icon:'🎥',order:9,active:true},
    {label:'Panel Guru',url:'admin.html',icon:'🔐',order:10,active:true}
  ],
  modules: {
    pentadbiran:[['Carta Organisasi','Struktur kepimpinan sekolah','🏫'],['Takwim Sekolah','Perancangan dan aktiviti tahunan','📅'],['Pekeliling','Makluman serta rujukan rasmi','📄'],['Muat Turun Borang','Borang kegunaan warga sekolah','📥']],
    kurikulum:[['Panitia','Pengurusan mata pelajaran','📚'],['PBD','Pentaksiran Bilik Darjah','📊'],['PLC','Komuniti pembelajaran profesional','🤝'],['Program Akademik','Intervensi dan kecemerlangan murid','🎓'],['Jadual Waktu','Maklumat jadual persekolahan','🗓️'],['Pentaksiran','Maklumat pentaksiran sekolah','✅']],
    kokurikulum:[['PAJSK','Pentaksiran aktiviti jasmani, sukan dan kokurikulum','📊'],['SEGAK','Standard Kecergasan Fizikal Kebangsaan','🏃'],['Unit Beruniform','Aktiviti dan pencapaian unit','🎖️'],['Kelab & Persatuan','Aktiviti kelab dan persatuan','👥'],['Sukan & Permainan','Program sukan sekolah','⚽'],['Kejohanan','Penyertaan dan pencapaian','🏆']],
    hem:[['Kebajikan','Bantuan dan kebajikan murid','💚'],['SPBT','Pengurusan buku teks','📘'],['RMT','Program Rancangan Makanan Tambahan','🍽️'],['Kesihatan','Program kesihatan murid','🩺'],['Bimbingan & Kaunseling','Sokongan perkembangan murid','🤝'],['3K','Kebersihan, kesihatan dan keselamatan','🛡️']]
  }
};

const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const safeUrl=(url='')=>{try{const u=new URL(url,location.href);return ['http:','https:'].includes(u.protocol)?u.href:(url.startsWith('#')||url.endsWith('.html')?url:'#')}catch{return '#'}};
const dateValue=v=>v?.toDate?v.toDate():v?.seconds?new Date(v.seconds*1000):new Date(v||Date.now());
const formatDate=v=>dateValue(v).toLocaleDateString('ms-MY',{day:'numeric',month:'long',year:'numeric'});

function bindChrome(){
  document.querySelectorAll('img[src$="logo.jpg"]').forEach(e=>e.setAttribute('data-site-logo',''));
  document.querySelectorAll('img[src$="bendera.png"]').forEach(e=>e.setAttribute('data-site-flag',''));
  document.querySelectorAll('img[src$="peta.jpg"]').forEach(e=>e.setAttribute('data-site-plan',''));
  document.querySelectorAll('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
  const clock=document.querySelector('#clock'); const tick=()=>{if(clock)clock.textContent=new Date().toLocaleString('ms-MY',{dateStyle:'medium',timeStyle:'short'})}; tick();setInterval(tick,30000);
  const btn=document.querySelector('.menu-btn'), nav=document.querySelector('.navlinks'); btn?.addEventListener('click',()=>{const open=nav?.classList.toggle('open');btn.setAttribute('aria-expanded',String(!!open))});
  document.querySelectorAll('[data-scroll]').forEach(btn=>btn.addEventListener('click',()=>{const rail=document.getElementById(btn.dataset.scroll);rail?.scrollBy({left:Number(btn.dataset.direction||1)*Math.min(rail.clientWidth*.8,650),behavior:'smooth'})}));
}
function applySite(x={}){const s={...defaults.site,...x},root=document.documentElement,validColor=v=>/^#[0-9a-f]{6}$/i.test(v||'');document.querySelectorAll('[data-school-name]').forEach(e=>e.textContent=s.schoolName);document.querySelectorAll('[data-tagline]').forEach(e=>e.textContent=s.tagline);document.querySelectorAll('[data-motto]').forEach(e=>e.textContent=s.motto);document.querySelectorAll('[data-address]').forEach(e=>e.textContent=s.address);document.querySelectorAll('[data-phone]').forEach(e=>e.textContent=s.phone||'Belum ditetapkan');document.querySelectorAll('[data-email]').forEach(e=>e.textContent=s.email||'Belum ditetapkan');const vision=document.querySelector('#publicVision'),mission=document.querySelector('#publicMission'),motto=document.querySelector('#publicMotto');if(vision&&s.vision)vision.textContent=s.vision;if(mission&&s.mission)mission.textContent=s.mission;if(motto&&s.motto)motto.textContent=s.motto;document.querySelectorAll('[data-facebook]').forEach(e=>{if(s.facebookUrl){e.href=safeUrl(s.facebookUrl);e.hidden=false}else e.hidden=true});if(validColor(s.primaryColor))root.style.setProperty('--blue',s.primaryColor);if(validColor(s.secondaryColor))root.style.setProperty('--green',s.secondaryColor);if(validColor(s.accentColor))root.style.setProperty('--yellow',s.accentColor);root.style.setProperty('--hero-overlay',String(Math.min(90,Math.max(20,Number(s.heroOverlay||65)))/100));if(s.bannerUrl)root.style.setProperty('--hero-image',`url("${safeUrl(s.bannerUrl)}")`);const section=document.body.dataset.section,sectionKey=section?`${section}BannerUrl`:'';if(sectionKey&&s[sectionKey])root.style.setProperty('--page-hero-image',`url("${safeUrl(s[sectionKey])}")`);if(s.logoUrl)document.querySelectorAll('.brand img,[data-site-logo]').forEach(e=>e.src=safeUrl(s.logoUrl));if(s.flagUrl)document.querySelectorAll('[data-site-flag]').forEach(e=>e.src=safeUrl(s.flagUrl));if(s.planUrl)document.querySelectorAll('[data-site-plan]').forEach(e=>e.src=safeUrl(s.planUrl));}
function renderCards(target,items,type){const el=document.querySelector(target);if(!el)return;el.innerHTML=items.length?items.map(x=>{if(type==='activity')return `<article class="gallery-card"><img loading="lazy" src="${safeUrl(x.imageUrl||'assets/img/banner.png')}" alt="${esc(x.title)}"><div class="body"><span class="badge">${esc(x.section||'Aktiviti')}</span><h3>${esc(x.title)}</h3><p>${esc(x.description||'')}</p><div class="meta">${esc(x.activityDate||formatDate(x.createdAt))}</div></div></article>`;if(type==='event')return `<article class="card event-card"><time>${formatDate(x.eventDate||x.createdAt)}</time><h3>${esc(x.title)}</h3><p>${esc(x.description||'')}</p></article>`;return `<article class="card"><span class="badge">${type==='news'?'Berita':'Pengumuman'}</span><h3>${esc(x.title)}</h3><p>${esc(x.body||x.summary||'')}</p><div class="meta">${formatDate(x.createdAt)}</div></article>`}).join(''):`<article class="empty-state"><strong>Belum ada kandungan</strong><span>Maklumat baharu akan dipaparkan di sini.</span></article>`;}
function renderQuick(items){const el=document.querySelector('#quickAccess');if(!el)return;el.innerHTML=items.filter(x=>x.active!==false).sort((a,b)=>(a.order||0)-(b.order||0)).map(x=>`<a class="quick-card" href="${safeUrl(x.url)}" ${(x.url||'').startsWith('http')?'target="_blank" rel="noopener"':''}><span>${esc(x.icon||'🔗')}</span><strong>${esc(x.label)}</strong></a>`).join('');}
function renderModules(section,items){const el=document.querySelector('[data-module-rail]');if(!el)return;const rows=items.map(x=>Array.isArray(x)?{title:x[0],description:x[1],icon:x[2]}:x).filter(x=>x.active!==false).sort((a,b)=>(a.order||0)-(b.order||0));el.innerHTML=rows.map(x=>`<article class="module-card"><span class="module-icon">${esc(x.icon||'•')}</span><h3>${esc(x.title)}</h3><p>${esc(x.description||'')}</p>${x.url?`<a href="${safeUrl(x.url)}">Lihat maklumat →</a>`:''}</article>`).join('');}
async function startFirebase(){if(!firebaseReady){document.body.dataset.firebase='offline';return}try{const [{initializeApp},{getFirestore,collection,query,where,orderBy,onSnapshot,limit,doc}]=await Promise.all([import('https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js')]);const db=getFirestore(initializeApp(firebaseConfig));
  const listen=(ref,ok)=>onSnapshot(ref,s=>ok(s.docs?s.docs.map(d=>({id:d.id,...d.data()})):(s.exists()?s.data():{})),e=>console.warn(e.message));
  listen(doc(db,'settings','site'),applySite);
  listen(query(collection(db,'announcements'),where('published','==',true),orderBy('createdAt','desc'),limit(6)),x=>renderCards('#announcementList',x,'announcement'));
  listen(query(collection(db,'news'),where('published','==',true),orderBy('createdAt','desc'),limit(6)),x=>renderCards('#newsList',x,'news'));
  listen(query(collection(db,'events'),where('published','==',true),orderBy('eventDate','asc'),limit(8)),x=>renderCards('#eventList',x,'event'));
  listen(query(collection(db,'activities'),where('status','==','approved'),orderBy('createdAt','desc'),limit(12)),x=>renderCards('#publicGallery',x,'activity'));
  listen(query(collection(db,'quickLinks'),where('active','==',true),orderBy('order','asc')),x=>renderQuick(x.length?x:defaults.quickLinks));
  const section=document.body.dataset.section;if(section)listen(query(collection(db,'modules'),where('section','==',section),where('active','==',true),orderBy('order','asc')),x=>renderModules(section,x.length?x:defaults.modules[section]));
}catch(e){console.warn('Firebase tidak dapat dimulakan:',e.message)}}

bindChrome();applySite();renderCards('#announcementList',defaults.announcements,'announcement');renderCards('#newsList',defaults.news,'news');renderCards('#eventList',defaults.events,'event');renderCards('#publicGallery',defaults.activities,'activity');renderQuick(defaults.quickLinks);const section=document.body.dataset.section;if(section)renderModules(section,defaults.modules[section]);startFirebase();

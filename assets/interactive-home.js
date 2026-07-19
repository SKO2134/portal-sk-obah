const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const configs=[
  {id:'newsList',label:'Berita sekolah',interval:5200},
  {id:'publicGallery',label:'Galeri aktiviti',interval:4300}
];

function move(rail,direction){
  const cards=[...rail.querySelectorAll(':scope > article')];
  const atEnd=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-12;
  const atStart=rail.scrollLeft<=12;
  if(direction>0&&atEnd)rail.scrollTo({left:0,behavior:'smooth'});
  else if(direction<0&&atStart)rail.scrollTo({left:rail.scrollWidth,behavior:'smooth'});
  else{
    const positions=cards.map(card=>card.offsetLeft-rail.offsetLeft);
    const target=direction>0
      ?positions.find(position=>position>rail.scrollLeft+12)
      :positions.reverse().find(position=>position<rail.scrollLeft-12);
    rail.scrollTo({left:target??(direction>0?rail.scrollWidth:0),behavior:'smooth'});
  }
}

function addControls(rail,config){
  const section=rail.closest('.section');
  const head=section?.querySelector('.section-head');
  if(!head||head.querySelector(`[data-controls="${config.id}"]`))return;
  const controls=document.createElement('div');
  controls.className='carousel-controls';controls.dataset.controls=config.id;
  controls.innerHTML=`<button type="button" aria-label="Sebelumnya: ${config.label}">‹</button><button type="button" aria-label="Seterusnya: ${config.label}">›</button>`;
  const [prev,next]=controls.querySelectorAll('button');prev.addEventListener('click',()=>move(rail,-1));next.addEventListener('click',()=>move(rail,1));head.append(controls);
}

function enableAuto(rail,config){
  if(reduceMotion||rail.dataset.autoReady)return;rail.dataset.autoReady='true';let timer;
  const start=()=>{clearInterval(timer);timer=setInterval(()=>{if(!document.hidden)move(rail,1)},config.interval)};
  const stop=()=>clearInterval(timer);
  rail.addEventListener('mouseenter',stop);rail.addEventListener('mouseleave',start);
  rail.addEventListener('focusin',stop);rail.addEventListener('focusout',start);
  rail.addEventListener('pointerdown',stop);rail.addEventListener('pointerup',start);
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());start();
}

function openGallery(card){
  const img=card.querySelector('img');if(!img)return;
  const modal=document.querySelector('#galleryLightbox')||createLightbox();
  modal.querySelector('img').src=img.src;modal.querySelector('img').alt=img.alt;
  modal.querySelector('h3').textContent=card.querySelector('h3')?.textContent||'Aktiviti SK Obah';
  modal.querySelector('p').textContent=card.querySelector('p')?.textContent||'';
  modal.showModal();modal.querySelector('button').focus();
}

function createLightbox(){
  const modal=document.createElement('dialog');modal.id='galleryLightbox';modal.className='gallery-lightbox';
  modal.innerHTML='<button aria-label="Tutup gambar">×</button><div><img alt=""><section><h3></h3><p></p></section></div>';
  modal.querySelector('button').addEventListener('click',()=>modal.close());
  modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});document.body.append(modal);return modal;
}

function enhance(config){
  const rail=document.getElementById(config.id);if(!rail)return;
  rail.classList.add('interactive-rail');rail.setAttribute('aria-label',config.label);
  addControls(rail,config);enableAuto(rail,config);
  if(config.id==='publicGallery')rail.addEventListener('click',e=>{const card=e.target.closest('.gallery-card');if(card)openGallery(card)});
}

configs.forEach(config=>{const rail=document.getElementById(config.id);if(!rail)return;enhance(config);new MutationObserver(()=>enhance(config)).observe(rail,{childList:true})});

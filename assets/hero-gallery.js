document.head.insertAdjacentHTML('beforeend','<link rel="stylesheet" href="assets/hero-gallery.css">');
const gallery=document.querySelector('.hero-feature');
if(gallery){
  const slides=[...gallery.querySelectorAll('.feature-slide')];
  const dots=[...gallery.querySelectorAll('[data-feature-dot]')];
  const stories=[...document.querySelectorAll('.hero-stories a')];
  const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current=0,timer;
  const show=index=>{
    current=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>slide.classList.toggle('active',i===current));
    dots.forEach((dot,i)=>{dot.classList.toggle('active',i===current);dot.setAttribute('aria-selected',String(i===current))});
    stories.forEach((story,i)=>story.classList.toggle('story-active',i===current));
  };
  const stop=()=>clearInterval(timer);
  const start=()=>{stop();if(!reduceMotion)timer=setInterval(()=>show(current+1),4800)};
  gallery.querySelector('[data-feature-prev]')?.addEventListener('click',()=>{show(current-1);start()});
  gallery.querySelector('[data-feature-next]')?.addEventListener('click',()=>{show(current+1);start()});
  dots.forEach(dot=>dot.addEventListener('click',()=>{show(Number(dot.dataset.featureDot));start()}));
  gallery.addEventListener('mouseenter',stop);gallery.addEventListener('mouseleave',start);
  gallery.addEventListener('focusin',stop);gallery.addEventListener('focusout',start);
  document.addEventListener('visibilitychange',()=>document.hidden?stop():start());
  show(0);start();
}

document.addEventListener('DOMContentLoaded',()=>{
  const items=[...document.querySelectorAll('.reveal-card')];
  if(!items.length)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver'in window)){
    items.forEach(item=>item.classList.add('is-visible'));
    return;
  }
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },{threshold:.14,rootMargin:'0px 0px -35px'});
  items.forEach(item=>observer.observe(item));
});

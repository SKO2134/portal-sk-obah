(() => {
  const hero = document.querySelector('.school-hero');
  if (!hero) return;
  const slides = [...hero.querySelectorAll('.hero-slide')];
  const dotsBox = hero.querySelector('.hero-dots');
  const prev = hero.querySelector('[data-hero-prev]');
  const next = hero.querySelector('[data-hero-next]');
  const pause = hero.querySelector('[data-hero-pause]');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let stopped = reduceMotion;
  let timer;

  const dots = slides.map((slide, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hero-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Papar gambar ${index + 1}: ${slide.dataset.title || ''}`);
    dot.addEventListener('click', () => show(index, true));
    dotsBox.append(dot);
    return dot;
  });

  function show(index, restart = false) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === current);
      dot.setAttribute('aria-selected', String(i === current));
    });
    if (restart) start();
  }

  function start() {
    clearInterval(timer);
    if (!stopped && slides.length > 1) timer = setInterval(() => show(current + 1), 6500);
  }

  prev?.addEventListener('click', () => show(current - 1, true));
  next?.addEventListener('click', () => show(current + 1, true));
  pause?.addEventListener('click', () => {
    stopped = !stopped;
    pause.textContent = stopped ? 'Main' : 'Jeda';
    pause.setAttribute('aria-pressed', String(stopped));
    pause.setAttribute('aria-label', stopped ? 'Mulakan pertukaran automatik' : 'Hentikan pertukaran automatik');
    start();
  });
  hero.addEventListener('mouseenter', () => clearInterval(timer));
  hero.addEventListener('mouseleave', start);
  document.addEventListener('visibilitychange', () => document.hidden ? clearInterval(timer) : start());
  show(0);
  start();
})();

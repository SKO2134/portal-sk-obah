(() => {
  document.querySelectorAll('[data-rotator]').forEach((rotator) => {
    const slides = [...rotator.querySelectorAll('.rotator-slide')];
    if (slides.length < 2) return;
    const dotsBox = rotator.querySelector('[data-dots]');
    let current = 0;
    let timer;

    const dots = dotsBox ? slides.map((slide, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'rotator-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Papar foto ${index + 1}`);
      dot.addEventListener('click', () => show(index, true));
      dotsBox.append(dot);
      return dot;
    }) : [];

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
      if (!document.hidden) {
        timer = setInterval(() => show(current + 1), Number(rotator.dataset.interval) || 5000);
      }
    }

    rotator.querySelector('[data-prev]')?.addEventListener('click', () => show(current - 1, true));
    rotator.querySelector('[data-next]')?.addEventListener('click', () => show(current + 1, true));
    document.addEventListener('visibilitychange', start);
    show(0);
    start();
  });
})();

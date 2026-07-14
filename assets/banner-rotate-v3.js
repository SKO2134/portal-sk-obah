(() => {
  function initialiseRotators() {
    document.querySelectorAll('[data-rotator]').forEach((rotator, rotatorIndex) => {
      const slides = Array.from(rotator.querySelectorAll('.rotator-slide'));
      if (slides.length < 2 || rotator.dataset.rotatorReady === 'true') return;
      rotator.dataset.rotatorReady = 'true';
      const dotsBox = rotator.querySelector('[data-dots]');
      const interval = Number(rotator.dataset.interval) || 5000;
      let current = 0;
      let timer = null;
      const dots = dotsBox ? slides.map((slide, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'rotator-dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Papar foto ${index + 1}`);
        dot.addEventListener('click', () => show(index, true));
        dotsBox.appendChild(dot);
        return dot;
      }) : [];
      function show(index, restart) {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
        dots.forEach((dot, i) => {
          dot.classList.toggle('is-active', i === current);
          dot.setAttribute('aria-selected', String(i === current));
        });
        if (restart) start();
      }
      function start() {
        if (timer) window.clearInterval(timer);
        timer = window.setInterval(() => show(current + 1, false), interval);
      }
      rotator.querySelector('[data-prev]')?.addEventListener('click', () => show(current - 1, true));
      rotator.querySelector('[data-next]')?.addEventListener('click', () => show(current + 1, true));
      show(rotatorIndex % slides.length, false);
      start();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialiseRotators, { once: true });
  else initialiseRotators();
})();

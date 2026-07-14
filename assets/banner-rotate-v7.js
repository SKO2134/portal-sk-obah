(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function initialiseRotators() {
    document.querySelectorAll('[data-rotator]').forEach((rotator, rotatorIndex) => {
      const slides = Array.from(rotator.querySelectorAll('.rotator-slide'));
      if (slides.length < 2 || rotator.dataset.rotatorReady === 'true') return;

      rotator.dataset.rotatorReady = 'true';
      const dotsBox = rotator.querySelector('[data-dots]');
      const controls = rotator.querySelector('.feature-controls');
      const interval = Number(rotator.dataset.interval) || 5000;
      const isFeature = rotator.classList.contains('feature-rotator');
      let current = 0;
      let timer = null;
      let paused = false;

      rotator.style.setProperty('--rotator-duration', `${interval}ms`);

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

      let counter = null;
      let progressBar = null;
      if (isFeature && controls) {
        counter = document.createElement('span');
        counter.className = 'feature-counter';
        counter.setAttribute('aria-live', 'polite');
        controls.insertBefore(counter, controls.querySelector('[data-next]'));

        const progress = document.createElement('div');
        progress.className = 'feature-progress';
        progress.setAttribute('aria-hidden', 'true');
        progressBar = document.createElement('span');
        progress.appendChild(progressBar);
        rotator.appendChild(progress);
      }

      function restartProgress() {
        if (!isFeature || reduceMotion.matches) return;
        rotator.classList.remove('is-running');
        void progressBar?.offsetWidth;
        rotator.classList.add('is-running');
      }

      function show(index, restart) {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
        dots.forEach((dot, i) => {
          dot.classList.toggle('is-active', i === current);
          dot.setAttribute('aria-selected', String(i === current));
        });
        if (counter) counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
        restartProgress();
        if (restart) start();
      }

      function start() {
        if (timer) window.clearInterval(timer);
        if (!paused) timer = window.setInterval(() => show(current + 1, false), interval);
      }

      function pause() {
        paused = true;
        if (timer) window.clearInterval(timer);
        rotator.classList.add('is-paused');
      }

      function resume() {
        paused = false;
        rotator.classList.remove('is-paused');
        start();
      }

      rotator.querySelector('[data-prev]')?.addEventListener('click', () => show(current - 1, true));
      rotator.querySelector('[data-next]')?.addEventListener('click', () => show(current + 1, true));
      rotator.addEventListener('mouseenter', pause);
      rotator.addEventListener('mouseleave', resume);
      rotator.addEventListener('focusin', pause);
      rotator.addEventListener('focusout', resume);
      document.addEventListener('visibilitychange', () => document.hidden ? pause() : resume());

      show(rotatorIndex % slides.length, false);
      start();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialiseRotators, { once: true });
  } else {
    initialiseRotators();
  }
})();

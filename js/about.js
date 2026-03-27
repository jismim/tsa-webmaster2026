/* ============================================================
   CareMap Morris — About Page JS
   Handles: scroll-reveal animations + number counter animation
============================================================ */

(function () {
  'use strict';

  /* ── 1. Scroll Reveal ── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: just show everything
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ── 2. Animated Number Counters ── */
  const statEls = document.querySelectorAll('.county-stat .big[data-target]');

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400; // ms
    const startTime = performance.now();

    // Easing: ease-out quad
    function easeOut(t) { return t * (2 - t); }

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOut(progress) * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    statEls.forEach((el) => counterObserver.observe(el));
  } else {
    // Fallback: set final values
    statEls.forEach((el) => {
      el.textContent = parseInt(el.dataset.target, 10).toLocaleString() + (el.dataset.suffix || '');
    });
  }

})();
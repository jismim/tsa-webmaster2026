/* ============================================================
   CareMap Morris — Highlights Page JavaScript
   Fast init: lazy carousel setup, smooth reveal, no image glitching
============================================================ */

(function () {
  'use strict';

  /* ── 1. Hero load-in ── */
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      document.querySelectorAll('.reveal-hero').forEach(function (el) {
        el.classList.add('visible');
      });
    }, 60);

    /* Footer year */
    var yearEl = document.getElementById('footerYear');
    if (yearEl) {
      yearEl.textContent = '© ' + new Date().getFullYear() + ' CareMap Morris. All rights reserved.';
    }
  });

  /* ── 2. Scroll Reveal ── */
  function buildRevealObserver() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -24px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── 3. Carousel logic ── */
  var initialized = {};

  function initCarousel(carouselId, trackId, dotsId) {
    if (initialized[carouselId]) return;
    initialized[carouselId] = true;

    var carousel = document.getElementById(carouselId);
    var track    = document.getElementById(trackId);
    var dotsEl   = document.getElementById(dotsId);

    if (!carousel || !track || !dotsEl) return;

    var slides  = track.querySelectorAll('.carousel-slide');
    var total   = slides.length;
    var current = 0;

    if (!total) return;

    /* Smooth slide transition */
    track.style.transition = 'transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)';
    track.style.willChange = 'transform';

    /* Build dots */
    dotsEl.innerHTML = '';
    for (var i = 0; i < total; i++) {
      (function (idx) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (idx + 1));
        dot.addEventListener('click', function () { goTo(idx); });
        dotsEl.appendChild(dot);
      })(i);
    }

    function goTo(n) {
      current = ((n % total) + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dotsEl.querySelectorAll('.carousel-dot').forEach(function (d, idx) {
        d.classList.toggle('active', idx === current);
      });
    }

    carousel.querySelectorAll('.carousel-prev').forEach(function (btn) {
      btn.addEventListener('click', function () { goTo(current - 1); });
    });
    carousel.querySelectorAll('.carousel-next').forEach(function (btn) {
      btn.addEventListener('click', function () { goTo(current + 1); });
    });

    /* Keyboard nav */
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    /* Touch/swipe */
    var startX = 0;
    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    }, { passive: true });

    goTo(0);
  }

  /* ── 4. Lazy-init each carousel only when it enters viewport ──
     The images are all still there with normal src= (no glitching).
     We just delay running the JS carousel setup until needed.     */
  var carouselMap = [
    { id: 'carouselMay',      track: 'trackMay',      dots: 'dotsMay' },
    { id: 'carouselApril',    track: 'trackApril',    dots: 'dotsApril' },
    { id: 'carouselMarch',    track: 'trackMarch',    dots: 'dotsMarch' },
    { id: 'carouselFebruary', track: 'trackFebruary', dots: 'dotsFebruary' },
    { id: 'carouselJanuary',  track: 'trackJanuary',  dots: 'dotsJanuary' },
  ];

  function setupLazyCarousels() {
    if (!('IntersectionObserver' in window)) {
      /* No observer support — just init all now */
      carouselMap.forEach(function (c) { initCarousel(c.id, c.track, c.dots); });
      return;
    }

    var lazyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id  = entry.target.id;
        var cfg = carouselMap.filter(function (c) { return c.id === id; })[0];
        if (cfg) initCarousel(cfg.id, cfg.track, cfg.dots);
        lazyObserver.unobserve(entry.target);
      });
    }, {
      /* Start init 300px before carousel enters view so it's
         ready before the user actually sees it — no pop-in */
      rootMargin: '300px 0px'
    });

    carouselMap.forEach(function (c) {
      var el = document.getElementById(c.id);
      if (el) lazyObserver.observe(el);
    });
  }

  /* ── 5. Boot everything after DOM is ready ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      buildRevealObserver();
      setupLazyCarousels();
    });
  } else {
    buildRevealObserver();
    setupLazyCarousels();
  }

})();
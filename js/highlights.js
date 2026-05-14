/* ============================================================
   CareMap Morris — Highlights Page JavaScript
   Handles: hero load-in, scroll reveal, footer year,
            and monthly carousels
============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ── 1. Hero load-in ── */
  setTimeout(function () {
    document.querySelectorAll('.reveal-hero').forEach(function (el) {
      el.classList.add('visible');
    });
  }, 80);

  /* ── 2. Scroll Reveal ── */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -36px 0px'
    });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ── 3. Footer year ── */
  var yearEl = document.getElementById('footerYear');

  if (yearEl) {
    yearEl.textContent = '© ' + new Date().getFullYear() + ' CareMap Morris. All rights reserved.';
  }

  /* ── 4. Monthly carousels ── */
  function initCarousel(carouselId, trackId, dotsId) {
    var carousel = document.getElementById(carouselId);
    var track = document.getElementById(trackId);
    var dotsEl = document.getElementById(dotsId);

    if (!carousel || !track || !dotsEl) return;

    var slides = track.querySelectorAll('.carousel-slide');
    var current = 0;
    var total = slides.length;

    if (!total) return;

    dotsEl.innerHTML = '';

    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.dataset.index = i;

      dot.addEventListener('click', function () {
        goTo(parseInt(this.dataset.index, 10));
      });

      dotsEl.appendChild(dot);
    }

    function goTo(n) {
      current = (n + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';

      dotsEl.querySelectorAll('.carousel-dot').forEach(function (d, idx) {
        d.classList.toggle('active', idx === current);
      });
    }

    carousel.querySelectorAll('.carousel-prev').forEach(function (btn) {
      btn.addEventListener('click', function () {
        goTo(current - 1);
      });
    });

    carousel.querySelectorAll('.carousel-next').forEach(function (btn) {
      btn.addEventListener('click', function () {
        goTo(current + 1);
      });
    });

    var startX = 0;

    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      var diff = startX - e.changedTouches[0].clientX;

      if (Math.abs(diff) > 40) {
        goTo(diff > 0 ? current + 1 : current - 1);
      }
    }, { passive: true });
  }

  initCarousel('carouselMay', 'trackMay', 'dotsMay');
  initCarousel('carouselApril', 'trackApril', 'dotsApril');
  initCarousel('carouselMarch', 'trackMarch', 'dotsMarch');
  initCarousel('carouselFebruary', 'trackFebruary', 'dotsFebruary');
  initCarousel('carouselJanuary', 'trackJanuary', 'dotsJanuary');
});
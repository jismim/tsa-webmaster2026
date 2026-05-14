/* ============================================================
   CareMap Morris — About Page JS
   Handles: scroll-reveal animations + number counter animation
============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* ── Hero load-in (fires on page load, not scroll) ── */
  setTimeout(function () {
    document.querySelectorAll('.reveal-hero').forEach(function (el) {
      el.classList.add('visible');
    });
  }, 80);

  /* ── Footer year ── */
  var yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = '© ' + new Date().getFullYear() + ' CareMap Morris. All rights reserved.';

});
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
document.addEventListener('DOMContentLoaded', function () {
  'use strict';
 
  /* ── Mobile menu toggle ── */
  const mobileMenu      = document.getElementById('mobileMenu');
  const mobileNavBtn    = document.getElementById('mobileNavBtn');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
 
  function openMobileMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileNavBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
 
  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileNavBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
 
  if (mobileNavBtn)    mobileNavBtn.addEventListener('click', openMobileMenu);
  if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
  if (mobileMenu)      mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));
 
  /* ── Mobile dropdown toggle ── */
  const dropdownToggle = document.querySelector('.mobile-menu-dropdown-toggle');
  if (dropdownToggle) {
    dropdownToggle.addEventListener('click', function() {
      this.parentElement.classList.toggle('open');
    });
  }
 
  /* ── Desktop dropdown toggle ── */
  const desktopToggle = document.querySelector('.dropdown-toggle');
  const desktopMenu   = document.querySelector('.dropdown-menu');
  if (desktopToggle && desktopMenu) {
    desktopToggle.addEventListener('click', function() {
      const isOpen = desktopMenu.style.display === 'flex';
      desktopMenu.style.display = isOpen ? 'none' : 'flex';
      desktopToggle.setAttribute('aria-expanded', !isOpen);
    });
 
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.nav-dropdown')) {
        desktopMenu.style.display = 'none';
        desktopToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Update bookmark badge ── */
  function updateBookmarkBadges() {
    if (typeof CareMapBookmarks === 'undefined') return;
    const count = CareMapBookmarks.count();
    document.querySelectorAll('.bookmark-count').forEach(function(el) {
      el.textContent   = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }
 
  // Initial badge update
  updateBookmarkBadges();
 
  // Listen for storage changes (syncs across tabs)
  window.addEventListener('storage', function(e) {
    if (e.key && e.key.startsWith('cm_bookmarks_')) {
      updateBookmarkBadges();
    }
  });
});
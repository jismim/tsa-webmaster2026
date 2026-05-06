/* ============================================================
   CareMap Morris — Works Cited Page JS
   Handles: hero load-in, scroll reveal, PDF tab switching,
            mobile menu, dropdown, footer year
============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ── 1. Hero load-in (fires on page load, not scroll) ── */
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
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── 3. PDF reference tab switching ── */
  var referenceTabs  = document.querySelectorAll('.reference-tab');
  var referencesFrame = document.getElementById('referencesFrame');
  var activeRefLink  = document.querySelector('.active-ref-link');

  referenceTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var pdf   = tab.dataset.pdf;
      var title = tab.dataset.title;

      referenceTabs.forEach(function (btn) {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      if (referencesFrame) {
        referencesFrame.src   = pdf;
        referencesFrame.title = title;
      }
      if (activeRefLink) activeRefLink.href = pdf;
    });
  });

  /* ── 4. Mobile menu ── */
  var mobileMenu      = document.getElementById('mobileMenu');
  var mobileNavBtn    = document.getElementById('mobileNavBtn');
  var mobileMenuClose = document.getElementById('mobileMenuClose');

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (mobileNavBtn) mobileNavBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (mobileNavBtn) mobileNavBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileNavBtn)    mobileNavBtn.addEventListener('click', openMobileMenu);
  if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (l) {
      l.addEventListener('click', closeMobileMenu);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ── 5. Dropdown ── */
  var toggle = document.querySelector('.dropdown-toggle');
  var menu   = document.querySelector('.dropdown-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var isOpen = menu.style.display === 'flex';
      menu.style.display = isOpen ? 'none' : 'flex';
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.style.display = 'none';
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── 6. Footer year ── */
  var yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = '© ' + new Date().getFullYear() + ' CareMap Morris. All rights reserved.';

});
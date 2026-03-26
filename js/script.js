/* ============================================================
   CAREMAP MORRIS — Main JavaScript
   Handles: modal/walkthrough, search, counters, scroll reveal,
            mobile menu, bookmark toggle, footer dates
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------
     1. FIRST-TIME USER WALKTHROUGH MODAL
     FIX: Restored - was functionally fine but re-documented clearly.
     The modal HTML must exist in index.html for this to work.
     It uses sessionStorage so it only shows once per browser session.
  ---------------------------------------------------------- */
  const backdrop   = document.getElementById('modalBackdrop');
  const modalWrap  = document.getElementById('modalWrap');
  const dismissX   = document.getElementById('dismissX');
  const dismissBtn = document.getElementById('dismissBtn');

  function openModal() {
    if (!backdrop || !modalWrap) return;
    backdrop.hidden  = false;
    modalWrap.hidden = false;
    document.body.style.overflow = 'hidden';
    // Focus first focusable element for accessibility
    const firstFocusable = modalWrap.querySelector('button, a[href]');
    if (firstFocusable) firstFocusable.focus();
  }

  function closeModal() {
    if (!backdrop || !modalWrap) return;
    backdrop.hidden  = true;
    modalWrap.hidden = true;
    document.body.style.overflow = '';
    sessionStorage.setItem('cm_welcomed', '1');
  }

  // Show only once per session (clears when browser tab closes)
  // To test: open DevTools → Application → Session Storage → delete cm_welcomed
  if (!sessionStorage.getItem('cm_welcomed')) {
    setTimeout(openModal, 650);
  }

  if (dismissX)   dismissX.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);
  if (backdrop)   backdrop.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal();
      closeMobileMenu();
    }
  });


  /* ----------------------------------------------------------
     2. SEARCH — redirect to directory with query param
  ---------------------------------------------------------- */
  const searchInput = document.getElementById('heroSearch');
  const searchBtn   = document.getElementById('heroSearchBtn');

  function doSearch() {
    if (!searchInput) return;
    const q = searchInput.value.trim();
    if (q) {
      window.location.href = 'directory.html?q=' + encodeURIComponent(q);
    } else {
      searchInput.focus();
    }
  }

  if (searchBtn)   searchBtn.addEventListener('click', doSearch);
  if (searchInput) {
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') doSearch();
    });
  }


  /* ----------------------------------------------------------
     3. MOBILE MENU
  ---------------------------------------------------------- */
  const mobileMenu      = document.getElementById('mobileMenu');
  const mobileNavBtn    = document.getElementById('mobileNavBtn');
  const mobileMenuClose = document.getElementById('mobileMenuClose');

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

  // Close mobile menu when any link inside is clicked
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }


  /* ----------------------------------------------------------
     4. ANIMATED STAT COUNTERS
     FIX: The original animateCount used setInterval with floating
          point accumulation which caused it to sometimes never
          reach the target. Replaced with a requestAnimationFrame
          approach using elapsed time — reliable and smooth.
  ---------------------------------------------------------- */
  function animateCount(el, target, duration) {
    const start     = performance.now();
    const startVal  = 0;

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + (target - startVal) * eased);

      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target; // ensure exact final value
      }
    }

    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('.count-num');

  if (counters.length) {
    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target, 10);
            if (!isNaN(target)) {
              animateCount(entry.target, target, 1400);
            }
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });

      counters.forEach(function (c) { counterObserver.observe(c); });
    } else {
      // Fallback for browsers without IntersectionObserver
      counters.forEach(function (c) {
        c.textContent = c.dataset.target || '0';
      });
    }
  }


  /* ----------------------------------------------------------
     5. SCROLL REVEAL
     ENHANCED: Supports .reveal, .reveal-left, .reveal-right,
               .reveal-scale variants. Stagger is applied
               automatically to siblings.
  ---------------------------------------------------------- */
  const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
  const reveals = document.querySelectorAll(revealSelectors);

  if (reveals.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        const el       = entry.target;
        const parent   = el.parentElement;

        // Find un-revealed siblings to stagger them
        const siblings = parent
          ? Array.from(parent.querySelectorAll(revealSelectors + ':not(.visible)'))
          : [];
        const idx = siblings.indexOf(el);

        // Stagger delay: 80ms per sibling, max 400ms
        const delay = Math.min(Math.max(0, idx) * 80, 400);

        setTimeout(function () {
          el.classList.add('visible');
        }, delay);

        revealObserver.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (r) { revealObserver.observe(r); });
  } else {
    // Fallback: show everything immediately
    reveals.forEach(function (r) { r.classList.add('visible'); });
  }


  /* ----------------------------------------------------------
     6. BOOKMARK / SAVE TOGGLE
  ---------------------------------------------------------- */
  document.querySelectorAll('.card-bookmark').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const saved = this.classList.toggle('saved');
      this.textContent = saved ? '♥' : '♡';
      this.setAttribute(
        'aria-label',
        saved ? 'Unsave this organization' : 'Save this organization'
      );
    });
  });


  /* ----------------------------------------------------------
     7. FOOTER — auto-populate review date and copyright year
  ---------------------------------------------------------- */
  const now      = new Date();
  const dateOpts = { year: 'numeric', month: 'long', day: 'numeric' };

  const footerDateEl = document.getElementById('footerDate');
  const footerYearEl = document.getElementById('footerYear');

  if (footerDateEl) {
    footerDateEl.textContent = now.toLocaleDateString('en-US', dateOpts);
  }
  if (footerYearEl) {
    footerYearEl.textContent = '© ' + now.getFullYear() + ' CareMap Morris. All rights reserved.';
  }

});

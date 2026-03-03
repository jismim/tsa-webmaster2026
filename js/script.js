/* ============================================================
   CAREMAP MORRIS — Main JavaScript
   Handles: modal, search, counters, scroll reveal,
            mobile menu, bookmark toggle, footer dates
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------
     1. FIRST-TIME USER MODAL
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
    // Focus first focusable element inside modal
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

  // Show only on first visit per session
  if (!sessionStorage.getItem('cm_welcomed')) {
    setTimeout(openModal, 650);
  }

  if (dismissX)   dismissX.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);
  if (backdrop)   backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
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

  if (searchBtn)  searchBtn.addEventListener('click', doSearch);
  if (searchInput) {
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') doSearch();});
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

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileMenu();
  });

  // Close mobile menu if a link inside it is clicked
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }


  /* ----------------------------------------------------------
     4. ANIMATED STAT COUNTERS
  ---------------------------------------------------------- */
  function animateCount(el, target, duration) {
    let start  = 0;
    const step = target / (duration / 16);

    const timer = setInterval(function () {
      start += step;
      if (start >= target) {
        el.textContent = target;
        clearInterval(timer);
        return;
      }
      el.textContent = Math.floor(start);}, 16);
  }

  const counters = document.querySelectorAll('.count-num');

  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target, 10);
          animateCount(entry.target, target, 1200);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (c) { counterObserver.observe(c); });
  } else {
    // Fallback: just set the final number immediately
    counters.forEach(function (c) {
      c.textContent = c.dataset.target;
    });
  }


  /* ----------------------------------------------------------
     5. SCROLL REVEAL
  ---------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');

  if (reveals.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        // Stagger siblings that are also un-revealed
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
        const idx = siblings.indexOf(entry.target);

        setTimeout(function () {entry.target.classList.add('visible');}, Math.max(0, idx) * 80);

        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    reveals.forEach(function (r) { revealObserver.observe(r); });
  } else {
    // Fallback: make all visible immediately
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
        saved ? 'Unsave this organization' : 'Save this organization');
    });
  });


  /* ----------------------------------------------------------
     7. FOOTER — auto-populate date and year
  ---------------------------------------------------------- */
  const now      = new Date();
  const dateOpts = { year: 'numeric', month: 'long', day: 'numeric' };

  const footerDateEl = document.getElementById('footerDate');
  const footerYearEl = document.getElementById('footerYear');

  if (footerDateEl) {
    footerDateEl.textContent = now.toLocaleDateString('en-US', dateOpts);
  }
  if (footerYearEl) {
    footerYearEl.textContent = '© ' + now.getFullYear() + ' CareMap Morris';
  }

});
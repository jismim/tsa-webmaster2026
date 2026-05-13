(function () {
  'use strict';

  /* ── Step definitions ─────────────────────────────────── */
  const STEPS = [
    {
      page: 'index.html',
      target: '#heroSearch, .hero-search',
      title: 'Search for Resources',
      desc: 'Type anything here — "food pantry," "shelter," "counseling" — and we\'ll take you straight to matching results in the Directory.',
      position: 'bottom',
      scrollTo: '.hero',
    },
    {
      page: 'index.html',
      target: '#map, .map-wrapper',
      title: 'Find Resources Near You',
      desc: 'The interactive map shows all listed organizations across Morris County. Click any colored pin to see the name and details.',
      position: 'top',
      scrollTo: '.map-section',
    },
    {
      page: 'directory.html',
      target: '.cards-grid, .resource-card',
      title: 'Resource Directory',
      desc: 'Browse all nonprofits by category. Use filters to narrow down by service type, or search for a specific need.',
      position: 'top',
      scrollTo: '.cards-grid',
    },
    {
      page: 'donate-volunteer.html',
      target: '.filter-divider, .results-header',
      title: 'Give Back to Your Community',
      desc: 'See ways to donate goods, volunteer your time, or give financially. Every hour and dollar goes directly to Morris County neighbors.',
      position: 'top',
      scrollTo: '.filter-divider',
    },
    {
      page: 'bookmarks.html',
      target: '.saved-list, .resource-card',
      title: 'Save Resources for Later',
      desc: 'Click the ♡ on any resource card to bookmark it. Your saved resources live here — no account needed, stored in your browser.',
      position: 'top',
      scrollTo: '.main-content',
    },
    {
      /* Admin login — always renders centered, no spotlight needed */
      page: 'admin/login.html',
      target: null,
      title: 'Administrator Access',
      desc: 'Site admins log in here to manage directory listings and keep the database current. This page is for authorized personnel only.',
      position: 'center',
      scrollTo: null,
    },
    {
      page: 'index.html',
      target: '.hero',
      title: 'You\'re All Set!',
      desc: 'That\'s a full tour of CareMap Morris. Start by searching for a resource, browsing the directory, or exploring the map.',
      position: 'center',
      scrollTo: '.hero',
      isLast: true,
    },
  ];

  /* ── State ─────────────────────────────────────────────── */
  let currentStep = -1;
  let isActive    = false;

  let overlay, ring, card, endCard, trigger;
  let curtains = [];

  const PAD = 10;

  const STORAGE_KEY = 'cm_tour_step';

  /* ════════════════════════════════════════════════════════
     PAGE MATCHING
     Handles all of:
       /index.html  →  index.html
       /            →  index.html
       /admin/login.html
       admin/login.html
       /admin login.html  (space in filename — your original)
  ═══════════════════════════════════════════════════════════ */
  function normalizePath(raw) {
    return String(raw || '')
      .replace(/\\/g, '/')           // backslash → forward
      .replace(/^\/+/, '')           // strip leading slashes
      .replace(/\/+$/, '')           // strip trailing slashes
      .toLowerCase()
      .trim()
      || 'index.html';
  }

  function currentNormalizedPath() {
    // Use pathname; fall back to index.html for bare "/"
    let p = window.location.pathname;
    if (p === '/' || p === '') return 'index.html';
    return normalizePath(p);
  }

  function stepMatchesPage(step) {
    const stepPage = normalizePath(step.page);
    const here     = currentNormalizedPath();

    // Direct match
    if (here === stepPage) return true;
    // Current path ends with the step page (handles sub-folder deployments)
    if (here.endsWith('/' + stepPage)) return true;
    // Step page ends with current path (e.g. step="admin/login.html", here="login.html")
    if (stepPage.endsWith('/' + here)) return true;

    return false;
  }

  /* ════════════════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════════════════ */
  function init() {
    buildDOM();
    bindEvents();

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const idx = parseInt(saved, 10);
      if (!isNaN(idx) && idx >= 0 && idx < STEPS.length) {
        isActive    = true;
        currentStep = idx;
        // renderStep is called on window load below
      }
    }
  }

  /* ════════════════════════════════════════════════════════
     BUILD DOM
  ═══════════════════════════════════════════════════════════ */
  function buildDOM() {
    overlay = el('div', { id: 'cm-tour-overlay' });
    document.body.appendChild(overlay);

    ['top', 'bottom', 'left', 'right'].forEach(function (side) {
      const c = el('div', { class: 'cm-curtain', 'data-side': side });
      document.body.appendChild(c);
      curtains.push(c);
    });

    ring = el('div', { id: 'cm-tour-ring', role: 'presentation' });
    document.body.appendChild(ring);

    card = el('div', {
      id: 'cm-tour-card',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': 'cm-tour-title',
      'aria-describedby': 'cm-tour-desc',
      tabindex: '-1',
    });
    card.innerHTML = buildCardHTML();
    document.body.appendChild(card);

    endCard = el('div', { id: 'cm-tour-end', role: 'dialog', 'aria-modal': 'true', tabindex: '-1' });
    endCard.innerHTML = `
      <div class="cm-end-card">
        <div class="cm-end-icon">🗺️</div>
        <h2 class="cm-end-title">You know the map!</h2>
        <p class="cm-end-desc">
          You've seen everything CareMap Morris has to offer.<br>
          Ready to find help, give back, or explore?
        </p>
        <div class="cm-end-actions">
          <a class="cm-end-btn cm-end-btn-primary" href="/directory.html">Browse Directory →</a>
          <button class="cm-end-btn cm-end-btn-ghost" id="cm-end-close">Back to Home</button>
        </div>
      </div>`;
    document.body.appendChild(endCard);

    /* Floating help / tour trigger */
    trigger = el('button', { id: 'cm-tour-trigger', 'aria-label': 'Start site tour' });
    trigger.innerHTML = '<span class="cm-tour-trigger-icon">🧭</span> Take a Tour';
    document.body.appendChild(trigger);
  }

  function buildCardHTML() {
    const dots = STEPS.map(function () {
      return `<span class="cm-tour-dot" aria-hidden="true"></span>`;
    }).join('');

    return `
      <div class="cm-tour-head">
        <span class="cm-tour-step-label" id="cm-tour-step-label">Step 1 of ${STEPS.length}</span>
        <button class="cm-tour-close" id="cm-tour-close-btn" aria-label="Close tour">✕</button>
      </div>
      <div class="cm-tour-body">
        <h3 class="cm-tour-title" id="cm-tour-title">—</h3>
        <p class="cm-tour-desc"  id="cm-tour-desc">—</p>
      </div>
      <div class="cm-tour-dots" role="tablist" aria-label="Tour steps">${dots}</div>
      <div class="cm-tour-footer">
        <button class="cm-tour-skip" id="cm-tour-skip">Skip tour</button>
        <div class="cm-tour-nav">
          <button class="cm-tour-btn cm-tour-btn-prev" id="cm-tour-prev" aria-label="Previous step">← Back</button>
          <button class="cm-tour-btn cm-tour-btn-next" id="cm-tour-next" aria-label="Next step">Next →</button>
        </div>
      </div>
      <div class="cm-tour-keys">
        <kbd>←</kbd><kbd>→</kbd>
        <span>navigate</span>
        <span style="margin-left:6px"></span>
        <kbd>Space</kbd>
        <span>next</span>
        <span style="margin-left:6px"></span>
        <kbd>Esc</kbd>
        <span>close</span>
      </div>`;
  }

  /* ════════════════════════════════════════════════════════
     EVENTS
  ═══════════════════════════════════════════════════════════ */
  function bindEvents() {
    trigger.addEventListener('click', startTour);

    document.addEventListener('click', function (e) {
      const t = e.target;
      if (t.id === 'cm-tour-close-btn' || t.id === 'cm-tour-skip') { closeTour(); return; }
      if (t.id === 'cm-tour-next')  { nextStep(); return; }
      if (t.id === 'cm-tour-prev')  { prevStep(); return; }
      if (t.id === 'cm-end-close')  { closeEnd(); return; }

      /* Click on dimming curtain → close tour */
      if (isActive && t.classList && t.classList.contains('cm-curtain')) {
        closeTour();
      }
    });

    /* Keyboard: always captured at capture phase so nothing blocks Esc */
    document.addEventListener('keydown', handleKeydown, true);

    window.addEventListener('resize', debounce(function () {
      if (isActive && currentStep >= 0) renderStep(currentStep, true);
    }, 120));

    /* On page load: if a step was saved, try to render it */
    window.addEventListener('load', function () {
      if (currentStep >= 0 && currentStep < STEPS.length) {
        goToStep(currentStep);
      }
    });
  }

  function handleKeydown(e) {
    const key    = e.key;
    const isSpace = key === ' ' || key === 'Spacebar' || e.code === 'Space';
    const endOpen = endCard && endCard.classList.contains('visible');

    if (endOpen) {
      if (key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); closeEnd(); }
      return;
    }

    if (!isActive) return;

    if (key === 'Escape') {
      e.preventDefault();
      e.stopImmediatePropagation();
      closeTour();
      return;
    }
    if (key === 'ArrowRight' || (isSpace && e.target.id !== 'cm-tour-prev') || key === 'Enter') {
      if (e.target.id !== 'cm-tour-prev') {
        e.preventDefault();
        e.stopImmediatePropagation();
        nextStep();
      }
      return;
    }
    if (key === 'ArrowLeft') {
      e.preventDefault();
      e.stopImmediatePropagation();
      prevStep();
    }
  }

  /* ════════════════════════════════════════════════════════
     TOUR LIFECYCLE
  ═══════════════════════════════════════════════════════════ */
  function startTour() {
    isActive    = true;
    currentStep = 0;
    goToStep(0);
  }

  function closeTour() {
    isActive = false;
    localStorage.removeItem(STORAGE_KEY);
    overlay.classList.remove('active');
    card.classList.remove('visible');
    ring.classList.remove('visible');
    hideCurtains();
    document.body.style.overflow = '';
    currentStep = -1;
  }

  function nextStep() {
    if (currentStep >= STEPS.length - 1) { showEnd(); }
    else { goToStep(currentStep + 1); }
  }

  function prevStep() {
    if (currentStep > 0) goToStep(currentStep - 1);
  }

  function goToStep(index) {
    if (index < 0 || index >= STEPS.length) return;

    currentStep = index;
    const step  = STEPS[index];

    localStorage.setItem(STORAGE_KEY, String(index));

    /* ── Page navigation check ──────────────────────────── */
    if (!stepMatchesPage(step)) {
      /* Navigate to the correct page; tour resumes on load */
      window.location.href = '/' + normalizePath(step.page);
      return;
    }

    /* ── Already on the right page — render ─────────────── */
    card.classList.remove('visible');
    ring.classList.remove('visible');

    scrollToStep(step, function () {
      renderStep(index, false);
    });
  }

  /* ════════════════════════════════════════════════════════
     SCROLL
  ═══════════════════════════════════════════════════════════ */
  function scrollToStep(step, cb) {
    if (!step.scrollTo) { setTimeout(cb, 60); return; }
    const target = document.querySelector(step.scrollTo);
    if (!target)  { setTimeout(cb, 60); return; }

    const rect    = target.getBoundingClientRect();
    const visible = rect.top >= -100 && rect.bottom <= window.innerHeight + 100;
    if (visible) { setTimeout(cb, 60); return; }

    const targetY = window.scrollY + rect.top - (step.position === 'bottom' ? 120 : 80);
    smoothScrollTo(targetY, 480, cb);
  }

  function smoothScrollTo(targetY, duration, cb) {
    const startY = window.scrollY;
    const diff   = targetY - startY;
    const start  = performance.now();

    function tick(now) {
      const t    = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      window.scrollTo(0, startY + diff * ease);
      if (t < 1) { requestAnimationFrame(tick); }
      else        { setTimeout(cb, 60); }
    }
    requestAnimationFrame(tick);
  }

  /* ════════════════════════════════════════════════════════
     RENDER STEP
  ═══════════════════════════════════════════════════════════ */
  function renderStep(index, instant) {
    const step  = STEPS[index];
    const total = STEPS.length;

    /* Text */
    document.getElementById('cm-tour-step-label').textContent = `Step ${index + 1} of ${total}`;
    document.getElementById('cm-tour-title').textContent = step.title;
    document.getElementById('cm-tour-desc').textContent  = step.desc;

    /* Buttons */
    const prevBtn = document.getElementById('cm-tour-prev');
    const nextBtn = document.getElementById('cm-tour-next');
    prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
    nextBtn.textContent      = index === total - 1 ? 'Finish ✓' : 'Next →';

    /* Dots */
    card.querySelectorAll('.cm-tour-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === index);
      d.classList.toggle('done',   i < index);
    });

    /* Spotlight */
    const isCentered = step.position === 'center' || !step.target;
    const targetEl   = isCentered ? null : document.querySelector(step.target);

    if (targetEl) {
      positionSpotlight(targetEl, step.position, instant);
    } else {
      hideCurtains();
      ring.classList.remove('visible');
      positionCardCenter();
    }

    /* Show */
    setTimeout(function () {
      overlay.classList.add('active');
      card.classList.add('visible');
      card.focus();
    }, instant ? 0 : 120);
  }

  /* ════════════════════════════════════════════════════════
     SPOTLIGHT
  ═══════════════════════════════════════════════════════════ */
  function positionSpotlight(targetEl, position, instant) {
    const rect = targetEl.getBoundingClientRect();
    const vw   = window.innerWidth;
    const vh   = window.innerHeight;

    const sTop    = rect.top    - PAD;
    const sLeft   = rect.left   - PAD;
    const sWidth  = rect.width  + PAD * 2;
    const sHeight = rect.height + PAD * 2;

    Object.assign(ring.style, {
      top: sTop + 'px', left: sLeft + 'px',
      width: sWidth + 'px', height: sHeight + 'px',
    });
    ring.classList.add('visible');

    const [cTop, cBottom, cLeft, cRight] = curtains;
    Object.assign(cTop.style,    { top: '0',                   left: '0', width: vw + 'px',                        height: Math.max(0, sTop) + 'px' });
    Object.assign(cBottom.style, { top: (sTop+sHeight) + 'px', left: '0', width: vw + 'px',                        height: Math.max(0, vh - sTop - sHeight) + 'px' });
    Object.assign(cLeft.style,   { top: sTop + 'px',           left: '0', width: Math.max(0, sLeft) + 'px',        height: sHeight + 'px' });
    Object.assign(cRight.style,  { top: sTop + 'px',           left: (sLeft+sWidth) + 'px', width: Math.max(0, vw - sLeft - sWidth) + 'px', height: sHeight + 'px' });

    positionCard(sTop, sLeft, sWidth, sHeight, position, vw, vh);
  }

  function positionCard(sTop, sLeft, sWidth, sHeight, preferred, vw, vh) {
    const W   = 360, H = 280, GAP = 20, VP = 20;
    const tries = [
      { pos: 'bottom', t: sTop + sHeight + GAP,   l: sLeft + sWidth/2 - W/2 },
      { pos: 'top',    t: sTop - H - GAP,          l: sLeft + sWidth/2 - W/2 },
      { pos: 'right',  t: sTop + sHeight/2 - H/2,  l: sLeft + sWidth + GAP   },
      { pos: 'left',   t: sTop + sHeight/2 - H/2,  l: sLeft - W - GAP        },
    ];

    let top, left;
    const pref = tries.find(x => x.pos === preferred);
    if (pref && fits(pref.t, pref.l, W, H, vw, vh, VP)) { top = pref.t; left = pref.l; }
    else {
      const found = tries.find(x => fits(x.t, x.l, W, H, vw, vh, VP));
      if (found) { top = found.t; left = found.l; }
      else { top = Math.max(VP, vh/2 - H/2); left = Math.max(VP, vw/2 - W/2); }
    }

    left = clamp(left, VP, vw - W - VP);
    top  = clamp(top,  VP, vh - H - VP);
    Object.assign(card.style, { top: top + 'px', left: left + 'px' });
  }

  function fits(top, left, w, h, vw, vh, pad) {
    return top >= pad && top + h <= vh - pad && left >= pad && left + w <= vw - pad;
  }

  function positionCardCenter() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const W = 360, H = 280;
    Object.assign(card.style, {
      top:  Math.max(20, (vh - H) / 2) + 'px',
      left: Math.max(20, (vw - W) / 2) + 'px',
    });
  }

  function hideCurtains() {
    curtains.forEach(c => Object.assign(c.style, { top:'0', left:'0', width:'0', height:'0' }));
  }

  /* ════════════════════════════════════════════════════════
     END CARD
  ═══════════════════════════════════════════════════════════ */
  function showEnd() {
    isActive = false;
    localStorage.removeItem(STORAGE_KEY);
    overlay.classList.remove('active');
    card.classList.remove('visible');
    ring.classList.remove('visible');
    hideCurtains();
    endCard.classList.add('visible');
    endCard.focus();
    smoothScrollTo(0, 600, function () {});
  }

  function closeEnd() {
    endCard.classList.remove('visible');
    window.location.href = '/index.html';
  }

  /* ════════════════════════════════════════════════════════
     HELPERS
  ═══════════════════════════════════════════════════════════ */
  function el(tag, attrs) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => node.setAttribute(k, v));
    return node;
  }

  function clamp(val, min, max) { return Math.max(min, Math.min(val, max)); }

  function debounce(fn, ms) {
    let t;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }

  /* ── Boot ─────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

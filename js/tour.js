@ -0,0 +1,577 @@


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
      page: '/admin/login.html',
      target: 'body',
      title: 'Administrator Access',
      desc: 'Site admins can log in here to manage directory listings and keep the database up to date.',
      position: 'center',
      scrollTo: 'body',
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
  let isActive = false;

  // DOM refs
  let overlay, ring, card, endCard, trigger;
  let curtains = [];

  const PAD = 10; // spotlight padding

  /* ── LocalStorage Keys ──────────────────────────────────── */
  const STORAGE_KEYS = {
    tourSeen: 'cm_tour_seen',
    tourStep: 'cm_tour_step',
  };

  /* ── Init ──────────────────────────────────────────────– */
  function init() {
    buildDOM();
    bindEvents();

    // Check if tour is in progress from page navigation
    const savedStep = localStorage.getItem(STORAGE_KEYS.tourStep);
    if (savedStep !== null) {
      const step = parseInt(savedStep, 10);
      if (step < STEPS.length) {
        isActive = true;
        currentStep = step;
        // Don't auto-render yet, wait for page load
      }
    } else if (!sessionStorage.getItem(STORAGE_KEYS.tourSeen)) {
      // First ever visit — DON'T auto-start
      // Let the welcome modal appear first
      // User will start tour from "Take a Tour" button or welcome modal CTA
      sessionStorage.setItem(STORAGE_KEYS.tourSeen, '1');
    }
  }

  /* ── Build DOM ─────────────────────────────────────────── */
  function buildDOM() {
    // Overlay container
    overlay = el('div', { id: 'cm-tour-overlay' });
    document.body.appendChild(overlay);

    // Four curtains
    ['top', 'bottom', 'left', 'right'].forEach(function (side) {
      const c = el('div', { class: 'cm-curtain', 'data-side': side });
      document.body.appendChild(c);
      curtains.push(c);
    });

    // Spotlight ring
    ring = el('div', { id: 'cm-tour-ring', role: 'presentation' });
    document.body.appendChild(ring);

    // Tour card
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

    // End card
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
          <a class="cm-end-btn cm-end-btn-primary" href="directory.html">Browse Directory →</a>
          <button class="cm-end-btn cm-end-btn-ghost" id="cm-end-close">Back to Home</button>
        </div>
      </div>`;
    document.body.appendChild(endCard);

    // Floating trigger button
    trigger = el('button', { id: 'cm-tour-trigger', 'aria-label': 'Start site tour' });
    trigger.innerHTML = '<span class="cm-tour-trigger-icon">🧭</span> Take a Tour';
    document.body.appendChild(trigger);
  }

  function buildCardHTML() {
    const dots = STEPS.map(function (_, i) {
      return `<span class="cm-tour-dot" aria-hidden="true"></span>`;
    }).join('');

    return `
      <div class="cm-tour-head">
        <span class="cm-tour-step-label" id="cm-tour-step-label">Step 1 of ${STEPS.length}</span>
        <button class="cm-tour-close" id="cm-tour-close-btn" aria-label="Close tour">✕</button>
      </div>
      <div class="cm-tour-body">
        <h3 class="cm-tour-title" id="cm-tour-title">—</h3>
        <p class="cm-tour-desc" id="cm-tour-desc">—</p>
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

  /* ── Events ────────────────────────────────────────────── */
  function bindEvents() {
    trigger.addEventListener('click', startTour);

    document.addEventListener('click', function (e) {
      if (!isActive) return;
      const t = e.target;
      if (t.id === 'cm-tour-close-btn' || t.id === 'cm-tour-skip') closeTour();
      if (t.id === 'cm-tour-next') nextStep();
      if (t.id === 'cm-tour-prev') prevStep();
      if (t.id === 'cm-end-close') closeEnd();
    });

    document.addEventListener('keydown', handleKeydown, true);
    // Resize: reposition
    window.addEventListener('resize', debounce(function () {
      if (isActive && currentStep >= 0) renderStep(currentStep, true);
    }, 120));

    // Page load: if tour is in progress, render the step
    window.addEventListener('load', function () {
      if (currentStep >= 0 && currentStep < STEPS.length) {
        goToStep(currentStep);
      }
    });
  }

  function handleKeydown(e) {
    const key = e.key;
    const isSpace = key === ' ' || key === 'Spacebar' || e.code === 'Space';
    const isEndOpen = endCard && endCard.classList.contains('visible');

    if (isEndOpen) {
      if (key === 'Escape') {
        e.preventDefault();
        e.stopImmediatePropagation();
        closeEnd();
      }
      return;
    }

    if (!isActive) return;

    if (key === 'Escape') {
      e.preventDefault();
      e.stopImmediatePropagation();
      closeTour();
      return;
    }

    if (key === 'ArrowRight' || isSpace || key === 'Enter') {
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

  /* ── Tour Lifecycle ────────────────────────────────────– */
  function startTour() {
    isActive = true;
    currentStep = 0;
    goToStep(0);
  }

  function closeTour() {
    isActive = false;
    localStorage.removeItem(STORAGE_KEYS.tourStep);
    overlay.classList.remove('active');
    card.classList.remove('visible');
    ring.classList.remove('visible');
    hideCurtains();
    document.body.style.overflow = '';
    currentStep = -1;
  }

  function nextStep() {
    if (currentStep >= STEPS.length - 1) {
      showEnd();
    } else {
      goToStep(currentStep + 1);
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  }

  function goToStep(index) {
    if (index < 0 || index >= STEPS.length) return;

    currentStep = index;
    const step = STEPS[index];

    // Save progress
    localStorage.setItem(STORAGE_KEYS.tourStep, String(index));

    // Check if we need to navigate to a different page
    const currentPage = getCurrentPagePath();
    const targetPage = normalizePagePath(step.page);
    if (!isCurrentPage(targetPage, currentPage)) {
      // Navigate to the new page — tour will resume on load
      window.location.href = step.page;
      return;
    }

    // We're already on the right page — render it
    card.classList.remove('visible');
    ring.classList.remove('visible');

    scrollToStep(step, function () {
      renderStep(index, false);
    });
  }

  /* ── Get Current Page ──────────────────────────────────– */
  function getCurrentPagePath() {
    return normalizePagePath(window.location.pathname);
  }

  function isCurrentPage(targetPage, currentPage) {
    return currentPage === targetPage || currentPage.endsWith('/' + targetPage);
  }

  function normalizePagePath(path) {
    const cleaned = String(path || 'index.html')
      .replace(/^\/+/, '')
      .replace(/\/+$/, '');

    return cleaned || 'index.html';
  }

  /* ── Scroll to Step ────────────────────────────────────– */
  function scrollToStep(step, cb) {
    const scrollTarget = step.scrollTo ? document.querySelector(step.scrollTo) : null;
    if (!scrollTarget) { setTimeout(cb, 60); return; }

    const rect = scrollTarget.getBoundingClientRect();
    const alreadyVisible = rect.top >= -100 && rect.bottom <= window.innerHeight + 100;

    if (alreadyVisible) {
      setTimeout(cb, 60);
    } else {
      const targetY = window.scrollY + rect.top - (step.position === 'bottom' ? 120 : 80);
      smoothScrollTo(targetY, 480, cb);
    }
  }

  function smoothScrollTo(targetY, duration, cb) {
    const startY = window.scrollY;
    const diff   = targetY - startY;
    const start  = performance.now();

    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      window.scrollTo(0, startY + diff * ease);
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        setTimeout(cb, 60);
      }
    }
    requestAnimationFrame(step);
  }

  /* ── Render step ───────────────────────────────────────– */
  function renderStep(index, instant) {
    const step  = STEPS[index];
    const total = STEPS.length;

    // Update card text
    document.getElementById('cm-tour-step-label').textContent = `Step ${index + 1} of ${total}`;
    document.getElementById('cm-tour-title').textContent = step.title;
    document.getElementById('cm-tour-desc').textContent  = step.desc;

    // Button states
    const prevBtn = document.getElementById('cm-tour-prev');
    const nextBtn = document.getElementById('cm-tour-next');
    prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
    nextBtn.textContent = index === total - 1 ? 'Finish ✓' : 'Next →';

    // Dots
    const dots = card.querySelectorAll('.cm-tour-dot');
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === index);
      d.classList.toggle('done', i < index);
    });

    // Spotlight
    const targetEl = step.position === 'center'
      ? null
      : document.querySelector(step.target);

    if (targetEl) {
      positionSpotlight(targetEl, step.position, instant);
    } else {
      hideCurtains();
      ring.classList.remove('visible');
      positionCardCenter();
    }

    // Show card
    setTimeout(function () {
      overlay.classList.add('active');
      card.classList.add('visible');
      card.focus();
    }, instant ? 0 : 120);
  }

  /* ── Spotlight positioning ──────────────────────────────– */
  function positionSpotlight(targetEl, position, instant) {
    const rect = targetEl.getBoundingClientRect();
    const vw   = window.innerWidth;
    const vh   = window.innerHeight;

    const sTop    = rect.top    - PAD;
    const sLeft   = rect.left   - PAD;
    const sWidth  = rect.width  + PAD * 2;
    const sHeight = rect.height + PAD * 2;

    // Ring
    Object.assign(ring.style, {
      top:    sTop  + 'px',
      left:   sLeft + 'px',
      width:  sWidth  + 'px',
      height: sHeight + 'px',
    });
    ring.classList.add('visible');

    // Curtains
    const [cTop, cBottom, cLeft, cRight] = curtains;
    Object.assign(cTop.style,    { top: '0', left: '0', width: vw + 'px', height: Math.max(0, sTop) + 'px' });
    Object.assign(cBottom.style, { top: (sTop + sHeight) + 'px', left: '0', width: vw + 'px', height: Math.max(0, vh - sTop - sHeight) + 'px' });
    Object.assign(cLeft.style,   { top: sTop + 'px', left: '0', width: Math.max(0, sLeft) + 'px', height: sHeight + 'px' });
    Object.assign(cRight.style,  { top: sTop + 'px', left: (sLeft + sWidth) + 'px', width: Math.max(0, vw - sLeft - sWidth) + 'px', height: sHeight + 'px' });

    positionCard(sTop, sLeft, sWidth, sHeight, position, vw, vh);
  }

  function positionCard(sTop, sLeft, sWidth, sHeight, preferredPos, vw, vh) {
    const CARD_W = 360;
    const CARD_H = 280;
    const GAP    = 20;
    const VP_PAD = 20; // viewport padding

    let top, left;
    let positioned = false;

    // Try positions in order of preference
    const tryPositions = [
      { pos: 'bottom', calcFn: () => ({ t: sTop + sHeight + GAP, l: sLeft + sWidth / 2 - CARD_W / 2 }) },
      { pos: 'top', calcFn: () => ({ t: sTop - CARD_H - GAP, l: sLeft + sWidth / 2 - CARD_W / 2 }) },
      { pos: 'right', calcFn: () => ({ t: sTop + sHeight / 2 - CARD_H / 2, l: sLeft + sWidth + GAP }) },
      { pos: 'left', calcFn: () => ({ t: sTop + sHeight / 2 - CARD_H / 2, l: sLeft - CARD_W - GAP }) },
    ];

    // First try the preferred position
    const preferred = tryPositions.find(x => x.pos === preferredPos);
    if (preferred) {
      const pos = preferred.calcFn();
      if (fitsInViewport(pos.t, pos.l, CARD_W, CARD_H, vw, vh, VP_PAD)) {
        top = pos.t;
        left = pos.l;
        positioned = true;
      }
    }

    // If preferred doesn't fit, try all others in order
    if (!positioned) {
      for (let tryPos of tryPositions) {
        const pos = tryPos.calcFn();
        if (fitsInViewport(pos.t, pos.l, CARD_W, CARD_H, vw, vh, VP_PAD)) {
          top = pos.t;
          left = pos.l;
          positioned = true;
          break;
        }
      }
    }

    // Last resort: center with safety margins
    if (!positioned) {
      top = Math.max(VP_PAD, vh / 2 - CARD_H / 2);
      left = Math.max(VP_PAD, vw / 2 - CARD_W / 2);
    }

    // Final safety clamp
    left = Math.max(VP_PAD, Math.min(left, vw - CARD_W - VP_PAD));
    top  = Math.max(VP_PAD, Math.min(top, vh - CARD_H - VP_PAD));

    Object.assign(card.style, { top: top + 'px', left: left + 'px' });
  }

  function fitsInViewport(top, left, width, height, vw, vh, padding) {
    return (
      top >= padding &&
      top + height <= vh - padding &&
      left >= padding &&
      left + width <= vw - padding
    );
  }

  function positionCardCenter() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const CARD_W = 360;
    const CARD_H = 280;
    Object.assign(card.style, {
      top:  Math.max(20, (vh - CARD_H) / 2) + 'px',
      left: Math.max(20, (vw - CARD_W) / 2) + 'px',
    });
  }

  function hideCurtains() {
    curtains.forEach(function (c) {
      Object.assign(c.style, { top: '0', left: '0', width: '0', height: '0' });
    });
  }

  /* ── End Card ──────────────────────────────────────────– */
  function showEnd() {
    isActive = false;
    localStorage.removeItem(STORAGE_KEYS.tourStep);
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
  }

  /* ── Helpers ───────────────────────────────────────────– */
  function el(tag, attrs) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(function ([k, v]) { node.setAttribute(k, v); });
    return node;
  }

  function debounce(fn, ms) {
    let t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, ms);
    };
  }

  /* ── Init ──────────────────────────────────────────────– */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

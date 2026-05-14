/* ============================================================
   CAREMAP MORRIS — Main JavaScript
   Handles: modal/walkthrough, search, counters, scroll reveal,
            mobile menu, bookmark toggle, footer dates, map
============================================================ */

/*
  LOADER — runs immediately on script parse, NOT inside DOMContentLoaded.
  Script sits at bottom of <body> so DOM nodes already exist when this runs.

  FIX: The white flash was caused by two things:
    1. This loader IIFE was inside DOMContentLoaded (fires too late — browser
       already painted the white body before the event fires).
    2. A duplicate loader block in the inline <script> in index.html was
       running a second time, resetting page-wrap to opacity:0 again after
       the first loader already finished — causing a second white flash.
  Both are now fixed: one loader, running here before any event listener.
*/
(function () {
  const loader = document.getElementById('loader');
  const page   = document.getElementById('page-wrap');
  if (!loader) return;

  const hasVisited = sessionStorage.getItem('cm_visited');

  if (hasVisited) {
    loader.style.display = 'none';
    if (page) page.style.opacity = '1';
  } else {
    sessionStorage.setItem('cm_visited', 'true');
    document.body.classList.add('loading');
    if (page) page.style.opacity = '0';

    setTimeout(function () {
  loader.classList.add('hide');
  if (page) page.style.opacity = '1';
  document.body.classList.remove('loading');

  setTimeout(function () {
    loader.style.display = 'none';

    // 🔑 NEW: signal that intro animation is fully done
    window.__cmLoaderDone = true;
  }, 600);

}, 2400);
  }
})();

document.addEventListener('DOMContentLoaded', function () {

  /* ----------------------------------------------------------
     1. WALKTHROUGH MODAL → now a collapsible help panel
        - Auto-starts the tour on first visit
        - Modal content lives inside a bottom-right help button
        - Tour starts automatically; modal becomes help reference
  ---------------------------------------------------------- */
  const backdrop   = document.getElementById('modalBackdrop');
  const modalWrap  = document.getElementById('modalWrap');
  const dismissX   = document.getElementById('dismissX');
  const dismissBtn = document.getElementById('dismissBtn');

  // These are now used by the help panel expand/collapse, not auto-show
  function openModal() {
    if (!backdrop || !modalWrap) return;
    backdrop.hidden  = false;
    modalWrap.hidden = false;
    document.body.style.overflow = 'hidden';
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

  if (dismissX)   dismissX.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);
  if (backdrop)   backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
  closeModal();
  if (typeof closeMobileMenu === 'function') closeMobileMenu();
    }
  });

  // Auto-start the tour on first visit (replaces the old modal auto-show)
const TOUR_KEY = 'cm_tour_seen';

function tryStartTour() {
  if (sessionStorage.getItem(TOUR_KEY)) return;
  if (!window.__cmLoaderDone) return;
  if (!window.CareMapTour || typeof window.CareMapTour.start !== 'function') return;

  window.CareMapTour.start();
  sessionStorage.setItem(TOUR_KEY, '1');
}

// try immediately (in case loader already finished)
tryStartTour();

// also keep checking until loader is done
const tourInterval = setInterval(function () {
  if (sessionStorage.getItem(TOUR_KEY)) {
    clearInterval(tourInterval);
    return;
  }

  if (window.__cmLoaderDone) {
    tryStartTour();
    clearInterval(tourInterval);
  }
}, 200);

  // Wire the "Browse Directory" button in the modal to also close it
  const browseBtn = modalWrap ? modalWrap.querySelector('a[href="directory.html"]') : null;
  if (browseBtn) {
    browseBtn.addEventListener('click', closeModal);
  }

  // Expose openModal so the help button in tour.js can call it
  window.CareMapHelp = { open: openModal };

 
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
     3. DROPDOWN NAVIGATION
---------------------------------------------------------- */
const toggle = document.querySelector('.dropdown-toggle');
const menu   = document.querySelector('.dropdown-menu');

if (toggle && menu) {
  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = menu.classList.contains('open');
    menu.classList.toggle('open', !isOpen);
    menu.style.display = isOpen ? '' : 'flex';
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });

  document.addEventListener('click', function (e) {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      menu.style.display = '';
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      menu.classList.remove('open');
      menu.style.display = '';
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}
  /* ----------------------------------------------------------
     4. MOBILE MENU
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
 
  if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setTimeout(closeMobileMenu, 50);
    });
  });
}
 
 
 /* ----------------------------------------------------------
   5. EDITORIAL STAT CARDS
---------------------------------------------------------- */
function animateCmStatNumber(el, target, duration) {
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    el.textContent = Math.round(eased * target);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(step);
}

const cmStatCells = document.querySelectorAll('.cm-cell');

if (cmStatCells.length) {
  if ('IntersectionObserver' in window) {
    const cmStatObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        const cell = entry.target;
        if (cell.dataset.played === 'true') return;

        const num = cell.querySelector('.cm-num');
        const bar = cell.querySelector('.cm-bar-fill');

        if (num) {
          const target = parseInt(num.dataset.count, 10);
          if (!isNaN(target)) {
            animateCmStatNumber(num, target, 1400);
          }
        }

        if (bar) {
          const fill = parseInt(bar.dataset.fill, 10);
          if (!isNaN(fill)) {
            bar.style.width = fill + '%';
          }
        }

        cell.dataset.played = 'true';
        cmStatObserver.unobserve(cell);
      });
    }, { threshold: 0.35 });

    cmStatCells.forEach(function (cell) {
      cmStatObserver.observe(cell);
    });
  } else {
    cmStatCells.forEach(function (cell) {
      const num = cell.querySelector('.cm-num');
      const bar = cell.querySelector('.cm-bar-fill');

      if (num) {
        num.textContent = num.dataset.count || '0';
      }

      if (bar) {
        bar.style.width = (bar.dataset.fill || 0) + '%';
      }
    });
  }
}

/* ----------------------------------------------------------
   5b. HOMEPAGE STATS COUNTERS
---------------------------------------------------------- */
function animateStatNumber(el, target, duration) {
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    el.textContent = Math.round(eased * target);

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(step);
}

const statCounters = document.querySelectorAll('.count-num[data-target]');

if (statCounters.length) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    statCounters.forEach(function (counter) {
      counter.textContent = counter.dataset.target || '0';
    });
  } else {
    const statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        const counter = entry.target;
        if (counter.dataset.played === 'true') return;

        const target = parseInt(counter.dataset.target, 10);
        if (!isNaN(target)) {
          animateStatNumber(counter, target, 1200);
        }

        counter.dataset.played = 'true';
        statObserver.unobserve(counter);
      });
    }, { threshold: 0.35 });

    statCounters.forEach(function (counter) {
      statObserver.observe(counter);
    });
  }
}
 
 
  /* ----------------------------------------------------------
     6. SCROLL REVEAL
  ---------------------------------------------------------- */
  const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
  const reveals = document.querySelectorAll(revealSelectors);
 
  if (reveals.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el       = entry.target;
        const parent   = el.parentElement;
        const siblings = parent
          ? Array.from(parent.querySelectorAll(revealSelectors + ':not(.visible)'))
          : [];
        const delay = Math.min(Math.max(0, siblings.indexOf(el)) * 80, 400);
        setTimeout(function () { el.classList.add('visible'); }, delay);
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
 
    reveals.forEach(function (r) { revealObserver.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add('visible'); });
  }
 
 
  /* ----------------------------------------------------------
     7. LEAFLET MAP
  ---------------------------------------------------------- */
  if (document.getElementById('map')) {
    const map = L.map('map').setView([40.8925, -74.4788], 11.25);
 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
 
    const organizations = [
      { id: 1,  name: "Interfaith Food Pantry",             coords: [40.831599473789744, -74.4967387711644], category: "food" },
      { id: 2,  name: "Boonton Food Pantry",                coords: [40.9019471, -74.4068955],              category: "food" },
      { id: 3,  name: "Loaves & Fishes Community Food Pantry", coords: [40.906545, -74.409786],             category: "food" },
      { id: 4,  name: "Chester Mendham Food Pantry",        coords: [40.7937, -74.6974],                    category: "food" },
      { id: 5,  name: "nourish.NJ (Morristown)",            coords: [40.8050444, -74.4845942],              category: "food" },
      { id: 5,  name: "nourish.NJ (Dover)",                 coords: [40.8779, -74.5385],                    category: "food" },
      { id: 6,  name: "Faith Kitchen",                      coords: [40.8851, -74.5521],                    category: "food" },
      { id: 7,  name: "Mount Olive Food Pantry",            coords: [40.864242169063566, -74.76509680000012], category: "food" },
      { id: 8,  name: "St. Peter's Food Pantry",            coords: [40.86494978034143, -74.39408306931551], category: "food" },
      { id: 9,  name: "Randolph Food Pantry",               coords: [40.84784658347127, -74.56295426376882], category: "food" },
      { id: 10, name: "Rockaway Food Closet",               coords: [40.903988992120844, -74.51300020369783], category: "food" },
      { id: 15, name: "Family Promise of Morris County",    coords: [40.79856105235971, -74.4834509449061],  category: "shelter" },
      { id: 16, name: "Market Street Mission",              coords: [40.798585446529735, -74.48346167116411], category: "shelter" },
      { id: 12, name: "Morris Family Justice Center",       coords: [40.79723006613729, -74.48403157374204], category: "support" },
      { id: 17, name: "Homeless Solutions Inc (Morristown)", coords: [40.831283217856836, -74.4471109602484], category: "shelter" },
      { id: 17, name: "Homeless Solutions Inc (Rockaway)",  coords: [40.831880509255264, -74.52162566024835], category: "shelter" },
      { id: 13, name: "Deirdre's House",                    coords: [40.7977545523217, -74.48360376024962],  category: "support" },
      { id: 14, name: "Jersey Battered Women's Service",    coords: [40.797686995786044, -74.48359027797845], category: "support" },
      { id: 18, name: "Morris Plains Teen Center",          coords: [40.82623300728235, -74.47964360257681], category: "youth" },
      { id: 19, name: "Youth Health Resources",             coords: [40.91279808390638, -74.52999068722995], category: "youth" },
      { id: 20, name: "CASA of Morris & Sussex Counties",   coords: [40.81130908220087, -74.45855200257735], category: "youth" },
      { id: 22, name: "Cornerstone Family Programs",        coords: [40.803089610756764, -74.48083271792117], category: "youth" },
      { id: 23, name: "Roots & Wings",                      coords: [40.89117504495456, -74.47447243141015], category: "youth" },
      { id: 24, name: "Morris County Youth Shelter",        coords: [40.832075785570865, -74.52214704274178], category: "shelter" },
      { id: 25, name: "Growing Stage",                      coords: [40.90071317709448, -74.70426357373807], category: "youth" },
      { id: 26, name: "DAWN Center for Independent Living", coords: [40.91160110393633, -74.49426738908117], category: "support" },
      { id: 27, name: "AVIDD Community Services",           coords: [40.89171681182489, -74.47431140257427], category: "support" },
      { id: 28, name: "ArcMorris",                          coords: [40.83067041207043, -74.49741557374077], category: "support" },
      { id: 29, name: "Lennon's House",                     coords: [40.90559424640193, -74.50382761791732], category: "support" },
      { id: 30, name: "Literacy Volunteers of Morris County", coords: [40.79332643399677, -74.4759002602498], category: "support" },
      { id: 31, name: "Morristown & Morris Township Library", coords: [40.79399217493562, -74.47882624490622], category: "support" },
      { id: 32, name: "Morris County Library",              coords: [40.80646109508215, -74.45300504729107], category: "support" },
      { id: 33, name: "First Choice Women's Resource Centers", coords: [40.80062942517182, -74.4820338602496], category: "health" },
      { id: 34, name: "Rockaway Neck Volunteer First Aid Squad", coords: [40.87585664412647, -74.38110460442618], category: "health" },
      { id: 35, name: "EdgeNJ",                             coords: [40.874729184442884, -74.42607387373907], category: "health" },
      { id: 36, name: "Community Hope",                     coords: [40.8615472676916, -74.381067658396],    category: "health" },
      { id: 37, name: "CARE Center of New Jersey",          coords: [40.928350332400875, -74.48457642955759], category: "health" },
      { id: 38, name: "Legal Services of Northwest Jersey", coords: [40.79662297465631, -74.48355830010377], category: "support" },
      { id: 39, name: "ProBono Partnership",                coords: [40.877853455214, -74.44696502707635],   category: "support" },
      { id: 40, name: "New Chapter Youth Program",          coords: [40.86794792719892, -74.41444721534225], category: "youth" },
      { id: 41, name: "Community Hope — Mental Health",     coords: [40.86172910714738, -74.38142671904005], category: "health" },
      { id: 42, name: "True Life Care Mental Health",       coords: [40.86238346057868, -74.49607819328992], category: "health" },
      { id: 44, name: "Mental Health Association of Morris County", coords: [40.86737726118494, -74.42343992883555], category: "health" },
      { id: 45, name: "Florham Park Rehabilitation & Healthcare", coords: [40.78770830141692, -74.43203738650666], category: "support" },
      { id: 47, name: "Integral Home Care",                 coords: [40.824383036609134, -74.49355781349333], category: "support" },
      { id: 48, name: "Excelcare at Troy Hills",            coords: [40.84835147338429, -74.40243757116444], category: "support" },
      { id: 49, name: "Caring Senior Service",              coords: [40.78772924776525, -74.46809968650668], category: "support" },
      { id: 50, name: "Absolute Awakenings",                coords: [40.86242426680515, -74.49609012883555], category: "other" },
      { id: 51, name: "The Milestone House",                coords: [40.886449566445165, -74.55858335767111], category: "other" },
      { id: 52, name: "New Pathway Counseling",             coords: [40.86599408106594, -74.351141],         category: "other" },
      { id: 53, name: "Better Life Recovery & Wellness",    coords: [40.79075328786209, -74.38283997116446], category: "other" },
      { id: 55, name: "Prevention is Key (PIK)",            coords: [40.90067877772641, -74.5132934],        category: "other" },
      { id: 56, name: "Morris County Aftercare",            coords: [40.883856359774995, -74.47998177125463], category: "other" },
      { id: 57, name: "New Chapter Recovery of NJ",         coords: [40.86789924704041, -74.41438284241306], category: "other" },
    ];
 
    const iconMap = {
      food:    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
      shelter: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
      support: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
      health:  'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      youth:   'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
      other:   'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png'
    };
 
    organizations.forEach(function (org) {
      const icon = L.icon({
        iconUrl:    iconMap[org.category] || iconMap.other,
        iconSize:   [25, 41],
        iconAnchor: [12, 41],
        popupAnchor:[1, -34],
        shadowUrl:  'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
      });
 
      const popupHtml = `
        <div style="font-family:'DM Sans',sans-serif; min-width:160px;">
          <strong style="font-size:.95rem; display:block; margin-bottom:.4rem;">${org.name}</strong>
          <a href="directory.html?id=${org.id}"
             style="display:inline-block; background:#C04B20; color:#fff;
                    padding:.3rem .7rem; border-radius:3px; font-size:.78rem;
                    text-decoration:none; margin-top:.2rem;">
            View Details →
          </a>
        </div>`;
 
      L.marker(org.coords, { icon })
        .addTo(map)
        .bindPopup(popupHtml);
    });
  }
 
 
  /* ----------------------------------------------------------
     8. BOOKMARKS — homepage featured cards
  ---------------------------------------------------------- */
  if (typeof CareMapBookmarks !== 'undefined') {
    CareMapBookmarks.bindButtons();
    CareMapBookmarks.applyToPage();
 
    document.querySelectorAll('.bookmark-count').forEach(function (el) {
      const c = CareMapBookmarks.count();
      el.textContent = c;
      el.style.display = c > 0 ? 'inline-flex' : 'none';
    });
  }
 
 
  /* ----------------------------------------------------------
     9. FOOTER — auto-populate year
  ---------------------------------------------------------- */
  const footerYearEl = document.getElementById('footerYear');
  if (footerYearEl) {
    footerYearEl.textContent = '© ' + new Date().getFullYear() + ' CareMap Morris. All rights reserved.';
  }
 
});
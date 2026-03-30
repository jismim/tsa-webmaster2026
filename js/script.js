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

const toggle = document.querySelector('.dropdown-toggle');
const menu = document.querySelector('.dropdown-menu');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const isOpen = menu.style.display === 'flex';
    menu.style.display = isOpen ? 'none' : 'flex';
    toggle.setAttribute('aria-expanded', !isOpen);
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
/**MAP */

// Leaflet map initialization
const map = L.map('map').setView([40.8925, -74.4788], 11.25); // Morris County center

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Example markers — replace with real organization coordinates
const organizations = [
  {
    name: "Interfaith Food Pantry",
    coords: [40.831599473789744, -74.4967387711644],
    category: "food",
  },
  {
    name: "Booton Food Pantry",
    coords: [40.9019471, -74.4068955],
    category: "food",
  },
  {
    name: "Loaves & Fishes Community Food Pantry",
    coords: [40.906545, -74.409786],
    category: "food",
  },
  {
    name: "Chester Mendham Food Pantry",
    coords: [40.7937, -74.6974],
    category: "food",
  },
  {
    name: "nourish.NJ",
    coords: [40.8050444, -74.4845942],
    category: "food",
  },
  {
    name: "nourish.NJ",
    coords: [40.8779, -74.5385],
    category: "food",
  },
  {
    name: "Faith Kitchen",
    coords: [40.8851, -74.5521],
    category: "food",
  },
  {
    name: "Mount Olive Food Pantry",
    coords: [40.864242169063566, -74.76509680000012],
    category: "food",
  },
  {
    name: "St. Peter's Food Pantry",
    coords: [40.86494978034143, -74.39408306931551],
    category: "food",
  },
  {
    name: "Randolph Food Pantry",
    coords: [40.84784658347127, -74.56295426376882],
    category: "food",
  },
  {
    name: "Rockaway Food Closet",
    coords: [40.903988992120844, -74.51300020369783],
    category: "food",
  },
  {
    name: "Family Promise of Morris County",
    coords: [40.79856105235971, -74.4834509449061],
    category: "shelter",
  },
  {
    name: "Market Street Mission - Morris County",
    coords: [40.798585446529735, -74.48346167116411],
    category: "shelter"
  },
  {
    name: "Morris Family Justice Center",
    coords: [40.79723006613729, -74.48403157374204],
    category: "support"
  },
  {
    name: "Homeless Solutions Inc",
    coords: [40.831283217856836, -74.4471109602484],
    category: "shelter"
  },
  {
    name: "Homeless Solutions Inc",
    coords: [40.831880509255264, -74.52162566024835],
    category: "shelter"
  },
    {
    name: "Deirdre’s House",
    coords: [40.7977545523217, -74.48360376024962],
    category: "support"
  },
    {
    name: "Jersey Battered Women’s Service (JBWS)",
    coords: [40.797686995786044, -74.48359027797845],
    category: "support"
  },
    {
    name: "Morris Plains Teen Center",
    coords: [40.82623300728235, -74.47964360257681],
    category: "youth"
  },
      {
    name: "Young Health Resources",
    coords: [40.91279808390638, -74.52999068722995],
    category: "youth"
  },
      {
    name: "CASA of Morris & Sussex Counties",
    coords: [40.81130908220087, -74.45855200257735],
    category: "youth"
  },
      {
    name: "Cornerstone Family Programs",
    coords: [40.803089610756764, -74.48083271792117],
    category: "youth"
  },
      {
    name: "Roots & Wings",
    coords: [40.89117504495456, -74.47447243141015],
    category: "youth"
  },
      {
    name: "Morris County Youth Shelter",
    coords: [40.832075785570865, -74.52214704274178],
    category: "shelter"
  },
      {
    name: "Growing Stage",
    coords: [40.90071317709448, -74.70426357373807],
    category: "youth"
  },
      {
    name: "DAWN Center for Independent Living",
    coords: [40.91160110393633, -74.49426738908117],
    category: "support"
  },
      {
    name: "AVIDD Community Services",
    coords: [40.89171681182489, -74.47431140257427],
    category: "support"
  },
        {
    name: "ArcMorris",
    coords: [40.83067041207043, -74.49741557374077],
    category: "support"
  },
        {
    name: "Lennon’s House",
    coords: [40.90559424640193, -74.50382761791732],
    category: "support"
  },
        {
    name: "Literacy Volunteers of Morris County",
    coords: [40.79332643399677, -74.4759002602498],
    category: "support"
  },
        {
    name: "Morristown & Morris Township Library",
    coords: [40.79399217493562, -74.47882624490622],
    category: "support"
  },
        {
    name: "Morris County Library",
    coords: [40.80646109508215, -74.45300504729107],
    category: "support"
  },
  {
    name: "First Choice Women's Resource Centers",
    coords: [40.80062942517182, -74.4820338602496],
    category: "health"
  },
  {
    name: "Parsippany's Rockaway Neck Volunteer First Aid Squad",
    coords: [40.87585664412647, -74.38110460442618],
    category: "health"
  },
  {
    name: "EdgeNJ",
    coords: [40.874729184442884, -74.42607387373907],
    category: "health"
  },
  {
    name: "Community Hope Inc",
    coords: [40.8615472676916, -74.381067658396],
    category: "health"
  },
  {
    name: "CARE Center of New Jersey",
    coords: [40.928350332400875, -74.48457642955759],
    category: "health"
  },
  {
    name: "Legal Services of Northwest Jersey",
    coords: [40.79662297465631, -74.48355830010377],
    category: "support"
  },
  {
    name: "ProBono Partnership",
    coords: [40.877853455214, -74.44696502707635],
    category: "support"
  },
  {
    name: "New Chapter Youth Program",
    coords: [40.86794792719892, -74.41444721534225],
    category: "youth"
  },
  {
    name: "Community Hope — Mental Health",
    coords: [40.86172910714738, -74.38142671904005],
    category: "health"
  },
  {
    name: "True Life Care Mental Health",
    coords: [40.86238346057868, -74.49607819328992],
    category: "health"
  },
  {
    name: "Mental Health Association of Morris County",
    coords: [40.86737726118494, -74.42343992883555],
    category: "health"
  },
  {
    name: "Florham Park Rehabilitation & Healthcare Center",
    coords: [40.78770830141692, -74.43203738650666],
    category: "support"
  },
  {
    name: "Integral Home Care",
    coords: [40.824383036609134, -74.49355781349333],
    category: "support"
  },
  {
    name: "Excelcare at Troy Hills",
    coords: [40.84835147338429, -74.40243757116444],
    category: "support"
  },
  {
    name: "Caring Senior Service",
    coords: [40.78772924776525, -74.46809968650668],
    category: "support"
  },
  {
    name: "Absolute Awakenings",
    coords: [40.86242426680515, -74.49609012883555],
    category: "other"
  },
  {
    name: "The Milestone House",
    coords: [40.886449566445165, -74.55858335767111],
    category: "other"
  },
  {
    name: "New Pathway Counseling",
    coords: [40.86599408106594, -74.351141],
    category: "other"
  },
  {
    name: "Better Life Recovery & Wellness",
    coords: [40.79075328786209, -74.38283997116446],
    category: "other"
  },
  {
    name: "The Milestone House",
    coords: [40.886449566445165, -74.55858335767111],
    category: "other"
  },
  {
    name: "Prevention is Key (PIK)",
    coords: [40.90067877772641, -74.5132934],
    category: "other"
  },
  {
    name: "Morris County Aftercare",
    coords: [40.883856359774995, -74.47998177125463],
    category: "other"
  },
{
    name: "New Chapter Recovery of NJ",
    coords: [40.86789924704041, -74.41438284241306],
    category: "other"
  },
{
    name: "Morris County Aftercare",
    coords: [40.883856359774995, -74.47998177125463],
    category: "other"
  },
{
    name: "Morris County Aftercare",
    coords: [40.883856359774995, -74.47998177125463],
    category: "other"
  }

];
const iconMap = {
  food: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
  shelter: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  support: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  health: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  youth: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  other: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png'
};

organizations.forEach(org => {
  const icon = L.icon({
    iconUrl: iconMap[org.category] || iconMap.other,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
  });

  L.marker(org.coords, { icon })
    .addTo(map)
    .bindPopup(`<strong>${org.name}</strong>`);
});
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

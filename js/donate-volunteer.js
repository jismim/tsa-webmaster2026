document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const MIN_GIVE_BACK_LOAD_MS = 2200;

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

  /* ── 3. Footer year ── */
  var yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = '© ' + new Date().getFullYear() + ' CareMap Morris. All rights reserved.';

  /* ── DATA ── */
  const VOLUNTEER_APPROVED_ENDPOINTS = [
    "https://8dz55fh325.execute-api.us-east-1.amazonaws.com/prod/approved/formatted?root=volunteer",
    "https://8dz55fh325.execute-api.us-east-1.amazonaws.com/prod/approved?root=volunteer"
  ];

  const DATA = [];

  function slugify(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function unwrapApprovedItems(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.items)) {
      return payload.items.map(item => item.data || item);
    }
    return [];
  }

  function firstText(...values) {
    return values.find(value => String(value || '').trim()) || '';
  }

  function inferKind(item) {
    if (item.kind) return String(item.kind).toLowerCase();

    const donationNeeds = firstText(item.donationNeeds, item.donation_needs);
    const volunteerRoles = firstText(item.volunteerRoles, item.volunteerOpportunities, item.volunteer_opportunities);

    if (donationNeeds && volunteerRoles) return 'donate & volunteer';
    if (donationNeeds) return 'donate';
    return 'volunteer';
  }

  function mergeKinds(existingKind, approvedKind) {
    const kinds = new Set();

    [existingKind, approvedKind].forEach(kind => {
      const normalized = String(kind || '').toLowerCase();
      if (normalized.includes('donate')) kinds.add('donate');
      if (normalized.includes('volunteer')) kinds.add('volunteer');
    });

    if (kinds.has('donate') && kinds.has('volunteer')) return 'donate & volunteer';
    if (kinds.has('donate')) return 'donate';
    return 'volunteer';
  }

  function inferAges(item) {
    if (Array.isArray(item.age) && item.age.length) return item.age.map(slugify).filter(Boolean);

    const text = [
      item.category,
      item.resourceType,
      item.desc,
      item.shortDesc,
      item.longDesc,
      item.description,
      item.volunteerRoles,
      item.volunteerOpportunities
    ].join(' ').toLowerCase();

    const ages = new Set(['adult']);
    if (text.includes('family')) ages.add('family');
    if (text.includes('teen') || text.includes('youth')) ages.add('teen');
    if (text.includes('kid') || text.includes('child')) ages.add('kids');
    if (text.includes('senior')) ages.add('senior');
    return Array.from(ages);
  }

  function inferLocation(item) {
    if (item.location) return slugify(item.location);
    if (item.town) return slugify(item.town);

    const knownLocations = [
      'boonton', 'butler', 'chester', 'clifton', 'dover', 'florham-park',
      'kinnelon', 'madison', 'morris-plains', 'morristown', 'mt-arlington',
      'newark', 'parsippany', 'randolph', 'riverdale', 'rockaway', 'roxbury',
      'whippany'
    ];
    const normalizedAddress = slugify(item.address);
    return knownLocations.find(location => normalizedAddress.includes(location)) || 'county-wide';
  }

  function mapService(value) {
    const serviceMap = {
      'food-pantry': 'food',
      shelter: 'housing',
      'domestic-violence': 'counseling',
      'mental-health': 'counseling',
      'legal-aid': 'legal',
      'youth-services': 'childcare',
      'senior-services': 'social',
      'disability-services': 'social',
      'job-training': 'education',
      healthcare: 'medical',
      social: 'social',
      education: 'education',
      substance: 'counseling',
      violence: 'counseling',
      legal: 'legal',
      childcare: 'childcare',
      hygiene: 'hygiene',
      housing: 'housing',
      food: 'food'
    };
    const slug = slugify(value);
    return serviceMap[slug] || slug;
  }

  function inferServices(item) {
    const services = [
      ...(Array.isArray(item.services) ? item.services : []),
      ...(Array.isArray(item.servicesProvided) ? item.servicesProvided : []),
      item.category,
      item.resourceType
    ]
      .map(mapService)
      .filter(Boolean);

    return Array.from(new Set(services));
  }

  function makeNumericId(item) {
    const numericId = Number(item.id);
    if (Number.isSafeInteger(numericId) && numericId > 0) return 1000000 + numericId;

    const source = String(item.id || item.title || item.organizationName || item.name || '');
    return 1000000 + Math.abs(source.split('').reduce((hash, char) => {
      return ((hash << 5) - hash) + char.charCodeAt(0);
    }, 0));
  }

  function normalizeApprovedVolunteer(item) {
    return {
      id: makeNumericId(item),
      kind: inferKind(item),
      title: firstText(item.title, item.organizationName, item.name),
      desc: firstText(item.desc, item.description, item.shortDesc, item.longDesc, item.volunteerRoles, item.volunteerOpportunities, item.donationNeeds),
      age: inferAges(item),
      location: inferLocation(item),
      services: inferServices(item),
      link: firstText(item.website, item.link),
      phone: firstText(item.phone),
      address: firstText(item.address)
    };
  }

  async function fetchApprovedVolunteerItems() {
    for (const endpoint of VOLUNTEER_APPROVED_ENDPOINTS) {
      try {
        const response = await fetch(endpoint, { cache: 'no-store' });
        if (!response.ok) continue;

        const items = unwrapApprovedItems(await response.json())
          .map(normalizeApprovedVolunteer)
          .filter(item => item.title && item.desc);

        if (items.length) return items;
      } catch (error) {
        console.warn(`Unable to load approved volunteer opportunities from ${endpoint}`, error);
      }
    }

    return [];
  }

  async function loadApprovedVolunteerOpportunities() {
    const approvedItems = await fetchApprovedVolunteerItems();
    const existingIds = new Set(DATA.map(item => Number(item.id)));
    const existingByTitle = new Map(DATA.map(item => [slugify(item.title), item]));
    const newItems = [];

    approvedItems.forEach(item => {
      const existingItem = existingByTitle.get(slugify(item.title));

      if (existingItem) {
        existingItem.kind = mergeKinds(existingItem.kind, item.kind);
        existingItem.desc = firstText(item.desc, existingItem.desc);
        existingItem.age = Array.from(new Set([...(existingItem.age || []), ...(item.age || [])]));
        existingItem.services = Array.from(new Set([...(existingItem.services || []), ...(item.services || [])]));
        existingItem.link = firstText(existingItem.link, item.link);
        existingItem.phone = firstText(existingItem.phone, item.phone);
        existingItem.address = firstText(existingItem.address, item.address);
        existingItem.location = existingItem.location === 'county-wide' ? item.location : existingItem.location;
        return;
      }

      if (!existingIds.has(Number(item.id))) {
        newItems.push(item);
      }
    });

    DATA.unshift(...newItems);
  }

  const cardsList      = document.getElementById('cardsList');
  const noResults      = document.getElementById('noResults');
  const resultsCount   = document.getElementById('resultsCount');
  const filterAge      = document.getElementById('filter-age');
  const filterLocation = document.getElementById('filter-location');
  const chips          = document.querySelectorAll('.chip');
  const tabBtns        = document.querySelectorAll('.tab-btn');
  const resetBtn       = document.getElementById('resetFilters');

  /* Detail modal DOM refs */
  const backdrop   = document.getElementById('detailBackdrop');
  const modalWrap  = document.getElementById('detailModalWrap');
  const detailCard = document.getElementById('detailCard');

  let activeTab      = 'all';
  let activeServices = [];
  let lastFocused    = null;
let currentPage    = 1;
let viewAll        = false;
const PAGE_SIZE    = 8;

  /* ── Nav badge helper ── */
  function updateDvBadge() {
    if (typeof CareMapBookmarks === 'undefined') return;
    const count = CareMapBookmarks.count();
    document.querySelectorAll('.bookmark-count').forEach(el => {
      el.textContent   = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  }

  function syncLocationFilterOptions() {
    const existing = new Set(Array.from(filterLocation.options).map(option => option.value));

    Array.from(new Set(DATA.map(item => item.location).filter(Boolean)))
      .sort()
      .forEach(location => {
        if (existing.has(location)) return;

        const option = document.createElement('option');
        option.value = location;
        option.textContent = location
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        filterLocation.appendChild(option);
      });
  }

  // -------------------
  // Kind badge HTML
  // -------------------
  function kindBadgesHtml(kind) {
    if (kind === 'donate & volunteer') {
      if (activeTab === 'donate')    return `<span class="kind-badge badge-donate">Donate</span>`;
      if (activeTab === 'volunteer') return `<span class="kind-badge badge-volunteer">Volunteer</span>`;
      return `<span class="kind-badge badge-donate">Donate</span><span class="kind-badge badge-volunteer">Volunteer</span>`;
    }
    if (kind === 'volunteer') {
      return `<span class="kind-badge badge-volunteer">Volunteer</span>`;
    }
    return `<span class="kind-badge badge-donate">Donate</span>`;
  }

  function formatServiceTag(service) {
    const labels = {
      animals: 'Animals',
      childcare: 'Childcare',
      clothing: 'Clothing',
      counseling: 'Counseling',
      education: 'Education',
      environment: 'Environment',
      food: 'Food',
      housing: 'Housing',
      hygiene: 'Hygiene',
      legal: 'Legal',
      medical: 'Medical'
    };

    return labels[service] || service
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function servicePillsHtml(services) {
    return (services || [])
      .map(service => `<span class="card-pill">${formatServiceTag(service)}</span>`)
      .join('');
  }

  /* ── Main render function ── */
  function render() {
    cardsList.setAttribute('aria-busy', 'false');

    const age      = filterAge.value;
    const location = filterLocation.value.toLowerCase();

    const filtered = DATA.filter(item => {
      if (activeTab === 'donate'    && item.kind === 'volunteer') return false;
      if (activeTab === 'volunteer' && item.kind === 'donate')    return false;
      if (age      && !item.age.includes(age))                           return false;
      if (location && item.location.toLowerCase() !== location)          return false;
      if (activeServices.length && !activeServices.every(s => item.services.includes(s))) return false;
      return true;
    });

    /* When filtering by tab, push "both" items to bottom */
    if (activeTab !== 'all') {
      filtered.sort((a, b) => {
        const aIsBoth = a.kind === 'donate & volunteer' ? 1 : 0;
        const bIsBoth = b.kind === 'donate & volunteer' ? 1 : 0;
        return aIsBoth - bIsBoth;
      });
    }
const totalPages = viewAll ? 1 : Math.ceil(filtered.length / PAGE_SIZE);
if (currentPage > totalPages) currentPage = 1;

const pageItems = viewAll ? filtered : filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    cardsList.innerHTML = pageItems.map(item => {
      const townDisplay = item.location
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const isSaved    = typeof CareMapBookmarks !== 'undefined' && CareMapBookmarks.isSaved(item.id);
      const heartChar  = isSaved ? '♥' : '♡';
      const heartLabel = isSaved ? 'Unsave this organization' : 'Save this organization';

      return `
  <article class="dv-card" tabindex="0" role="button" aria-label="View details for ${item.title}" data-id="${item.id}">
    <div class="dv-card-topbar">
      <div class="kind-badges">${kindBadgesHtml(item.kind)}</div>
      <button
        class="card-bookmark dv-bookmark${isSaved ? ' saved' : ''}"
        data-id="${item.id}"
        aria-label="${heartLabel}"
        title="${heartLabel}"
      >${heartChar}</button>
    </div>

    <div class="dv-card-content">
      <h3>${item.title}</h3>
${item.address ? `
  <p class="card-address">
    <svg class="card-location-icon" width="10" height="13" viewBox="0 0 10 13" aria-hidden="true" focusable="false">
      <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="currentColor"></path>
    </svg>
    <span>${item.address}</span>
  </p>
` : `
  <p class="card-address">
    <svg class="card-location-icon" width="10" height="13" viewBox="0 0 10 13" aria-hidden="true" focusable="false">
      <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="currentColor"></path>
    </svg>
    <span>${townDisplay}</span>
  </p>
`}
${item.phone ? `
  <p class="card-phone">
    <svg class="card-phone-icon" width="13" height="13" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" fill="currentColor"/>
    </svg>
    ${item.phone}
  </p>` : ''}
      <div class="dv-card-bottom-row">
        <p class="card-desc">${item.desc}</p>
        <div class="dv-card-actions">
          <button class="btn btn-secondary view-details-btn" data-id="${item.id}">View details</button>
        </div>
      </div>
    </div>
  </article>
`;

    }).join('');

    resultsCount.textContent = `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`;
    noResults.hidden = filtered.length > 0;
    cardsList.hidden = filtered.length === 0;

renderPagination(filtered.length, totalPages, filtered.length);
    /* ── Bind bookmark hearts on cards ── */
    cardsList.querySelectorAll('.dv-bookmark[data-id]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        if (typeof CareMapBookmarks === 'undefined') return;
        const id = parseInt(btn.dataset.id, 10);
        
        // Find the item and cache it before bookmarking
        const item = DATA.find(d => d.id === id);
        if (item) {
          localStorage.setItem('cm_gb_item_' + id, JSON.stringify(item));
        }
        
        const nowSaved = CareMapBookmarks.toggle(id, CareMapBookmarks.SECTIONS.GIVE_BACK);
        btn.textContent = nowSaved ? '♥' : '♡';
        btn.classList.toggle('saved', nowSaved);
        btn.setAttribute('aria-label', nowSaved ? 'Unsave this organization' : 'Save this organization');
        btn.classList.remove('bookmark-pop');
        void btn.offsetWidth;
        btn.classList.add('bookmark-pop');
        updateDvBadge();
      });
    });

    /* ── Whole card opens modal ── */
    cardsList.querySelectorAll('.dv-card').forEach(card => {
      const item = DATA.find(d => d.id === Number(card.dataset.id));
      if (!item) return;

      card.addEventListener('click', e => {
        if (e.target.closest('a') || e.target.closest('.dv-bookmark')) return;
        openDetail(item, card);
      });

      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openDetail(item, card);
        }
      });
    });
  }

  /* ── Pagination renderer ── */
 function renderPagination(total, totalPages) {
  let pager = document.getElementById('dvPagination');
  if (!pager) {
    pager = document.createElement('nav');
    pager.id = 'dvPagination';
    pager.setAttribute('aria-label', 'Results pages');
    cardsList.parentNode.insertBefore(pager, cardsList.nextSibling);
  }

  const viewAllBtn = `
    <button class="page-btn view-all-btn" id="pgViewAll">
      ${viewAll ? '↩ Show Less' : 'View All'}
    </button>`;

  if (viewAll || totalPages <= 1) {
    pager.innerHTML = `
      <p class="pagination-info">Showing all ${total} result${total !== 1 ? 's' : ''}</p>
      <div class="pagination-btns">${viewAllBtn}</div>`;
    pager.querySelector('#pgViewAll').addEventListener('click', () => {
      viewAll = !viewAll;
      currentPage = 1;
      render();
      scrollToList();
    });
    return;
  }

  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end   = Math.min(currentPage * PAGE_SIZE, total);

  let html = `<p class="pagination-info">Showing ${start}–${end} of ${total}</p>`;
  html += `<div class="pagination-btns">`;
  html += `<button class="page-btn page-arrow" ${currentPage === 1 ? 'disabled' : ''} aria-label="First page" id="pgFirst">&#8676;</button>`;
  html += `<button class="page-btn page-arrow" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous page" id="pgPrev">&#8592;</button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}" aria-label="Page ${i}" aria-current="${i === currentPage ? 'page' : 'false'}">${i}</button>`;
  }
  html += `<button class="page-btn page-arrow" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Next page" id="pgNext">&#8594;</button>`;
  html += `<button class="page-btn page-arrow" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Last page" id="pgLast">&#8677;</button>`;
  html += viewAllBtn;
  html += `</div>`;

  pager.innerHTML = html;

  pager.querySelector('#pgFirst').addEventListener('click', () => { if (currentPage > 1) { currentPage = 1; render(); scrollToList(); } });
  pager.querySelector('#pgPrev').addEventListener('click',  () => { if (currentPage > 1) { currentPage--; render(); scrollToList(); } });
  pager.querySelector('#pgNext').addEventListener('click',  () => { if (currentPage < totalPages) { currentPage++; render(); scrollToList(); } });
  pager.querySelector('#pgLast').addEventListener('click',  () => { if (currentPage < totalPages) { currentPage = totalPages; render(); scrollToList(); } });
  pager.querySelectorAll('.page-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => { currentPage = Number(btn.dataset.page); render(); scrollToList(); });
  });
  pager.querySelector('#pgViewAll').addEventListener('click', () => {
    viewAll = !viewAll;
    currentPage = 1;
    render();
    scrollToList();
  });
}

  /* ── Scroll to card list ── */
  function scrollToList() {
    const top = cardsList.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  /* ── Open detail modal ── */
  function openDetail(item, triggerEl) {
    lastFocused = triggerEl || document.activeElement;

    // Cache the item when opening modal
    localStorage.setItem('cm_gb_item_' + item.id, JSON.stringify(item));

    const pills = servicePillsHtml(item.services);

    const websiteHtml = item.link
      ? `<a href="${item.link}" target="_blank" rel="noopener">${item.link.replace(/^https?:\/\//, '')}</a>`
      : `<span style="color:var(--warm-gray)">Not listed</span>`;

    const phoneHtml = item.phone
      ? `<a href="tel:${item.phone}">${item.phone}</a>`
      : `<span style="color:var(--warm-gray)">Not listed</span>`;

    const mapsUrl = item.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`
      : '';

    const isSaved    = typeof CareMapBookmarks !== 'undefined' && CareMapBookmarks.isSaved(item.id);
    const heartChar  = isSaved ? '♥' : '♡';
    const heartLabel = isSaved ? 'Unsave this organization' : 'Save this organization';

    detailCard.innerHTML = `
  <div class="detail-head">
    <div class="detail-head-left">
      <div class="kind-badges">${kindBadgesHtml(item.kind)}</div>
      <h2 class="detail-title" id="detailTitle">${item.title}</h2>
    </div>
    <div class="detail-head-right">
      <button
        class="detail-bookmark card-bookmark${isSaved ? ' saved' : ''}"
        data-id="${item.id}"
        aria-label="${heartLabel}"
        title="${heartLabel}"
      >${heartChar}</button>
      <button class="detail-close" id="detailCloseX" aria-label="Close details">&#x2715;</button>
    </div>
  </div>

  <div class="detail-body">
    <div class="detail-section">
      <p class="detail-section-label">Summary</p>
      <p class="detail-long-desc">${item.desc}</p>
    </div>

    <div class="detail-section">
      <p class="detail-section-label">Tags</p>
      <div class="detail-tags">${pills || "<span style='color:var(--warm-gray)'>No tags listed</span>"}</div>
    </div>

    <div class="detail-section">
      <p class="detail-section-label">Contact &amp; Location</p>
      <div class="detail-info-grid">
        <div class="detail-info-item">
          <p class="detail-info-label">Town</p>
          <p class="detail-info-value">${item.location.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</p>
        </div>

        <div class="detail-info-item">
          <p class="detail-info-label">Phone</p>
          <p class="detail-info-value">${phoneHtml}</p>
        </div>

        <div class="detail-info-item">
          <p class="detail-info-label">Address</p>
          <p class="detail-info-value">${item.address || "<span style='color:var(--warm-gray)'>Not listed</span>"}</p>
        </div>

        <div class="detail-info-item">
          <p class="detail-info-label">Website</p>
          <p class="detail-info-value">${websiteHtml}</p>
        </div>
      </div>
    </div>
  </div>

  <div class="detail-actions">
    ${item.link    ? `<a class="btn btn-primary"   href="${item.link}" target="_blank" rel="noopener">Visit Website</a>` : ''}
    ${item.phone   ? `<a class="btn btn-secondary" href="tel:${item.phone}">Call</a>` : ''}
    ${mapsUrl      ? `<a class="btn btn-secondary" href="${mapsUrl}" target="_blank" rel="noopener">Open in Maps</a>` : ''}
  </div>
`;

    detailCard.querySelector('#detailCloseX').addEventListener('click',   closeDetail);
    /* ── Modal bookmark heart ── */
    const modalHeart = detailCard.querySelector('.detail-bookmark');
    if (modalHeart && typeof CareMapBookmarks !== 'undefined') {
      modalHeart.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const nowSaved = CareMapBookmarks.toggle(item.id, CareMapBookmarks.SECTIONS.GIVE_BACK);

        // Cache the item
        localStorage.setItem('cm_gb_item_' + item.id, JSON.stringify(item));

        modalHeart.textContent = nowSaved ? '♥' : '♡';
        modalHeart.classList.toggle('saved', nowSaved);
        modalHeart.setAttribute('aria-label', nowSaved ? 'Unsave this organization' : 'Save this organization');

        /* Sync with grid card heart */
        const gridHeart = cardsList.querySelector(`.dv-bookmark[data-id="${item.id}"]`);
        if (gridHeart) {
          gridHeart.textContent = nowSaved ? '♥' : '♡';
          gridHeart.classList.toggle('saved', nowSaved);
          gridHeart.setAttribute('aria-label', nowSaved ? 'Unsave this organization' : 'Save this organization');
        }

        updateDvBadge();

        modalHeart.classList.remove('bookmark-pop');
        void modalHeart.offsetWidth;
        modalHeart.classList.add('bookmark-pop');
      });
    }

    backdrop.hidden  = false;
    modalWrap.hidden = false;
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      const first = detailCard.querySelector('button, a[href]');
      if (first) first.focus();
    });
  }

  /* ── Close detail modal ── */
  function closeDetail() {
    backdrop.hidden  = true;
    modalWrap.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  backdrop.addEventListener('click', closeDetail);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modalWrap.hidden) closeDetail();
  });

  /* ── Tab buttons ── */
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      activeTab   = btn.dataset.tab;
      currentPage = 1;

      const resultsHeading = document.getElementById('results-heading');
      if (resultsHeading) {
        if (activeTab === 'donate')         resultsHeading.textContent = 'Donate Opportunities';
        else if (activeTab === 'volunteer') resultsHeading.textContent = 'Volunteer Opportunities';
        else                                resultsHeading.textContent = 'All Opportunities';
      }

      render();
    });
  });

  /* ── Service chips ── */
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      const val = chip.dataset.value;
      activeServices = activeServices.includes(val)
        ? activeServices.filter(s => s !== val)
        : [...activeServices, val];
      currentPage = 1;
      render();
    });
  });

  /* ── Age & Location filters ── */
  filterAge.addEventListener('change',      () => { currentPage = 1; render(); });
  filterLocation.addEventListener('change', () => { currentPage = 1; render(); });

  /* ── Reset button ── */
 resetBtn.addEventListener('click', () => {
    activeTab      = 'all';
    activeServices = [];
    currentPage    = 1;
    viewAll        = false;
    filterAge.value      = '';
    filterLocation.value = '';
    chips.forEach(c => c.classList.remove('selected'));
    tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    tabBtns[0].classList.add('active');
    tabBtns[0].setAttribute('aria-selected', 'true');
    render();
  });

  /* ══════════════════════════════════════════════════════
     VOLUNTEER MATCHMAKER QUIZ
  ══════════════════════════════════════════════════════ */

  const QUIZ_STEPS = [
    {
      id: 'intent',
      question: 'What would you like to do?',
      cols: 3,
      options: [
        { label: 'Volunteer My Time',      desc: 'Hands-on help at local orgs',      value: 'volunteer' },
        { label: 'Donate',                 desc: 'Money, supplies, or goods',         value: 'donate'    },
        { label: 'Both',                   desc: "I'm open to either",                value: 'all'       },
      ]
    },
    {
      id: 'cause',
      question: 'What cause matters most to you?',
      options: [
        { label: 'Hunger & Basic Needs',    desc: 'Food pantries, meal programs',     value: 'food'           },
        { label: 'Families & Children',     desc: 'Childcare, family support, youth', value: 'family-support' },
        { label: 'Animals',                 desc: 'Animal shelters & welfare',         value: 'animals'        },
        { label: 'Mental Health & Crisis',  desc: 'Counseling & crisis services',      value: 'crisis'         },
        { label: 'Education & Arts',        desc: 'Libraries, museums, literacy',      value: 'education'      },
        { label: 'Housing & Shelter',       desc: 'Homelessness & housing needs',      value: 'housing'        },
      ]
    },
    {
      id: 'age',
      question: 'Which age group are you?',
      options: [
        { label: 'Under 13',       desc: 'Kid-friendly programs',          value: 'kids'   },
        { label: 'Teen (13–17)',   desc: 'Youth volunteer opportunities',  value: 'teen'   },
        { label: 'Adult (18–54)', desc: 'Full adult volunteer roles',      value: 'adult'  },
        { label: 'Senior (55+)',   desc: 'Senior-friendly opportunities',  value: 'senior' },
        { label: 'Family Group',   desc: 'Volunteering together',          value: 'family' },
      ]
    },
    {
      id: 'location',
      question: 'Where are you located?',
      isDropdown: true
    }
  ];

  const CAUSE_SERVICE_MAP = {
    'food':           ['food', 'hygiene'],
    'family-support': ['childcare', 'food'],
    'animals':        ['animals'],
    'crisis':         ['counseling', 'housing'],
    'education':      ['education'],
    'housing':        ['housing'],
  };

  const CAUSE_LABELS = {
    'food':           'Hunger & Basic Needs',
    'family-support': 'Families & Children',
    'animals':        'Animals',
    'crisis':         'Mental Health & Crisis',
    'education':      'Education & Arts',
    'housing':        'Housing & Shelter',
  };

  const AGE_LABELS = { kids: 'Under 13', teen: 'Teens (13–17)', adult: 'Adults (18–54)', senior: 'Seniors (55+)', family: 'Family Group' };

  const quizBackdrop  = document.getElementById('quizBackdrop');
  const quizModalWrap = document.getElementById('quizModalWrap');
  const quizModal     = document.getElementById('quizModal');
  const quizLaunchBtn = document.getElementById('quizLaunchBtn');

  let quizStep    = 0;
  let quizAnswers = {};

  function openQuiz() {
    quizStep    = 0;
    quizAnswers = {};
    quizBackdrop.hidden  = false;
    quizModalWrap.hidden = false;
    document.body.style.overflow = 'hidden';
    renderQuizStep();
    requestAnimationFrame(() => {
      const first = quizModal.querySelector('.quiz-option, .quiz-location-select');
      if (first) first.focus();
    });
  }

  function closeQuiz() {
    quizBackdrop.hidden  = true;
    quizModalWrap.hidden = true;
    document.body.style.overflow = '';
    if (quizLaunchBtn) quizLaunchBtn.focus();
  }

  function renderQuizStep() {
    const step  = QUIZ_STEPS[quizStep];
    const total = QUIZ_STEPS.length;
    const pct   = Math.round((quizStep / total) * 100);

    let bodyHtml = '';

    if (step.isDropdown) {
      const locationOpts = Array.from(filterLocation.options)
        .map(o => `<option value="${o.value}"${quizAnswers.location === o.value ? ' selected' : ''}>${o.textContent}</option>`)
        .join('');
      bodyHtml = `
        <p class="quiz-step-counter">Step ${quizStep + 1} of ${total}</p>
        <p class="quiz-step-question">${step.question}</p>
        <select class="quiz-location-select" id="quizLocationSelect">${locationOpts}</select>
      `;
    } else {
      const colClass = step.cols === 3 ? 'quiz-options cols-3' : 'quiz-options';
      const opts = step.options.map(opt => `
        <button
          class="quiz-option${quizAnswers[step.id] === opt.value ? ' selected' : ''}"
          data-value="${opt.value}"
          aria-pressed="${quizAnswers[step.id] === opt.value ? 'true' : 'false'}"
        >
          <span class="quiz-option-label">${opt.label}</span>
          ${opt.desc ? `<span class="quiz-option-desc">${opt.desc}</span>` : ''}
        </button>
      `).join('');
      bodyHtml = `
        <p class="quiz-step-counter">Step ${quizStep + 1} of ${total}</p>
        <p class="quiz-step-question">${step.question}</p>
        <div class="${colClass}" role="group" aria-label="${step.question}">${opts}</div>
      `;
    }

    const isLast    = quizStep === total - 1;
    const canBack   = quizStep > 0;
    const hasAnswer = step.isDropdown || !!quizAnswers[step.id];

    quizModal.innerHTML = `
      <div class="quiz-header">
        <div class="quiz-title-area">
          <p class="quiz-eyebrow">Volunteer Matchmaker</p>
          <h2 class="quiz-heading" id="quizHeading">Find Your Match</h2>
        </div>
        <button class="quiz-close" id="quizCloseBtn" aria-label="Close quiz">&#x2715;</button>
      </div>
      <div class="quiz-progress" aria-hidden="true">
        <div class="quiz-progress-bar" style="width:${pct}%"></div>
      </div>
      <div class="quiz-body">${bodyHtml}</div>
      <div class="quiz-footer">
        ${canBack ? `<button class="quiz-btn-back" id="quizBackBtn">&#8592; Back</button>` : `<span></span>`}
        <button class="quiz-btn-next" id="quizNextBtn"${!hasAnswer ? ' disabled' : ''}>
          ${isLast ? 'See My Matches' : 'Next'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    `;

    quizModal.querySelector('#quizCloseBtn').addEventListener('click', closeQuiz);

    if (canBack) {
      quizModal.querySelector('#quizBackBtn').addEventListener('click', () => { quizStep--; renderQuizStep(); });
    }

    if (!step.isDropdown) {
      quizModal.querySelectorAll('.quiz-option').forEach(btn => {
        btn.addEventListener('click', () => {
          quizAnswers[step.id] = btn.dataset.value;
          quizModal.querySelectorAll('.quiz-option').forEach(b => {
            b.classList.toggle('selected', b.dataset.value === btn.dataset.value);
            b.setAttribute('aria-pressed', b.dataset.value === btn.dataset.value ? 'true' : 'false');
          });
          quizModal.querySelector('#quizNextBtn').disabled = false;
        });
      });
    }

    quizModal.querySelector('#quizNextBtn').addEventListener('click', () => {
      if (step.isDropdown) {
        quizAnswers.location = quizModal.querySelector('#quizLocationSelect').value;
      }
      if (quizStep < total - 1) {
        quizStep++;
        renderQuizStep();
      } else {
        applyQuizResults();
      }
    });
  }

  function applyQuizResults() {
    closeQuiz();

    activeTab      = quizAnswers.intent || 'all';
    activeServices = CAUSE_SERVICE_MAP[quizAnswers.cause] || [];
    filterAge.value      = quizAnswers.age      || '';
    filterLocation.value = quizAnswers.location || '';

    tabBtns.forEach(b => {
      const on = b.dataset.tab === activeTab;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    chips.forEach(c => c.classList.toggle('selected', activeServices.includes(c.dataset.value)));

    const resultsHeading = document.getElementById('results-heading');
    if (resultsHeading) {
      if (activeTab === 'donate')         resultsHeading.textContent = 'Donate Opportunities';
      else if (activeTab === 'volunteer') resultsHeading.textContent = 'Volunteer Opportunities';
      else                                resultsHeading.textContent = 'All Opportunities';
    }

    currentPage = 1;
    render();
    showQuizResultsBanner();

    setTimeout(() => {
      const target = document.getElementById('results-heading');
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 100);
  }

  function buildResultsSummary() {
    const parts = [];
    if (quizAnswers.intent && quizAnswers.intent !== 'all') {
      parts.push(quizAnswers.intent === 'volunteer' ? 'Volunteer' : 'Donate');
    }
    if (quizAnswers.cause) parts.push(CAUSE_LABELS[quizAnswers.cause] || quizAnswers.cause);
    if (quizAnswers.age)   parts.push(AGE_LABELS[quizAnswers.age] || quizAnswers.age);
    if (quizAnswers.location) {
      parts.push(quizAnswers.location.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
    }
    return parts.join(' · ');
  }

  function showQuizResultsBanner() {
    const existing = document.getElementById('quizResultsBanner');
    if (existing) existing.remove();

    const summary = buildResultsSummary();
    const banner  = document.createElement('div');
    banner.id        = 'quizResultsBanner';
    banner.className = 'quiz-results-banner';
    banner.innerHTML = `
      <div class="quiz-results-banner-text">
        <strong>Showing your matched opportunities</strong>
        <span>${summary || 'All opportunities'}</span>
      </div>
      <button class="quiz-results-clear" id="quizClearBtn">Clear match</button>
    `;

    const resultsHeader = document.querySelector('.results-header');
    if (resultsHeader) resultsHeader.after(banner);

    banner.querySelector('#quizClearBtn').addEventListener('click', () => {
      banner.remove();
      resetBtn.click();
    });
  }

  if (quizLaunchBtn) quizLaunchBtn.addEventListener('click', openQuiz);

  quizBackdrop.addEventListener('click', closeQuiz);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !quizModalWrap.hidden) closeQuiz();
  });

  resetBtn.addEventListener('click', () => {
    const banner = document.getElementById('quizResultsBanner');
    if (banner) banner.remove();
  });

  /* ── Initial render + badge sync ── */
  resultsCount.textContent = 'Loading opportunities...';
  const giveBackLoadDelay = new Promise(resolve => {
    setTimeout(resolve, MIN_GIVE_BACK_LOAD_MS);
  });

  Promise.all([
    loadApprovedVolunteerOpportunities()
    .catch(error => {
      console.warn('Approved volunteer opportunities could not be loaded; using built-in Give Back data.', error);
    }),
    giveBackLoadDelay
  ])
    .finally(() => {
      syncLocationFilterOptions();
      render();
      updateDvBadge();
    });
});

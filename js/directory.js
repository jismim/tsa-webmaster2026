/* ============================================================
<<<<<<< Updated upstream
   CAREMAP MORRIS — Full Directory JavaScript
   Requires: resources.js loaded first (provides RESOURCES array)
   Features: search, category/town/service filters, sort,
             grid/list view, hover tooltip, detail modal,
             save/bookmark, email saved list
=======
   CAREMAP MORRIS — Directory JavaScript
   Requires: resources.js loaded before this file
<<<<<<< HEAD
>>>>>>> Stashed changes
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

<<<<<<< Updated upstream
  /* ──────────────────────────────────────────────
     CATEGORY MAP
  ────────────────────────────────────────────── */
  var CAT = {
    'food':               { label: 'Food & Nutrition',    cls: 'badge-food' },
    'housing':            { label: 'Housing & Shelter',   cls: 'badge-housing' },
    'domestic-violence':  { label: 'Domestic Violence',   cls: 'badge-domestic-violence' },
    'mental-health':      { label: 'Mental Health',       cls: 'badge-mental-health' },
    'substance-use':      { label: 'Substance Use',       cls: 'badge-substance-use' },
    'health':             { label: 'Health Care',         cls: 'badge-health' },
    'legal':              { label: 'Legal Services',      cls: 'badge-legal' },
    'disability':         { label: 'Disability Services', cls: 'badge-disability' },
    'youth':              { label: 'Youth & Children',    cls: 'badge-youth' },
    'senior':             { label: 'Senior Services',     cls: 'badge-senior' },
    'employment':         { label: 'Employment',          cls: 'badge-employment' },
    'education':          { label: 'Education & ESL',     cls: 'badge-education' },
    'social-services':    { label: 'Social Services',     cls: 'badge-social-services' }
  };

  /* ──────────────────────────────────────────────
     STATE
  ────────────────────────────────────────────── */
  var state = {
    query:    '',
    category: 'all',
    town:     'All Towns',
    service:  'all',
    sort:     'alpha',
    view:     'grid',
    saved:    []       // array of resource IDs
  };

  // Read URL params on load (?q=... ?category=...)
  var urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('q'))        state.query    = urlParams.get('q');
  if (urlParams.get('category')) state.category = urlParams.get('category');

  /* ──────────────────────────────────────────────
     DOM REFS
  ────────────────────────────────────────────── */
  var searchInput     = document.getElementById('dirSearch');
  var catPills        = document.querySelectorAll('.cat-pill[data-cat]');
  var townSelect      = document.getElementById('townFilter');
  var serviceSelect   = document.getElementById('serviceFilter');
  var sortSelect      = document.getElementById('sortSelect');
  var viewGridBtn     = document.getElementById('viewGrid');
  var viewListBtn     = document.getElementById('viewList');
  var resultCountEl   = document.getElementById('resultCount');
  var gridWrap        = document.getElementById('resourceGridWrap');
  var activeFiltersEl = document.getElementById('activeFilters');

  var hoverTip        = document.getElementById('hoverTip');

  var detailBackdrop  = document.getElementById('detailBackdrop');
  var detailModalWrap = document.getElementById('detailModalWrap');
  var detailCard      = document.getElementById('detailCard');

  var saveModalWrap   = document.getElementById('saveModalWrap');
  var saveModalClose  = document.getElementById('saveModalClose');
  var saveBackdrop    = document.getElementById('saveBackdrop');
  var savedListEl     = document.getElementById('savedList');
  var emailInput      = document.getElementById('emailInput');
  var sendEmailBtn    = document.getElementById('sendEmailBtn');
  var emailNote       = document.getElementById('emailNote');
  var floatSaves      = document.getElementById('floatSaves');
  var floatSavesBtn   = document.getElementById('floatSavesBtn');
  var floatBadge      = document.getElementById('floatBadge');

  var lastFocused     = null;
  var hoverTimer      = null;
  var mouseX = 0, mouseY = 0;

  /* ──────────────────────────────────────────────
     INIT
  ────────────────────────────────────────────── */
  function init() {
    if (state.query) searchInput.value = state.query;
    if (state.category !== 'all') updateCatUI();
    render();
  }

  /* ──────────────────────────────────────────────
     FILTER + SORT
  ────────────────────────────────────────────── */
  function getFiltered() {
    var list = RESOURCES.slice();

    // Search query
    if (state.query.trim()) {
      var q = state.query.toLowerCase();
      list = list.filter(function (r) {
        return (
          r.title.toLowerCase().includes(q) ||
          r.shortDesc.toLowerCase().includes(q) ||
          r.longDesc.toLowerCase().includes(q) ||
          r.town.toLowerCase().includes(q) ||
          r.tags.some(function (t) { return t.toLowerCase().includes(q); })
        );
      });
=======
  /* ----------------------------------------------------------
     STATE
  ---------------------------------------------------------- */
  let state = {
    query:       '',
    category:    'all',
    town:        'All Towns',
    service:     'all',
    sort:        'alpha',
    view:        'grid',   // 'grid' | 'list'
    savedIds:    [],
    hoverTimer:  null,
    hoverActive: null,
  };

  // Parse URL query params on load
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('q'))        state.query    = urlParams.get('q');
  if (urlParams.get('category')) state.category = urlParams.get('category');

  /* ----------------------------------------------------------
     DOM REFS
  ---------------------------------------------------------- */
  const searchInput      = document.getElementById('dirSearch');
  const categoryPills    = document.querySelectorAll('.filter-pill[data-category]');
  const townSelect       = document.getElementById('townFilter');
  const serviceSelect    = document.getElementById('serviceFilter');
  const sortSelect       = document.getElementById('sortFilter');
  const viewGrid         = document.getElementById('viewGrid');
  const viewList         = document.getElementById('viewList');
  const resultCount      = document.getElementById('resultCount');
  const gridWrap         = document.getElementById('resourceGridWrap');
  const activeFiltersEl  = document.getElementById('activeFilters');
  const clearAllBtn      = document.getElementById('clearAllFilters');

  const hoverCard        = document.getElementById('hoverCard');
  const detailBackdrop   = document.getElementById('detailBackdrop');
  const detailModal      = document.getElementById('detailModal');
  const detailClose      = document.getElementById('detailClose');
  const detailContent    = document.getElementById('detailContent');

  const saveBackdrop     = document.getElementById('saveBackdrop');
  const saveModal        = document.getElementById('saveModal');
  const saveModalClose   = document.getElementById('saveModalClose');
  const floatSavesBtn    = document.getElementById('floatSavesBtn');
  const saveCountBadge   = document.getElementById('saveCountBadge');
  const savedListEl      = document.getElementById('savedListEl');
  const emailInput       = document.getElementById('emailInput');
  const sendEmailBtn     = document.getElementById('sendEmailBtn');
  const emailNote        = document.getElementById('emailNote');

  /* ----------------------------------------------------------
     INIT — populate filters from data
  ---------------------------------------------------------- */
  function init() {
    if (state.query) searchInput.value = state.query;
    if (state.category !== 'all') {
      document.querySelector(`.filter-pill[data-category="${state.category}"]`)?.classList.add('active');
      document.querySelector(`.filter-pill[data-category="all"]`)?.classList.remove('active');
    }
    render();
  }

  /* ----------------------------------------------------------
     FILTERING
  ---------------------------------------------------------- */
  function getFiltered() {
    let list = [...RESOURCES];

    // Query
    if (state.query.trim()) {
      const q = state.query.toLowerCase();
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.shortDesc.toLowerCase().includes(q) ||
        r.longDesc.toLowerCase().includes(q) ||
        r.town.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q))
      );
>>>>>>> Stashed changes
    }

    // Category
    if (state.category !== 'all') {
<<<<<<< Updated upstream
      list = list.filter(function (r) { return r.category === state.category; });
    }

    // Town
    if (state.town !== 'All Towns') {
      list = list.filter(function (r) { return r.town === state.town; });
    }

    // Service
    if (state.service !== 'all') {
      list = list.filter(function (r) { return r.services.includes(state.service); });
    }

    // Sort
    if (state.sort === 'alpha') {
      list.sort(function (a, b) { return a.title.localeCompare(b.title); });
    } else if (state.sort === 'category') {
      list.sort(function (a, b) { return a.category.localeCompare(b.category); });
    } else if (state.sort === 'town') {
      list.sort(function (a, b) { return a.town.localeCompare(b.town); });
    }

    return list;
  }

  /* ──────────────────────────────────────────────
     RENDER
  ────────────────────────────────────────────── */
  function render() {
    var filtered = getFiltered();

    // Result count
    resultCountEl.innerHTML =
      'Showing <strong>' + filtered.length + '</strong> of <strong>' + RESOURCES.length + '</strong> resources';

    // Active filter chips
    renderActiveFilters();

    // Clear container
    gridWrap.innerHTML = '';

    // Set class
    gridWrap.className = state.view === 'grid' ? 'resource-grid' : 'resource-list';

    if (filtered.length === 0) {
      gridWrap.innerHTML =
        '<div class="dir-empty">' +
          '<div class="dir-empty-icon">🔍</div>' +
          '<h3>No resources found</h3>' +
          '<p>Try adjusting your search or filters. You can also <a href="submit.html">submit a resource</a> if one is missing.</p>' +
        '</div>';
      return;
    }

    filtered.forEach(function (r, i) {
      var el = state.view === 'grid' ? buildCard(r, i) : buildListItem(r, i);
      gridWrap.appendChild(el);
    });
  }

  /* ──────────────────────────────────────────────
     BUILD GRID CARD
  ────────────────────────────────────────────── */
  function buildCard(r, i) {
    var cat     = CAT[r.category] || { label: r.category, cls: '' };
    var isSaved = state.saved.indexOf(r.id) !== -1;

    var tagsHtml = r.tags.slice(0, 3).map(function (t) {
      return '<span class="res-tag">' + t + '</span>';
    }).join('');
    if (r.tags.length > 3) {
      tagsHtml += '<span class="res-tag">+' + (r.tags.length - 3) + '</span>';
    }

    var card = document.createElement('article');
    card.className = 'res-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'View details for ' + r.title);

    card.innerHTML =
      '<div class="res-card-body">' +
        '<span class="res-badge ' + cat.cls + '">' + cat.label + '</span>' +
        '<h3 class="res-card-title">' + r.title + '</h3>' +
        '<p class="res-card-location">' + pinSvg() + r.town + '</p>' +
        '<p class="res-card-desc">' + r.shortDesc + '</p>' +
        '<div class="res-card-tags">' + tagsHtml + '</div>' +
      '</div>' +
      '<div class="res-card-footer">' +
        '<span class="res-card-phone">' + (r.phone || '') + '</span>' +
        '<div style="display:flex;gap:5px;align-items:center">' +
          '<button class="res-save-btn ' + (isSaved ? 'saved' : '') + '" data-id="' + r.id + '" aria-label="' + (isSaved ? 'Unsave' : 'Save') + ' ' + r.title + '">' +
            (isSaved ? '♥' : '♡') + ' Save' +
          '</button>' +
          '<button class="res-expand-btn" data-id="' + r.id + '" aria-label="View details for ' + r.title + '">' +
            'Details ' + arrowSvg() +
          '</button>' +
        '</div>' +
      '</div>';

    // Card body click → detail
    card.addEventListener('click', function (e) {
      if (e.target.closest('.res-save-btn') || e.target.closest('.res-expand-btn')) return;
      openDetail(r, card);
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetail(r, card); }
    });

    card.querySelector('.res-expand-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      openDetail(r, card);
    });
    card.querySelector('.res-save-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      toggleSave(r.id);
    });

    // Hover tooltip
    card.addEventListener('mouseenter', function () { scheduleHover(r); });
    card.addEventListener('mouseleave',  cancelHover);

    return card;
  }

  /* ──────────────────────────────────────────────
     BUILD LIST ITEM
  ────────────────────────────────────────────── */
  function buildListItem(r, i) {
    var cat     = CAT[r.category] || { label: r.category, cls: '' };
    var isSaved = state.saved.indexOf(r.id) !== -1;

    var item = document.createElement('article');
    item.className = 'res-list-item';
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'View details for ' + r.title);

    item.innerHTML =
      '<div>' +
        '<span class="res-badge ' + cat.cls + '" style="font-size:.65rem">' + cat.label + '</span>' +
      '</div>' +
      '<div class="res-list-content">' +
        '<h3>' + r.title + '</h3>' +
        '<div class="res-list-meta">' +
          '<span>' + pinSvg() + ' ' + r.town + '</span>' +
          (r.phone  ? '<span>📞 ' + r.phone  + '</span>' : '') +
          (r.hours  ? '<span>🕐 ' + r.hours  + '</span>' : '') +
        '</div>' +
        '<p class="res-list-desc">' + r.shortDesc + '</p>' +
      '</div>' +
      '<div class="res-list-actions">' +
        '<button class="res-save-btn ' + (isSaved ? 'saved' : '') + '" data-id="' + r.id + '">' +
          (isSaved ? '♥' : '♡') +
        '</button>' +
        '<button class="res-expand-btn" data-id="' + r.id + '">Details</button>' +
      '</div>';

    item.addEventListener('click', function (e) {
      if (e.target.closest('.res-save-btn') || e.target.closest('.res-expand-btn')) return;
      openDetail(r, item);
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetail(r, item); }
    });
    item.querySelector('.res-expand-btn').addEventListener('click', function (e) {
      e.stopPropagation(); openDetail(r, item);
    });
    item.querySelector('.res-save-btn').addEventListener('click', function (e) {
      e.stopPropagation(); toggleSave(r.id);
    });

    item.addEventListener('mouseenter', function () { scheduleHover(r); });
    item.addEventListener('mouseleave',  cancelHover);

    return item;
  }

  /* ──────────────────────────────────────────────
     HOVER TOOLTIP
  ────────────────────────────────────────────── */
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (hoverTip.classList.contains('show')) positionTip();
  });

  function scheduleHover(r) {
    cancelHover();
    hoverTimer = setTimeout(function () { showTip(r); }, 320);
  }
  function cancelHover() {
    clearTimeout(hoverTimer);
    hoverTip.classList.remove('show');
  }
  function showTip(r) {
    var cat = CAT[r.category] || { label: r.category, cls: '' };
    hoverTip.innerHTML =
      '<div class="hover-tip-inner">' +
        '<div class="hover-tip-head">' +
          '<span class="res-badge ' + cat.cls + '" style="font-size:.62rem;margin-bottom:4px">' + cat.label + '</span>' +
          '<p class="hover-tip-name">' + r.title + '</p>' +
        '</div>' +
        '<div class="hover-tip-body">' +
          '<div class="hover-tip-row"><span class="hover-tip-icon">📍</span><span>' + r.address + '</span></div>' +
          (r.phone ? '<div class="hover-tip-row"><span class="hover-tip-icon">📞</span><span>' + r.phone + '</span></div>' : '') +
          (r.hours ? '<div class="hover-tip-row"><span class="hover-tip-icon">🕐</span><span>' + r.hours + '</span></div>' : '') +
        '</div>' +
        '<div class="hover-tip-foot">Click to view full details</div>' +
      '</div>';
    positionTip();
    hoverTip.classList.add('show');
  }
  function positionTip() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var tw = hoverTip.offsetWidth  || 260;
    var th = hoverTip.offsetHeight || 160;
    var gap = 14;
    var x = mouseX + gap;
    var y = mouseY - th / 2;
    if (x + tw > vw - gap) x = mouseX - tw - gap;
    if (y < gap)            y = gap;
    if (y + th > vh - gap)  y = vh - th - gap;
    hoverTip.style.left = x + 'px';
    hoverTip.style.top  = y + 'px';
  }

  /* ──────────────────────────────────────────────
     DETAIL MODAL
  ────────────────────────────────────────────── */
  function openDetail(r, trigger) {
    lastFocused = trigger || document.activeElement;
    cancelHover();

    var cat       = CAT[r.category] || { label: r.category, cls: '' };
    var isSaved   = state.saved.indexOf(r.id) !== -1;
    var tagsHtml  = r.tags.map(function (t) { return '<span class="res-tag">' + t + '</span>'; }).join('');
    var phoneHtml = r.phone   ? '<a href="tel:' + r.phone + '">'   + r.phone   + '</a>' : 'Not listed';
    var webHtml   = r.website ? '<a href="' + r.website + '" target="_blank" rel="noopener">' + r.website.replace('https://','').replace('http://','') + '</a>' : 'Not listed';

    detailCard.innerHTML =
      '<div class="detail-head">' +
        '<div class="detail-head-left">' +
          '<span class="res-badge ' + cat.cls + '">' + cat.label + '</span>' +
          '<h2 class="detail-title" id="detailTitle">' + r.title + '</h2>' +
        '</div>' +
        '<button class="detail-close" id="dCloseX" aria-label="Close">&#x2715;</button>' +
      '</div>' +
      '<div class="detail-body">' +
        '<div class="detail-section">' +
          '<p class="detail-section-label">About this organization</p>' +
          '<p class="detail-long-desc">' + r.longDesc + '</p>' +
        '</div>' +
        '<div class="detail-section">' +
          '<p class="detail-section-label">Tags</p>' +
          '<div class="detail-tags">' + tagsHtml + '</div>' +
        '</div>' +
        '<div class="detail-section">' +
          '<p class="detail-section-label">Contact &amp; Location</p>' +
          '<div class="detail-info-grid">' +
            '<div class="detail-info-item"><p class="detail-info-label">Address</p><p class="detail-info-value">' + (r.address || 'Not listed') + '</p></div>' +
            '<div class="detail-info-item"><p class="detail-info-label">Phone</p><p class="detail-info-value">' + phoneHtml + '</p></div>' +
            '<div class="detail-info-item"><p class="detail-info-label">Hours</p><p class="detail-info-value">' + (r.hours || 'Call to confirm') + '</p></div>' +
            '<div class="detail-info-item"><p class="detail-info-label">Website</p><p class="detail-info-value">' + webHtml + '</p></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="detail-actions">' +
        (r.website ? '<a class="btn btn-primary" href="' + r.website + '" target="_blank" rel="noopener">Visit Website &rarr;</a>' : '') +
        (r.phone   ? '<a class="btn btn-secondary" href="tel:' + r.phone + '">Call Now</a>' : '') +
        '<button class="btn ' + (isSaved ? 'btn-secondary' : 'btn-ghost') + '" id="dSaveBtn">' +
          (isSaved ? '♥ Saved' : '♡ Save') +
        '</button>' +
        '<button class="btn btn-ghost" id="dCloseBtn">Close</button>' +
      '</div>';

    detailCard.querySelector('#dCloseX').addEventListener('click',  closeDetail);
    detailCard.querySelector('#dCloseBtn').addEventListener('click', closeDetail);
    detailCard.querySelector('#dSaveBtn').addEventListener('click', function () {
      toggleSave(r.id);
      var btn = detailCard.querySelector('#dSaveBtn');
      var saved = state.saved.indexOf(r.id) !== -1;
      btn.innerHTML = saved ? '♥ Saved' : '♡ Save';
      btn.className = 'btn ' + (saved ? 'btn-secondary' : 'btn-ghost');
    });

    detailBackdrop.hidden  = false;
    detailModalWrap.hidden = false;
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(function () {
      var first = detailCard.querySelector('button, a[href]');
      if (first) first.focus();
    });
  }

  function closeDetail() {
    detailBackdrop.hidden  = true;
    detailModalWrap.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  detailBackdrop.addEventListener('click', closeDetail);

  /* ──────────────────────────────────────────────
     SAVE / BOOKMARK
  ────────────────────────────────────────────── */
  function toggleSave(id) {
    var idx = state.saved.indexOf(id);
    if (idx === -1) {
      state.saved.push(id);
    } else {
      state.saved.splice(idx, 1);
    }
    updateFloatBtn();
    render();
  }

  function updateFloatBtn() {
    var count = state.saved.length;
    floatBadge.textContent = count;
    if (count > 0) {
      floatSaves.style.display = 'block';
      floatBadge.classList.add('show');
    } else {
      floatSaves.style.display = 'none';
      floatBadge.classList.remove('show');
    }
  }

  /* ──────────────────────────────────────────────
     SAVE MODAL
  ────────────────────────────────────────────── */
  function openSaveModal() {
    renderSavedList();
    saveBackdrop.hidden    = false;
    saveModalWrap.hidden   = false;
    document.body.style.overflow = 'hidden';
  }
  function closeSaveModal() {
    saveBackdrop.hidden    = true;
    saveModalWrap.hidden   = true;
    document.body.style.overflow = '';
  }

  function renderSavedList() {
    emailNote.textContent = '';
    emailNote.className   = 'email-note';

    if (state.saved.length === 0) {
      savedListEl.innerHTML =
        '<div class="save-modal-empty">' +
          '<span class="empty-icon">🔖</span>' +
          'No saved resources yet. Click ♡ on any card.' +
        '</div>';
      return;
    }
    savedListEl.innerHTML = state.saved.map(function (id) {
      var r = RESOURCES.find(function (x) { return x.id === id; });
      if (!r) return '';
      return '<div class="saved-list-item">' +
        '<span>' + r.title + '</span>' +
        '<button class="saved-list-remove" data-remove="' + id + '">✕ Remove</button>' +
      '</div>';
    }).join('');

    savedListEl.querySelectorAll('.saved-list-remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        toggleSave(parseInt(this.dataset.remove, 10));
        renderSavedList();
      });
    });
  }

  floatSavesBtn.addEventListener('click', openSaveModal);
  saveModalClose.addEventListener('click', closeSaveModal);
  saveBackdrop.addEventListener('click', closeSaveModal);

  sendEmailBtn.addEventListener('click', function () {
    var email = emailInput.value.trim();
    if (!email || !email.includes('@')) {
      emailNote.textContent = 'Please enter a valid email address.';
      emailNote.className   = 'email-note error';
      return;
    }
    if (state.saved.length === 0) {
      emailNote.textContent = 'Save some resources first!';
      emailNote.className   = 'email-note error';
      return;
    }
    var body = state.saved.map(function (id) {
      var r = RESOURCES.find(function (x) { return x.id === id; });
      if (!r) return '';
      return r.title + '\n📍 ' + r.address + '\n📞 ' + (r.phone || 'N/A') + '\n🌐 ' + (r.website || 'N/A');
    }).join('\n\n---\n\n');

    var subject = encodeURIComponent('My Saved Resources — CareMap Morris');
    var mailBody = encodeURIComponent('Here are the resources I saved from CareMap Morris:\n\n' + body + '\n\nFind more at caremapmorris.org');
    window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + mailBody;

    emailNote.textContent = '✓ Opening your email client…';
    emailNote.className   = 'email-note success';
    emailInput.value = '';
    setTimeout(function () {
      emailNote.textContent = '';
      emailNote.className = 'email-note';
    }, 4000);
  });

  /* ──────────────────────────────────────────────
     ACTIVE FILTER CHIPS
  ────────────────────────────────────────────── */
  function renderActiveFilters() {
    var chips = [];
    if (state.query) chips.push({ label: '"' + state.query + '"', clear: function () { state.query = ''; searchInput.value = ''; } });
    if (state.category !== 'all') {
      var catLabel = (CAT[state.category] || {}).label || state.category;
      chips.push({ label: catLabel, clear: function () { state.category = 'all'; updateCatUI(); } });
    }
    if (state.town !== 'All Towns') {
      chips.push({ label: state.town, clear: function () { state.town = 'All Towns'; townSelect.value = 'All Towns'; } });
    }
    if (state.service !== 'all') {
      var opt = serviceSelect.querySelector('option[value="' + state.service + '"]');
      chips.push({ label: opt ? opt.textContent : state.service, clear: function () { state.service = 'all'; serviceSelect.value = 'all'; } });
    }

    if (chips.length === 0) { activeFiltersEl.innerHTML = ''; return; }

    activeFiltersEl.innerHTML = chips.map(function (c, i) {
      return '<button class="active-filter-chip" data-idx="' + i + '">' + c.label + ' <span class="active-filter-chip-x">✕</span></button>';
    }).join('') + '<button class="clear-all-link" id="clearAllDyn">Clear all</button>';

    activeFiltersEl.querySelectorAll('.active-filter-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        chips[parseInt(this.dataset.idx, 10)].clear();
        render();
      });
    });
    var clearAll = activeFiltersEl.querySelector('#clearAllDyn');
    if (clearAll) clearAll.addEventListener('click', doClearAll);
  }

  function doClearAll() {
=======
      list = list.filter(r => r.category === state.category);
    }

    // Town
    if (state.town !== 'All Towns') {
      list = list.filter(r => r.town === state.town);
    }

    // Service
    if (state.service !== 'all') {
      list = list.filter(r => r.services.includes(state.service));
    }

    // Sort
    if (state.sort === 'alpha') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (state.sort === 'category') {
      list.sort((a, b) => a.category.localeCompare(b.category));
    } else if (state.sort === 'town') {
      list.sort((a, b) => a.town.localeCompare(b.town));
    }

    return list;
  }

  /* ----------------------------------------------------------
     RENDER
  ---------------------------------------------------------- */
  function render() {
    const filtered = getFiltered();

    // Result count
    resultCount.innerHTML = `Showing <strong>${filtered.length}</strong> of <strong>${RESOURCES.length}</strong> resources`;

    // Active filters display
    renderActiveFilters();

    // Clear grid
    gridWrap.innerHTML = '';

    if (filtered.length === 0) {
      gridWrap.innerHTML = `
        <div class="dir-empty">
          <div class="dir-empty-icon">🔍</div>
          <h3>No resources found</h3>
          <p>Try adjusting your filters or search term. You can also <a href="submit.html" style="color:var(--rust)">submit a resource</a> if you think one is missing.</p>
        </div>`;
      return;
    }

    // Update grid class
    gridWrap.className = state.view === 'grid' ? 'resource-grid' : 'resource-list';
    gridWrap.id = 'resourceGridWrap';

    // Render cards
    filtered.forEach(function(r, i) {
      const el = state.view === 'grid' ? buildGridCard(r, i) : buildListItem(r, i);
      gridWrap.appendChild(el);
    });
  }

  /* ----------------------------------------------------------
     BUILD GRID CARD
  ---------------------------------------------------------- */
  function buildGridCard(r, i) {
    const catDef  = CATEGORIES.find(c => c.id === r.category) || CATEGORIES[0];
    const isSaved = state.savedIds.includes(r.id);

    const card = document.createElement('article');
    card.className = 'res-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View details for ${r.title}`);
    card.innerHTML = `
      <div class="res-card-top">
        <span class="res-cat-badge" style="background:${catDef.color}22;color:${catDef.color}">${catDef.label}</span>
        <button class="res-save-btn ${isSaved ? 'saved' : ''}"
          data-id="${r.id}"
          aria-label="${isSaved ? 'Unsave' : 'Save'} ${r.title}"
          title="${isSaved ? 'Unsave' : 'Save'} this resource">
          ${isSaved ? '♥' : '♡'}
        </button>
      </div>
      <div class="res-card-body">
        <h3 class="res-card-title">${r.title}</h3>
        <p class="res-card-town">${r.town}</p>
        <p class="res-card-desc">${r.shortDesc}</p>
        <div class="res-card-tags">
          ${r.tags.slice(0, 3).map(t => `<span class="res-tag">${t}</span>`).join('')}
          ${r.tags.length > 3 ? `<span class="res-tag">+${r.tags.length - 3}</span>` : ''}
        </div>
      </div>
      <div class="res-card-footer">
        <span class="res-card-phone">${r.phone || '—'}</span>
        <button class="res-expand-btn" data-id="${r.id}">View details</button>
      </div>
    `;

    // Click body → open detail
    card.addEventListener('click', function(e) {
      if (e.target.closest('.res-save-btn') || e.target.closest('.res-expand-btn')) return;
      openDetail(r.id);
    });
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetail(r.id); }
    });

    // Expand btn
    card.querySelector('.res-expand-btn').addEventListener('click', function(e) {
      e.stopPropagation();
      openDetail(r.id);
    });

    // Save btn
    card.querySelector('.res-save-btn').addEventListener('click', function(e) {
      e.stopPropagation();
      toggleSave(r.id);
    });

    // Hover card
    card.addEventListener('mouseenter', function(e) { scheduleHover(r, card); });
    card.addEventListener('mouseleave',  function()  { cancelHover(); });

    return card;
  }

  /* ----------------------------------------------------------
     BUILD LIST ITEM
  ---------------------------------------------------------- */
  function buildListItem(r, i) {
    const catDef  = CATEGORIES.find(c => c.id === r.category) || CATEGORIES[0];
    const isSaved = state.savedIds.includes(r.id);

    const item = document.createElement('article');
    item.className = 'res-list-item';
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View details for ${r.title}`);
    item.innerHTML = `
      <div class="res-list-badge-col">
        <span class="res-cat-badge" style="background:${catDef.color}22;color:${catDef.color}">${catDef.label}</span>
      </div>
      <div class="res-list-content">
        <h3>${r.title}</h3>
        <div class="res-list-meta">
          <span>📍 ${r.town}</span>
          ${r.phone ? `<span>📞 ${r.phone}</span>` : ''}
          ${r.hours ? `<span>🕐 ${r.hours}</span>` : ''}
        </div>
        <p class="res-list-desc">${r.shortDesc}</p>
      </div>
      <div class="res-list-actions">
        <button class="res-save-btn ${isSaved ? 'saved' : ''}" data-id="${r.id}" aria-label="${isSaved ? 'Unsave' : 'Save'} ${r.title}">
          ${isSaved ? '♥' : '♡'}
        </button>
        <button class="res-expand-btn" data-id="${r.id}">Details</button>
      </div>
    `;

    item.addEventListener('click', function(e) {
      if (e.target.closest('.res-save-btn') || e.target.closest('.res-expand-btn')) return;
      openDetail(r.id);
    });
    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetail(r.id); }
    });
    item.querySelector('.res-expand-btn').addEventListener('click', function(e) {
      e.stopPropagation(); openDetail(r.id);
    });
    item.querySelector('.res-save-btn').addEventListener('click', function(e) {
      e.stopPropagation(); toggleSave(r.id);
    });

    item.addEventListener('mouseenter', function() { scheduleHover(r, item); });
    item.addEventListener('mouseleave',  function() { cancelHover(); });

    return item;
  }

  /* ----------------------------------------------------------
     HOVER CARD
  ---------------------------------------------------------- */
  let hoverX = 0, hoverY = 0;

  document.addEventListener('mousemove', function(e) {
    hoverX = e.clientX; hoverY = e.clientY;
    if (hoverCard.classList.contains('visible')) positionHoverCard();
  });

  function positionHoverCard() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cw = hoverCard.offsetWidth  || 300;
    const ch = hoverCard.offsetHeight || 200;
    const gap = 16;

    let x = hoverX + gap;
    let y = hoverY - ch / 2;

    if (x + cw > vw - gap) x = hoverX - cw - gap;
    if (y < gap)            y = gap;
    if (y + ch > vh - gap)  y = vh - ch - gap;

    hoverCard.style.left = x + 'px';
    hoverCard.style.top  = y + 'px';
  }

  function scheduleHover(r, el) {
    cancelHover();
    state.hoverTimer = setTimeout(function() {
      showHoverCard(r, el);
    }, 300);
  }

  function cancelHover() {
    clearTimeout(state.hoverTimer);
    hoverCard.classList.remove('visible');
    state.hoverActive = null;
  }

  function showHoverCard(r, el) {
    const catDef = CATEGORIES.find(c => c.id === r.category) || CATEGORIES[0];
    hoverCard.innerHTML = `
      <div class="hover-card-inner">
        <div class="hover-card-head">
          <div>
            <span class="res-cat-badge" style="background:${catDef.color}22;color:${catDef.color};font-size:.62rem">${catDef.label}</span>
            <p class="hover-card-title" style="margin-top:.4rem">${r.title}</p>
          </div>
        </div>
        <div class="hover-card-body">
          <div class="hover-card-detail">
            <span class="hover-card-detail-icon">📍</span>
            <span>${r.address}</span>
          </div>
          ${r.phone ? `<div class="hover-card-detail"><span class="hover-card-detail-icon">📞</span><span>${r.phone}</span></div>` : ''}
          ${r.hours ? `<div class="hover-card-detail"><span class="hover-card-detail-icon">🕐</span><span>${r.hours}</span></div>` : ''}
        </div>
        <div class="hover-card-foot">Click to view full details</div>
      </div>
    `;
    positionHoverCard();
    hoverCard.classList.add('visible');
    state.hoverActive = r.id;
  }

  /* ----------------------------------------------------------
     DETAIL MODAL
  ---------------------------------------------------------- */
  function openDetail(id) {
    const r = RESOURCES.find(r => r.id === id);
    if (!r) return;

    const catDef  = CATEGORIES.find(c => c.id === r.category) || CATEGORIES[0];
    const isSaved = state.savedIds.includes(r.id);

    detailContent.innerHTML = `
      <div class="detail-card-head">
        <div class="detail-head-top">
          <div>
            <span class="res-cat-badge" style="background:${catDef.color}22;color:${catDef.color};margin-bottom:.5rem;display:inline-block">${catDef.label}</span>
            <h2 class="detail-title">${r.title}</h2>
          </div>
          <button class="detail-close" id="detailClose" aria-label="Close details">✕</button>
        </div>
        <div class="detail-meta-row">
          <span class="detail-meta-item">📍 <strong>${r.town}</strong></span>
          ${r.phone  ? `<span class="detail-meta-item">📞 <strong>${r.phone}</strong></span>` : ''}
          ${r.hours  ? `<span class="detail-meta-item">🕐 <strong>${r.hours}</strong></span>` : ''}
        </div>
      </div>

      <div class="detail-card-body">
        <div class="detail-section">
          <p class="detail-section-title">About this organization</p>
          <p class="detail-desc">${r.longDesc}</p>
        </div>

        <div class="detail-tags">
          ${r.tags.map(t => `<span class="detail-tag">${t}</span>`).join('')}
        </div>

        <div class="detail-info-grid">
          <div class="detail-info-item">
            <p class="detail-info-label">Address</p>
            <p class="detail-info-value">${r.address || 'Not listed'}</p>
          </div>
          <div class="detail-info-item">
            <p class="detail-info-label">Phone</p>
            <p class="detail-info-value">${r.phone ? `<a href="tel:${r.phone}">${r.phone}</a>` : 'Not listed'}</p>
          </div>
          <div class="detail-info-item">
            <p class="detail-info-label">Hours</p>
            <p class="detail-info-value">${r.hours || 'Call to confirm'}</p>
          </div>
          <div class="detail-info-item">
            <p class="detail-info-label">Website</p>
            <p class="detail-info-value">${r.website ? `<a href="${r.website}" target="_blank" rel="noopener">${r.website.replace('https://','')}</a>` : 'Not listed'}</p>
          </div>
        </div>
      </div>

      <div class="detail-card-foot">
        <button class="btn btn-primary" id="detailSaveBtn">
          ${isSaved ? '♥ Saved' : '♡ Save this resource'}
        </button>
        ${r.website ? `<a class="btn btn-secondary" href="${r.website}" target="_blank" rel="noopener">Visit Website →</a>` : ''}
        ${r.phone   ? `<a class="btn btn-ghost" href="tel:${r.phone}">Call Now</a>` : ''}
      </div>
    `;

    // Wire new close button
    detailContent.querySelector('#detailClose').addEventListener('click', closeDetail);

    // Wire save button inside modal
    detailContent.querySelector('#detailSaveBtn').addEventListener('click', function() {
      toggleSave(r.id);
      this.innerHTML = state.savedIds.includes(r.id) ? '♥ Saved' : '♡ Save this resource';
    });

    detailBackdrop.hidden = false;
    detailModal.hidden    = false;
    document.body.style.overflow = 'hidden';
    cancelHover();
  }

  function closeDetail() {
    detailBackdrop.hidden = true;
    detailModal.hidden    = true;
    document.body.style.overflow = '';
  }

  detailBackdrop.addEventListener('click', closeDetail);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeDetail(); closeSaveModal(); }
  });

  /* ----------------------------------------------------------
     SAVE / BOOKMARK
  ---------------------------------------------------------- */
  function toggleSave(id) {
    const idx = state.savedIds.indexOf(id);
    if (idx === -1) {
      state.savedIds.push(id);
    } else {
      state.savedIds.splice(idx, 1);
    }
    updateSaveBadge();
    render(); // re-render to update heart icons
  }

  function updateSaveBadge() {
    const count = state.savedIds.length;
    saveCountBadge.textContent = count;
    if (count > 0) {
      saveCountBadge.classList.add('visible');
      floatSavesBtn.style.display = 'flex';
    } else {
      saveCountBadge.classList.remove('visible');
      floatSavesBtn.style.display = 'none';
    }
  }

  /* ----------------------------------------------------------
     SAVE MODAL
  ---------------------------------------------------------- */
  function openSaveModal() {
    renderSavedList();
    saveBackdrop.hidden = false;
    saveModal.hidden    = false;
    document.body.style.overflow = 'hidden';
  }

  function closeSaveModal() {
    saveBackdrop.hidden = true;
    saveModal.hidden    = true;
    document.body.style.overflow = '';
  }

  function renderSavedList() {
    if (state.savedIds.length === 0) {
      savedListEl.innerHTML = `
        <div class="save-modal-empty">
          <span>🔖</span>
          <p>No saved resources yet. Click the ♡ on any card to save it.</p>
        </div>`;
      return;
    }
    const items = state.savedIds.map(function(id) {
      const r = RESOURCES.find(r => r.id === id);
      if (!r) return '';
      return `
        <div class="saved-list-item">
          <span>${r.title}</span>
          <button class="saved-list-remove" data-remove="${r.id}" aria-label="Remove ${r.title}">✕ Remove</button>
        </div>`;
    }).join('');
    savedListEl.innerHTML = items;

    savedListEl.querySelectorAll('.saved-list-remove').forEach(function(btn) {
      btn.addEventListener('click', function() {
        toggleSave(parseInt(this.dataset.remove, 10));
        renderSavedList();
      });
    });
  }

  floatSavesBtn.addEventListener('click', openSaveModal);
  saveModalClose.addEventListener('click', closeSaveModal);
  saveBackdrop.addEventListener('click', closeSaveModal);

  sendEmailBtn.addEventListener('click', function() {
    const email = emailInput.value.trim();
    if (!email || !email.includes('@')) {
      emailNote.textContent = 'Please enter a valid email address.';
      emailNote.style.color = 'var(--rust)';
      return;
    }
    if (state.savedIds.length === 0) {
      emailNote.textContent = 'Save some resources first!';
      emailNote.style.color = 'var(--rust)';
      return;
    }

    // Build mailto body
    const savedResources = state.savedIds.map(function(id) {
      const r = RESOURCES.find(r => r.id === id);
      if (!r) return '';
      return `${r.title}\n📍 ${r.address}\n📞 ${r.phone || 'N/A'}\n🌐 ${r.website || 'N/A'}\n`;
    }).join('\n---\n\n');

    const subject = encodeURIComponent('CareMap Morris — My Saved Resources');
    const body    = encodeURIComponent(
      `Here are the community resources I saved from CareMap Morris:\n\n${savedResources}\n\nFind more at caremapmorris.org`
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

    emailNote.textContent = '✓ Opening your email client…';
    emailNote.style.color = 'var(--sage)';
    emailInput.value = '';
    setTimeout(function() { emailNote.textContent = ''; emailNote.style.color = ''; }, 4000);
  });

  /* ----------------------------------------------------------
     ACTIVE FILTERS DISPLAY
  ---------------------------------------------------------- */
  function renderActiveFilters() {
    const tags = [];
    if (state.query)               tags.push({ label: `"${state.query}"`, clear: () => { state.query = ''; searchInput.value = ''; } });
    if (state.category !== 'all') {
      const cat = CATEGORIES.find(c => c.id === state.category);
      tags.push({ label: cat?.label || state.category, clear: () => { state.category = 'all'; updateCategoryUI(); } });
    }
    if (state.town !== 'All Towns') tags.push({ label: state.town, clear: () => { state.town = 'All Towns'; townSelect.value = 'All Towns'; } });
    if (state.service !== 'all') {
      const svc = SERVICE_TYPES.find(s => s.id === state.service);
      tags.push({ label: svc?.label || state.service, clear: () => { state.service = 'all'; serviceSelect.value = 'all'; } });
    }

    if (tags.length === 0) {
      activeFiltersEl.innerHTML = '';
      return;
    }

    activeFiltersEl.innerHTML = tags.map((t, i) =>
      `<button class="active-filter-tag" data-idx="${i}">${t.label} <span class="active-filter-tag-x">✕</span></button>`
    ).join('') + `<button class="clear-all-btn" id="clearAllDynamic">Clear all</button>`;

    activeFiltersEl.querySelectorAll('.active-filter-tag').forEach(function(btn) {
      btn.addEventListener('click', function() {
        tags[parseInt(this.dataset.idx, 10)].clear();
        render();
      });
    });
    activeFiltersEl.querySelector('#clearAllDynamic')?.addEventListener('click', clearAll);
  }

  function clearAll() {
>>>>>>> Stashed changes
    state.query    = '';
    state.category = 'all';
    state.town     = 'All Towns';
    state.service  = 'all';
<<<<<<< Updated upstream
    searchInput.value   = '';
    townSelect.value    = 'All Towns';
    serviceSelect.value = 'all';
    updateCatUI();
    render();
  }

  /* ──────────────────────────────────────────────
     FILTER EVENTS
  ────────────────────────────────────────────── */

  // Search — debounced
  var searchTimer;
  searchInput.addEventListener('input', function () {
    clearTimeout(searchTimer);
    var val = this.value;
    searchTimer = setTimeout(function () { state.query = val; render(); }, 260);
  });
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { state.query = this.value; render(); }
  });

  // Category pills
  catPills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      state.category = this.dataset.cat;
      updateCatUI();
      render();
    });
  });
  function updateCatUI() {
    catPills.forEach(function (p) {
      p.classList.toggle('active', p.dataset.cat === state.category);
=======
    searchInput.value = '';
    townSelect.value  = 'All Towns';
    serviceSelect.value = 'all';
    updateCategoryUI();
    render();
  }

  /* ----------------------------------------------------------
     EVENT LISTENERS — FILTERS
  ---------------------------------------------------------- */
  // Search
  let searchDebounce;
  searchInput.addEventListener('input', function() {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(function() {
      state.query = searchInput.value;
      render();
    }, 280);
  });
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { state.query = searchInput.value; render(); }
  });

  // Category pills
  categoryPills.forEach(function(pill) {
    pill.addEventListener('click', function() {
      state.category = this.dataset.category;
      updateCategoryUI();
      render();
    });
  });

  function updateCategoryUI() {
    categoryPills.forEach(function(p) {
      p.classList.toggle('active', p.dataset.category === state.category);
>>>>>>> Stashed changes
    });
  }

  // Town
<<<<<<< Updated upstream
  townSelect.addEventListener('change', function () { state.town = this.value; render(); });

  // Service
  serviceSelect.addEventListener('change', function () { state.service = this.value; render(); });

  // Sort
  sortSelect.addEventListener('change', function () { state.sort = this.value; render(); });

  // View toggle
  viewGridBtn.addEventListener('click', function () {
    state.view = 'grid';
    viewGridBtn.classList.add('active');
    viewListBtn.classList.remove('active');
    render();
  });
  viewListBtn.addEventListener('click', function () {
    state.view = 'list';
    viewListBtn.classList.add('active');
    viewGridBtn.classList.remove('active');
    render();
  });

  /* ──────────────────────────────────────────────
     KEYBOARD / ESCAPE
  ────────────────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!detailModalWrap.hidden) closeDetail();
      else if (!saveModalWrap.hidden) closeSaveModal();
    }
  });

  /* ──────────────────────────────────────────────
     FOOTER DATE
  ────────────────────────────────────────────── */
  var footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = '© ' + new Date().getFullYear() + ' CareMap Morris';

  /* ──────────────────────────────────────────────
     HELPERS
  ────────────────────────────────────────────── */
  function pinSvg() {
    return '<svg width="9" height="12" viewBox="0 0 9 12" fill="none" aria-hidden="true" style="flex-shrink:0;margin-top:1px"><path d="M4.5 0C2.015 0 0 2.015 0 4.5c0 3.375 4.5 7.5 4.5 7.5S9 7.875 9 4.5C9 2.015 6.985 0 4.5 0zm0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="currentColor"/></svg>';
  }
  function arrowSvg() {
    return '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  /* ── GO ── */
  updateFloatBtn();
=======
  townSelect.addEventListener('change', function() {
    state.town = this.value;
    render();
  });

  // Service
  serviceSelect.addEventListener('change', function() {
    state.service = this.value;
    render();
  });

  // Sort
  sortSelect.addEventListener('change', function() {
    state.sort = this.value;
    render();
  });

  // View toggle
  viewGrid.addEventListener('click', function() {
    state.view = 'grid';
    viewGrid.classList.add('active');
    viewList.classList.remove('active');
    render();
  });
  viewList.addEventListener('click', function() {
    state.view = 'list';
    viewList.classList.add('active');
    viewGrid.classList.remove('active');
    render();
  });

  /* ----------------------------------------------------------
     CLEAR ALL BUTTON (sidebar)
  ---------------------------------------------------------- */
  if (clearAllBtn) clearAllBtn.addEventListener('click', clearAll);

  /* ----------------------------------------------------------
     GO!
  ---------------------------------------------------------- */
  updateSaveBadge();
>>>>>>> Stashed changes
  init();
});
=======
>>>>>>> 11a7de31277276b8e2487a8d2e5505e2b9ead5eb

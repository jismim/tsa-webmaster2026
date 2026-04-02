
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

  /* ── 3. Footer year ── */
  var yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = '© ' + new Date().getFullYear() + ' CareMap Morris. All rights reserved.';

  /* ── Initial render ── */
const DATA = [
  {id:1, kind:"donate & volunteer", title:"St. Peter's Food Pantry", desc:"Food pantry providing groceries to individuals and families in need.", age:["adult","family"], location:"clifton", services:["food","hygiene"], link:"https://www.saintpetershaven.org/", phone:"(973) 546-3406", address:"380 Clifton Ave, Clifton, NJ 07011"},
  {id:2, kind:"donate & volunteer", title:"Morris County Nutrition Project", desc:"Provides meal services and nutrition support for seniors in Morris County.", age:["senior"], location:"county-wide", services:["food"], link:"", phone:"", address:"Morris County, NJ"},
  {id:3, kind:"donate & volunteer", title:"Nourish NJ", desc:"Provides meals, food assistance, and social services with volunteer opportunities.", age:["adult","family","senior"], location:"dover", services:["food","hygiene"], link:"https://www.nourishnj.org/", phone:"(862)-397-0030", address:"347 S Salem St, Dover, NJ 07801"},
  {id:4, kind:"donate & volunteer", title:"Loaves & Fishes/First Presbyterian", desc:"Community meal program run by First Presbyterian Church of Boonton.", age:["adult","family"], location:"boonton", services:["food","hygiene"], link:"https://lfcfp.org/", phone:"(973) 352-7668", address:"513 Birch St, Boonton, NJ 07005"},
  {id:5, kind:"donate & volunteer", title:"St. John's Soup Kitchen", desc:"Provides meals to the community with volunteer and donation opportunities.", age:["adult","family"], location:"newark", services:["food","hygiene"], link:"https://www.njsk.org/we-need", phone:"(973) 623-0822", address:"871 McCarter Hwy, Newark, NJ 07102"},
  {id:6, kind:"donate & volunteer", title:"Salvation Army", desc:"Provides food assistance and community services with donation and volunteer opportunities.", age:["adult","family"], location:"dover", services:["food","housing","clothing","hygiene"], link:"https://satruck.org/", phone:"(800)-728-7825", address:"24 Bassett Hwy, Dover, NJ 07801"},
  {id:7, kind:"donate", title:"Jersey Battered Women's Services", desc:"Supports survivors of domestic violence through programs funded by donations.", age:["adult","family"], location:"morristown", services:["housing","counseling"], link:"https://jbws.org/", phone:"(973) 267-7520", address:"Morristown, NJ 07962"},
  {id:8, kind:"donate", title:"Family Promise of Morris County", desc:"Supports families experiencing homelessness through donations and services.", age:["adult","family"], location:"morristown", services:["housing","food","clothing","hygiene"], link:"https://www.familypromisemorris.org/wish-list", phone:"(973) 998-0820", address:"Morristown, NJ 07962"},
  {id:9, kind:"donate", title:"Morris County Park Commission", desc:"Supports parks and community programs through donations.", age:["adult","family"], location:"morristown", services:["environment"], link:"https://www.morrisparks.net/care-for-our-parks/donations/", phone:"(973)-326-7600", address:"300 Mendham Rd, Morristown, NJ 07960"},
  {id:10, kind:"donate & volunteer", title:"Child & Family Resource", desc:"Provides family support services with volunteer and donation opportunities.", age:["adult","family","teen"], location:"mt-arlington", services:["childcare","food"], link:"https://cfrmorris.org/", phone:"(973) 398-1730", address:"111 Howard Blvd #104, Mt Arlington, NJ 07856"},
  {id:11, kind:"donate & volunteer", title:"Habitat For Humanity ReStore", desc:"Accepts donations and offers volunteer opportunities supporting housing.", age:["adult","family"], location:"randolph", services:["housing"], link:"https://www.morrishabitat.org/", phone:"(973) 366-3358", address:"274 S Salem St, Randolph, NJ 07869"},
  {id:12, kind:"volunteer", title:"Edna's Haven", desc:"Provides meals and community support with volunteer opportunities.", age:["adult","family"], location:"dover", services:["food"], link:"https://www.tlcnj.org/ednas-haven", phone:"(973) 366-2821", address:"123 E Blackwell St, Dover, NJ 07801"},
  {id:13, kind:"donate & volunteer", title:"I A.M. Hope NJ", desc:"Community outreach organization offering support services, volunteering, and donations.", age:["adult","family","teen"], location:"county-wide", services:["food","clothing","hygiene"], link:"https://www.iamhopenj.org/", phone:"(973) 865-4852", address:"Various locations, NJ"},
  {id:14, kind:"donate", title:"Green Vision Inc.", desc:"Supports environmental and community initiatives through donations.", age:["adult","family"], location:"randolph", services:["environment"], link:"https://gvinc.org/", phone:"(973) 998-7955", address:"8 Emery Ave, Randolph, NJ 07869"},
  {id:15, kind:"volunteer", title:"Morris Minute Men EMS", desc:"Emergency medical services organization with volunteer opportunities.", age:["adult"], location:"morris-plains", services:["medical"], link:"https://morrisminutemen.org/", phone:"(973) 539-1776", address:"97 Mill Road, Morris Plains, NJ 07950"},
  {id:16, kind:"volunteer", title:"Literary Volunteers of Morris County", desc:"Provides literacy tutoring and education through volunteers.", age:["adult"], location:"morristown", services:["education"], link:"https://www.lvmorris.org/", phone:"(973) 984-1998", address:"16 Elm St, 1st Floor, Morristown, NJ 07960"},
  {id:17, kind:"donate & volunteer", title:"St. Hubert's Animal Welfare Center", desc:"Animal shelter accepting volunteers and donations.", age:["adult","teen"], location:"madison", services:["animals"], link:"https://www.sthuberts.org/volunteer", phone:"(973) 377-2295", address:"575 Woodland Ave, Madison, NJ 07940"},
  {id:18, kind:"volunteer", title:"Morris Museum", desc:"Volunteer opportunities supporting museum programs and events.", age:["adult","teen"], location:"morristown", services:["education"], link:"https://morrismuseum.org/join-our-team/volunteer-program", phone:"(973) 971-3700", address:"6 Normandy Heights Road, Morristown, NJ 07960"},
  {id:19, kind:"volunteer", title:"Atlantic Health", desc:"Healthcare system offering structured volunteer programs.", age:["adult"], location:"morristown", services:["medical"], link:"https://www.f4mmc.org/ways-to-give/volunteer/", phone:"(973) 593-2400", address:"310 South Street, 4th Floor, Morristown, NJ 07960"},
  {id:20, kind:"donate & volunteer", title:"Interfaith Food Pantry", desc:"Provides food assistance and accepts volunteers and donations.", age:["adult","family"], location:"morris-plains", services:["food","hygiene"], link:"https://www.mcifp.org/", phone:"(973) 538-8049", address:"2 Executive Drive, Morris Plains, NJ 07950"},
  {id:21, kind:"donate & volunteer", title:"Market Street Mission", desc:"Provides meals, shelter, and accepts volunteers and donations.", age:["adult"], location:"morristown", services:["food","housing","clothing","hygiene"], link:"https://www.marketstreet.org/", phone:"(973) 538-0431", address:"9 Market Street, Morristown, NJ 07960"},
  {id:22, kind:"donate & volunteer", title:"Morristown Meals on Wheels", desc:"Delivers meals to homebound individuals with volunteer support.", age:["senior","adult"], location:"morristown", services:["food"], link:"https://morristownmeals-on-wheels.org/", phone:"(973) 532-2706", address:"Morristown, NJ 07962"},
  {id:23, kind:"volunteer", title:"National Historical Park", desc:"Volunteer opportunities supporting park operations and education.", age:["adult","teen"], location:"morristown", services:["education"], link:"https://www.nps.gov/morr/getinvolved/volunteer.htm", phone:"(973) 539-2016", address:"30 Washington Place, Morristown, NJ 07960"},
  {id:24, kind:"donate", title:"Children's Specialized Hospital Foundation", desc:"Supports pediatric healthcare through donations.", age:["family"], location:"newark", services:["medical"], link:"https://www.give2csh.org/", phone:"(908) 588-5181", address:"Newark, NJ 07101-4000"},
  {id:25, kind:"donate & volunteer", title:"Community Hope Inc", desc:"Provides housing, mental health services, and community support programs.", age:["adult","family"], location:"parsippany", services:["housing","counseling"], link:"https://www.communityhope-nj.org/", phone:"(973) 463-9600", address:"959 US-46 #402, Parsippany, NJ 07054"},
  {id:26, kind:"donate & volunteer", title:"First Presbyterian Church of Rockaway", desc:"Operates a food closet providing groceries to local residents.", age:["adult","family"], location:"rockaway", services:["food","hygiene"], link:"https://fpcrockaway.org/", phone:"(973) 627-1059", address:"35 Church St, Rockaway, NJ 07866"},
  {id:27, kind:"donate & volunteer", title:"First Presbyterian Church of Whippany", desc:"Food pantry offering grocery assistance to Whippany residents by appointment.", age:["adult","family"], location:"whippany", services:["food","hygiene"], link:"https://www.whippanychurch.com/", phone:"(973) 887-2197", address:"494 NJ-10, Whippany, NJ 07981"},
  {id:28, kind:"donate", title:"Legal Services of Northwest Jersey", desc:"Provides free civil legal assistance to eligible low-income residents of Morris County, including help with housing, family law, and public benefits.", age:["adult","family","senior"], location:"morristown", services:["legal"], link:"https://www.lsnwj.org/", phone:"(973) 285-6911", address:"30 Schuyler Pl, Morristown, NJ 07960"},

{id:29, kind:"donate & volunteer", colorSmile:true, title:"Color A Smile", desc:"Volunteers create cheerful drawings that are sent to isolated seniors, troops, and others who could use a smile.", age:["adult","family","teen","kids"], location:"morristown", services:["education"], link:"https://colorasmile.org/", phone:"(973) 540-9222", address:"164 Ridgedale Ave Unit 7, Morristown, NJ 07960"},
  {id:30, kind:"volunteer", title:"Morristown & Morris Township Library", desc:"Teen volunteer program supporting library programs and community services.", age:["teen","kids"], location:"morristown", services:["education"], link:"https://mmtlibrary.org/teens/teen-volunteers/", phone:"(973) 538-6161", address:"1 Miller Rd, Morristown, NJ 07960"},
  {id:31, kind:"volunteer", title:"Kinnelon Volunteer Animal Shelter", desc:"Community animal shelter offering volunteer opportunities for animal care and adoption support.", age:["adult","teen","kids"], location:"kinnelon", services:["animals"], link:"https://www.kvasnj.org/", phone:"(973) 283-4120", address:"118 Kinnelon Rd, Kinnelon, NJ 07405"},
  {id:32, kind:"volunteer", title:"Butler Museum", desc:"Local history museum with volunteer opportunities supporting exhibits and community events.", age:["adult","teen","kids"], location:"butler", services:["education"], link:"https://www.butlerborough.com/cn/webpage.cfm?tpid=17694", phone:"(973) 838-7222", address:"Main St, Butler, NJ 07405"},
  {id:33, kind:"volunteer", title:"Whippany Railway Museum", desc:"Historic railway museum offering volunteer opportunities supporting preservation and education.", age:["adult","teen","kids"], location:"whippany", services:["education"], link:"https://whippanyrailwaymuseum.net/", phone:"(973) 887-8177", address:"1 Railroad Plaza, Whippany, NJ 07981"},
  {id:34, kind:"donate & volunteer", title:"Riverdale Food Pantry", desc:"Municipal food pantry providing groceries to Riverdale residents in need.", age:["adult","family","kids"], location:"riverdale", services:["food"], link:"https://www.riverdalenj.gov/pages/riverdale-food-pantry", phone:"(973) 714-7141", address:"57 Loy Ave, Riverdale, NJ 07457"},
  {id:35, kind:"volunteer", title:"Roxbury Public Library", desc:"Public library offering volunteer opportunities supporting programs and community services.", age:["adult","teen","kids"], location:"roxbury", services:["education"], link:"https://www.roxburylibrary.org/", phone:"(973) 584-2400", address:"103 Main St, Succasunna, NJ 07876"},
  {id:36, kind:"volunteer", title:"Chester Mendham Food Pantry", desc:"Food pantry serving Chester and Mendham communities with volunteer-run grocery assistance.", age:["adult","family","kids"], location:"chester", services:["food"], link:"https://www.chestermendhamfp.com/volunteering.html", phone:"(862) 419-3373", address:"100 North Road, Chester, NJ 07930"},
  {id:37, kind:"donate", title:"Florham Park Education Foundation", desc:"Supports public education in Florham Park through fundraising and community donations.", age:["adult","family"], location:"florham-park", services:["education"], link:"https://www.fpefnj.org/ways-to-give", phone:"(646) 425-5030", address:"Florham Park, NJ 07932"},
  {id:38, kind:"donate", title:"NJ Chronic Fatigue Syndrome Association Inc.", desc:"Nonprofit supporting awareness, education, and advocacy for individuals living with chronic fatigue syndrome.", age:["adult","family","senior"], location:"florham-park", services:["medical"], link:"https://www.njcfsa.org/", phone:"", address:"Florham Park, NJ 07932"},
]
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
const PAGE_SIZE    = 8;

// -------------------
// Badge helper
// -------------------
function kindBadgesHtml(kind) {
  if (kind === 'donate & volunteer') {
    return `<span class="kind-badge badge-donate">Donate</span><span class="kind-badge badge-volunteer">Volunteer</span>`;
  }
  if (kind === 'volunteer') {
    return `<span class="kind-badge badge-volunteer">Volunteer</span>`;
  }
  return `<span class="kind-badge badge-donate">Donate</span>`;
}

// -------------------
// Main render function
// -------------------
function render() {
  const age      = filterAge.value;
  const location = filterLocation.value.toLowerCase();

  const filtered = DATA.filter(item => {
    if (activeTab === 'donate'    && !item.kind.includes('donate'))    return false;
    if (activeTab === 'volunteer' && !item.kind.includes('volunteer')) return false;
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

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  if (currentPage > totalPages) currentPage = 1;

  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  cardsList.innerHTML = pageItems.map(item => {
    const pills = item.services.map(s => `<span class="card-pill">${s}</span>`).join('');
    const townDisplay = item.location
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return `
      <article class="dv-card" tabindex="0" role="button" aria-label="View details for ${item.title}" data-id="${item.id}">
        <div>
          <div class="kind-badges">${kindBadgesHtml(item.kind)}</div>
          <h3>${item.title}</h3>
          ${item.address ? `<p class="card-address">${item.address}</p>` : `<p class="card-address">${townDisplay}</p>`}
          ${item.phone   ? `<p class="card-phone">${item.phone}</p>`     : ''}
          <p class="card-desc">${item.desc}</p>
          <div class="card-pills">${pills}</div>
        </div>
        <div class="dv-card-actions">
          <button class="btn btn-secondary view-details-btn" data-id="${item.id}">View details</button>
        </div>
      </article>
    `;
  }).join('');

  resultsCount.textContent = `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`;
  noResults.hidden = filtered.length > 0;
  cardsList.hidden = filtered.length === 0;

  renderPagination(filtered.length, totalPages);

  /* Whole card opens modal */
  cardsList.querySelectorAll('.dv-card').forEach(card => {
    const item = DATA.find(d => d.id === Number(card.dataset.id));
    if (!item) return;

    card.addEventListener('click', e => {
      if (e.target.closest('a')) return;
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

// -------------------
// Pagination renderer
// -------------------
function renderPagination(total, totalPages) {
  let pager = document.getElementById('dvPagination');
  if (!pager) {
    pager = document.createElement('nav');
    pager.id = 'dvPagination';
    pager.setAttribute('aria-label', 'Results pages');
    cardsList.parentNode.insertBefore(pager, cardsList.nextSibling);
  }

  if (totalPages <= 1) {
    pager.innerHTML = '';
    return;
  }

  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end   = Math.min(currentPage * PAGE_SIZE, total);

  let html = `<p class="pagination-info">Showing ${start}–${end} of ${total}</p>`;
  html += `<div class="pagination-btns">`;

  // Double-left arrow → first page
  html += `<button class="page-btn page-arrow" ${currentPage === 1 ? 'disabled' : ''} aria-label="First page" id="pgFirst">&#8676;</button>`;
  // Single-left arrow → previous page
  html += `<button class="page-btn page-arrow" ${currentPage === 1 ? 'disabled' : ''} aria-label="Previous page" id="pgPrev">&#8592;</button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}" aria-label="Page ${i}" aria-current="${i === currentPage ? 'page' : 'false'}">${i}</button>`;
  }

  // Single-right arrow → next page
  html += `<button class="page-btn page-arrow" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Next page" id="pgNext">&#8594;</button>`;
  // Double-right arrow → last page
  html += `<button class="page-btn page-arrow" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Last page" id="pgLast">&#8677;</button>`;

  html += `</div>`;

  pager.innerHTML = html;

  pager.querySelector('#pgFirst').addEventListener('click', () => {
    if (currentPage > 1) { currentPage = 1; render(); scrollToList(); }
  });
  pager.querySelector('#pgPrev').addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; render(); scrollToList(); }
  });
  pager.querySelector('#pgNext').addEventListener('click', () => {
    if (currentPage < totalPages) { currentPage++; render(); scrollToList(); }
  });
  pager.querySelector('#pgLast').addEventListener('click', () => {
    if (currentPage < totalPages) { currentPage = totalPages; render(); scrollToList(); }
  });

  pager.querySelectorAll('.page-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = Number(btn.dataset.page);
      render();
      scrollToList();
    });
  });
}

// -------------------
// Scroll to card list
// (80px offset so it lands above the results header, not flush against it)
// -------------------
function scrollToList() {
  const top = cardsList.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: 'smooth' });
}

// -------------------
// Open detail modal
// -------------------
function openDetail(item, triggerEl) {
  lastFocused = triggerEl || document.activeElement;

  const pills = item.services.map(s => `<span class="card-pill">${s}</span>`).join('');

  const websiteHtml = item.link
    ? `<a href="${item.link}" target="_blank" rel="noopener">${item.link.replace(/^https?:\/\//, '')}</a>`
    : `<span style="color:var(--muted)">Not listed</span>`;

  const phoneHtml = item.phone
    ? `<a href="tel:${item.phone}">${item.phone}</a>`
    : `<span style="color:var(--muted)">Not listed</span>`;

  const mapsUrl = item.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`
    : '';

  detailCard.innerHTML = `
    <div class="detail-head">
      <div class="detail-head-left">
        <div class="kind-badges">${kindBadgesHtml(item.kind)}</div>
        <h2 class="detail-title" id="detailTitle">${item.title}</h2>
      </div>
      <button class="detail-close" id="detailCloseX" aria-label="Close details">&#x2715;</button>
    </div>

    <div class="detail-body">

      <div class="detail-section">
        <p class="detail-section-label">About</p>
        <p class="detail-long-desc">${item.desc}</p>
      </div>

      <div class="detail-section">
        <p class="detail-section-label">Services</p>
        <div class="detail-tags">${pills || "<span style='color:var(--muted)'>No services listed</span>"}</div>
      </div>

      <div class="detail-section">
        <p class="detail-section-label">Who it serves</p>
        <div class="detail-tags">
          ${item.age.map(a => `<span class="card-pill">${a}</span>`).join('')}
        </div>
      </div>

      <div class="detail-section">
        <p class="detail-section-label">Contact & Location</p>
        <div class="detail-info-grid">

          <div class="detail-info-item">
            <p class="detail-info-label">Location</p>
            <p class="detail-info-value">${item.location.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</p>
          </div>

          <div class="detail-info-item">
            <p class="detail-info-label">Phone</p>
            <p class="detail-info-value">${phoneHtml}</p>
          </div>

          <div class="detail-info-item" style="grid-column:1/-1;">
            <p class="detail-info-label">Address</p>
            <p class="detail-info-value">${item.address || "<span style='color:var(--muted)'>Not listed</span>"}</p>
          </div>

          <div class="detail-info-item" style="grid-column:1/-1;">
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
      ${item.address ? `<button class="btn btn-ghost" id="copyAddressBtn">Copy Address</button>` : ''}
      <button class="btn btn-ghost" id="detailCloseBtn">Close</button>
    </div>
  `;

  detailCard.querySelector('#detailCloseX').addEventListener('click',   closeDetail);
  detailCard.querySelector('#detailCloseBtn').addEventListener('click', closeDetail);

  if (item.address) {
    detailCard.querySelector('#copyAddressBtn').addEventListener('click', () => {
      navigator.clipboard.writeText(item.address).then(() => {
        alert('Address copied to clipboard!');
      });
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

// -------------------
// Close detail modal
// -------------------
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

// -------------------
// Tab buttons
// -------------------
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

// -------------------
// Service chips
// -------------------
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

// -------------------
// Age & Location filters
// -------------------
filterAge.addEventListener('change',      () => { currentPage = 1; render(); });
filterLocation.addEventListener('change', () => { currentPage = 1; render(); });

// -------------------
// Reset button
// -------------------
resetBtn.addEventListener('click', () => {
  activeTab      = 'all';
  activeServices = [];
  currentPage    = 1;
  filterAge.value      = '';
  filterLocation.value = '';
  chips.forEach(c => c.classList.remove('selected'));
  tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
  tabBtns[0].classList.add('active');
  tabBtns[0].setAttribute('aria-selected', 'true');
  render();
});

/* Initial render */
render();
});
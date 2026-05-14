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

  /* ── DATA ── */
  const VOLUNTEER_APPROVED_ENDPOINTS = [
    "https://8dz55fh325.execute-api.us-east-1.amazonaws.com/prod/approved/formatted?root=volunteer",
    "https://8dz55fh325.execute-api.us-east-1.amazonaws.com/prod/approved?root=volunteer"
  ];

  const DATA = [
    {id:1,  kind:"donate & volunteer", title:"St. Peter's Food Pantry",                    desc:"Food pantry providing groceries to individuals and families in need.",                                                                                                  age:["adult","family"],               location:"clifton",       services:["food","hygiene"],                   link:"https://www.saintpetershaven.org/",                             phone:"(973) 546-3406", address:"380 Clifton Ave, Clifton, NJ 07011"},
    {id:2,  kind:"donate & volunteer", title:"Morris County Nutrition Project",              desc:"Provides meal services and nutrition support for seniors in Morris County.",                                                                                            age:["senior"],                       location:"county-wide",   services:["food"],                             link:"",                                                             phone:"",               address:"Morris County, NJ"},
    {id:3,  kind:"donate & volunteer", title:"Nourish NJ",                                   desc:"Provides meals, food assistance, and social services with volunteer opportunities.",                                                                                    age:["adult","family","senior"],       location:"dover",         services:["food","hygiene"],                   link:"https://www.nourishnj.org/",                                    phone:"(862)-397-0030", address:"347 S Salem St, Dover, NJ 07801"},
    {id:4,  kind:"donate & volunteer", title:"Loaves & Fishes/First Presbyterian",           desc:"Community meal program run by First Presbyterian Church of Boonton.",                                                                                                  age:["adult","family"],               location:"boonton",       services:["food","hygiene"],                   link:"https://lfcfp.org/",                                            phone:"(973) 352-7668", address:"513 Birch St, Boonton, NJ 07005"},
    {id:5,  kind:"donate & volunteer", title:"St. John's Soup Kitchen",                     desc:"Provides meals to the community with volunteer and donation opportunities.",                                                                                             age:["adult","family"],               location:"newark",        services:["food","hygiene"],                   link:"https://www.njsk.org/we-need",                                  phone:"(973) 623-0822", address:"871 McCarter Hwy, Newark, NJ 07102"},
    {id:6,  kind:"donate & volunteer", title:"Salvation Army",                               desc:"Provides food assistance and community services with donation and volunteer opportunities.",                                                                             age:["adult","family"],               location:"dover",         services:["food","housing","clothing","hygiene"],link:"https://satruck.org/",                                          phone:"(800)-728-7825", address:"24 Bassett Hwy, Dover, NJ 07801"},
    {id:7,  kind:"donate",             title:"Jersey Battered Women's Services",             desc:"Supports survivors of domestic violence through programs funded by donations.",                                                                                          age:["adult","family"],               location:"morristown",    services:["housing","counseling"],             link:"https://jbws.org/",                                             phone:"(973) 267-7520", address:"Morristown, NJ 07962"},
    {id:8,  kind:"donate",             title:"Family Promise of Morris County",              desc:"Supports families experiencing homelessness through donations and services.",                                                                                            age:["adult","family"],               location:"morristown",    services:["housing","food","clothing","hygiene"],link:"https://www.familypromisemorris.org/wish-list",                phone:"(973) 998-0820", address:"Morristown, NJ 07962"},
    {id:9,  kind:"donate",             title:"Morris County Park Commission",                desc:"Supports parks and community programs through donations.",                                                                                                              age:["adult","family"],               location:"morristown",    services:["environment"],                      link:"https://www.morrisparks.net/care-for-our-parks/donations/",    phone:"(973)-326-7600", address:"300 Mendham Rd, Morristown, NJ 07960"},
    {id:10, kind:"donate & volunteer", title:"Child & Family Resource",                      desc:"Provides family support services with volunteer and donation opportunities.",                                                                                            age:["adult","family","teen"],         location:"mt-arlington",  services:["childcare","food"],                 link:"https://cfrmorris.org/",                                        phone:"(973) 398-1730", address:"111 Howard Blvd #104, Mt Arlington, NJ 07856"},
    {id:11, kind:"donate & volunteer", title:"Habitat For Humanity ReStore",                 desc:"Accepts donations and offers volunteer opportunities supporting housing.",                                                                                               age:["adult","family"],               location:"randolph",      services:["housing"],                          link:"https://www.morrishabitat.org/",                                phone:"(973) 366-3358", address:"274 S Salem St, Randolph, NJ 07869"},
    {id:12, kind:"volunteer",          title:"Edna's Haven",                                 desc:"Provides meals and community support with volunteer opportunities.",                                                                                                     age:["adult","family"],               location:"dover",         services:["food"],                             link:"https://www.tlcnj.org/ednas-haven",                             phone:"(973) 366-2821", address:"123 E Blackwell St, Dover, NJ 07801"},
    {id:13, kind:"donate & volunteer", title:"I A.M. Hope NJ",                               desc:"Community outreach organization offering support services, volunteering, and donations.",                                                                               age:["adult","family","teen"],         location:"county-wide",   services:["food","clothing","hygiene"],        link:"https://www.iamhopenj.org/",                                    phone:"(973) 865-4852", address:"Various locations, NJ"},
    {id:14, kind:"donate",             title:"Green Vision Inc.",                             desc:"Supports environmental and community initiatives through donations.",                                                                                                   age:["adult","family"],               location:"randolph",      services:["environment"],                      link:"https://gvinc.org/",                                            phone:"(973) 998-7955", address:"8 Emery Ave, Randolph, NJ 07869"},
    {id:15, kind:"volunteer",          title:"Morris Minute Men EMS",                         desc:"Emergency medical services organization with volunteer opportunities.",                                                                                                 age:["adult"],                        location:"morris-plains", services:["medical"],                          link:"https://morrisminutemen.org/",                                  phone:"(973) 539-1776", address:"97 Mill Road, Morris Plains, NJ 07950"},
    {id:16, kind:"volunteer",          title:"Literary Volunteers of Morris County",          desc:"Provides literacy tutoring and education through volunteers.",                                                                                                          age:["adult"],                        location:"morristown",    services:["education"],                        link:"https://www.lvmorris.org/",                                     phone:"(973) 984-1998", address:"16 Elm St, 1st Floor, Morristown, NJ 07960"},
    {id:17, kind:"donate & volunteer", title:"St. Hubert's Animal Welfare Center",           desc:"Animal shelter accepting volunteers and donations.",                                                                                                                    age:["adult","teen"],                 location:"madison",       services:["animals"],                          link:"https://www.sthuberts.org/volunteer",                           phone:"(973) 377-2295", address:"575 Woodland Ave, Madison, NJ 07940"},
    {id:18, kind:"volunteer",          title:"Morris Museum",                                 desc:"Volunteer opportunities supporting museum programs and events.",                                                                                                        age:["adult","teen"],                 location:"morristown",    services:["education"],                        link:"https://morrismuseum.org/join-our-team/volunteer-program",      phone:"(973) 971-3700", address:"6 Normandy Heights Road, Morristown, NJ 07960"},
    {id:19, kind:"volunteer",          title:"Atlantic Health",                               desc:"Healthcare system offering structured volunteer programs.",                                                                                                             age:["adult"],                        location:"morristown",    services:["medical"],                          link:"https://www.f4mmc.org/ways-to-give/volunteer/",                 phone:"(973) 593-2400", address:"310 South Street, 4th Floor, Morristown, NJ 07960"},
    {id:20, kind:"donate & volunteer", title:"Interfaith Food Pantry",                       desc:"Provides food assistance and accepts volunteers and donations.",                                                                                                        age:["adult","family"],               location:"morris-plains", services:["food","hygiene"],                   link:"https://www.mcifp.org/",                                        phone:"(973) 538-8049", address:"2 Executive Drive, Morris Plains, NJ 07950"},
    {id:21, kind:"donate & volunteer", title:"Market Street Mission",                        desc:"Provides meals, shelter, and accepts volunteers and donations.",                                                                                                        age:["adult"],                        location:"morristown",    services:["food","housing","clothing","hygiene"],link:"https://www.marketstreet.org/",                                phone:"(973) 538-0431", address:"9 Market Street, Morristown, NJ 07960"},
    {id:22, kind:"donate & volunteer", title:"Morristown Meals on Wheels",                   desc:"Delivers meals to homebound individuals with volunteer support.",                                                                                                       age:["senior","adult"],               location:"morristown",    services:["food"],                             link:"https://morristownmeals-on-wheels.org/",                        phone:"(973) 532-2706", address:"Morristown, NJ 07962"},
    {id:23, kind:"volunteer",          title:"National Historical Park",                      desc:"Volunteer opportunities supporting park operations and education.",                                                                                                     age:["adult","teen"],                 location:"morristown",    services:["education"],                        link:"https://www.nps.gov/morr/getinvolved/volunteer.htm",            phone:"(973) 539-2016", address:"30 Washington Place, Morristown, NJ 07960"},
    {id:24, kind:"donate",             title:"Children's Specialized Hospital Foundation",   desc:"Supports pediatric healthcare through donations.",                                                                                                                      age:["family","child"],               location:"newark",        services:["medical"],                          link:"https://www.give2csh.org/",                                     phone:"(908) 588-5181", address:"Newark, NJ 07101-4000"},
    {id:25, kind:"donate & volunteer", title:"Community Hope Inc",                            desc:"Provides housing, mental health services, and community support programs.",                                                                                            age:["adult","family"],               location:"parsippany",    services:["housing","counseling"],             link:"https://www.communityhope-nj.org/",                             phone:"(973) 463-9600", address:"959 US-46 #402, Parsippany, NJ 07054"},
    {id:26, kind:"donate & volunteer", title:"First Presbyterian Church of Rockaway",        desc:"Operates a food closet providing groceries to local residents.",                                                                                                       age:["adult","family"],               location:"rockaway",      services:["food","hygiene"],                   link:"https://fpcrockaway.org/",                                      phone:"(973) 627-1059", address:"35 Church St, Rockaway, NJ 07866"},
    {id:27, kind:"donate & volunteer", title:"First Presbyterian Church of Whippany",        desc:"Food pantry offering grocery assistance to Whippany residents by appointment.",                                                                                        age:["adult","family"],               location:"whippany",      services:["food","hygiene"],                   link:"https://www.whippanychurch.com/",                               phone:"(973) 887-2197", address:"494 NJ-10, Whippany, NJ 07981"},
    {id:28, kind:"donate",             title:"Legal Services of Northwest Jersey",            desc:"Provides free civil legal assistance to eligible low-income residents of Morris County, including help with housing, family law, and public benefits.",                age:["adult","family","senior"],       location:"morristown",    services:["legal"],                            link:"https://www.lsnwj.org/",                                        phone:"(973) 285-6911", address:"30 Schuyler Pl, Morristown, NJ 07960"},
    {id:29, kind:"donate & volunteer", title:"Color A Smile",                                desc:"Volunteers create cheerful drawings that are sent to isolated seniors, troops, and others who could use a smile.",                                                      age:["adult","family","teen","kids"], location:"morristown",    services:["education"],                        link:"https://colorasmile.org/",                                      phone:"(973) 540-9222", address:"164 Ridgedale Ave Unit 7, Morristown, NJ 07960"},
    {id:30, kind:"volunteer",          title:"Morristown & Morris Township Library",          desc:"Teen volunteer program supporting library programs and community services.",                                                                                            age:["teen","kids"],                  location:"morristown",    services:["education"],                        link:"https://mmtlibrary.org/teens/teen-volunteers/",                 phone:"(973) 538-6161", address:"1 Miller Rd, Morristown, NJ 07960"},
    {id:31, kind:"volunteer",          title:"Kinnelon Volunteer Animal Shelter",             desc:"Community animal shelter offering volunteer opportunities for animal care and adoption support.",                                                                        age:["adult","teen","kids"],          location:"kinnelon",      services:["animals"],                          link:"https://www.kvasnj.org/",                                       phone:"(973) 283-4120", address:"118 Kinnelon Rd, Kinnelon, NJ 07405"},
    {id:32, kind:"volunteer",          title:"Butler Museum",                                 desc:"Local history museum with volunteer opportunities supporting exhibits and community events.",                                                                            age:["adult","teen","kids"],          location:"butler",        services:["education"],                        link:"https://www.butlerborough.com/cn/webpage.cfm?tpid=17694",      phone:"(973) 838-7222", address:"Main St, Butler, NJ 07405"},
    {id:33, kind:"volunteer",          title:"Whippany Railway Museum",                       desc:"Historic railway museum offering volunteer opportunities supporting preservation and education.",                                                                        age:["adult","teen","kids"],          location:"whippany",      services:["education"],                        link:"https://whippanyrailwaymuseum.net/",                            phone:"(973) 887-8177", address:"1 Railroad Plaza, Whippany, NJ 07981"},
    {id:34, kind:"donate & volunteer", title:"Riverdale Food Pantry",                        desc:"Municipal food pantry providing groceries to Riverdale residents in need.",                                                                                             age:["adult","family","kids"],        location:"riverdale",     services:["food"],                             link:"https://www.riverdalenj.gov/pages/riverdale-food-pantry",      phone:"(973) 714-7141", address:"57 Loy Ave, Riverdale, NJ 07457"},
    {id:35, kind:"volunteer",          title:"Roxbury Public Library",                        desc:"Public library offering volunteer opportunities supporting programs and community services.",                                                                            age:["adult","teen","kids"],          location:"roxbury",       services:["education"],                        link:"https://www.roxburylibrary.org/",                               phone:"(973) 584-2400", address:"103 Main St, Succasunna, NJ 07876"},
    {id:36, kind:"volunteer",          title:"Chester Mendham Food Pantry",                   desc:"Food pantry serving Chester and Mendham communities with volunteer-run grocery assistance.",                                                                           age:["adult","family","kids"],        location:"chester",       services:["food"],                             link:"https://www.chestermendhamfp.com/volunteering.html",           phone:"(862) 419-3373", address:"100 North Road, Chester, NJ 07930"},
    {id:37, kind:"donate",             title:"Florham Park Education Foundation",             desc:"Supports public education in Florham Park through fundraising and community donations.",                                                                               age:["adult","family"],               location:"florham-park",  services:["education"],                        link:"https://www.fpefnj.org/ways-to-give",                          phone:"(646) 425-5030", address:"Florham Park, NJ 07932"},
    {id:38, kind:"donate",             title:"NJ Chronic Fatigue Syndrome Association Inc.", desc:"Nonprofit supporting awareness, education, and advocacy for individuals living with chronic fatigue syndrome.",                                                         age:["adult","family","senior"],      location:"florham-park",  services:["medical"],                          link:"https://www.njcfsa.org/",                                       phone:"",               address:"Florham Park, NJ 07932"},
  ];

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
      desc: firstText(item.desc, item.volunteerRoles, item.volunteerOpportunities, item.donationNeeds, item.shortDesc, item.description, item.longDesc),
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
        const nowSaved = CareMapBookmarks.toggle(id);
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
        const nowSaved = CareMapBookmarks.toggle(item.id);

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
  loadApprovedVolunteerOpportunities()
    .catch(error => {
      console.warn('Approved volunteer opportunities could not be loaded; using built-in Give Back data.', error);
    })
    .finally(() => {
      syncLocationFilterOptions();
      render();
      updateDvBadge();
    });
});


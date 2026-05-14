/* ============================================================
   CareMap Morris — Directory JavaScript
============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var MIN_RESOURCE_LOAD_MS = 2200;
  var resourcesReady = window.CareMapResourcesReady || Promise.resolve(window.RESOURCES || []);
  var safeResourcesReady = resourcesReady.catch(function (error) {
    console.error(error);
    return [];
  });
  var resourceLoadDelay = new Promise(function (resolve) {
    setTimeout(resolve, MIN_RESOURCE_LOAD_MS);
  });

  Promise.all([safeResourcesReady, resourceLoadDelay]).then(function (values) {
    var resources = values[0];
    window.RESOURCES = Array.isArray(resources) ? resources : [];
    initDirectory();
  });

  function initDirectory() {

  /* ── Category label + badge class map ── */
  var CAT = {
    "food":               { label: "Food & Nutrition",    cls: "badge-food" },
    "housing":            { label: "Housing & Shelter",   cls: "badge-housing" },
    "domestic-violence":  { label: "Domestic Violence",   cls: "badge-domestic-violence" },
    "mental-health":      { label: "Mental Health",       cls: "badge-mental-health" },
    "substance-use":      { label: "Substance Use",       cls: "badge-substance-use" },
    "health":             { label: "Health Care",         cls: "badge-health" },
    "legal":              { label: "Legal Services",      cls: "badge-legal" },
    "disability":         { label: "Disability Services", cls: "badge-disability" },
    "youth":              { label: "Youth & Children",    cls: "badge-youth" },
    "senior":             { label: "Senior Services",     cls: "badge-senior" },
    "employment":         { label: "Employment",          cls: "badge-employment" },
    "education":          { label: "Education & ESL",     cls: "badge-education" },
    "social-services":    { label: "Social Services",     cls: "badge-social-services" }
  };

  /* ── DOM refs ── */
  var grid           = document.getElementById("resourceGrid");
  var backdrop       = document.getElementById("detailBackdrop");
  var modalWrap      = document.getElementById("detailModalWrap");
  var detailCard     = document.getElementById("detailCard");
  var searchInput    = document.getElementById("searchInput");
  var addressInput   = document.getElementById("addressInput");
  var addressList    = document.getElementById("addressSuggestions");
  var radiusFilter   = document.getElementById("radiusFilter");
  var demoAddressBtn = document.getElementById("demoAddressBtn");
  var locationStatus = document.getElementById("locationStatus");
  var categoryFilter = document.getElementById("categoryFilter");
  var townFilter     = document.getElementById("townFilter");
  var clearBtn       = document.getElementById("clearFilters");
  var resultsCount   = document.getElementById("resultsCount");

  var lastFocused         = null;
  var showAll             = false;
  var currentFilteredList = [];
  var activeLocation      = null;
  var remoteAddressSuggestions = [];
  var currentAddressOptions = [];
  var addressSearchTimer = null;
  var addressSearchSeq = 0;
  var highlightedAddressIndex = -1;

  var DEMO_ADDRESS = "County College of Morris, 214 Center Grove Rd, Randolph, NJ";

  var ADDRESS_SUGGESTIONS = [
    { label: DEMO_ADDRESS, lat: 40.8571, lng: -74.5814 },
    { label: "Morristown Green, 10 N Park Place, Morristown, NJ", lat: 40.7977, lng: -74.4815 },
    { label: "Morris County Library, 30 E Hanover Ave, Whippany, NJ", lat: 40.8065, lng: -74.4530 },
    { label: "Dover Train Station, Dover, NJ", lat: 40.8834, lng: -74.5591 },
    { label: "Boonton Town Hall, Boonton, NJ", lat: 40.9026, lng: -74.4071 },
    { label: "Parsippany-Troy Hills, NJ", lat: 40.8653, lng: -74.4174 },
    { label: "Morristown, NJ", lat: 40.7970, lng: -74.4815 },
    { label: "Dover, NJ", lat: 40.8839, lng: -74.5621 },
    { label: "Randolph, NJ", lat: 40.8484, lng: -74.5815 },
    { label: "Rockaway, NJ", lat: 40.9012, lng: -74.5143 },
    { label: "Madison, NJ", lat: 40.7598, lng: -74.4171 },
    { label: "Chatham, NJ", lat: 40.7409, lng: -74.3838 },
    { label: "Mount Olive, NJ", lat: 40.8518, lng: -74.7341 },
    { label: "Morris Plains, NJ", lat: 40.8218, lng: -74.4809 },
    { label: "Whippany, NJ", lat: 40.8245, lng: -74.4171 }
  ];

  var RESOURCE_COORDINATES = [
    { id: 1,  coords: [40.831599473789744, -74.4967387711644] },
    { id: 2,  coords: [40.9019471, -74.4068955] },
    { id: 3,  coords: [40.906545, -74.409786] },
    { id: 4,  coords: [40.7937, -74.6974] },
    { id: 5,  coords: [40.8050444, -74.4845942], match: "morristown" },
    { id: 5,  coords: [40.8779, -74.5385], match: "dover" },
    { id: 6,  coords: [40.8851, -74.5521] },
    { id: 7,  coords: [40.864242169063566, -74.76509680000012] },
    { id: 8,  coords: [40.86494978034143, -74.39408306931551] },
    { id: 9,  coords: [40.84784658347127, -74.56295426376882] },
    { id: 10, coords: [40.903988992120844, -74.51300020369783] },
    { id: 12, coords: [40.79723006613729, -74.48403157374204] },
    { id: 13, coords: [40.7977545523217, -74.48360376024962] },
    { id: 14, coords: [40.797686995786044, -74.48359027797845] },
    { id: 15, coords: [40.79856105235971, -74.4834509449061] },
    { id: 16, coords: [40.798585446529735, -74.48346167116411] },
    { id: 17, coords: [40.831283217856836, -74.4471109602484], match: "morristown" },
    { id: 17, coords: [40.831880509255264, -74.52162566024835], match: "rockaway" },
    { id: 18, coords: [40.82623300728235, -74.47964360257681] },
    { id: 19, coords: [40.91279808390638, -74.52999068722995] },
    { id: 20, coords: [40.81130908220087, -74.45855200257735] },
    { id: 22, coords: [40.803089610756764, -74.48083271792117] },
    { id: 23, coords: [40.89117504495456, -74.47447243141015] },
    { id: 24, coords: [40.832075785570865, -74.52214704274178] },
    { id: 25, coords: [40.90071317709448, -74.70426357373807] },
    { id: 26, coords: [40.91160110393633, -74.49426738908117] },
    { id: 27, coords: [40.89171681182489, -74.47431140257427] },
    { id: 28, coords: [40.83067041207043, -74.49741557374077] },
    { id: 29, coords: [40.90559424640193, -74.50382761791732] },
    { id: 30, coords: [40.79332643399677, -74.4759002602498] },
    { id: 31, coords: [40.79399217493562, -74.47882624490622] },
    { id: 32, coords: [40.80646109508215, -74.45300504729107] },
    { id: 33, coords: [40.80062942517182, -74.4820338602496] },
    { id: 34, coords: [40.87585664412647, -74.38110460442618] },
    { id: 35, coords: [40.874729184442884, -74.42607387373907] },
    { id: 36, coords: [40.8615472676916, -74.381067658396] },
    { id: 37, coords: [40.928350332400875, -74.48457642955759] },
    { id: 38, coords: [40.79662297465631, -74.48355830010377] },
    { id: 39, coords: [40.877853455214, -74.44696502707635] },
    { id: 40, coords: [40.86794792719892, -74.41444721534225] },
    { id: 41, coords: [40.86172910714738, -74.38142671904005] },
    { id: 42, coords: [40.86238346057868, -74.49607819328992] },
    { id: 44, coords: [40.86737726118494, -74.42343992883555] },
    { id: 45, coords: [40.78770830141692, -74.43203738650666] },
    { id: 47, coords: [40.824383036609134, -74.49355781349333] },
    { id: 48, coords: [40.84835147338429, -74.40243757116444] },
    { id: 49, coords: [40.78772924776525, -74.46809968650668] },
    { id: 50, coords: [40.86242426680515, -74.49609012883555] },
    { id: 51, coords: [40.886449566445165, -74.55858335767111] },
    { id: 52, coords: [40.86599408106594, -74.351141] },
    { id: 53, coords: [40.79075328786209, -74.38283997116446] },
    { id: 55, coords: [40.90067877772641, -74.5132934] },
    { id: 56, coords: [40.883856359774995, -74.47998177125463] },
    { id: 57, coords: [40.86789924704041, -74.41438284241306] }
  ];

  function normalizeText(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getResourceCoords(resource) {
    if (!resource) return null;

    if (Array.isArray(resource.coords) && resource.coords.length === 2) {
      return resource.coords;
    }

    if (typeof resource.lat === "number" && typeof resource.lng === "number") {
      return [resource.lat, resource.lng];
    }

    if (typeof resource.latitude === "number" && typeof resource.longitude === "number") {
      return [resource.latitude, resource.longitude];
    }

    var resourceText = normalizeText(
      (resource.title || "") + " " + (resource.town || "") + " " + (resource.address || "")
    );

    var matched = RESOURCE_COORDINATES.find(function (item) {
      if (item.id !== resource.id) return false;
      return !item.match || resourceText.includes(normalizeText(item.match));
    });

    if (!matched) {
      matched = RESOURCE_COORDINATES.find(function (item) {
        return item.id === resource.id;
      });
    }

    return matched ? matched.coords : null;
  }

  function milesBetween(a, b) {
    var earthRadiusMiles = 3958.8;
    var lat1 = a[0] * Math.PI / 180;
    var lat2 = b[0] * Math.PI / 180;
    var dLat = (b[0] - a[0]) * Math.PI / 180;
    var dLng = (b[1] - a[1]) * Math.PI / 180;
    var sinLat = Math.sin(dLat / 2);
    var sinLng = Math.sin(dLng / 2);
    var h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
    return 2 * earthRadiusMiles * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }

  function findAddressMatch(value) {
    var needle = normalizeText(value);
    if (!needle) return null;
    var suggestions = getAddressSuggestions();

    return suggestions.find(function (item) {
      return normalizeText(item.label) === needle;
    }) || suggestions.find(function (item) {
      var label = normalizeText(item.label);
      return label.includes(needle) || needle.includes(label.replace(" nj", ""));
    });
  }

  function getAddressSuggestions() {
    var seen = {};
    var suggestions = ADDRESS_SUGGESTIONS.map(function (item) {
      return {
        label: item.label,
        lat: item.lat,
        lng: item.lng,
        source: item.source || "Popular"
      };
    });

    ADDRESS_SUGGESTIONS.forEach(function (item) {
      seen[normalizeText(item.label)] = true;
    });

    RESOURCES.forEach(function (resource) {
      if (!resource.address || resource.address.toLowerCase().includes("online")) return;

      var coords = getResourceCoords(resource);
      if (!coords) return;

      var label = resource.address;
      if (resource.title) {
        label += " - " + resource.title;
      }

      var key = normalizeText(label);
      if (seen[key]) return;

      seen[key] = true;
      suggestions.push({
        label: label,
        lat: coords[0],
        lng: coords[1],
        source: "Resource address"
      });
    });

    remoteAddressSuggestions.forEach(function (item) {
      var key = normalizeText(item.label);
      if (seen[key]) return;

      seen[key] = true;
      suggestions.push(item);
    });

    return suggestions;
  }

  function getFilteredAddressSuggestions(query) {
    var needle = normalizeText(query);
    var suggestions = getAddressSuggestions();

    if (!needle) return suggestions.slice(0, 8);

    return suggestions.filter(function (item) {
      return normalizeText(item.label).includes(needle);
    }).slice(0, 8);
  }

  function renderAddressSuggestions(options, statusText) {
    if (!addressList || !addressInput) return;

    currentAddressOptions = options || [];
    highlightedAddressIndex = -1;
    addressList.innerHTML = "";

    if (!currentAddressOptions.length && !statusText) {
      hideAddressSuggestions();
      return;
    }

    currentAddressOptions.forEach(function (item, idx) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dir-address-suggestion";
      btn.setAttribute("role", "option");
      btn.setAttribute("data-index", String(idx));
      btn.innerHTML =
        '<span class="dir-address-main">' + escapeHtml(item.label) + "</span>" +
        '<span class="dir-address-meta">' + escapeHtml(item.source || "Morris County address") + "</span>";

      btn.addEventListener("mousedown", function (e) {
        e.preventDefault();
      });

      btn.addEventListener("click", function () {
        selectAddressSuggestion(idx);
      });

      addressList.appendChild(btn);
    });

    if (statusText) {
      var status = document.createElement("div");
      status.className = "dir-address-suggestion is-muted";
      status.textContent = statusText;
      addressList.appendChild(status);
    }

    addressList.hidden = false;
    addressInput.setAttribute("aria-expanded", "true");
  }

  function hideAddressSuggestions() {
    if (!addressList || !addressInput) return;
    addressList.hidden = true;
    addressList.innerHTML = "";
    addressInput.setAttribute("aria-expanded", "false");
    highlightedAddressIndex = -1;
  }

  function updateHighlightedAddress() {
    if (!addressList) return;

    addressList.querySelectorAll(".dir-address-suggestion[role='option']").forEach(function (el) {
      var idx = Number(el.getAttribute("data-index"));
      el.classList.toggle("is-active", idx === highlightedAddressIndex);
    });
  }

  function selectAddressSuggestion(index) {
    var item = currentAddressOptions[index];
    if (!item || !addressInput) return;

    addressInput.value = item.label;
    hideAddressSuggestions();
    applyAddressLocation();
  }

  function fetchMorrisCountyAddresses(query) {
    var trimmed = query.trim();
    if (trimmed.length < 3) return Promise.resolve([]);

    var searchQuery = trimmed;
    if (!/\b(nj|new jersey)\b/i.test(searchQuery)) {
      searchQuery += ", Morris County, New Jersey";
    }

    var params = new URLSearchParams({
      format: "jsonv2",
      q: searchQuery,
      addressdetails: "1",
      countrycodes: "us",
      limit: "8",
      viewbox: "-74.95,41.08,-74.25,40.65",
      bounded: "1"
    });

    return fetch("https://nominatim.openstreetmap.org/search?" + params.toString(), {
      headers: { "Accept": "application/json" }
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Address search failed");
        return response.json();
      })
      .then(function (items) {
        return items.map(function (item) {
          return {
            label: item.display_name,
            lat: Number(item.lat),
            lng: Number(item.lon),
            source: "Morris County lookup"
          };
        }).filter(function (item) {
          return !isNaN(item.lat) && !isNaN(item.lng);
        });
      });
  }

  function hasAddressSeparators(value) {
    return value.indexOf(",") !== -1;
  }

  function looksLikeSpecificAddress(value) {
    return /\d/.test(value) && /\b(st|street|ave|avenue|rd|road|dr|drive|blvd|boulevard|ln|lane|ct|court|pl|place|pkwy|parkway|hwy|highway|route|rt)\b/i.test(value);
  }

  function getAddressFormatHint(value) {
    if (!value || hasAddressSeparators(value)) return "";
    if (looksLikeSpecificAddress(value)) {
      return "No commas found. Searching anyway, but try: street, town, NJ.";
    }
    return "";
  }

  function updateAddressAutocomplete() {
    if (!addressInput) return;

    var query = addressInput.value.trim();
    var localOptions = getFilteredAddressSuggestions(query);
    clearTimeout(addressSearchTimer);
    addressSearchSeq += 1;

    if (!query) {
      renderAddressSuggestions(localOptions);
      return;
    }

    renderAddressSuggestions(
      localOptions,
      query.length >= 3 ? (getAddressFormatHint(query) || "Searching Morris County addresses...") : ""
    );

    addressSearchTimer = setTimeout(function () {
      var searchId = ++addressSearchSeq;

      fetchMorrisCountyAddresses(query)
        .then(function (results) {
          if (searchId !== addressSearchSeq) return;

          remoteAddressSuggestions = results;
          renderAddressSuggestions(getFilteredAddressSuggestions(query));
        })
        .catch(function () {
          if (searchId !== addressSearchSeq) return;
          renderAddressSuggestions(localOptions.length ? localOptions : [], "Could not load live address matches.");
        });
    }, 320);
  }

  function formatDistance(miles) {
    if (miles < 1) return "Under 1 mile away";
    return miles.toFixed(1) + " miles away";
  }

  function setLocationStatus(message, isError) {
    if (!locationStatus) return;
    locationStatus.textContent = message || "";
    locationStatus.classList.toggle("is-error", Boolean(isError));
  }

  function applyAddressLocation() {
    if (!addressInput) return Promise.resolve(false);

    var rawAddress = addressInput.value.trim();
    if (!rawAddress) {
      activeLocation = null;
      setLocationStatus("");
      applyFilters();
      return Promise.resolve(true);
    }

    var match = findAddressMatch(rawAddress);
    var matchReady = match
      ? Promise.resolve(match)
      : fetchMorrisCountyAddresses(rawAddress).then(function (results) {
          remoteAddressSuggestions = results;
          return results[0] || null;
        }).catch(function () {
          return null;
        });

    return matchReady.then(function (resolvedMatch) {
      if (!resolvedMatch) {
        activeLocation = null;
        setLocationStatus(
          hasAddressSeparators(rawAddress)
            ? "Pick a suggested address or try a more specific Morris County address."
            : "Address not found. Try adding commas like: street, town, NJ, or choose a suggestion.",
          true
        );
        applyFilters();
        return false;
      }

      activeLocation = {
        label: resolvedMatch.label,
        coords: [resolvedMatch.lat, resolvedMatch.lng]
      };
      addressInput.value = resolvedMatch.label;
      setLocationStatus("Showing closest resources near " + resolvedMatch.label + ".");
      hideAddressSuggestions();
      applyFilters();
      return true;
    });
  }

  /* ── Populate dropdown filters ── */
  function populateFilters() {
    var towns      = {};
    var categories = {};

    RESOURCES.forEach(function (r) {
      if (r.town)     towns[r.town] = true;
      if (r.category) categories[r.category] = true;
    });

    Object.keys(categories).sort().forEach(function (catKey) {
      var cat = CAT[catKey] || { label: catKey };
      var opt = document.createElement("option");
      opt.value       = catKey;
      opt.textContent = cat.label;
      categoryFilter.appendChild(opt);
    });

    Object.keys(towns).sort().forEach(function (town) {
      var opt = document.createElement("option");
      opt.value       = town;
      opt.textContent = town;
      townFilter.appendChild(opt);
    });
  }

  function populateAddressSuggestions() {
    if (!addressList) return;
    hideAddressSuggestions();
  }

  /* ── Update nav bookmark badge ── */
  function updateBadge() {
    if (typeof CareMapBookmarks === "undefined") return;
    var c = CareMapBookmarks.count();
    document.querySelectorAll(".bookmark-count").forEach(function (el) {
      el.textContent   = c;
      el.style.display = c > 0 ? "inline-flex" : "none";
    });
  }

  /* ── Render card grid ── */
  function renderResources(list) {
    currentFilteredList = list;
    grid.setAttribute("aria-busy", "false");
    grid.innerHTML = "";

    if (list.length === 0) {
      grid.innerHTML =
        '<p style="grid-column:1/-1; color:var(--warm-gray); font-size:1rem; padding:18px;">' +
        "No results found. Try changing your search or filters.</p>";
      return;
    }

    /* Limit to 20 unless showAll is true */
    var displayList = showAll ? list : list.slice(0, 20);

    displayList.forEach(function (r, idx) {
      var cat = CAT[r.category] || { label: r.category, cls: "" };

      /* Bookmark state */
      var isSaved    = typeof CareMapBookmarks !== "undefined" && CareMapBookmarks.isSaved(r.id);
      var heartChar  = isSaved ? "♥" : "♡";
      var heartCls   = "card-bookmark" + (isSaved ? " saved" : "");
      var heartLabel = isSaved ? "Unsave this organization" : "Save this organization";

      /* Tags */
      var tagsHtml = r.tags.slice(0, 3).map(function (t) {
        return '<span class="res-tag">' + t + "</span>";
      }).join("");
      if (r.tags.length > 3) {
        tagsHtml += '<span class="res-tag">+' + (r.tags.length - 3) + " more</span>";
      }

      var card = document.createElement("article");
      var revealClass = idx < 12 ? " reveal" : "";
      card.className = "res-card" + revealClass;
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "View details for " + r.title);
      card.dataset.resourceId = r.id;

      card.innerHTML =
        '<div class="res-card-top">' +
          '<span class="res-badge ' + cat.cls + '">' + cat.label + "</span>" +
          '<button class="' + heartCls + '" data-id="' + r.id + '" ' +
            'aria-label="' + heartLabel + '" title="' + heartLabel + '">' +
            heartChar +
          "</button>" +
        "</div>" +
        '<div class="res-card-body">' +
          '<h3 class="res-card-title">' + r.title + "</h3>" +
          '<p class="res-card-location">' +
            '<svg width="10" height="13" viewBox="0 0 10 13" fill="none" aria-hidden="true">' +
              '<path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="currentColor"/>' +
            "</svg>" +
            (r.town || "Morris County") +
          "</p>" +
          (typeof r._distanceMiles === "number"
            ? '<p class="res-card-distance">' + formatDistance(r._distanceMiles) + "</p>"
            : "") +
          '<p class="res-card-desc">' + r.shortDesc + "</p>" +
          '<div class="res-card-tags">' + tagsHtml + "</div>" +
        "</div>" +
        '<div class="res-card-footer">' +
          '<span class="res-card-phone">' + (r.phone || "") + "</span>" +
          '<button class="res-expand-btn" aria-label="View full details for ' + r.title + '">' +
            "View details" +
            '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">' +
              '<path d="M2.5 6.5h8M7 3l3.5 3.5L7 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
            "</svg>" +
          "</button>" +
        "</div>";

      /* Open modal — NOT when clicking the bookmark button */
      card.addEventListener("click", function (e) {
        if (e.target.closest(".card-bookmark")) return;
        openDetail(r, card);
      });

      card.addEventListener("keydown", function (e) {
        if (e.target.closest(".card-bookmark")) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDetail(r, card);
        }
      });

      grid.appendChild(card);
    });

    /* View All button if capped */
    if (list.length > 20 && !showAll) {
      var viewAllWrap = document.createElement("div");
      viewAllWrap.style.cssText = "grid-column:1/-1; text-align:center; padding:32px 0;";
      viewAllWrap.className = "reveal";

      var viewAllBtn = document.createElement("button");
      viewAllBtn.className   = "btn btn-outline-dark";
      viewAllBtn.textContent = "View All " + list.length + " Resources →";
      viewAllBtn.addEventListener("click", function () {
        showAll = true;
        renderResources(list);
      });

      viewAllWrap.appendChild(viewAllBtn);
      grid.appendChild(viewAllWrap);
    }

    /* Staggered reveal on cards */
    if ('IntersectionObserver' in window) {
      var cardObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el       = entry.target;
          var siblings = Array.from(grid.querySelectorAll('.res-card.reveal:not(.visible)'));
          var delay    = Math.min(siblings.indexOf(el) * 55, 440);
          setTimeout(function () { el.classList.add('visible'); }, delay);
          cardObserver.unobserve(el);
        });
      }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });

      grid.querySelectorAll('.res-card.reveal').forEach(function (c) {
        cardObserver.observe(c);
      });
    } else {
      grid.querySelectorAll('.res-card.reveal').forEach(function (c) {
        c.classList.add('visible');
      });
    }

    /* Restore bookmark heart state after re-render */
    if (typeof CareMapBookmarks !== "undefined") {
      CareMapBookmarks.applyToPage();
    }

    /* Bind grid-level bookmarks */
    bindGridBookmarks();
  }

  /* ── Grid bookmark click handler ── */
  function bindGridBookmarks() {
    grid.querySelectorAll('.card-bookmark[data-id]').forEach(function (btn) {
      btn.removeEventListener('click', handleGridBookmarkClick);
      btn.addEventListener('click', handleGridBookmarkClick);
    });
  }

  function handleGridBookmarkClick(e) {
    e.preventDefault();
    e.stopPropagation();

    var btn = e.currentTarget;
    var resourceId = parseInt(btn.dataset.id, 10);

    if (typeof CareMapBookmarks === "undefined") return;

    var nowSaved = CareMapBookmarks.toggle(resourceId);

    /* Update button */
    btn.textContent = nowSaved ? "♥" : "♡";
    btn.classList.toggle("saved", nowSaved);
    btn.setAttribute("aria-label",
      nowSaved ? "Unsave this organization" : "Save this organization");

    /* Animate */
    btn.classList.remove("bookmark-pop");
    void btn.offsetWidth;
    btn.classList.add("bookmark-pop");

    /* Update nav badge */
    updateBadge();
  }

  /* ── Filtering logic ── */
  function applyFilters() {
    var query   = (searchInput.value || "").toLowerCase().trim();
    var catVal  = categoryFilter.value;
    var townVal = townFilter.value;
    var radiusMiles = radiusFilter ? Number(radiusFilter.value || 5) : 5;

    var filtered = RESOURCES.filter(function (r) {
      var matchesCategory = (catVal === "all") || (r.category === catVal);
      var matchesTown     = (townVal === "all") || (r.town === townVal);
      var matchesSearch   = true;

      if (query.length > 0) {
        var blob =
          (r.title    || "") + " " +
          (r.town     || "") + " " +
          (r.shortDesc|| "") + " " +
          (r.longDesc || "") + " " +
          (r.tags     || []).join(" ");
        matchesSearch = blob.toLowerCase().includes(query);
      }

      r._distanceMiles = null;

      if (activeLocation) {
        var coords = getResourceCoords(r);
        if (!coords) return false;

        r._distanceMiles = milesBetween(activeLocation.coords, coords);
        if (r._distanceMiles > radiusMiles) return false;
      }

      return matchesCategory && matchesTown && matchesSearch;
    });

    if (activeLocation) {
      filtered.sort(function (a, b) {
        return (a._distanceMiles || 0) - (b._distanceMiles || 0);
      });
    }

    showAll = false;

    var resultPrefix = activeLocation
      ? "Within " + radiusMiles + " miles: "
      : "";

    resultsCount.textContent =
      resultPrefix + (filtered.length <= 20
        ? "Showing " + filtered.length + " of " + RESOURCES.length + " resources"
        : "Showing 20 of " + filtered.length + " resources");

    renderResources(filtered);
  }

  /* ── Open detail modal ── */
  function openDetail(r, triggerEl) {
    lastFocused = triggerEl || document.activeElement;

    var cat = CAT[r.category] || { label: r.category, cls: "" };

    var tagsHtml = (r.tags || []).map(function (t) {
      return '<span class="res-tag">' + t + "</span>";
    }).join("");

    var websiteHtml = r.website
      ? '<a href="' + r.website + '" target="_blank" rel="noopener">' +
          r.website.replace("https://", "").replace("http://", "") + "</a>"
      : "<span style='color:var(--warm-gray)'>Not listed</span>";

    var phoneHtml = r.phone
      ? '<a href="tel:' + r.phone + '">' + r.phone + "</a>"
      : "<span style='color:var(--warm-gray)'>Not listed</span>";

    var addressText = r.address || "";
    var mapsUrl = addressText
      ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(addressText)
      : "";

    /* Bookmark state for modal heart */
    var isSaved    = typeof CareMapBookmarks !== "undefined" && CareMapBookmarks.isSaved(r.id);
    var heartChar  = isSaved ? "♥" : "♡";
    var heartLabel = isSaved ? "Unsave this organization" : "Save this organization";
    var heartSaved = isSaved ? " saved" : "";

    detailCard.innerHTML =
      /* ── Header ── */
      '<div class="detail-head">' +
        '<div class="detail-head-left">' +
          '<span class="res-badge ' + cat.cls + '">' + cat.label + "</span>" +
          '<h2 class="detail-title" id="detailTitle">' + r.title + "</h2>" +
        "</div>" +
        /* heart + close sit together on the right */
        '<div class="detail-head-right">' +
          '<button class="detail-bookmark card-bookmark' + heartSaved + '" ' +
            'data-id="' + r.id + '" ' +
            'aria-label="' + heartLabel + '" ' +
            'title="' + heartLabel + '">' +
            heartChar +
          "</button>" +
          '<button class="detail-close" id="detailCloseX" aria-label="Close details">&#x2715;</button>' +
        "</div>" +
      "</div>" +

      /* ── Body ── */
      '<div class="detail-body">' +
        '<div class="detail-section">' +
          '<p class="detail-section-label">Summary</p>' +
          '<p class="detail-long-desc">' +
            (r.longDesc || r.shortDesc || "No description available.") +
          "</p>" +
        "</div>" +
        '<div class="detail-section">' +
          '<p class="detail-section-label">Tags</p>' +
          '<div class="detail-tags">' +
            (tagsHtml || "<span style='color:var(--warm-gray)'>No tags listed</span>") +
          "</div>" +
        "</div>" +
        '<div class="detail-section">' +
          '<p class="detail-section-label">Contact &amp; Location</p>' +
          '<div class="detail-info-grid">' +
            '<div class="detail-info-item">' +
              '<p class="detail-info-label">Town</p>' +
              '<p class="detail-info-value">' + (r.town || "Morris County") + "</p>" +
            "</div>" +
            '<div class="detail-info-item">' +
              '<p class="detail-info-label">Phone</p>' +
              '<p class="detail-info-value">' + phoneHtml + "</p>" +
            "</div>" +
            '<div class="detail-info-item">' +
              '<p class="detail-info-label">Address</p>' +
              '<p class="detail-info-value">' +
                (r.address || "<span style='color:var(--warm-gray)'>Not listed</span>") +
              "</p>" +
            "</div>" +
            '<div class="detail-info-item">' +
              '<p class="detail-info-label">Hours</p>' +
              '<p class="detail-info-value">' +
                (r.hours || "<span style='color:var(--warm-gray)'>Call to confirm</span>") +
              "</p>" +
            "</div>" +
            '<div class="detail-info-item" style="grid-column:1/-1;">' +
              '<p class="detail-info-label">Website</p>' +
              '<p class="detail-info-value">' + websiteHtml + "</p>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</div>" +

      /* ── Actions ── */
      '<div class="detail-actions">' +
        (r.website
          ? '<a class="btn btn-primary" href="' + r.website + '" target="_blank" rel="noopener">Visit Website</a>'
          : "") +
        (r.phone
          ? '<a class="btn btn-secondary" href="tel:' + r.phone + '">Call</a>'
          : "") +
        (mapsUrl
          ? '<a class="btn btn-secondary" href="' + mapsUrl + '" target="_blank" rel="noopener">Open in Maps</a>'
          : "") +
        (addressText
          ? '<button class="btn btn-ghost" id="copyAddressBtn">Copy Address</button>'
          : "") +
        '<button class="btn btn-ghost" id="detailCloseBtn">Close</button>' +
      "</div>";

    /* Wire close buttons */
    detailCard.querySelector("#detailCloseX").addEventListener("click", closeDetail);
    detailCard.querySelector("#detailCloseBtn").addEventListener("click", closeDetail);

    /* Copy address */
    if (addressText) {
      detailCard.querySelector("#copyAddressBtn").addEventListener("click", function () {
        var btn = detailCard.querySelector("#copyAddressBtn");
        navigator.clipboard.writeText(addressText).then(function () {
          btn.textContent = "Copied!";
          setTimeout(function () { btn.textContent = "Copy Address"; }, 1800);
        });
      });
    }

    /* ── Modal bookmark heart ── */
    var modalHeart = detailCard.querySelector(".detail-bookmark");
    if (modalHeart && typeof CareMapBookmarks !== "undefined") {
      modalHeart.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        var nowSaved = CareMapBookmarks.toggle(r.id);

        /* Update modal heart */
        modalHeart.textContent = nowSaved ? "♥" : "♡";
        modalHeart.classList.toggle("saved", nowSaved);
        modalHeart.setAttribute("aria-label",
          nowSaved ? "Unsave this organization" : "Save this organization");

        /* Sync grid card heart */
        var gridHeart = grid.querySelector('.card-bookmark[data-id="' + r.id + '"]');
        if (gridHeart) {
          gridHeart.textContent = nowSaved ? "♥" : "♡";
          gridHeart.classList.toggle("saved", nowSaved);
          gridHeart.setAttribute("aria-label",
            nowSaved ? "Unsave this organization" : "Save this organization");
        }

        /* Update nav badge */
        updateBadge();

        /* Pop animation */
        modalHeart.classList.remove("bookmark-pop");
        void modalHeart.offsetWidth; /* force reflow */
        modalHeart.classList.add("bookmark-pop");
      });
    }

    backdrop.hidden = false;
    modalWrap.hidden = false;
    document.body.style.overflow = "hidden";

    requestAnimationFrame(function () {
      var first = detailCard.querySelector("button, a[href]");
      if (first) first.focus();
    });
  }

  /* ── Close modal ── */
  function closeDetail() {
    backdrop.hidden = true;
    modalWrap.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  backdrop.addEventListener("click", closeDetail);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modalWrap.hidden) closeDetail();
  });

  /* ── Clear filters ── */
  clearBtn.addEventListener("click", function () {
    searchInput.value    = "";
    if (addressInput) addressInput.value = "";
    if (radiusFilter) radiusFilter.value = "5";
    categoryFilter.value = "all";
    townFilter.value     = "all";
    activeLocation       = null;
    showAll              = false;
    setLocationStatus("");
    applyFilters();
  });

  searchInput.addEventListener("input",     applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
  townFilter.addEventListener("change",     applyFilters);

  if (addressInput) {
    addressInput.addEventListener("focus", function () {
      renderAddressSuggestions(getFilteredAddressSuggestions(addressInput.value));
    });

    addressInput.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") {
        if (!currentAddressOptions.length) return;
        e.preventDefault();
        highlightedAddressIndex = Math.min(highlightedAddressIndex + 1, currentAddressOptions.length - 1);
        updateHighlightedAddress();
      } else if (e.key === "ArrowUp") {
        if (!currentAddressOptions.length) return;
        e.preventDefault();
        highlightedAddressIndex = Math.max(highlightedAddressIndex - 1, 0);
        updateHighlightedAddress();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (highlightedAddressIndex >= 0) {
          selectAddressSuggestion(highlightedAddressIndex);
        } else {
          applyAddressLocation();
        }
      } else if (e.key === "Escape") {
        hideAddressSuggestions();
      }
    });

    addressInput.addEventListener("change", applyAddressLocation);
    addressInput.addEventListener("input", function () {
      if (!addressInput.value.trim()) {
        activeLocation = null;
        setLocationStatus("");
        applyFilters();
      }
      updateAddressAutocomplete();
    });
  }

  document.addEventListener("mousedown", function (e) {
    if (!addressInput || !addressList) return;
    if (addressInput.contains(e.target) || addressList.contains(e.target)) return;
    hideAddressSuggestions();
  });

  if (radiusFilter) {
    radiusFilter.addEventListener("change", function () {
      if (activeLocation) {
        applyFilters();
      }
    });
  }

  if (demoAddressBtn) {
    demoAddressBtn.addEventListener("click", function () {
      if (addressInput) addressInput.value = DEMO_ADDRESS;
      applyAddressLocation();
      var gridTop = grid.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: gridTop, behavior: "smooth" });
    });
  }

  /* ── Deep link: ?id=X from map pins, ?q= from hero search ── */
  function handleDeepLink() {
    var params   = new URLSearchParams(window.location.search);
    var targetId = params.get("id");
    var queryStr = params.get("q");

    /* Hero search redirect */
    if (queryStr) {
      searchInput.value = queryStr;
      applyFilters();
      return;
    }

    if (!targetId) return;

    var numId    = Number(targetId);
    var resource = RESOURCES.find(function (r) { return r.id === numId; });
    if (!resource) return;

    /* Force ALL cards to render so the target card exists in the DOM */
    showAll = true;
    applyFilters();

    /* Wait for render then scroll + highlight + open */
    setTimeout(function () {
      var card = grid.querySelector('[data-resource-id="' + numId + '"]');

      if (card) {
        /* Smooth scroll to card with a little offset for better visibility */
        card.scrollIntoView({ behavior: "smooth", block: "center" });

        /* Rust outline pulse animation */
        card.style.transition   = "outline 0s, box-shadow .3s";
        card.style.outline      = "3px solid var(--rust)";
        card.style.outlineOffset = "3px";
        card.style.boxShadow    = "0 0 0 6px rgba(192,75,32,.18)";

        setTimeout(function () {
          card.style.outline      = "";
          card.style.outlineOffset = "";
          card.style.boxShadow    = "";
          openDetail(resource, card);
        }, 750);
      } else {
        /* Fallback: open modal without scroll */
        openDetail(resource, null);
      }
    }, 200);
  }

  /* ── Init ── */
  populateFilters();
  populateAddressSuggestions();
  applyFilters();

  if (typeof CareMapBookmarks !== "undefined") {
    CareMapBookmarks.bindButtons();
    updateBadge();
  }

  handleDeepLink();

  }
});

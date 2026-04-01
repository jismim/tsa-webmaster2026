/* ============================================================
   CAREMAP MORRIS — Directory JavaScript
   Requires: resources.js and bookmarks.js loaded before this file
============================================================ */

(function () {
  'use strict';

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
  var categoryFilter = document.getElementById("categoryFilter");
  var townFilter     = document.getElementById("townFilter");
  var clearBtn       = document.getElementById("clearFilters");
  var resultsCount   = document.getElementById("resultsCount");

  var lastFocused = null;
  var showAll = false;
  var currentFilteredList = [];

  /* ── Populate dropdown filters ── */
  function populateFilters() {
    var towns = {};
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

  /* ── Render card grid ── */
  function renderResources(list) {
    currentFilteredList = list;
    grid.innerHTML = "";

    if (list.length === 0) {
      grid.innerHTML =
        '<p style="grid-column:1/-1; color:var(--warm-gray); font-size:1rem; padding:18px;">' +
        "No results found. Try changing your search or filters." +
        "</p>";
      return;
    }

    /* Limit to 20 unless showAll is true */
    var displayList = showAll ? list : list.slice(0, 20);

    displayList.forEach(function (r, idx) {
      var cat = CAT[r.category] || { label: r.category, cls: "" };

      /* ── Bookmark state ── */
      var isSaved    = typeof CareMapBookmarks !== "undefined" && CareMapBookmarks.isSaved(r.id);
      var heartChar  = isSaved ? "♥" : "♡";
      var heartCls   = "card-bookmark" + (isSaved ? " saved" : "");
      var heartLabel = isSaved ? "Unsave this organization" : "Save this organization";

      /* ── Tags ── */
      var tagsHtml = r.tags.slice(0, 3).map(function (t) {
        return '<span class="res-tag">' + t + "</span>";
      }).join("");
      if (r.tags.length > 3) {
        tagsHtml += '<span class="res-tag">+' + (r.tags.length - 3) + " more</span>";
      }

      var card = document.createElement("article");
      /* Only first 12 cards get reveal animation to avoid over-animating */
      var revealClass = idx < 12 ? " reveal" : "";
      card.className = "res-card" + revealClass;
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "View details for " + r.title);
      card.dataset.resourceId = r.id;

      card.innerHTML =
        /* Top bar: badge + bookmark heart */
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

      /* Open modal — but NOT when clicking the bookmark button */
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

    /* ── Add View All button if there are more than 20 results ── */
    if (list.length > 20 && !showAll) {
      var viewAllContainer = document.createElement("div");
      viewAllContainer.style.gridColumn = "1 / -1";
      viewAllContainer.style.textAlign = "center";
      viewAllContainer.style.padding = "32px 0";
      viewAllContainer.className = "reveal";

      var viewAllBtn = document.createElement("button");
      viewAllBtn.className = "btn btn-outline-dark";
      viewAllBtn.textContent = "View All " + list.length + " Resources →";
      viewAllBtn.style.marginTop = "8px";
      viewAllBtn.addEventListener("click", function () {
        showAll = true;
        renderResources(list);
      });

      viewAllContainer.appendChild(viewAllBtn);
      grid.appendChild(viewAllContainer);
    }

    /* ── Trigger staggered reveal on rendered cards ── */
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
  }

  /* ── Filtering logic ── */
  function applyFilters() {
    var query   = (searchInput.value || "").toLowerCase().trim();
    var catVal  = categoryFilter.value;
    var townVal = townFilter.value;

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

      return matchesCategory && matchesTown && matchesSearch;
    });

    showAll = false; /* Reset showAll when filters change */

    resultsCount.textContent =
      "Showing " + Math.min(filtered.length, 20) + " of " + filtered.length + " resources";

    renderResources(filtered);
  }

  /* ── Open detail modal ── */
  function openDetail(r, triggerEl) {
    lastFocused = triggerEl || document.activeElement;

    var cat      = CAT[r.category] || { label: r.category, cls: "" };
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

    /* Bookmark state in modal */
    var isSaved    = typeof CareMapBookmarks !== "undefined" && CareMapBookmarks.isSaved(r.id);
    var heartChar  = isSaved ? "♥" : "♡";
    var heartCls   = "card-bookmark detail-bookmark" + (isSaved ? " saved" : "");
    var heartLabel = isSaved ? "Unsave this organization" : "Save this organization";

    detailCard.innerHTML =
      '<div class="detail-head">' +
        '<div class="detail-head-left">' +
          '<span class="res-badge ' + cat.cls + '">' + cat.label + "</span>" +
          '<h2 class="detail-title" id="detailTitle">' + r.title + "</h2>" +
        "</div>" +
        '<div class="detail-head-right">' +
          '<button class="' + heartCls + '" data-id="' + r.id + '" ' +
            'aria-label="' + heartLabel + '" title="' + heartLabel + '">' +
            heartChar +
          "</button>" +
          '<button class="detail-close" id="detailCloseX" aria-label="Close details">&#x2715;</button>' +
        "</div>" +
      "</div>" +

      '<div class="detail-body">' +
        '<div class="detail-section">' +
          '<p class="detail-section-label">Summary</p>' +
          '<p class="detail-long-desc">' + (r.longDesc || r.shortDesc || "No description available.") + "</p>" +
        "</div>" +
        '<div class="detail-section">' +
          '<p class="detail-section-label">Tags</p>' +
          '<div class="detail-tags">' + (tagsHtml || "<span style='color:var(--warm-gray)'>No tags listed</span>") + "</div>" +
        "</div>" +
        '<div class="detail-section">' +
          '<p class="detail-section-label">Contact &amp; Location</p>' +
          '<div class="detail-info-grid">' +
            '<div class="detail-info-item"><p class="detail-info-label">Town</p><p class="detail-info-value">' + (r.town || "Morris County") + "</p></div>" +
            '<div class="detail-info-item"><p class="detail-info-label">Phone</p><p class="detail-info-value">' + phoneHtml + "</p></div>" +
            '<div class="detail-info-item"><p class="detail-info-label">Address</p><p class="detail-info-value">' + (r.address || "<span style='color:var(--warm-gray)'>Not listed</span>") + "</p></div>" +
            '<div class="detail-info-item"><p class="detail-info-label">Hours</p><p class="detail-info-value">' + (r.hours || "<span style='color:var(--warm-gray)'>Call to confirm</span>") + "</p></div>" +
            '<div class="detail-info-item" style="grid-column:1/-1;"><p class="detail-info-label">Website</p><p class="detail-info-value">' + websiteHtml + "</p></div>" +
          "</div>" +
        "</div>" +
      "</div>" +

      '<div class="detail-actions">' +
        (r.website ? '<a class="btn btn-primary" href="' + r.website + '" target="_blank" rel="noopener">Visit Website</a>' : "") +
        (r.phone   ? '<a class="btn btn-secondary" href="tel:' + r.phone + '">Call</a>' : "") +
        (mapsUrl   ? '<a class="btn btn-secondary" href="' + mapsUrl + '" target="_blank" rel="noopener">Open in Maps</a>' : "") +
        (addressText ? '<button class="btn btn-ghost" id="copyAddressBtn">Copy Address</button>' : "") +
        '<button class="btn btn-ghost" id="detailCloseBtn">Close</button>' +
      "</div>";

    /* Wire close buttons */
    detailCard.querySelector("#detailCloseX").addEventListener("click", closeDetail);
    detailCard.querySelector("#detailCloseBtn").addEventListener("click", closeDetail);

    /* Copy address with inline feedback */
    if (addressText) {
      detailCard.querySelector("#copyAddressBtn").addEventListener("click", function () {
        var btn = detailCard.querySelector("#copyAddressBtn");
        navigator.clipboard.writeText(addressText).then(function () {
          btn.textContent = "Copied!";
          setTimeout(function () { btn.textContent = "Copy Address"; }, 1800);
        });
      });
    }

    /* ── Modal bookmark button ── */
    var modalHeart = detailCard.querySelector(".detail-bookmark");
    if (modalHeart && typeof CareMapBookmarks !== "undefined") {
      modalHeart.addEventListener("click", function () {
        var nowSaved = CareMapBookmarks.toggle(r.id);
        modalHeart.textContent = nowSaved ? "♥" : "♡";
        modalHeart.classList.toggle("saved", nowSaved);
        modalHeart.setAttribute("aria-label", nowSaved ? "Unsave this organization" : "Save this organization");

        /* Sync matching card in grid */
        var gridHeart = grid.querySelector('.card-bookmark[data-id="' + r.id + '"]');
        if (gridHeart) {
          gridHeart.textContent = nowSaved ? "♥" : "♡";
          gridHeart.classList.toggle("saved", nowSaved);
        }

        updateBadge();

        /* Pop animation */
        modalHeart.classList.remove("bookmark-pop");
        void modalHeart.offsetWidth;
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

  /* ── Update nav bookmark badge ── */
  function updateBadge() {
    if (typeof CareMapBookmarks === "undefined") return;
    document.querySelectorAll(".bookmark-count").forEach(function (el) {
      var c = CareMapBookmarks.count();
      el.textContent   = c;
      el.style.display = c > 0 ? "inline-flex" : "none";
    });
  }

  /* ── Clear filters ── */
  clearBtn.addEventListener("click", function () {
    searchInput.value    = "";
    categoryFilter.value = "all";
    townFilter.value     = "all";
    showAll              = false;
    applyFilters();
  });

  searchInput.addEventListener("input",     applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
  townFilter.addEventListener("change",     applyFilters);

  /* ── Handle ?id=X deep link (from map pins) and ?q= (hero search) ── */
  function handleDeepLink() {
    var params   = new URLSearchParams(window.location.search);
    var targetId = params.get("id");
    var queryStr = params.get("q");

    if (queryStr) {
      searchInput.value = queryStr;
      applyFilters();
      return;
    }

    if (!targetId) return;

    var numId    = Number(targetId);
    var resource = RESOURCES.find(function (r) { return r.id === numId; });
    if (!resource) return;

    setTimeout(function () {
      var card = grid.querySelector('[data-resource-id="' + numId + '"]');
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.style.outline       = "3px solid var(--rust)";
        card.style.outlineOffset = "3px";
        setTimeout(function () {
          card.style.outline       = "";
          card.style.outlineOffset = "";
          openDetail(resource, card);
        }, 700);
      } else {
        openDetail(resource, null);
      }
    }, 200);
  }

  /* ── Sync badge when grid bookmark buttons are clicked ── */
  grid.addEventListener("click", function (e) {
    if (e.target.closest(".card-bookmark[data-id]")) updateBadge();
  });

  /* ── Init ── */
  populateFilters();
  applyFilters();

  if (typeof CareMapBookmarks !== "undefined") {
    CareMapBookmarks.bindButtons();
    updateBadge();
  }

  handleDeepLink();

})();
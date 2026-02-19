/* ============================================================
   CAREMAP MORRIS — Directory JavaScript (Improved)
   Requires: resources.js loaded before this file
============================================================ */


(function () {

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
  var grid          = document.getElementById("resourceGrid");
  var backdrop      = document.getElementById("detailBackdrop");
  var modalWrap     = document.getElementById("detailModalWrap");
  var detailCard    = document.getElementById("detailCard");

  var searchInput   = document.getElementById("searchInput");
  var categoryFilter= document.getElementById("categoryFilter");
  var townFilter    = document.getElementById("townFilter");
  var clearBtn      = document.getElementById("clearFilters");
  var resultsCount  = document.getElementById("resultsCount");

  /* track which element opened the modal so we can restore focus */
  var lastFocused = null;

  /* ── Populate dropdown options ── */
  function populateFilters() {
    var towns = {};
    var categories = {};

    RESOURCES.forEach(function (r) {
      if (r.town) towns[r.town] = true;
      if (r.category) categories[r.category] = true;
    });

    Object.keys(categories).sort().forEach(function (catKey) {
      var cat = CAT[catKey] || { label: catKey };
      var opt = document.createElement("option");
      opt.value = catKey;
      opt.textContent = cat.label;
      categoryFilter.appendChild(opt);
    });

    Object.keys(towns).sort().forEach(function (town) {
      var opt = document.createElement("option");
      opt.value = town;
      opt.textContent = town;
      townFilter.appendChild(opt);
    });
  }

  /* ── Render card grid based on filtered list ── */
  function renderResources(list) {
    grid.innerHTML = "";

    if (list.length === 0) {
      grid.innerHTML =
        '<p style="grid-column:1/-1; color:var(--muted); font-size:1rem; padding:18px;">' +
        "No results found. Try changing your search or filters." +
        "</p>";
      return;
    }

    list.forEach(function (r) {
      var cat = CAT[r.category] || { label: r.category, cls: "" };

      var tagsHtml = r.tags.slice(0, 3).map(function (t) {
        return '<span class="res-tag">' + t + "</span>";
      }).join("");

      if (r.tags.length > 3) {
        tagsHtml += '<span class="res-tag">+' + (r.tags.length - 3) + " more</span>";
      }

      var card = document.createElement("article");
      card.className = "res-card";
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", "View details for " + r.title);

      card.innerHTML =
        '<div class="res-card-body">' +
          '<span class="res-badge ' + cat.cls + '">' + cat.label + "</span>" +
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

      card.addEventListener("click", function () {
        openDetail(r, card);
      });

      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDetail(r, card);
        }
      });

      grid.appendChild(card);
    });
  }

  /* ── Filtering logic ── */
  function applyFilters() {
    var query = (searchInput.value || "").toLowerCase().trim();
    var catVal = categoryFilter.value;
    var townVal = townFilter.value;

    var filtered = RESOURCES.filter(function (r) {

      var matchesCategory = (catVal === "all") || (r.category === catVal);
      var matchesTown = (townVal === "all") || (r.town === townVal);

      var matchesSearch = true;
      if (query.length > 0) {
        var searchBlob =
          (r.title || "") + " " +
          (r.town || "") + " " +
          (r.shortDesc || "") + " " +
          (r.longDesc || "") + " " +
          (r.tags || []).join(" ");

        matchesSearch = searchBlob.toLowerCase().includes(query);
      }

      return matchesCategory && matchesTown && matchesSearch;
    });

    resultsCount.textContent =
      "Showing " + filtered.length + " of " + RESOURCES.length + " resources";

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
          r.website.replace("https://", "").replace("http://", "") +
        "</a>"
      : "<span style='color:var(--muted)'>Not listed</span>";

    var phoneHtml = r.phone
      ? '<a href="tel:' + r.phone + '">' + r.phone + "</a>"
      : "<span style='color:var(--muted)'>Not listed</span>";

    var addressText = r.address || "";
    var mapsUrl = addressText
      ? "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(addressText)
      : "";

    detailCard.innerHTML =
      '<div class="detail-head">' +
        '<div class="detail-head-left">' +
          '<span class="res-badge ' + cat.cls + '">' + cat.label + "</span>" +
          '<h2 class="detail-title" id="detailTitle">' + r.title + "</h2>" +
        "</div>" +
        '<button class="detail-close" id="detailCloseX" aria-label="Close details">&#x2715;</button>' +
      "</div>" +

      '<div class="detail-body">' +

        '<div class="detail-section">' +
          '<p class="detail-section-label">Summary</p>' +
          '<p class="detail-long-desc">' + (r.longDesc || r.shortDesc || "No description available.") + "</p>" +
        "</div>" +

        '<div class="detail-section">' +
          '<p class="detail-section-label">Tags</p>' +
          '<div class="detail-tags">' + (tagsHtml || "<span style='color:var(--muted)'>No tags listed</span>") + "</div>" +
        "</div>" +

        '<div class="detail-section">' +
          '<p class="detail-section-label">Contact & Location</p>' +
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
              '<p class="detail-info-value">' + (r.address || "<span style='color:var(--muted)'>Not listed</span>") + "</p>" +
            "</div>" +

            '<div class="detail-info-item">' +
              '<p class="detail-info-label">Hours</p>' +
              '<p class="detail-info-value">' + (r.hours || "<span style='color:var(--muted)'>Call to confirm</span>") + "</p>" +
            "</div>" +

            '<div class="detail-info-item" style="grid-column:1/-1;">' +
              '<p class="detail-info-label">Website</p>' +
              '<p class="detail-info-value">' + websiteHtml + "</p>" +
            "</div>" +

          "</div>" +
        "</div>" +

      "</div>" +

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

    detailCard.querySelector("#detailCloseX").addEventListener("click", closeDetail);
    detailCard.querySelector("#detailCloseBtn").addEventListener("click", closeDetail);

    if (addressText) {
      detailCard.querySelector("#copyAddressBtn").addEventListener("click", function () {
        navigator.clipboard.writeText(addressText).then(function () {
          alert("Address copied to clipboard!");
        });
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

  /* ── Close detail modal ── */
  function closeDetail() {
    backdrop.hidden = true;
    modalWrap.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  /* close on backdrop click */
  backdrop.addEventListener("click", closeDetail);

  /* close on Escape key */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modalWrap.hidden) closeDetail();
  });

  /* clear filters */
  clearBtn.addEventListener("click", function () {
    searchInput.value = "";
    categoryFilter.value = "all";
    townFilter.value = "all";
    applyFilters();
  });

  /* live updates */
  searchInput.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
  townFilter.addEventListener("change", applyFilters);

  /* init */
  populateFilters();
  applyFilters();

})();

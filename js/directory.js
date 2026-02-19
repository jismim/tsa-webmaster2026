/* ============================================================
   CAREMAP MORRIS — Directory JavaScript
   Requires: resources.js loaded before this file
   Handles: building cards from RESOURCES data, detail modal
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
  var grid       = document.getElementById("resourceGrid");
  var backdrop   = document.getElementById("detailBackdrop");
  var modalWrap  = document.getElementById("detailModalWrap");
  var detailCard = document.getElementById("detailCard");

  /* track which element opened the modal so we can restore focus */
  var lastFocused = null;

  /* ── Build all cards from RESOURCES data ── */
  RESOURCES.forEach(function (r) {
    var cat = CAT[r.category] || { label: r.category, cls: "" };

    /* build tag pills — show first 3 + overflow count */
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
          /* pin icon */
          '<svg width="10" height="13" viewBox="0 0 10 13" fill="none" aria-hidden="true">' +
            '<path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="currentColor"/>' +
          "</svg>" +
          r.town +
        "</p>" +
        '<p class="res-card-desc">' + r.shortDesc + "</p>" +
        '<div class="res-card-tags">' + tagsHtml + "</div>" +
      "</div>" +
      '<div class="res-card-footer">' +
        '<span class="res-card-phone">' + (r.phone || "") + "</span>" +
        '<button class="res-expand-btn" aria-label="View full details for ' + r.title + '">' +
          "View details" +
          /* arrow icon */
          '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">' +
            '<path d="M2.5 6.5h8M7 3l3.5 3.5L7 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
          "</svg>" +
        "</button>" +
      "</div>";

    /* click anywhere on the card → open modal */
    card.addEventListener("click", function () {
      openDetail(r, card);
    });

    /* keyboard: Enter / Space also opens modal */
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openDetail(r, card);
      }
    });

    grid.appendChild(card);
  });

  /* ── Open detail modal ── */
  function openDetail(r, triggerEl) {
    lastFocused = triggerEl || document.activeElement;

    var cat       = CAT[r.category] || { label: r.category, cls: "" };
    var tagsHtml  = r.tags.map(function (t) {
      return '<span class="res-tag">' + t + "</span>";
    }).join("");

    var websiteHtml = r.website
      ? '<a href="' + r.website + '" target="_blank" rel="noopener">' +
          r.website.replace("https://", "").replace("http://", "") +
        "</a>"
      : "Not listed";

    var phoneHtml = r.phone
      ? '<a href="tel:' + r.phone + '">' + r.phone + "</a>"
      : "Not listed";

    detailCard.innerHTML =
      /* ── sticky header ── */
      '<div class="detail-head">' +
        '<div class="detail-head-left">' +
          '<span class="res-badge ' + cat.cls + '">' + cat.label + "</span>" +
          '<h2 class="detail-title" id="detailTitle">' + r.title + "</h2>" +
        "</div>" +
        '<button class="detail-close" id="detailCloseX" aria-label="Close details">&#x2715;</button>' +
      "</div>" +

      /* ── scrollable body ── */
      '<div class="detail-body">' +

        '<div class="detail-section">' +
          '<p class="detail-section-label">About this organization</p>' +
          '<p class="detail-long-desc">' + r.longDesc + "</p>" +
        "</div>" +

        '<div class="detail-section">' +
          '<p class="detail-section-label">Tags</p>' +
          '<div class="detail-tags">' + tagsHtml + "</div>" +
        "</div>" +

        '<div class="detail-section">' +
          '<p class="detail-section-label">Contact &amp; Location</p>' +
          '<div class="detail-info-grid">' +
            '<div class="detail-info-item">' +
              '<p class="detail-info-label">Address</p>' +
              '<p class="detail-info-value">' + (r.address || "Not listed") + "</p>" +
            "</div>" +
            '<div class="detail-info-item">' +
              '<p class="detail-info-label">Phone</p>' +
              '<p class="detail-info-value">' + phoneHtml + "</p>" +
            "</div>" +
            '<div class="detail-info-item">' +
              '<p class="detail-info-label">Hours</p>' +
              '<p class="detail-info-value">' + (r.hours || "Call to confirm") + "</p>" +
            "</div>" +
            '<div class="detail-info-item">' +
              '<p class="detail-info-label">Website</p>' +
              '<p class="detail-info-value">' + websiteHtml + "</p>" +
            "</div>" +
          "</div>" +
        "</div>" +

      "</div>" +

      /* ── footer actions ── */
      '<div class="detail-actions">' +
        (r.website
          ? '<a class="btn btn-primary" href="' + r.website + '" target="_blank" rel="noopener">Visit Website &rarr;</a>'
          : "") +
        (r.phone
          ? '<a class="btn btn-secondary" href="tel:' + r.phone + '">Call Now</a>'
          : "") +
        '<button class="btn btn-ghost" id="detailCloseBtn">Close</button>' +
      "</div>";

    /* wire close buttons created inside the modal */
    detailCard.querySelector("#detailCloseX").addEventListener("click", closeDetail);
    detailCard.querySelector("#detailCloseBtn").addEventListener("click", closeDetail);

    /* show modal */
    backdrop.hidden  = false;
    modalWrap.hidden = false;
    document.body.style.overflow = "hidden";

    /* move focus to first interactive element inside modal */
    requestAnimationFrame(function () {
      var first = detailCard.querySelector("button, a[href]");
      if (first) first.focus();
    });
  }

  /* ── Close detail modal ── */
  function closeDetail() {
    backdrop.hidden  = true;
    modalWrap.hidden = true;
    document.body.style.overflow = "";
    /* return focus to the card that triggered the modal */
    if (lastFocused) lastFocused.focus();
  }

  /* close on backdrop click */
  backdrop.addEventListener("click", closeDetail);

  /* close on Escape key */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modalWrap.hidden) closeDetail();
  });

})();
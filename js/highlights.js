/* hello, please put code in here */
/* ============================================================
   CAREMAP MORRIS — Highlights Page JavaScript
   Handles: card rendering, modal open/close
============================================================ */

const HIGHLIGHTS = [
  // ── FOOD PANTRIES ──
  {
    week: "Week of January 6",
    org: "Interfaith Food Pantry",
    location: "Morris Plains",
    focus: "Food Assistance",
    provides: ["Emergency & supplemental groceries", "Fresh produce & farmers markets", "Client-choice shopping model", "Mobile delivery for seniors & homebound", "Nutrition education"],
    giveback: ["Donate food or funds", "Volunteer at the pantry"],
    why: "For over 25 years, IFPN has distributed millions of pounds of food and ensures no one is turned away regardless of background.",
    url: "https://www.mcifp.org/",
    image: ""
  },
  {
    week: "Week of January 13",
    org: "Boonton Food Pantry",
    location: "Boonton",
    focus: "Food Assistance",
    provides: ["Supplemental groceries", "Essential household items"],
    giveback: ["Donate non-perishable food", "Donate hygiene & cleaning supplies", "Monetary donations"],
    why: "Run entirely by local volunteers, the Boonton Food Pantry supports families facing short-term food insecurity right in the heart of town.",
    url: "https://www.boonton.org/630/Food-Pantries-Financial-Assistance",
    image: ""
  },
  {
    week: "Week of January 20",
    org: "Loaves & Fishes Community Food Pantry",
    location: "Boonton",
    focus: "Food Assistance",
    provides: ["Free fresh and shelf-stable groceries", "Weekly food distribution"],
    giveback: ["Volunteer at distributions", "Donate food or funds"],
    why: "Run by local churches, Loaves & Fishes serves anyone in need — no questions asked — multiple days each week.",
    url: "https://www.lfcfp.org/",
    image: ""
  },
  {
    week: "Week of January 27",
    org: "Chester Mendham Food Pantry",
    location: "Chester",
    focus: "Food Assistance",
    provides: ["Supplemental groceries", "Toiletries & household supplies"],
    giveback: ["Donate food or funds", "Volunteer to sort and deliver food"],
    why: "A volunteer-based pantry serving Chester and Mendham neighbors, collaborating with local schools, churches, and businesses.",
    url: "https://www.chestermendhamfp.com/",
    image: ""
  },
  {
    week: "Week of February 3",
    org: "nourish.NJ",
    location: "Morristown & Dover",
    focus: "Hunger Relief",
    provides: ["Daily healthy meals", "Farmers markets", "Bilingual SNAP/WIC assistance", "Fresh produce distributions", "Housing stability support"],
    giveback: ["Volunteer at food distributions", "Donate", "Help with meal prep & community events"],
    why: "Nourish NJ tackles hunger and its root causes — no income verification, welcoming to all — at multiple Morris County locations.",
    url: "https://www.nourishnj.org/",
    image: ""
  },
  {
    week: "Week of February 10",
    org: "Faith Kitchen",
    location: "Dover",
    focus: "Soup Kitchen",
    provides: ["Free nutritious meals 6 days/week", "Fresh produce", "Referrals to additional services"],
    giveback: ["Volunteer at the kitchen", "Donate funds or food"],
    why: "Supported by dozens of faith communities, Faith Kitchen has served tens of thousands of meals with no questions or income verification.",
    url: "https://www.faithkitchendover.org/",
    image: ""
  },
  {
    week: "Week of February 17",
    org: "Mount Olive Food Pantry",
    location: "Budd Lake",
    focus: "Food Assistance",
    provides: ["Free supplemental groceries", "Essential household items", "Multiple weekly distributions"],
    giveback: ["Donate food or funds", "Volunteer"],
    why: "Partnering with local churches and community groups, the Mount Olive Food Pantry serves the Budd Lake area with dignity and care.",
    url: "https://mountolivepantry.org/",
    image: ""
  },
  {
    week: "Week of February 24",
    org: "St. Peter's Food Pantry",
    location: "Parsippany",
    focus: "Food Assistance",
    provides: ["Monthly grocery supply per household", "Canned goods, produce & dry staples"],
    giveback: ["Donate food or funds", "Volunteer"],
    why: "Located at St. Peter the Apostle Parish, this pantry provides a full month's worth of food to those experiencing food depletion.",
    url: "https://www.foodhelpline.org/resources/st-peter-s-food-pantry",
    image: ""
  },
  {
    week: "Week of March 3",
    org: "Randolph Food Pantry",
    location: "Randolph",
    focus: "Food Assistance",
    provides: ["Non-perishable grocery items", "Essential supplies by appointment"],
    giveback: ["Donate food or funds", "Volunteer"],
    why: "Operated by Randolph Township Community Services, this pantry serves residents in need with dignity and privacy.",
    url: "https://www.randolphnj.org/175/Randolph-Food-Pantry",
    image: ""
  },
  {
    week: "Week of March 10",
    org: "Rockaway Food Closet",
    location: "Rockaway",
    focus: "Food Assistance",
    provides: ["Non-perishable grocery distribution", "Regular pick-up & drop-off hours"],
    giveback: ["Donate non-perishable food", "Volunteer"],
    why: "Housed at First Presbyterian Church, the Rockaway Food Closet serves borough and township residents with warmth and community support.",
    url: "https://fpcrockaway.org/",
    image: ""
  },

  // ── DOMESTIC VIOLENCE ──
  {
    week: "Week of March 17",
    org: "Morris Family Justice Center",
    location: "Morristown",
    focus: "Domestic Violence Support",
    provides: ["Walk-in coordinated support", "Civil legal assistance", "Counseling & safety planning", "Children's services", "Immigration support with bilingual staff"],
    giveback: ["Donate to support survivors", "Spread awareness"],
    why: "One roof, multiple agencies — the Morris FJC means survivors don't have to navigate help alone.",
    url: "https://morrisfjc.org/",
    image: ""
  },
  {
    week: "Week of March 24",
    org: "Jersey Battered Women's Service (JBWS)",
    location: "Morristown",
    focus: "Domestic Violence Support",
    provides: ["24/7 crisis hotline", "Emergency shelter", "Court & legal advocacy", "Safety planning & counseling", "Support groups & prevention education"],
    giveback: ["Donate funds or supplies", "Volunteer", "Call 1-877-782-2873 to refer someone"],
    why: "JBWS is Morris County's leading DV nonprofit, offering free, confidential services to people of all backgrounds.",
    url: "https://jbws.org/",
    image: ""
  },
 
];
(function () {

    /* ── DOM refs ── */
    var grid     = document.getElementById('highlightsGrid');
    var backdrop = document.getElementById('modalBackdrop');
    var lastFocused;

    /* ── Build cards ── */
    HIGHLIGHTS.forEach(function (o) {
        var card = document.createElement('article');
        card.className = 'h-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', o.org + ' — click to expand');

        card.innerHTML =
            '<div class="h-card-body">' +
                '<span class="card-week">' + o.week + '</span>' +
                '<div class="card-org">' + o.org + '</div>' +
                '<div class="card-location">' +
                    '<svg width="9" height="12" viewBox="0 0 10 13" fill="none" aria-hidden="true">' +
                        '<path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 8 5 8s5-4.25 5-8c0-2.76-2.24-5-5-5zm0 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="currentColor"/>' +
                    '</svg>' +
                    o.location +
                '</div>' +
                '<span class="card-focus">' + o.focus + '</span>' +
                '<p class="card-why">' + o.why + '</p>' +
            '</div>' +
            '<div class="card-footer">' +
                '<span class="card-cta">View details ↗</span>' +
            '</div>';

        card.addEventListener('click', function () { openModal(o, card); });
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(o, card);
            }
        });

        grid.appendChild(card);
    });

    /* ── Open modal ── */
    function openModal(o, triggerEl) {
        lastFocused = triggerEl || document.activeElement;

        document.getElementById('modalWeek').textContent     = o.week;
        document.getElementById('modalOrgName').textContent  = o.org;
        document.getElementById('modalLocation').textContent = o.location;
        document.getElementById('modalFocus').textContent    = o.focus;
        document.getElementById('modalWhy').textContent      = o.why;

        document.getElementById('modalProvides').innerHTML =
            o.provides.map(function (p) { return '<li>' + p + '</li>'; }).join('');

        document.getElementById('modalGiveback').innerHTML =
            o.giveback.map(function (g) { return '<li>' + g + '</li>'; }).join('');

            document.getElementById('modalGiveback').innerHTML =
    o.giveback.map(function (g) { return '<li>' + g + '</li>'; }).join('');

/* 🔗 ADD THIS RIGHT HERE */
const visitBtn = document.getElementById('modalVisitBtn');

if (o.url) {
    visitBtn.href = o.url;
    visitBtn.style.display = 'inline-block';
} else {
    visitBtn.style.display = 'none';
}
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';

        /* Focus the close button for accessibility */
        var closeBtn = document.getElementById('modalClose');
        if (closeBtn) closeBtn.focus();
    }

    /* ── Close modal ── */
    function closeModal() {
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    }

    /* ── Event listeners ── */
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);

    /* Click outside modal content to close */
    backdrop.addEventListener('click', function (e) {
        if (e.target === backdrop) closeModal();
    });

    /* Escape key to close */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && backdrop.classList.contains('open')) closeModal();
    });

})();
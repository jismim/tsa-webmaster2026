/* hello, please put code in here */
/* ============================================================
   CAREMAP MORRIS — Highlights Page JavaScript
   Handles: card rendering, modal open/close
============================================================ */

const HIGHLIGHTS = [
  // ── FOOD PANTRIES ──
   // ── WEEK 1 — Food Assistance ──
    {
    week: "Week of March 24",
    org: "ArcMorris",
    location: "Morris Plains",
    focus: "Disability Services",
    provides: ["Residential group homes & supervised apartments", "Day habilitation & employment training", "Youth transition programs", "Family support services", "Recreational activities"],
    giveback: ["Volunteer with program participants", "Donate to support independence"],
    why: "With over 70 years of service, ArcMorris helps individuals with intellectual and developmental disabilities build life skills and active community participation.",
    url: "https://arcmorris.org/",
    image: ""
  },
    {
    week: "Week of March 17",
    org: "CASA of Morris & Sussex Counties",
    location: "Cedar Knolls",
    focus: "Child Advocacy",
    provides: ["Court-appointed advocates for children in foster care", "One-on-one volunteer advocacy", "Recommendations to family court", "Support for abused & neglected children"],
    giveback: ["Become a CASA volunteer advocate", "Donate to support child advocacy"],
    why: "CASA volunteers are trained community members who speak up for the best interests of vulnerable children during difficult court proceedings.",
    url: "https://www.casamsc.org/",
    image: ""
  },
   {
    week: "Week of March 10",
    org: "Family Promise of Morris County",
    location: "Morristown",
    focus: "Family Homelessness",
    provides: ["Emergency shelter (motel model)", "Day-center resource hub", "Case management", "Transitional housing", "Long-term housing assistance"],
    giveback: ["Volunteer through your congregation or group", "Donate to support families in crisis"],
    why: "Family Promise works with a network of 75+ local congregations to help families move from homelessness to permanent stability.",
    url: "https://www.familypromisemorris.org/",
    image: ""
  },
    {
    week: "Week of March 3",
    org: "Literacy Volunteers of Morris County",
    location: "Morristown",
    focus: "Education & Literacy",
    provides: ["Free one-on-one & small group ESL tutoring", "GED preparation", "Citizenship support", "Trained volunteer tutors", "Programs across 40+ communities"],
    giveback: ["Become a volunteer tutor", "Donate to support adult learners"],
    why: "Literacy Volunteers connects adult learners with free tutoring to build English skills, confidence, and opportunities in everyday life and work.",
    url: "https://www.lvmorris.org/",
    image: ""
  },
   {
    week: "Week of February 24",
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
    week: "Week of February 10",
    org: "DAWN Center for Independent Living",
    location: "Denville",
    focus: "Disability Services",
    provides: ["Advocacy, information & referrals", "Peer support groups", "Independent living skills training", "Employment readiness programs", "Youth transition support"],
    giveback: ["Volunteer with DAWN", "Donate to support independent living programs"],
    why: "DAWN empowers individuals with disabilities across Morris, Sussex, and Warren counties to define their own goals and live fully in their communities.",
    url: "https://dawncil.org/",
    image: ""
  },
  {
    week: "Week of February 3",
    org: "Nourish NJ",
    location: "Morristown & Dover",
    focus: "Hunger Relief",
    provides: ["Daily healthy meals", "Farmers markets", "Bilingual SNAP/WIC assistance", "Fresh produce distributions", "Housing stability support"],
    giveback: ["Volunteer at food distributions", "Donate", "Help with meal prep & community events"],
    why: "Nourish NJ tackles hunger and its root causes — no income verification, welcoming to all — at multiple Morris County locations.",
    url: "https://www.nourishnj.org/",
    image: ""
  },

  {
    week: "Week of January 27",
    org: "Cornerstone Family Programs",
    location: "Morristown",
    focus: "Youth & Family Services",
    provides: ["Preschool & before/after school care", "Summer camps", "Teen enrichment & college prep", "Mental health workshops", "Mentorship & community connections"],
    giveback: ["Volunteer as a mentor", "Donate to support youth programs"],
    why: "Cornerstone provides children and teens with educational, recreational, and personal growth opportunities in a safe, nurturing environment.",
    url: "https://cornerstonefamilyprograms.org/",
    image: ""
  },

  {
    week: "Week of January 20",
    org: "Market Street Mission",
    location: "Morristown",
    focus: "Homeless Services",
    provides: ["Overnight emergency shelter", "Free daily meals", "Showers & personal hygiene facilities", "Counseling & recovery programs", "Life skills support & clothing assistance"],
    giveback: ["Donate clothing, food, or funds", "Volunteer at the Mission"],
    why: "Serving the community since 1889, Market Street Mission provides safe shelter, nourishment, and holistic support to help people move from crisis to stability.",
    url: "https://www.marketstreet.org/",
    image: ""
  },

   {
    week: "Week of January 13",
    org: "Jersey Battered Women's Service (JBWS)",
    location: "Morristown",
    focus: "Domestic Violence Support",
    provides: ["24/7 crisis hotline", "Emergency shelter", "Court & legal advocacy", "Safety planning & counseling", "Support groups & prevention education"],
    giveback: ["Donate funds or supplies", "Volunteer", "Call 1-877-782-2873 to refer someone"],
    why: "JBWS is Morris County's leading DV nonprofit, offering free, confidential services to people of all backgrounds.",
    url: "https://jbws.org/",
    image: ""
  },

  {
    week: "Week of March 24",
    org: "ArcMorris",
    location: "Morris Plains",
    focus: "Disability Services",
    provides: ["Residential group homes & supervised apartments", "Day habilitation & employment training", "Youth transition programs", "Family support services", "Recreational activities"],
    giveback: ["Volunteer with program participants", "Donate to support independence"],
    why: "With over 70 years of service, ArcMorris helps individuals with intellectual and developmental disabilities build life skills and active community participation.",
    url: "https://arcmorris.org/",
    image: ""
  },
    {
    week: "Week of March 17",
    org: "CASA of Morris & Sussex Counties",
    location: "Cedar Knolls",
    focus: "Child Advocacy",
    provides: ["Court-appointed advocates for children in foster care", "One-on-one volunteer advocacy", "Recommendations to family court", "Support for abused & neglected children"],
    giveback: ["Become a CASA volunteer advocate", "Donate to support child advocacy"],
    why: "CASA volunteers are trained community members who speak up for the best interests of vulnerable children during difficult court proceedings.",
    url: "https://www.casamsc.org/",
    image: ""
  },
   {
    week: "Week of March 10",
    org: "Family Promise of Morris County",
    location: "Morristown",
    focus: "Family Homelessness",
    provides: ["Emergency shelter (motel model)", "Day-center resource hub", "Case management", "Transitional housing", "Long-term housing assistance"],
    giveback: ["Volunteer through your congregation or group", "Donate to support families in crisis"],
    why: "Family Promise works with a network of 75+ local congregations to help families move from homelessness to permanent stability.",
    url: "https://www.familypromisemorris.org/",
    image: ""
  },
    {
    week: "Week of March 3",
    org: "Literacy Volunteers of Morris County",
    location: "Morristown",
    focus: "Education & Literacy",
    provides: ["Free one-on-one & small group ESL tutoring", "GED preparation", "Citizenship support", "Trained volunteer tutors", "Programs across 40+ communities"],
    giveback: ["Become a volunteer tutor", "Donate to support adult learners"],
    why: "Literacy Volunteers connects adult learners with free tutoring to build English skills, confidence, and opportunities in everyday life and work.",
    url: "https://www.lvmorris.org/",
    image: ""
  },
   {
    week: "Week of February 24",
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
    week: "Week of February 10",
    org: "DAWN Center for Independent Living",
    location: "Denville",
    focus: "Disability Services",
    provides: ["Advocacy, information & referrals", "Peer support groups", "Independent living skills training", "Employment readiness programs", "Youth transition support"],
    giveback: ["Volunteer with DAWN", "Donate to support independent living programs"],
    why: "DAWN empowers individuals with disabilities across Morris, Sussex, and Warren counties to define their own goals and live fully in their communities.",
    url: "https://dawncil.org/",
    image: ""
  },
  {
    week: "Week of February 3",
    org: "Nourish NJ",
    location: "Morristown & Dover",
    focus: "Hunger Relief",
    provides: ["Daily healthy meals", "Farmers markets", "Bilingual SNAP/WIC assistance", "Fresh produce distributions", "Housing stability support"],
    giveback: ["Volunteer at food distributions", "Donate", "Help with meal prep & community events"],
    why: "Nourish NJ tackles hunger and its root causes — no income verification, welcoming to all — at multiple Morris County locations.",
    url: "https://www.nourishnj.org/",
    image: ""
  },


  {
    week: "Week of January 27",
    org: "Cornerstone Family Programs",
    location: "Morristown",
    focus: "Youth & Family Services",
    provides: ["Preschool & before/after school care", "Summer camps", "Teen enrichment & college prep", "Mental health workshops", "Mentorship & community connections"],
    giveback: ["Volunteer as a mentor", "Donate to support youth programs"],
    why: "Cornerstone provides children and teens with educational, recreational, and personal growth opportunities in a safe, nurturing environment.",
    url: "https://cornerstonefamilyprograms.org/",
    image: ""
  },


  {
    week: "Week of January 20",
    org: "Market Street Mission",
    location: "Morristown",
    focus: "Homeless Services",
    provides: ["Overnight emergency shelter", "Free daily meals", "Showers & personal hygiene facilities", "Counseling & recovery programs", "Life skills support & clothing assistance"],
    giveback: ["Donate clothing, food, or funds", "Volunteer at the Mission"],
    why: "Serving the community since 1889, Market Street Mission provides safe shelter, nourishment, and holistic support to help people move from crisis to stability.",
    url: "https://www.marketstreet.org/",
    image: ""
  },


   {
    week: "Week of January 13",
    org: "Jersey Battered Women's Service (JBWS)",
    location: "Morristown",
    focus: "Domestic Violence Support",
    provides: ["24/7 crisis hotline", "Emergency shelter", "Court & legal advocacy", "Safety planning & counseling", "Support groups & prevention education"],
    giveback: ["Donate funds or supplies", "Volunteer", "Call 1-877-782-2873 to refer someone"],
    why: "JBWS is Morris County's leading DV nonprofit, offering free, confidential services to people of all backgrounds.",
    url: "https://jbws.org/",
    image: ""
  },


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

<<<<<<< Updated upstream


=======
>>>>>>> Stashed changes
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
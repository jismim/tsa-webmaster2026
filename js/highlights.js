/* hello, please put code in here */
/* ============================================================
   CAREMAP MORRIS — Highlights Page JavaScript
   Handles: card rendering, modal open/close
============================================================ */

const HIGHLIGHTS = [
    { week:"Week of Apr 20", name:"Zufall Health",                           location:"Dover",                focus:"Supportive Counseling & Crisis Referral",  why:"Integrates healthcare with housing and survivor support.",                                                      provides:["Behavioral health counseling","Crisis referrals","Domestic violence support connections"],                   giveback:["Support community health programs"] },
    { week:"Week of Apr 13", name:"Boonton United Methodist Food Pantry",    location:"Boonton",              focus:"Faith-Based Hunger Relief",                why:"Serves river-town communities with reliable food access.",                                                      provides:["Weekly grocery assistance","Emergency meal requests"],                                                        giveback:["Donate non-perishables","Volunteer distribution support"] },
    { week:"Week of Apr 6",  name:"Hope One",                                location:"Morris County Mobile", focus:"Crisis & Homeless Outreach",               why:"Brings services directly to residents experiencing crisis or homelessness.",                                   provides:["On-site mental health support","Recovery referrals","Emergency resource connection"],                        giveback:["Share resource information","Support outreach programs"] },
    { week:"Week of Mar 30", name:"Lincoln Park Food Pantry",                location:"Lincoln Park",         focus:"Community Hunger Relief",                  why:"Supports residents along the Pequannock River communities.",                                                    provides:["Monthly grocery distribution","Senior meal assistance"],                                                     giveback:["Donate shelf-stable goods","Volunteer distribution days"] },
    { week:"Week of Mar 23", name:"Roxbury Social Services",                 location:"Roxbury",              focus:"Emergency Housing Stabilization",          why:"Township-level intervention prevents larger housing crises.",                                                   provides:["Rental assistance referrals","Food assistance","Crisis case management"],                                    giveback:["Donate gift cards","Support local drives"] },
    { week:"Week of Mar 19", name:"Cornerstone Family Programs",             location:"Morris County",        focus:"Domestic Violence & Counseling",           why:"Strengthens survivor safety planning and long-term recovery.",                                                 provides:["Crisis counseling","Shelter coordination","Support groups"],                                                  giveback:["Volunteer event support","Donate essentials"] },
    { week:"Week of Mar 9",  name:"Mount Olive Cares",                       location:"Mount Olive",          focus:"Emergency Food & Housing Assistance",      why:"Expands access to crisis support in western Morris County.",                                                    provides:["Food pantry support","Emergency financial assistance referrals"],                                             giveback:["Donate grocery items","Support seasonal drives"] },
    { week:"Week of Mar 2",  name:"Market Street Mission",                   location:"Morristown",           focus:"Emergency Shelter & Recovery",             why:"Assists individuals experiencing homelessness and substance use recovery.",                                      provides:["Emergency shelter","Recovery programs","Daily meals"],                                                        giveback:["Donate clothing","Volunteer meal service"] },
    { week:"Week of Feb 23", name:"Kinnelon Food Pantry",                    location:"Kinnelon",             focus:"Northern Morris Hunger Relief",            why:"Supports suburban families quietly facing food insecurity.",                                                    provides:["Confidential grocery distribution","Holiday meal programs"],                                                 giveback:["Donate pantry staples","Volunteer sorting days"] },
    { week:"Week of Feb 16", name:"Salvation Army Morristown Corps",         location:"Morristown",           focus:"Meals & Emergency Assistance",             why:"Immediate stabilization for residents in crisis.",                                                             provides:["Daily meals","Emergency rent & utility assistance","Shelter referrals"],                                      giveback:["Volunteer meal prep","Donate food or essentials"] },
    { week:"Week of Feb 9",  name:"Legal Services of Northwest Jersey",      location:"Morristown",           focus:"Housing & Domestic Violence Legal",        why:"Prevents homelessness and protects survivors through legal intervention.",                                      provides:["Eviction defense","Restraining order guidance","Tenant rights advocacy"],                                    giveback:["Pro bono legal support","Volunteer outreach assistance"] },
    { week:"Week of Feb 2",  name:"Family Homelessness Prevention",          location:"Morris County",        focus:"Family Homelessness Prevention",           why:"Keeps families together during housing crises.",                                                               provides:["Temporary shelter","Rental assistance","Stabilization services"],                                             giveback:["Donate household supplies","Support fundraising efforts"] },
    { week:"Week of Jan 26", name:"Dover Area Interfaith Food Pantry",       location:"Dover",                focus:"Community-Based Food Relief",              why:"Serves multilingual families in western Morris County.",                                                       provides:["Weekly grocery distribution","Culturally responsive food access"],                                            giveback:["Donate pantry staples","Volunteer distribution days"] },
    { week:"Week of Jan 19", name:"Homeless Solutions",                      location:"Morristown",           focus:"Homelessness & Housing Support",           why:"Housing instability remains a challenge for working families even in affluent Morris County.",                 provides:["Emergency shelter","Transitional housing","Case management","Job readiness & life skills"],                  giveback:["Donate winter clothing","Volunteer for meal prep","Participate in awareness fundraisers"] },
    { week:"Week of Jan 12", name:"Jersey Battered Women's Service (JBWS)", location:"Morristown",           focus:"Domestic Violence & Emergency Shelter",    why:"Life-saving services for survivors and their children across Morris County.",                                   provides:["24/7 crisis hotline","Confidential emergency safe house","Counseling & safety planning","Legal advocacy"],    giveback:["Donate hygiene kits","Volunteer at awareness events","Support fundraising campaigns"] },
    { week:"Week of Jan 5",  name:"Interfaith Food Pantry Network",         location:"Parsippany",           focus:"Food Access — Countywide",                why:"Serves thousands of Morris County families facing rising food costs.",                                         provides:["Weekly grocery distributions","Mobile pantry events","SNAP enrollment support"],                             giveback:["Donate non-perishables","Volunteer warehouse sorting","Host a community food drive"] }
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
        card.setAttribute('aria-label', o.name + ' — click to expand');

        card.innerHTML =
            '<div class="h-card-body">' +
                '<span class="card-week">' + o.week + '</span>' +
                '<div class="card-org">' + o.name + '</div>' +
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
        document.getElementById('modalOrgName').textContent  = o.name;
        document.getElementById('modalLocation').textContent = o.location;
        document.getElementById('modalFocus').textContent    = o.focus;
        document.getElementById('modalWhy').textContent      = o.why;

        document.getElementById('modalProvides').innerHTML =
            o.provides.map(function (p) { return '<li>' + p + '</li>'; }).join('');

        document.getElementById('modalGiveback').innerHTML =
            o.giveback.map(function (g) { return '<li>' + g + '</li>'; }).join('');

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

const CareMapBookmarks = (function () {
  'use strict';

  /* ── Section keys ─────────────────────────────────────── */
  const SECTIONS = {
    SAVED:     'cm_bookmarks_saved',       // directory / resource cards
    GIVE_BACK: 'cm_bookmarks_giveback',    // donate-volunteer cards
  };

  /* ── Storage helpers ──────────────────────────────────── */
  function _read(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  }

  function _write(key, ids) {
    localStorage.setItem(key, JSON.stringify(ids));
  }

  /* ── Resolve section key ──────────────────────────────── */
  function _key(section) {
    // Accept either the raw key string or the SECTIONS object value
    return Object.values(SECTIONS).includes(section) ? section : SECTIONS.SAVED;
  }

  /* ── Core API ─────────────────────────────────────────── */
  function isSaved(id, section) {
    return _read(_key(section)).includes(Number(id));
  }

  function toggle(id, section) {
    const key   = _key(section);
    const ids   = _read(key);
    const numId = Number(id);
    const idx   = ids.indexOf(numId);
    if (idx === -1) { ids.push(numId); }
    else            { ids.splice(idx, 1); }
    _write(key, ids);
    updateAllBadges();
    return idx === -1; // true = just saved
  }

  function remove(id, section) {
    const key = _key(section);
    _write(key, _read(key).filter(i => i !== Number(id)));
    updateAllBadges();
  }

  function getSection(section) {
    return _read(_key(section));
  }

  function count(section) {
    if (section) return _read(_key(section)).length;
    // Both sections combined (deduplicated)
    const saved = new Set([
      ..._read(SECTIONS.SAVED),
      ..._read(SECTIONS.GIVE_BACK),
    ]);
    return saved.size;
  }

  /* ── Badge refresh ────────────────────────────────────── */
  /*
   * DROP-IN SNIPPET FOR OTHER PAGES:
   * ─────────────────────────────────────────────────────────
   * Add this anywhere after bookmarks.js loads to keep all
   * .bookmark-count badges in sync:
   *
   *   if (typeof CareMapBookmarks !== 'undefined') {
   *     CareMapBookmarks.updateAllBadges();
   *   }
   *
   * The badge elements must have class="bookmark-count".
   * The number shown is the combined total from both sections.
   * ─────────────────────────────────────────────────────────
   */
  function updateAllBadges() {
    const total = count(); // combined total
    document.querySelectorAll('.bookmark-count').forEach(function (el) {
      el.textContent   = total;
      el.style.display = total > 0 ? 'inline-flex' : 'none';
    });
  }

  /* ── Apply saved state to buttons on the page ─────────── */
  /*
   * Buttons must have:
   *   data-id="<resourceId>"
   *   data-section="cm_bookmarks_saved"  OR  "cm_bookmarks_giveback"
   * If data-section is omitted, defaults to SAVED.
   */
  function applyToPage() {
    document.querySelectorAll('.card-bookmark[data-id]').forEach(function (btn) {
      const id      = Number(btn.dataset.id);
      const section = btn.dataset.section || SECTIONS.SAVED;
      const saved   = isSaved(id, section);
      btn.classList.toggle('saved', saved);
      btn.textContent = saved ? '♥' : '♡';
      btn.setAttribute('aria-label', saved ? 'Unsave this organization' : 'Save this organization');
    });
    updateAllBadges();
  }

  /* ── Delegated global click handler ──────────────────── */
  function bindButtons() {
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.card-bookmark[data-id]');
      if (!btn) return;

      const id      = btn.dataset.id;
      const section = btn.dataset.section || SECTIONS.SAVED;
      const nowSaved = toggle(id, section);

      btn.classList.toggle('saved', nowSaved);
      btn.textContent = nowSaved ? '♥' : '♡';
      btn.setAttribute('aria-label', nowSaved ? 'Unsave this organization' : 'Save this organization');

      // Pop animation
      btn.classList.remove('bookmark-pop');
      void btn.offsetWidth;
      btn.classList.add('bookmark-pop');

      updateAllBadges();
    });
  }

  /* ── Expose ───────────────────────────────────────────── */
  return {
    SECTIONS,
    isSaved,
    toggle,
    remove,
    getSection,
    count,
    applyToPage,
    bindButtons,
    updateAllBadges,
  };
})();
/* ============================================================
   CAREMAP MORRIS — Bookmarks Module
   Persists saved resource IDs to localStorage.
   Usage: import or include BEFORE script.js
============================================================ */

const CareMapBookmarks = (function () {
  const STORAGE_KEY = 'cm_bookmarks';

  // ── Read all saved IDs ─────────────────────────────────
  function getAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  // ── Save IDs array back ────────────────────────────────
  function saveAll(ids) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }

  // ── Check if a resource is bookmarked ─────────────────
  function isSaved(id) {
    return getAll().includes(Number(id));
  }

  // ── Toggle bookmark — returns true if now saved ────────
  function toggle(id) {
    const ids = getAll();
    const numId = Number(id);
    const idx = ids.indexOf(numId);
    if (idx === -1) {
      ids.push(numId);
    } else {
      ids.splice(idx, 1);
    }
    saveAll(ids);
    return idx === -1; // true = just saved
  }

  // ── Remove a specific bookmark ─────────────────────────
  function remove(id) {
    saveAll(getAll().filter(i => i !== Number(id)));
  }

  // ── Get count ──────────────────────────────────────────
  function count() {
    return getAll().length;
  }

  // ── Apply saved state to all bookmark buttons on page ──
  // Call this on DOMContentLoaded to restore heart state
  function applyToPage() {
    document.querySelectorAll('.card-bookmark[data-id]').forEach(function (btn) {
      const id = Number(btn.dataset.id);
      if (isSaved(id)) {
        btn.classList.add('saved');
        btn.textContent = '♥';
        btn.setAttribute('aria-label', 'Unsave this organization');
      } else {
        btn.classList.remove('saved');
        btn.textContent = '♡';
        btn.setAttribute('aria-label', 'Save this organization');
      }
    });

    // Update badge counts
    document.querySelectorAll('.bookmark-count').forEach(function (el) {
      const c = count();
      el.textContent = c;
      el.style.display = c > 0 ? 'inline-flex' : 'none';
    });
  }

  // ── Wire click handlers to all bookmark buttons ────────
  function bindButtons() {
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.card-bookmark[data-id]');
      if (!btn) return;
      const nowSaved = toggle(btn.dataset.id);
      btn.classList.toggle('saved', nowSaved);
      btn.textContent = nowSaved ? '♥' : '♡';
      btn.setAttribute('aria-label', nowSaved ? 'Unsave this organization' : 'Save this organization');

      // Animate the heart
      btn.classList.remove('bookmark-pop');
      void btn.offsetWidth; // reflow
      btn.classList.add('bookmark-pop');

      // Update all count badges
      document.querySelectorAll('.bookmark-count').forEach(function (el) {
        const c = count();
        el.textContent = c;
        el.style.display = c > 0 ? 'inline-flex' : 'none';
      });
    });
  }

  return { getAll, isSaved, toggle, remove, count, applyToPage, bindButtons };
})();
// Home search: redirect into directory with query param (?q=...)
(function () {
  const form = document.getElementById("homeSearchForm");
  const input = document.getElementById("homeSearchInput");

  if (form && input) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = (input.value || "").trim();
      const url = q ? `directory.html?q=${encodeURIComponent(q)}` : "directory.html";
      window.location.href = url;
    });
  }
})();

// Stats counters
(function () {
  const counters = document.querySelectorAll(".count");
  if (!counters.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    counters.forEach((el) => (el.textContent = el.dataset.count || "0"));
    return;
  }

  function animateCount(el) {
    const target = Number(el.dataset.count || 0);
    const duration = 900; // ms
    const start = performance.now();

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const value = Math.floor(target * (0.15 + 0.85 * t));
      el.textContent = String(value);

      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = String(target);
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCount(el);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.35 }
  );

  counters.forEach((el) => observer.observe(el));
})();

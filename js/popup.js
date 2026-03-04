document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("firstTimeModal");
  const backdrop = document.getElementById("firstTimeBackdrop");
  const dismissBtn = document.getElementById("dismissModalBtn");
  const dismissX = document.getElementById("dismissModalX");

  if (!modal || !backdrop) return;

  const STORAGE_KEY = "caremap_first_time_dismissed_v1";

  function openModal() {
    modal.style.display = "grid"; // Explicitly show
    backdrop.style.display = "block";
    modal.removeAttribute("hidden");
    backdrop.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.style.display = "none"; // Explicitly hide
    backdrop.style.display = "none";
    modal.setAttribute("hidden", "");
    backdrop.setAttribute("hidden", "");
    document.body.style.overflow = "auto";
    localStorage.setItem(STORAGE_KEY, "true");
  }

  // Check storage
  if (localStorage.getItem(STORAGE_KEY) !== "true") {
    openModal();
  }

  // Use a single click listener for the modal area to catch the buttons
  modal.addEventListener("click", (e) => {
    // If the "Got it" button or "X" button is clicked
    if (e.target === dismissBtn || e.target === dismissX || dismissX.contains(e.target)) {
      closeModal();
    }
  });

  // Close when clicking the backdrop
  backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hasAttribute("hidden")) {
      closeModal();
    }
  });
});
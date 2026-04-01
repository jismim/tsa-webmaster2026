const API_BASE = "https://flvpf8iuu3.execute-api.us-east-1.amazonaws.com";

document.getElementById("submitForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const required = this.querySelectorAll("[required]");
  let valid = true;

  required.forEach((field) => {
    if (!field.value.trim()) {
      valid = false;
      field.style.borderColor = "#c0392b";
      field.addEventListener(
        "input",
        () => {
          field.style.borderColor = "";
        },
        { once: true }
      );
    }
  });

  if (!valid) {
    const first = this.querySelector('[required][style*="border-color"]');
    if (first) first.focus();
    return;
  }

  const services = Array.from(
    document.querySelectorAll('input[name="services"]:checked')
  ).map((el) => el.value);

  const donationNeeds = document.getElementById("donationNeeds")?.value.trim() || "";
  const volunteerRoles = document.getElementById("volunteerRoles")?.value.trim() || "";

  let rootFolders = Array.from(
  document.querySelectorAll('input[name="rootFolders"]:checked')
).map((el) => el.value);

if (!rootFolders.length) {
  rootFolders = ["resources"]; // default fallback
}
  const payload = {
    rootFolders,
    data: {
      title: document.getElementById("orgName").value.trim(),
      category: document.getElementById("orgType").value.trim(),
      town: "",
      address: document.getElementById("orgAddress").value.trim(),
      phone: document.getElementById("orgPhone").value.trim(),
      email: document.getElementById("orgEmail").value.trim(),
      website: document.getElementById("orgWebsite").value.trim(),
      hours: document.getElementById("orgHours").value.trim(),
      shortDesc: document.getElementById("orgDescription").value.trim(),
      longDesc: document.getElementById("orgDescription").value.trim(),
      tags: [],
      services,
      saves: 0,
      donationNeeds,
      volunteerRoles
    },
    submittedBy: {
      name: document.getElementById("submitterName")?.value.trim() || "",
      email: document.getElementById("submitterEmail")?.value.trim() || "",
      relation: document.getElementById("submitterRelation")?.value || "",
      notes: document.getElementById("additionalNotes")?.value.trim() || ""
    }
  };

  const submitButton = this.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = "Submitting...";

  try {
    const res = await fetch(`${API_BASE}/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Submission failed");
    }

    const banner = document.getElementById("successBanner");
    banner.classList.add("visible");

    const bannerTitle = banner.querySelector("strong");
    if (bannerTitle) {
      bannerTitle.textContent = `Submission received. Thank you! ID: 100${result.id}`;
    }

    document.querySelector(".form-card").style.display = "none";
    banner.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (err) {
    alert(`Error: ${err.message}`);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalText;
  }
});

(function () {
  'use strict';

  /* ── 1. Scroll Reveal ── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ── 2. FAQ Accordion ── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all other open items
      faqItems.forEach((other) => {
        if (other === item) return;
        const otherBtn = other.querySelector('.faq-q');
        const otherAns = other.querySelector('.faq-a');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        if (otherAns) {
          otherAns.classList.remove('open');
          otherAns.hidden = true;
        }
      });

      // Toggle current
      const nowOpen = !isOpen;
      btn.setAttribute('aria-expanded', String(nowOpen));

      if (nowOpen) {
        answer.hidden = false;
        // Tiny delay so "hidden" removal is painted before class adds height
        requestAnimationFrame(() => {
          requestAnimationFrame(() => answer.classList.add('open'));
        });
      } else {
        answer.classList.remove('open');
        // Wait for transition then hide for accessibility
        answer.addEventListener('transitionend', () => {
          if (!answer.classList.contains('open')) answer.hidden = true;
        }, { once: true });
      }
    });
  });

  /* ── 3. Ask-a-Question Form ── */
  const askForm = document.getElementById('askForm');
  const askSuccess = document.getElementById('askSuccess');

  if (askForm && askSuccess) {
    askForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = askForm.querySelector('#askEmail');
      const questionInput = askForm.querySelector('#askQuestion');

      if (!emailInput.value.trim() || !questionInput.value.trim()) {
        emailInput.reportValidity();
        questionInput.reportValidity();
        return;
      }

      // Simulate submission (replace with real backend/formspree/emailjs)
      const btn = askForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      setTimeout(() => {
        askForm.style.display = 'none';
        askSuccess.hidden = false;
      }, 800);
    });
  }

})();
// anohter resource button 
document.querySelector(".form-card").scrollIntoView({ behavior: "smooth" });
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("submitAnotherBtn");

  if (btn) {
    btn.addEventListener("click", () => {
      // reset form
      document.getElementById("submitForm").reset();

      // hide success banner
      document.getElementById("successBanner").classList.remove("visible");

      // show form again
      document.querySelector(".form-card").style.display = "block";

      // scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
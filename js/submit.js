document.getElementById('submitForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const required = this.querySelectorAll('[required]');
      let valid = true;
      required.forEach(function(field) {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#c0392b';
          field.addEventListener('input', function() { field.style.borderColor = ''; }, { once: true });
        }
      });
      if (!valid) {
        const first = this.querySelector('[required][style*="border-color"]');
        if (first) first.focus();
        return;
      }
      document.getElementById('successBanner').classList.add('visible');
      document.querySelector('.form-card').style.display = 'none';
      document.getElementById('successBanner').scrollIntoView({ behavior: 'smooth', block: 'center' });
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
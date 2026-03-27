
    const referenceTabs = document.querySelectorAll('.reference-tab');
    const referencesFrame = document.getElementById('referencesFrame');
    const activeRefLink = document.querySelector('.active-ref-link');

    referenceTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const pdf = tab.dataset.pdf;
        const title = tab.dataset.title;

        referenceTabs.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        referencesFrame.src = pdf;
        referencesFrame.title = title;
        activeRefLink.href = pdf;
      });
    });
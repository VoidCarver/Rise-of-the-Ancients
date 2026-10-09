/* navigation.js – Lightweight navigation helper for the ROTA site.
 * Handles mobile menu toggle, dropdown toggling on touch devices,
 * keyboard interactions (Escape), outside-click closing,
 * accessibility attributes, and the theme toggle.
 * It is intentionally lightweight and requires no external dependencies.
 */
(function () {
  /**
   * Initializes navigation once the nav element has been inserted.
   * @param {HTMLElement} nav The <nav> element that was injected.
   */
  function init(nav) {
    if (!nav) return;

    const toggleBtn = nav.querySelector('.nav-toggle');
    const menu = nav.querySelector('.menu');
    const submenuLinks = nav.querySelectorAll('a[aria-haspopup="true"]');

    /* ---------- Mobile menu toggle ---------- */
    if (toggleBtn && menu) {
      toggleBtn.addEventListener('click', function () {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        nav.classList.toggle('open');
      });

      /* Close menu when clicking outside */
      document.addEventListener('click', function (e) {
        if (!nav.contains(e.target) && nav.classList.contains('open')) {
          toggleBtn.setAttribute('aria-expanded', 'false');
          nav.classList.remove('open');
        }
      });

      /* Escape key closes menu and any open submenus */
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          toggleBtn.setAttribute('aria-expanded', 'false');
          nav.classList.remove('open');

          submenuLinks.forEach((link) => {
            link.setAttribute('aria-expanded', 'false');

            const li = link.parentElement;
            if (li && li.classList.contains('open')) {
              li.classList.remove('open');
            }
          });
        }
      });
    }

    /* ---------- Submenu toggle on mobile only ---------- */
    submenuLinks.forEach(function (link) {
      const li = link.parentElement;
      if (!li) return;

      link.addEventListener('click', function (e) {
        const isMobile = window.matchMedia('(max-width: 800px)').matches;

        if (!isMobile) {
          return;
        }

        const expanded = this.getAttribute('aria-expanded') === 'true';

        this.setAttribute('aria-expanded', String(!expanded));
        li.classList.toggle('open', !expanded);

        e.preventDefault();
      });
    });

    /* ---------- Theme selection ---------- */

    const lightButton = nav.querySelector('#theme-light');
    const darkButton = nav.querySelector('#theme-dark');

    if (lightButton && darkButton) {
      function setTheme(theme) {
        if (theme === 'light') {
          document.documentElement.setAttribute('data-theme', 'light');
        } else {
          document.documentElement.removeAttribute('data-theme');
          theme = 'dark';
        }

        localStorage.setItem('rota-theme', theme);

        /* Highlight the currently selected theme */
        lightButton.classList.toggle('active', theme === 'light');
        darkButton.classList.toggle('active', theme === 'dark');

        /* Accessibility state */
        lightButton.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        darkButton.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      }

      /* Restore saved theme */
      const savedTheme = localStorage.getItem('rota-theme') || 'dark';

      setTheme(savedTheme);

      /* Select light theme */
      lightButton.addEventListener('click', function () {
        setTheme('light');
      });

      /* Select dark theme */
      darkButton.addEventListener('click', function () {
        setTheme('dark');
      });
    }
  }

  /* Expose init globally */
  window.navigation = { init };
})();
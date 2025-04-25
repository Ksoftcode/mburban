(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

/**
 * Multi-Step Property Inquiry Form (survey-style)
 */
(function() {
  const form        = document.getElementById('inquiryForm');
  if (!form) return;

  const panels      = Array.from(form.querySelectorAll('.survey__panel'));
  const steps       = Array.from(form.querySelectorAll('.progressbar__step'));
  const progressbar = form.querySelector('.progressbar');
  const prev        = form.querySelector('[name="prev"]');
  const next        = form.querySelector('[name="next"]');
  const submit      = form.querySelector('[name="submit"]');
  let current       = 0;

  // seed --total-steps for CSS (if you have that)
  if (progressbar) {
    progressbar.style.setProperty('--total-steps', panels.length);
  }

  function showPanel(idx) {
    panels.forEach(p => p.classList.remove('survey__panel--current'));
    panels[idx].classList.add('survey__panel--current');

    steps.forEach((s,i) => s.classList.toggle('active', i <= idx));

    prev.disabled   = (idx === 0);
    next.disabled   = (idx === panels.length - 1);
    submit.disabled = (idx !== panels.length - 1);

    if (progressbar) {
      progressbar.style.setProperty('--active-step', idx + 1);
    }
  }

  prev.addEventListener('click', () => {
    if (current > 0) { current--; showPanel(current); }
  });

  next.addEventListener('click', () => {
    if (current < panels.length - 1) { current++; showPanel(current); }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    alert('Thank you! Your inquiry has been submitted.');
    form.reset();
    current = 0;
    showPanel(current);
  });

  // === NEW: compute & fix panel height once ===
  document.addEventListener('DOMContentLoaded', () => {
    // 1) Measure tallest “normal” panel (all except last)
    const normalPanels = panels.slice(0, -1);
    const maxH = normalPanels
      .map(p => p.scrollHeight)
      .reduce((a,b) => Math.max(a,b), 0);

    // 2) Lock those panels to that height, with scroll if overflow
    normalPanels.forEach(p => {
      p.style.height     = `${maxH}px`;
      p.style.overflowY  = 'auto';
    });

    // 3) Leave the last panel auto-sized (no extra space)
    const last = panels[panels.length - 1];
    last.style.height    = 'auto';
    last.style.overflowY = 'visible';

    // 4) Kick things off
    showPanel(current);
  });

    // Initialize intlTelInput on the phone field:
    const phoneInput = document.querySelector('#finalPhone');
    if (phoneInput && window.intlTelInput) {
      intlTelInput(phoneInput, {
        initialCountry: 'auto',
        geoIpLookup: (callback) => {
          // auto‐detect user country via IP (optional)
          fetch('https://ipinfo.io/json?token=6f758961c9b31e')
            .then(res => res.json())
            .then(data => callback(data.country))
            .catch(() => callback('us'));
        },
        utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@18/build/js/utils.js'
      });
    }
})();


})();
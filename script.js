// Smooth scroll assist and active link handling
(function(){
  const header = document.querySelector('.site-header');
  const nav = document.getElementById('site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelectorAll('#site-nav a');

  // Mobile nav toggle
  toggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav when clicking a link (mobile)
  links.forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }));

  // Active link based on section in view
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navById = new Map(Array.from(links).map(a => [a.getAttribute('href')?.slice(1), a]));

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = navById.get(id);
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

  sections.forEach(sec => activeObserver.observe(sec));

  // Reveal sections on scroll with hide animation
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-hidden');
        entry.target.classList.add('is-visible');
      } else {
        // Hide animation when scrolling past
        const rect = entry.target.getBoundingClientRect();
        if (rect.top < 0) {
          entry.target.classList.remove('is-visible');
          entry.target.classList.add('is-hidden');
        } else {
          // Reset if scrolling back up
          entry.target.classList.remove('is-visible', 'is-hidden');
        }
      }
    });
  }, { threshold: 0.15, rootMargin: '-10% 0px -10% 0px' });

  document.querySelectorAll('.section-observe').forEach(el => revealObserver.observe(el));

  // Offset scrolling using CSS scroll-margin in CSS; ensure header height updates if dynamic
  const updateScrollMargins = () => {
    const h = header?.offsetHeight || 0;
    document.querySelectorAll('section[id]').forEach(sec => {
      sec.style.scrollMarginTop = h + 'px';
    });
  };
  updateScrollMargins();
  window.addEventListener('resize', updateScrollMargins);

  // Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Contact form (no backend) – basic validation and mailto fallback
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !email || !message) {
      if (status) status.textContent = 'Please fill in all fields.';
      return;
    }

    const subject = encodeURIComponent('Portfolio Contact');
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    const mailto = `mailto:you@example.com?subject=${subject}&body=${body}`;
    window.location.href = mailto;
    if (status) status.textContent = 'Opening your email client...';
    form.reset();
  });

  // Hero image blink on hover/click
  const heroImage = document.querySelector('.hero-image');
  const heroVisual = document.querySelector('.hero-visual');
  if (heroImage) {
    let lastBlinkAt = 0;
    const triggerBlink = () => {
      const now = Date.now();
      if (now - lastBlinkAt < 450) return; // throttle rapid triggers
      lastBlinkAt = now;
      heroImage.classList.remove('blink');
      // reflow to restart animation
      void heroImage.offsetWidth;
      heroImage.classList.add('blink');
    };

    heroImage.addEventListener('click', triggerBlink);
    heroVisual?.addEventListener('mouseenter', triggerBlink);
  }
})();



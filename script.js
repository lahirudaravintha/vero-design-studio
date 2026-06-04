/* ============================================================
   VERO DESIGN STUDIO — interactions
   ============================================================ */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav scroll state ---------- */
  var nav = document.getElementById('nav');
  function onScrollNav() {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    if (mobileMenu) mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
  }
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      setMenu(!document.body.classList.contains('menu-open'));
    });
    mobileMenu.querySelectorAll('[data-mm]').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenu(false);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('[data-reveal], [data-reveal-line]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Parallax (hero + tagged images) ---------- */
  var heroImg = document.getElementById('heroImg');
  var paraEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var ticking = false;

  function applyParallax() {
    ticking = false;
    var vh = window.innerHeight;

    if (heroImg) {
      var hy = window.scrollY;
      if (hy < vh * 1.2) heroImg.style.transform = 'scale(1) translateY(' + (hy * 0.18) + 'px)';
    }
    paraEls.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > vh + 100) return;
      var center = rect.top + rect.height / 2;
      var offset = (center - vh / 2) / vh;
      var strength = parseFloat(el.getAttribute('data-parallax')) || 0.1;
      el.style.transform = 'translateY(' + (offset * strength * -140) + 'px) scale(1.06)';
    });
  }
  function requestParallax() {
    if (!ticking && !reduce) { ticking = true; requestAnimationFrame(applyParallax); }
  }
  if (!reduce) {
    applyParallax();
    window.addEventListener('scroll', requestParallax, { passive: true });
    window.addEventListener('resize', requestParallax);
  }

  /* ---------- Smooth anchor scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var navH = (nav && window.innerWidth <= 820) ? nav.getBoundingClientRect().height : 0;
      var y = target.getBoundingClientRect().top + window.pageYOffset - navH;
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Contact form (front-end only) ---------- */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = document.getElementById('formNote');
      var name = form.querySelector('#f-name');
      var email = form.querySelector('#f-email');
      if (!name.value.trim() || !email.value.trim()) {
        [name, email].forEach(function (f) {
          if (!f.value.trim()) {
            f.style.borderColor = '#ffd7c2';
            setTimeout(function () { f.style.borderColor = ''; }, 1600);
          }
        });
        return;
      }
      note.hidden = false;
      form.querySelector('.form__submit').textContent = 'Sent';
      setTimeout(function () { form.reset(); }, 400);
    });
  }
})();

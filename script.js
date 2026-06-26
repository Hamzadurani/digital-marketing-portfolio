/**
 * Digital Marketing Portfolio — JavaScript
 * Handles animations, navigation, and interactive features
 */

(function () {
  'use strict';

  /* --- DOM Elements --- */
  const loader = document.getElementById('loader');
  const header = document.getElementById('header');
  const navMenu = document.getElementById('navMenu');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');
  const cursorGlow = document.getElementById('cursorGlow');
  const hero = document.querySelector('.hero');

  const revealElements = document.querySelectorAll('.reveal, .fade-up, .slide-left, .slide-right, .zoom-in');
  const sections = document.querySelectorAll('section[id]');

  let statsCountersAnimated = false;

  /* --- Loading Screen --- */
  function initLoader() {
    document.body.classList.add('loading');

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');

        if (hero) {
          hero.classList.add('loaded');
        }
      }, 2000);
    });
  }

  /* --- Sticky Navbar --- */
  function initStickyNav() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  /* --- Mobile Menu Toggle --- */
  function initMobileMenu() {
    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', isActive);
      document.body.classList.toggle('nav-open', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Smooth Scrolling --- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* --- Active Menu Highlighting --- */
  function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach((link) => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* --- Scroll Progress Bar --- */
  function initScrollProgress() {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = `${progress}%`;
    });
  }

  /* --- Back to Top Button --- */
  function initBackToTop() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Scroll Reveal (Intersection Observer) --- */
  function initScrollReveal() {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => {
      if (!el.closest('.hero')) {
        observer.observe(el);
      }
    });
  }

  /* --- Animated Counters --- */
  function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const startTime = performance.now();
    const suffix = element.dataset.suffix || '';

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);

      element.textContent = current.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  function initStatsCounters() {
    const statsSection = document.getElementById('stats');
    if (!statsSection || statsCountersAnimated) return;

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            statsCountersAnimated = true;

            statsSection.querySelectorAll('.stat-number').forEach((stat, index) => {
              const target = parseInt(stat.dataset.target, 10);
              if (!isNaN(target)) {
                setTimeout(() => {
                  animateCounter(stat, target, 2000);
                }, index * 150);
              }
            });

            statsObserver.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    statsObserver.observe(statsSection);
  }

  /* --- Skill Bars (About Page) --- */
  function initSkillBars() {
    const skillsSection = document.querySelector('.about-skills');
    if (!skillsSection) return;

    const fills = skillsSection.querySelectorAll('.skill-fill');
    fills.forEach((fill) => {
      fill.dataset.targetWidth = fill.style.width;
      fill.style.width = '0';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fills.forEach((fill, index) => {
              setTimeout(() => {
                fill.style.width = fill.dataset.targetWidth;
              }, index * 100);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(skillsSection);
  }

  /* --- FAQ Accordion --- */
  function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item) => {
      const question = item.querySelector('.faq-question');

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        faqItems.forEach((other) => {
          other.classList.remove('active');
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* --- Contact Form --- */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const successMsg = document.getElementById('formSuccess');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const name = data.get('fullName');
      const email = data.get('email');
      const phone = data.get('phone') || 'Not provided';
      const service = data.get('service');
      const details = data.get('details');

      const subject = encodeURIComponent(`Project Inquiry — ${service}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\nProject Details:\n${details}`
      );

      window.location.href = `mailto:Amirhamzaprofessional@gmail.com?subject=${subject}&body=${body}`;

      if (successMsg) {
        successMsg.hidden = false;
        form.reset();
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  /* --- Cursor Glow Effect (Desktop) --- */
  function initCursorGlow() {
    if (window.matchMedia('(max-width: 768px)').matches) return;

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;

      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;

      requestAnimationFrame(animateGlow);
    }

    animateGlow();
  }

  /* --- Initialize All Features --- */
  function init() {
    initLoader();
    initStickyNav();
    initMobileMenu();
    initSmoothScroll();
    initActiveNav();
    initScrollProgress();
    initBackToTop();
    initScrollReveal();
    initStatsCounters();
    initSkillBars();
    initFaq();
    initContactForm();
    initCursorGlow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

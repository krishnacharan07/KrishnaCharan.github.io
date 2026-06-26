// Hero entrance animation
(function() {
  const elements = [
    { selector: '.hero-eyebrow', delay: 0 },
    { selector: '.hero-name', delay: 0.15 },
    { selector: '.hero-title', delay: 0.3 },
    { selector: '.hero-sub', delay: 0.45 },
    { selector: '.hero-tags', delay: 0.6 },
    { selector: '.hero-actions', delay: 0.75 },
    { selector: '.hero-socials', delay: 0.9 },
    { selector: '.hero-visual', delay: 0.2 },
  ];

  elements.forEach(({ selector, delay }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`;
  });

  window.addEventListener('load', () => {
    elements.forEach(({ selector, delay }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, delay * 1000);
    });
  });
})();

function toggleMenu() {
  const menu = document.querySelector('.menu-links');
  const icon = document.querySelector('.hamburger-icon');
  menu.classList.toggle('open');
  icon.classList.toggle('open');
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.section-label, .about-card, .timeline-item, .project-full'
).forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 0.08 + 's';
  observer.observe(el);
});

document.querySelectorAll('.nav-links a, .menu-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.menu-links')?.classList.remove('open');
    document.querySelector('.hamburger-icon')?.classList.remove('open');
  });
});

window.addEventListener('scroll', () => {
  const nav = document.getElementById('desktop-nav') || document.getElementById('hamburger-nav');
  if (window.scrollY > 20) {
    nav?.classList.add('scrolled');
  } else {
    nav?.classList.remove('scrolled');
  }
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => sectionObserver.observe(section));

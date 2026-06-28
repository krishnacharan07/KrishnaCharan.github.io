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

// Typing cursor on hero title
(function() {
  const titleEl = document.querySelector('.hero-title');
  if (!titleEl) return;
  const fullText = titleEl.textContent;
  titleEl.textContent = '';
  titleEl.style.opacity = '1';
  titleEl.style.transform = 'none';

  const cursor = document.createElement('span');
  cursor.textContent = '|';
  cursor.style.cssText = 'color:var(--accent);animation:blink 1s step-end infinite;margin-left:1px;';
  titleEl.appendChild(cursor);

  const style = document.createElement('style');
  style.textContent = '@keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}';
  document.head.appendChild(style);

  let i = 0;
  const speed = 40;
  function type() {
    if (i < fullText.length) {
      titleEl.insertBefore(document.createTextNode(fullText[i]), cursor);
      i++;
      setTimeout(type, speed);
    } else {
      setTimeout(() => { cursor.style.animation = 'none'; cursor.style.opacity = '0'; }, 2000);
    }
  }
  setTimeout(type, 800);
})();

// Architecture diagram arrow animation
const diagObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const diag = entry.target;
    if (diag.dataset.animated) return;
    diag.dataset.animated = 'true';
    const nodes = diag.querySelectorAll('.arch-node');
    const arrows = diag.querySelectorAll('.arch-arrow');
    nodes.forEach((node, i) => {
      node.style.opacity = '0';
      node.style.transform = 'translateY(8px)';
      node.style.transition = `opacity 0.4s ease ${i * 0.12}s, transform 0.4s ease ${i * 0.12}s`;
      setTimeout(() => {
        node.style.opacity = '1';
        node.style.transform = 'translateY(0)';
      }, i * 120);
    });
    arrows.forEach((arrow, i) => {
      arrow.style.opacity = '0';
      arrow.style.transition = `opacity 0.3s ease ${i * 0.12 + 0.1}s`;
      setTimeout(() => {
        arrow.style.opacity = '1';
      }, i * 120 + 100);
    });
    diagObserver.unobserve(diag);
  });
}, { threshold: 0.2 });

document.querySelectorAll('.project-arch-diagram').forEach(diag => {
  diag.querySelectorAll('.arch-node, .arch-arrow').forEach(el => {
    el.style.opacity = '0';
  });
  diagObserver.observe(diag);
});

// Contact items staggered entrance
const contactObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const section = entry.target;
    if (section.dataset.animated) return;
    section.dataset.animated = 'true';
    const items = section.querySelectorAll('.contact-item');
    items.forEach((item, i) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(16px)';
      item.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, i * 100);
    });
    contactObserver.unobserve(section);
  });
}, { threshold: 0.2 });

const contactSection = document.querySelector('#contact');
if (contactSection) {
  contactSection.querySelectorAll('.contact-item').forEach(item => {
    item.style.opacity = '0';
  });
  contactObserver.observe(contactSection);
}

// Skills section count badge
const skillsSection = document.querySelector('#skills');
if (skillsSection) {
  const badge = document.createElement('p');
  badge.textContent = '6 categories · 35 tools';
  badge.style.cssText = 'font-size:12px;color:var(--text-dim);margin-top:-36px;margin-bottom:36px;opacity:0;transition:opacity 0.6s ease 0.3s;';
  const title = skillsSection.querySelector('.title');
  if (title) title.after(badge);

  const skillsBadgeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        badge.style.opacity = '1';
        skillsBadgeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillsBadgeObserver.observe(skillsSection);
}

// Animated number counters
function animateCounter(el, target, duration, suffix) {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    if (target >= 1000000000) {
      el.textContent = (start / 1000000000).toFixed(1) + 'B' + suffix;
    } else if (target >= 1000000) {
      el.textContent = (start / 1000000).toFixed(0) + 'M' + suffix;
    } else {
      el.textContent = Math.floor(start) + suffix;
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;
    const raw = el.dataset.target;
    const suffix = el.dataset.suffix || '';
    if (entry.isIntersecting) {
      const duration = parseFloat(raw) >= 1000000000 ? 3000 : 1500;
      animateCounter(el, parseFloat(raw), duration, suffix);
    } else {
      el.textContent = '0' + suffix;
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

// Staggered project card entrance
const projectObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const card = entry.target;
    if (card.dataset.animated) return;
    card.dataset.animated = 'true';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
    projectObserver.unobserve(card);
  });
}, { threshold: 0.08 });

document.querySelectorAll('.project-full').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(40px)';
  card.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
  projectObserver.observe(card);
});

// Staggered timeline entrance
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const item = entry.target;
    if (item.dataset.animated) return;
    item.dataset.animated = 'true';
    item.style.opacity = '1';
    item.style.transform = 'translateX(0)';
    timelineObserver.unobserve(item);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.timeline-item').forEach((item, i) => {
  item.style.opacity = '0';
  item.style.transform = 'translateX(-20px)';
  item.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
  timelineObserver.observe(item);
});

// Staggered skill category entrance
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const cat = entry.target;
    if (cat.dataset.animated) return;
    cat.dataset.animated = 'true';
    cat.style.opacity = '1';
    cat.style.transform = 'translateY(0) scale(1)';
    skillObserver.unobserve(cat);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.skill-category').forEach((cat, i) => {
  cat.style.opacity = '0';
  cat.style.transform = 'translateY(20px) scale(0.98)';
  cat.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
  skillObserver.observe(cat);
});

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

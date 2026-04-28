// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile burger menu
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'סגור תפריט' : 'פתח תפריט');
});
mobileMenu.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  })
);

// Dropdown — hover with delay so it doesn't vanish when moving to items
const dropdowns = document.querySelectorAll('.nav__has-dropdown');
dropdowns.forEach(li => {
  let closeTimer = null;

  const open = () => {
    clearTimeout(closeTimer);
    // Close all others first
    dropdowns.forEach(other => { if (other !== li) other.classList.remove('is-open'); });
    li.classList.add('is-open');
    const btn = li.querySelector('.nav__dd-trigger');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  };

  const close = () => {
    closeTimer = setTimeout(() => {
      li.classList.remove('is-open');
      const btn = li.querySelector('.nav__dd-trigger');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }, 180); // 180ms grace period
  };

  li.addEventListener('mouseenter', open);
  li.addEventListener('mouseleave', close);

  // Keep open when hovering dropdown panel
  const panel = li.querySelector('.nav__dropdown');
  if (panel) {
    panel.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    panel.addEventListener('mouseleave', close);
  }

  // Click trigger to toggle (keyboard/touch)
  const btn = li.querySelector('.nav__dd-trigger');
  if (btn) {
    btn.addEventListener('click', () => {
      li.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', li.classList.contains('is-open'));
    });
  }
});

// Close dropdowns on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.nav__has-dropdown')) {
    dropdowns.forEach(li => li.classList.remove('is-open'));
  }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ===== ROTATING WORD IN HERO =====
const words = ['חנויות', 'מסעדות', 'קליניקות', 'נדל"ן', 'סטארטאפים', 'עסקים'];
let wordIndex = 0;
const wordEl = document.getElementById('rotatingWord');
const wordWrap = wordEl.closest('.rotating-word-wrap');

// Lock wrap width to the widest word — measured in-place so font size is exact
(function lockWrapWidth() {
  let maxW = 0;
  const orig = wordEl.textContent;
  words.forEach(w => {
    wordEl.textContent = w;
    maxW = Math.max(maxW, wordEl.scrollWidth);
  });
  wordEl.textContent = orig;
  wordWrap.style.width = maxW + 'px';
  wordWrap.style.textAlign = 'center';
})();

function rotateWord() {
  wordEl.classList.remove('enter');
  wordEl.classList.add('exit');

  setTimeout(() => {
    wordIndex = (wordIndex + 1) % words.length;
    wordEl.textContent = words[wordIndex];
    wordEl.classList.remove('exit');
    wordEl.classList.add('enter');
  }, 350);
}

setInterval(rotateWord, 2400);


// ===== FADE-IN ON SCROLL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.service-card, .process__step, .testi-card, .why__feature, .section-header, .about__text, .contact__info'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ===== ANIMATED COUNTERS =====
function animateCounter(el, target, prefix = '', suffix = '') {
  let start = null;
  const duration = 1800;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    el.textContent = prefix + Math.floor(eased * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat__num').forEach(el => {
      const raw = el.textContent.trim();
      if (raw.includes('%')) animateCounter(el, parseInt(raw), '+', '%');
      else if (raw.startsWith('+')) animateCounter(el, parseInt(raw.replace('+', '')), '+', '');
    });
    statsObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });

const heroStats = document.querySelector('.hero__stats');
if (heroStats) statsObserver.observe(heroStats);

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = '✓ נשלח בהצלחה! נחזור אליכם בקרוב';
  btn.style.background = '#22C55E';
  btn.style.color = '#fff';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
    btn.style.color = '';
    btn.disabled = false;
    e.target.reset();
  }, 4000);
});

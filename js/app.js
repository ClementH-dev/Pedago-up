// ── Burger menu ────────────────────────────────────────────
const burger = document.getElementById('burger');
const nav = document.getElementById('nav-menu');

burger?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(isOpen));
  burger.setAttribute('aria-label', isOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation');
  burger.querySelectorAll('span').forEach((s, i) => {
    s.style.transform = isOpen
      ? i === 0 ? 'translateY(7px) rotate(45deg)'
        : i === 1 ? 'scaleX(0)'
        : 'translateY(-7px) rotate(-45deg)'
      : '';
  });
});

nav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    nav.classList.remove('open');
    burger?.setAttribute('aria-expanded', 'false');
    burger?.setAttribute('aria-label', 'Ouvrir le menu de navigation');
    burger?.querySelectorAll('span').forEach(s => s.style.transform = '');
  });
});

// ── Testimonial slider ─────────────────────────────────────
const slides = document.querySelectorAll('.testimonial-slide');
const dots   = document.querySelectorAll('.dot');
let current  = 0;
let autoTimer;

function goTo(idx) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  dots[current].setAttribute('aria-pressed', 'false');
  current = (idx + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
  dots[current].setAttribute('aria-pressed', 'true');
}

function startAuto() {
  autoTimer = setInterval(() => goTo(current + 1), 5000);
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    clearInterval(autoTimer);
    goTo(+dot.dataset.index);
    startAuto();
  });
});

if (slides.length) startAuto();


// ── FAQ accordion ──────────────────────────────────────────
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq__item');
    const answer = item.querySelector('.faq__answer');
    const open   = btn.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.faq__question').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.closest('.faq__item').querySelector('.faq__answer').classList.remove('open');
    });

    if (!open) {
      btn.setAttribute('aria-expanded', 'true');
      answer.classList.add('open');
    }
  });
});

// ── Navbar highlight on scroll ─────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar__nav a');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => {
        a.style.color = '';
        a.removeAttribute('aria-current');
      });
      const active = document.querySelector(`.navbar__nav a[href="#${entry.target.id}"]`);
      if (active) {
        active.style.color = 'var(--blue)';
        active.setAttribute('aria-current', 'true');
      }
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

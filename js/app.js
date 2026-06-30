// ── Burger menu ────────────────────────────────────────────
const burger = document.getElementById('burger');
const nav = document.getElementById('nav-menu');
const pageContent = document.querySelectorAll('main, footer');

function setPageInert(isInert) {
  pageContent.forEach(element => {
    if (isInert) {
      element.setAttribute('inert', '');
      element.setAttribute('aria-hidden', 'true');
    } else {
      element.removeAttribute('inert');
      element.removeAttribute('aria-hidden');
    }
  });
}

function setBurgerIcon(isOpen) {
  burger?.querySelectorAll('span').forEach((span, index) => {
    span.style.transform = isOpen
      ? index === 0 ? 'translateY(7px) rotate(45deg)'
        : index === 1 ? 'scaleX(0)'
          : 'translateY(-7px) rotate(-45deg)'
      : '';
  });
}

function closeMenu({ restoreFocus = false } = {}) {
  nav?.classList.remove('open');
  document.body.classList.remove('menu-open');
  setPageInert(false);
  burger?.setAttribute('aria-expanded', 'false');
  burger?.setAttribute('aria-label', 'Ouvrir le menu de navigation');
  setBurgerIcon(false);
  if (restoreFocus) burger?.focus();
}

function openMenu() {
  nav?.classList.add('open');
  document.body.classList.add('menu-open');
  setPageInert(true);
  burger?.setAttribute('aria-expanded', 'true');
  burger?.setAttribute('aria-label', 'Fermer le menu de navigation');
  setBurgerIcon(true);
  nav?.querySelector('a')?.focus();
}

burger?.addEventListener('click', () => {
  const isOpen = burger.getAttribute('aria-expanded') === 'true';
  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

document.addEventListener('keydown', event => {
  if (burger?.getAttribute('aria-expanded') !== 'true') return;

  if (event.key === 'Escape') {
    event.preventDefault();
    closeMenu({ restoreFocus: true });
    return;
  }

  if (event.key !== 'Tab') return;

  const focusableElements = [burger, ...nav.querySelectorAll('a')].filter(Boolean);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstFocusable) {
    event.preventDefault();
    lastFocusable.focus();
  } else if (!event.shiftKey && document.activeElement === lastFocusable) {
    event.preventDefault();
    firstFocusable.focus();
  }
});

window.matchMedia('(min-width: 769px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => closeMenu());
});

// ── Testimonial slider ─────────────────────────────────────
const slider = document.getElementById('testimonialSlider');
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
const toggle = document.getElementById('testimonialToggle');
const prevBtn = document.getElementById('testimonialPrev');
const nextBtn = document.getElementById('testimonialNext');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function getScrollOffset() {
  const navbar = document.querySelector('.navbar');
  return (navbar?.offsetHeight ?? 0) + 24;
}

function focusAnchorTarget(target) {
  if (!target.hasAttribute('tabindex')) {
    target.setAttribute('tabindex', '-1');
  }
  target.focus({ preventScroll: true });
}

document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(link => {
  link.addEventListener('click', event => {
    const targetId = decodeURIComponent(link.hash.slice(1));
    const target = document.getElementById(targetId);

    if (!target) return;

    event.preventDefault();
    closeMenu();
    focusAnchorTarget(target);

    const top = targetId === 'top'
      ? 0
      : target.getBoundingClientRect().top + window.scrollY - getScrollOffset();

    window.scrollTo({
      top: Math.max(0, top),
      behavior: reducedMotion.matches ? 'auto' : 'smooth',
    });

    history.pushState(null, '', link.hash);
  });
});

window.addEventListener('load', () => {
  if (!window.location.hash) return;

  const targetId = decodeURIComponent(window.location.hash.slice(1));
  const target = document.getElementById(targetId);

  if (!target) return;

  requestAnimationFrame(() => {
    focusAnchorTarget(target);

    const top = targetId === 'top'
      ? 0
      : target.getBoundingClientRect().top + window.scrollY - getScrollOffset();

    window.scrollTo({
      top: Math.max(0, top),
      behavior: 'auto',
    });
  });
});

let focusedSectionId = '';

document.addEventListener('focusin', event => {
  const focusedElement = event.target;
  if (!(focusedElement instanceof HTMLElement)) return;
  if (!focusedElement.matches('a, button, input, textarea, select, [tabindex]')) return;

  const section = focusedElement.closest('section[id]');
  if (!section) return;

  if (section.id === focusedSectionId) return;
  focusedSectionId = section.id;

  requestAnimationFrame(() => {
    const offset = getScrollOffset();

    window.scrollTo({
      top: Math.max(0, section.getBoundingClientRect().top + window.scrollY - offset),
      behavior: 'auto',
    });
  });
});

let current = 0;
let autoTimer;
let isManualPaused = false;
let isInteractionPaused = false;
let sliderResizeTimeout;
let sliderTransitionTimeout;

function stopAuto() {
  clearInterval(autoTimer);
  autoTimer = undefined;
}

function setSliderHeight() {
  if (!slider || !slides.length) return;

  const heights = Array.from(slides, slide => slide.getBoundingClientRect().height);
  const maxHeight = Math.max(...heights);

  if (maxHeight > 0) {
    slider.style.height = `${Math.ceil(maxHeight + 20)}px`;
  }
}

function scheduleSliderHeightUpdate() {
  window.clearTimeout(sliderResizeTimeout);
  sliderResizeTimeout = window.setTimeout(setSliderHeight, 100);
}

function updatePauseButton() {
  if (!toggle) return;
  if (reducedMotion.matches) {
    toggle.disabled = true;
    toggle.setAttribute('aria-pressed', 'true');
    toggle.textContent = 'Défilement automatique désactivé';
    return;
  }

  toggle.disabled = false;
  toggle.setAttribute('aria-pressed', String(isManualPaused));
  toggle.textContent = isManualPaused
    ? 'Relancer les témoignages'
    : 'Mettre en pause les témoignages';
}

function goTo(index, { announce = false } = {}) {
  if (!slides.length) return;

  window.clearTimeout(sliderTransitionTimeout);
  slider?.setAttribute('aria-live', announce ? 'polite' : 'off');
  slides.forEach(slide => slide.classList.remove('is-exiting'));
  slides[current].classList.remove('active');
  slides[current].classList.add('is-exiting');
  slides[current].setAttribute('aria-hidden', 'true');
  dots[current].classList.remove('active');
  dots[current].setAttribute('aria-pressed', 'false');

  current = (index + slides.length) % slides.length;

  slides[current].classList.remove('is-exiting');
  slides[current].classList.add('active');
  slides[current].removeAttribute('aria-hidden');
  dots[current].classList.add('active');
  dots[current].setAttribute('aria-pressed', 'true');

  sliderTransitionTimeout = window.setTimeout(() => {
    slides.forEach(slide => {
      if (!slide.classList.contains('active')) {
        slide.classList.remove('is-exiting');
      }
    });
  }, 500);
}

function startAuto() {
  stopAuto();
  if (slides.length < 2 || isManualPaused || isInteractionPaused || reducedMotion.matches) return;
  autoTimer = setInterval(() => goTo(current + 1), 5000);
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    isManualPaused = true;
    stopAuto();
    updatePauseButton();
    goTo(Number(dot.dataset.index), { announce: true });
  });
});

prevBtn?.addEventListener('click', () => {
  isManualPaused = true;
  stopAuto();
  updatePauseButton();
  goTo(current - 1, { announce: true });
});

nextBtn?.addEventListener('click', () => {
  isManualPaused = true;
  stopAuto();
  updatePauseButton();
  goTo(current + 1, { announce: true });
});

toggle?.addEventListener('click', () => {
  if (reducedMotion.matches) return;

  isManualPaused = !isManualPaused;
  updatePauseButton();
  if (isManualPaused) {
    stopAuto();
  } else {
    startAuto();
  }
});

document.querySelector('.testimonials')?.addEventListener('mouseenter', () => {
  isInteractionPaused = true;
  stopAuto();
});

document.querySelector('.testimonials')?.addEventListener('mouseleave', () => {
  isInteractionPaused = false;
  startAuto();
});

document.querySelector('.testimonials')?.addEventListener('focusin', () => {
  isInteractionPaused = true;
  stopAuto();
});

document.querySelector('.testimonials')?.addEventListener('focusout', event => {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    isInteractionPaused = false;
    startAuto();
  }
});

reducedMotion.addEventListener('change', () => {
  updatePauseButton();
  startAuto();
});

if (slides.length) {
  slides.forEach((slide, index) => {
    if (index === current) {
      slide.removeAttribute('aria-hidden');
    } else {
      slide.setAttribute('aria-hidden', 'true');
    }
  });
  updatePauseButton();
  setSliderHeight();
  startAuto();
}

window.addEventListener('load', setSliderHeight);
window.addEventListener('resize', scheduleSliderHeightUpdate);

// ── FAQ accordion ──────────────────────────────────────────
document.querySelectorAll('.faq__item').forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;

    document.querySelectorAll('.faq__item[open]').forEach(otherItem => {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});

// ── Contact form validation ─────────────────────────────────
const contactForm = document.querySelector('.form');
const requiredFields = contactForm?.querySelectorAll('[required]');
const formStatus = document.getElementById('form-status');

function getFieldErrorMessage(field) {
  const label = contactForm
    ?.querySelector(`label[for="${field.id}"]`)
    ?.textContent
    .replace('*', '')
    .trim();

  if (field.validity.valueMissing) {
    return `${label} est obligatoire.`;
  }

  if (field.type === 'email' && field.validity.typeMismatch) {
    return 'Saisissez une adresse e-mail valide, par exemple nom@domaine.fr.';
  }

  return '';
}

function validateField(field) {
  const error = document.getElementById(`${field.id}-error`);
  const message = getFieldErrorMessage(field);

  field.setAttribute('aria-invalid', String(Boolean(message)));
  if (error) error.textContent = message;
  if (formStatus) formStatus.textContent = '';

  return !message;
}

function getMailtoUrl() {
  const formData = new FormData(contactForm);
  const subject = encodeURIComponent("Demande de contact Pédago'Up");
  const body = encodeURIComponent([
    `Prénom : ${formData.get('prenom') || ''}`,
    `Nom : ${formData.get('nom') || ''}`,
    `E-mail : ${formData.get('email') || ''}`,
    `Organisation : ${formData.get('organisation') || ''}`,
    '',
    'Message :',
    formData.get('message') || '',
  ].join('\n'));

  return `mailto:carla.delepee@pedago-up.fr?subject=${subject}&body=${body}`;
}

requiredFields?.forEach(field => {
  field.addEventListener('input', () => validateField(field));
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('invalid', event => {
    event.preventDefault();
    validateField(field);
    if (formStatus) {
      formStatus.textContent = 'Le formulaire contient des erreurs. Corrigez les champs signalés.';
    }
  });
});

contactForm?.addEventListener('submit', event => {
  event.preventDefault();

  const fields = Array.from(requiredFields ?? []);
  let firstInvalidField;

  fields.forEach(field => {
    const isValid = validateField(field);
    if (!isValid && !firstInvalidField) firstInvalidField = field;
  });

  if (firstInvalidField) {
    firstInvalidField.focus();
    if (formStatus) {
      formStatus.textContent = 'Le formulaire contient des erreurs. Corrigez les champs signalés.';
    }
    return;
  }

  if (formStatus) {
    formStatus.textContent = 'Votre client e-mail va s’ouvrir avec votre demande préremplie.';
  }

  window.location.href = getMailtoUrl();
});

// ── Navbar highlight on scroll ─────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar__nav a');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      });

      const active = document.querySelector(`.navbar__nav a[href="#${entry.target.id}"]`);
      if (active) {
        active.classList.add('is-active');
        active.setAttribute('aria-current', 'true');
      }
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => observer.observe(section));

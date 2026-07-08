// WriteandBill marketing site interactions

// --- True Tone: warm the page with the time of day (like Apple's display feature) ---
function setTrueTone() {
  const now = new Date();
  const h = now.getHours() + now.getMinutes() / 60;
  let warmth;
  if (h >= 11 && h < 16) warmth = 0.03;                        // midday: near neutral
  else if (h >= 16 && h < 19) warmth = 0.03 + ((h - 16) / 3) * 0.05; // dusk: warming up
  else if (h >= 19 || h < 5) warmth = 0.09;                    // evening/night: warmest
  else warmth = 0.03 + Math.min(1, (8 - h) / 3) * 0.05;        // dawn: cooling back down
  document.documentElement.style.setProperty('--truetone', warmth.toFixed(3));
}
setTrueTone();
setInterval(setTrueTone, 10 * 60 * 1000);

// --- Reveal-on-scroll ---
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => {
  // Elements already on screen at load (deep links, restored scroll) show
  // instantly — only below-the-fold content gets the scroll-in animation.
  if (el.getBoundingClientRect().top < window.innerHeight) {
    el.classList.add('no-anim', 'visible');
  } else {
    io.observe(el);
  }
});

// --- Animated stat counters ---
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const decimals = parseInt(el.dataset.decimal || '0', 10);
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = (target * eased).toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const statIo = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statIo.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stat strong[data-count]').forEach((el) => statIo.observe(el));

// --- Mobile nav ---
const burger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// --- Demo form (front-end only for now) ---
const demoForm = document.getElementById('demoForm');
const formNote = document.getElementById('formNote');
demoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = demoForm.name.value.trim().split(' ')[0] || 'there';
  demoForm.querySelectorAll('input, select, textarea, button').forEach((el) => (el.disabled = true));
  formNote.textContent = `Thanks, ${name} — request received. We'll reach out within one business day.`;
  formNote.style.color = '#0d9488';
  formNote.style.fontWeight = '600';
});

/**
 * Palace Scroll & Parallax Controller
 * Handles the vertical cinematic descent from the sky lanterns down through
 * the royal Indian palace facade into the turquoise fountain pool, revealing
 * the formal emerald invitation card and guiding section transitions.
 */

class PalaceScrollController {
  constructor() {
    this.heroSection = document.getElementById('hero-section');
    this.palaceContainer = document.getElementById('palace-container');
    this.heroTitle = document.getElementById('hero-title');
    this.formalCard = document.getElementById('formal-card');
    this.scrollPrompt = document.getElementById('scroll-prompt');
    this.vintageCars = document.querySelectorAll('.vintage-car-transition');

    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    this.handleScroll(); // Initial check
    this.initIntersectionObservers();
    this.initSmoothScrollButtons();
  }

  handleScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const windowH = window.innerHeight;

    // 1. Hero Palace Descent Parallax
    if (this.palaceContainer && this.heroSection) {
      const heroH = this.heroSection.offsetHeight;
      const progress = Math.min(1, Math.max(0, scrollY / (heroH - windowH * 0.4)));

      // Subtle parallax movement of palace layers
      const palaceOffset = progress * 140; // translateY
      this.palaceContainer.style.transform = `translate3d(0, -${palaceOffset}px, 0)`;

      // Hero Title fades & scales down as you scroll down
      if (this.heroTitle) {
        const titleOpacity = Math.max(0, 1 - progress * 2.2);
        const titleScale = 1 - progress * 0.15;
        this.heroTitle.style.opacity = titleOpacity;
        this.heroTitle.style.transform = `scale(${titleScale}) translateY(-${progress * 60}px)`;
      }

      // Hide scroll down prompt once user starts scrolling
      if (this.scrollPrompt) {
        this.scrollPrompt.style.opacity = scrollY > 40 ? '0' : '1';
        this.scrollPrompt.style.pointerEvents = scrollY > 40 ? 'none' : 'auto';
      }

      // Formal invitation card emerges gracefully from courtyard pool
      if (this.formalCard) {
        const cardProgress = Math.min(1, Math.max(0, (scrollY - heroH * 0.45) / (windowH * 0.5)));
        if (cardProgress > 0) {
          this.formalCard.classList.add('in-view');
        }
      }
    }

    // 2. Vintage Car Parallax Sway along scroll
    this.vintageCars.forEach((car) => {
      const rect = car.getBoundingClientRect();
      if (rect.top < windowH && rect.bottom > 0) {
        const centerOffset = (rect.top + rect.height / 2) - windowH / 2;
        const normalized = centerOffset / (windowH / 2);
        const swayAngle = normalized * -2.5; // subtle tilt as it glides
        const scaleVal = 1 + (1 - Math.abs(normalized)) * 0.04;
        const img = car.querySelector('.car-img');
        if (img) {
          img.style.transform = `rotate(${swayAngle}deg) scale(${scaleVal})`;
        }
      }
    });
  }

  initIntersectionObservers() {
    const revealElements = document.querySelectorAll('.royal-reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  initSmoothScrollButtons() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId && targetId !== '#') {
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.palaceScroll = new PalaceScrollController();
});

/**
 * Royal Sky Lanterns & Particle Engine
 * Creates interactive, physics-driven glowing lanterns drifting upward into the night sky,
 * with authentic flickering candle flames, natural wind sway, parallax depth,
 * and click-to-release interactive lanterns.
 */

class SkyLanternsEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.lanterns = [];
    this.petals = [];
    this.sparks = [];
    this.width = 0;
    this.height = 0;
    this.animationFrameId = null;
    this.lastTime = performance.now();
    this.isPetalsEnabled = true;
    this.wind = 0.3; // Gentle breeze

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Generate initial lanterns populated throughout the sky
    const initialCount = window.innerWidth < 768 ? 22 : 38;
    for (let i = 0; i < initialCount; i++) {
      this.lanterns.push(this.createLantern(true));
    }

    // Generate falling rose and marigold petals
    const petalCount = window.innerWidth < 768 ? 14 : 24;
    for (let i = 0; i < petalCount; i++) {
      this.petals.push(this.createPetal(true));
    }

    // Click/tap to release a lantern
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        this.handleClick(touch);
      }
    }, { passive: true });

    this.animate();
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.width = parent ? parent.clientWidth : window.innerWidth;
    this.height = parent ? parent.clientHeight : window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createLantern(isInitial = false, customX = null, customY = null) {
    // 3 depth layers: 0 (distant/small), 1 (midground), 2 (foreground/large)
    const layer = Math.random() < 0.4 ? 0 : (Math.random() < 0.75 ? 1 : 2);
    
    let baseWidth, baseHeight, speedY, opacity, swayAmount;
    if (layer === 0) {
      baseWidth = 14 + Math.random() * 8;
      baseHeight = baseWidth * 1.35;
      speedY = 0.35 + Math.random() * 0.35;
      opacity = 0.5 + Math.random() * 0.25;
      swayAmount = 12 + Math.random() * 8;
    } else if (layer === 1) {
      baseWidth = 24 + Math.random() * 12;
      baseHeight = baseWidth * 1.35;
      speedY = 0.6 + Math.random() * 0.45;
      opacity = 0.75 + Math.random() * 0.2;
      swayAmount = 18 + Math.random() * 12;
    } else {
      baseWidth = 38 + Math.random() * 16;
      baseHeight = baseWidth * 1.35;
      speedY = 0.85 + Math.random() * 0.5;
      opacity = 0.9 + Math.random() * 0.1;
      swayAmount = 24 + Math.random() * 15;
    }

    return {
      x: customX !== null ? customX : Math.random() * this.width,
      y: customY !== null ? customY : (isInitial ? Math.random() * this.height : this.height + baseHeight + Math.random() * 100),
      width: baseWidth,
      height: baseHeight,
      layer,
      speedY,
      swayAmount,
      swaySpeed: 0.0012 + Math.random() * 0.0016,
      swayOffset: Math.random() * Math.PI * 2,
      tilt: 0,
      flicker: 0,
      flickerSpeed: 0.04 + Math.random() * 0.06,
      opacity,
      colorWarmth: Math.random() // subtle variations between golden amber and deep honey orange
    };
  }

  createPetal(isInitial = false) {
    const isRose = Math.random() > 0.45; // Rose (crimson/pink) or Marigold (golden saffron)
    return {
      x: Math.random() * this.width,
      y: isInitial ? Math.random() * this.height : -20 - Math.random() * 100,
      size: 6 + Math.random() * 8,
      speedY: 0.8 + Math.random() * 1.2,
      speedX: -0.4 + Math.random() * 0.8,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      sway: Math.random() * Math.PI * 2,
      color: isRose 
        ? (Math.random() > 0.5 ? '#f43f5e' : '#e11d48') 
        : (Math.random() > 0.5 ? '#f59e0b' : '#fbbf24'),
      opacity: 0.55 + Math.random() * 0.35
    };
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Release a custom large glowing lantern at click point
    const newLantern = this.createLantern(false, x, y);
    newLantern.layer = 2; // Always prominent
    newLantern.width = 46;
    newLantern.height = 46 * 1.35;
    newLantern.speedY = 1.1;
    this.lanterns.push(newLantern);

    // Burst golden celebration sparks
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3.5;
      this.sparks.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        life: 1,
        decay: 0.02 + Math.random() * 0.02,
        color: Math.random() > 0.5 ? '#fff4d0' : '#f59e0b'
      });
    }

    // Trigger toast notification
    if (window.showAnniversaryToast) {
      window.showAnniversaryToast('✨ Sky Lantern Released with 25th Anniversary Blessings!');
    }
  }

  drawLantern(l, time) {
    const ctx = this.ctx;
    ctx.save();

    // Natural physics sway
    const sway = Math.sin(time * l.swaySpeed + l.swayOffset) * l.swayAmount;
    const currentX = l.x + sway;
    const currentY = l.y;

    // Tilt angle proportional to sway acceleration
    const tilt = Math.cos(time * l.swaySpeed + l.swayOffset) * 0.08;

    ctx.translate(currentX, currentY);
    ctx.rotate(tilt);

    // Candle flame flicker modulation
    l.flicker = Math.sin(time * l.flickerSpeed) * 0.15;
    const currentOpacity = Math.max(0.2, Math.min(1, l.opacity + l.flicker));

    const w = l.width;
    const h = l.height;

    // 1. Warm Golden Halo Bloom (Outer radial glow)
    const haloRadius = w * 2.2;
    const haloGrad = ctx.createRadialGradient(0, h * 0.45, w * 0.2, 0, h * 0.45, haloRadius);
    haloGrad.addColorStop(0, `rgba(255, 235, 175, ${0.45 * currentOpacity})`);
    haloGrad.addColorStop(0.35, `rgba(245, 158, 11, ${0.28 * currentOpacity})`);
    haloGrad.addColorStop(0.7, `rgba(217, 119, 6, ${0.12 * currentOpacity})`);
    haloGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');

    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(0, h * 0.45, haloRadius, 0, Math.PI * 2);
    ctx.fill();

    // 2. Paper Lantern Silhouette (Trapezoidal rounded traditional sky lantern)
    // Top is slightly narrower than shoulder, tapering gently to bottom rim
    const topW = w * 0.42;
    const shoulderW = w * 0.52;
    const bottomW = w * 0.38;

    ctx.beginPath();
    // Top arched dome
    ctx.moveTo(-topW, -h * 0.45);
    ctx.quadraticCurveTo(0, -h * 0.54, topW, -h * 0.45);
    // Shoulder curve down to bottom
    ctx.bezierCurveTo(shoulderW, -h * 0.1, shoulderW * 0.95, h * 0.25, bottomW, h * 0.45);
    // Bottom opening
    ctx.lineTo(-bottomW, h * 0.45);
    // Left side back to top
    ctx.bezierCurveTo(-shoulderW * 0.95, h * 0.25, -shoulderW, -h * 0.1, -topW, -h * 0.45);
    ctx.closePath();

    // Lantern Skin Gradient (Luminous translucent parchment)
    const lanternGrad = ctx.createLinearGradient(0, -h * 0.5, 0, h * 0.5);
    lanternGrad.addColorStop(0, `rgba(255, 240, 190, ${0.85 * currentOpacity})`);
    lanternGrad.addColorStop(0.35, `rgba(254, 215, 115, ${0.95 * currentOpacity})`);
    lanternGrad.addColorStop(0.75, `rgba(245, 158, 11, ${0.9 * currentOpacity})`);
    lanternGrad.addColorStop(1, `rgba(180, 83, 9, ${0.85 * currentOpacity})`);

    ctx.fillStyle = lanternGrad;
    ctx.fill();

    // Subtle paper ribs (delicate bamboo structure lines)
    if (l.layer >= 1) {
      ctx.strokeStyle = `rgba(160, 65, 5, ${0.35 * currentOpacity})`;
      ctx.lineWidth = l.layer === 2 ? 1 : 0.6;
      ctx.beginPath();
      // Center vertical rib
      ctx.moveTo(0, -h * 0.52);
      ctx.lineTo(0, h * 0.45);
      // Left vertical rib
      ctx.moveTo(-topW * 0.5, -h * 0.48);
      ctx.quadraticCurveTo(-shoulderW * 0.5, 0, -bottomW * 0.5, h * 0.45);
      // Right vertical rib
      ctx.moveTo(topW * 0.5, -h * 0.48);
      ctx.quadraticCurveTo(shoulderW * 0.5, 0, bottomW * 0.5, h * 0.45);
      ctx.stroke();

      // Horizontal subtle hoop ribs
      ctx.beginPath();
      ctx.ellipse(0, -h * 0.15, shoulderW * 0.9, h * 0.06, 0, 0, Math.PI * 2);
      ctx.ellipse(0, h * 0.2, shoulderW * 0.75, h * 0.05, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 3. Central Candle Flame Core (Fierce warm incandescent flame)
    const flameY = h * 0.32;
    const flameW = w * 0.22;
    const flameH = h * 0.25;

    const flameGrad = ctx.createRadialGradient(0, flameY, 1, 0, flameY, flameW * 1.5);
    flameGrad.addColorStop(0, '#ffffff');
    flameGrad.addColorStop(0.25, '#fffbeb');
    flameGrad.addColorStop(0.6, '#fde047');
    flameGrad.addColorStop(0.9, '#f59e0b');
    flameGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');

    ctx.fillStyle = flameGrad;
    ctx.beginPath();
    ctx.arc(0, flameY, flameW * 1.4, 0, Math.PI * 2);
    ctx.fill();

    // 4. Bottom Bamboo Ring Collar & Hanging Tassel
    ctx.strokeStyle = `rgba(120, 53, 15, ${0.8 * currentOpacity})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(0, h * 0.45, bottomW, h * 0.06, 0, 0, Math.PI * 2);
    ctx.stroke();

    if (l.layer === 2) {
      // Small hanging tassel with gold bead
      ctx.strokeStyle = `rgba(245, 158, 11, ${0.7 * currentOpacity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.48);
      ctx.lineTo(0, h * 0.62);
      ctx.stroke();

      ctx.fillStyle = '#fff4d0';
      ctx.beginPath();
      ctx.arc(0, h * 0.64, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  drawPetal(p) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;

    // Organic teardrop petal shape
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.5, p.size * 0.7, p.size * 0.4, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.4, -p.size * 0.6, -p.size * 0.5, 0, -p.size);
    ctx.fill();

    ctx.restore();
  }

  drawSpark(s) {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = s.color;
    ctx.globalAlpha = Math.max(0, s.life);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  animate() {
    const now = performance.now();
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update & draw lanterns
    for (let i = this.lanterns.length - 1; i >= 0; i--) {
      const l = this.lanterns[i];
      l.y -= l.speedY;

      this.drawLantern(l, now);

      // Reset or remove lantern once it drifts off top
      if (l.y < -l.height * 1.5) {
        this.lanterns.splice(i, 1);
        this.lanterns.push(this.createLantern(false));
      }
    }

    // Update & draw falling petals
    if (this.isPetalsEnabled) {
      for (let i = 0; i < this.petals.length; i++) {
        const p = this.petals[i];
        p.y += p.speedY;
        p.x += Math.sin(p.sway) * 0.8 + p.speedX;
        p.sway += 0.02;
        p.rotation += p.rotSpeed;

        this.drawPetal(p);

        if (p.y > this.height + 20) {
          this.petals[i] = this.createPetal(false);
        }
      }
    }

    // Update & draw celebratory click sparks
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const s = this.sparks[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.05; // slight gravity
      s.life -= s.decay;

      this.drawSpark(s);

      if (s.life <= 0) {
        this.sparks.splice(i, 1);
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.skyLanterns = new SkyLanternsEngine('lanterns-canvas');
});

import { SCENE_CONSTANTS } from "../config/scene-constants.js";

const { mobileBreakpoint, moon: MOON, star: STAR } = SCENE_CONSTANTS;

export class StarLayer {
  constructor(sketch, width, height) {
    this.sketch = sketch;
    this.width = width;
    this.height = height;
    this.stars = [];
    this.generateStars();
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.generateStars();
  }

  generateStars() {
    const count = Math.max(
      STAR.minCount,
      Math.min(STAR.maxCount, Math.round(this.width * this.height * STAR.density))
    );

    const moonBounds = this.getMoonBounds();
    this.stars = [];
    let attempts = 0;
    const maxAttempts = count * 12;

    while (this.stars.length < count && attempts < maxAttempts) {
      const star = this.createStar();
      attempts += 1;

      if (this.isNearMoon(star, moonBounds)) {
        continue;
      }

      this.stars.push(star);
    }

    while (this.stars.length < count) {
      this.stars.push(this.createStar());
    }
  }

  getMoonBounds() {
    const isMobile = this.width < mobileBreakpoint;
    const config = isMobile ? MOON.mobile : MOON.desktop;
    const size = config.baseSize + this.width * config.widthScale;
    const x = this.width * (1 - config.rightOffsetRatio);
    const y = this.height * config.topOffsetRatio + size / 2;

    return { x, y, radius: size / 2 + STAR.moonAvoidanceRadius };
  }

  createStar() {
    return {
      x: Math.random() * this.width,
      y: Math.random() * this.height * STAR.maxYRatio,
      size: this.randomBetween(STAR.minSize, STAR.maxSize),
      baseAlpha: this.randomBetween(STAR.minBaseAlpha, STAR.maxBaseAlpha),
      twinkleRange: this.randomBetween(STAR.minTwinkleRange, STAR.maxTwinkleRange),
      twinkleSpeed: this.randomBetween(STAR.minTwinkleSpeed, STAR.maxTwinkleSpeed),
      pulseScale: this.randomBetween(STAR.minPulseScale, STAR.maxPulseScale),
      phase: Math.random() * Math.PI * 2,
    };
  }

  isNearMoon(star, moonBounds) {
    const dx = star.x - moonBounds.x;
    const dy = star.y - moonBounds.y;
    return Math.hypot(dx, dy) < moonBounds.radius;
  }

  randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  draw() {
    const time = this.sketch.millis() / 1000;

    this.sketch.noStroke();

    this.stars.forEach((star) => {
      const shimmer = Math.sin(time * star.twinkleSpeed + star.phase) * star.twinkleRange;
      const pulse = (Math.sin(time * star.twinkleSpeed + star.phase) + 1) / 2;
      const alpha = Math.max(0.06, Math.min(0.95, star.baseAlpha + shimmer));
      const size = star.size * (1 + (star.pulseScale - 1) * pulse);

      this.sketch.fill(255, 255, 245, alpha * 255);
      this.sketch.circle(star.x, star.y, size);
    });
  }
}

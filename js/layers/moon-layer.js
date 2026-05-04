(function () {
  const { mobileBreakpoint, moon: MOON } = window.SkySketchConstants;
  const { isImageReady } = window.SkySketchAssets;

  class MoonLayer {
    constructor(assets) {
      this.assets = assets;
    }

    draw(context, themeName, width, height) {
      const image = this.assets.moon[themeName];

      if (!isImageReady(image)) {
        return;
      }

      const isMobile = width < mobileBreakpoint;
      const config = isMobile ? MOON.mobile : MOON.desktop;
      const size = config.baseSize + width * config.widthScale;
      const x = width * (1 - config.rightOffsetRatio) - size / 2;
      const y = height * config.topOffsetRatio;

      context.drawImage(image, x, y, size, size);
    }
  }

  window.SkySketchMoonLayer = MoonLayer;
})();

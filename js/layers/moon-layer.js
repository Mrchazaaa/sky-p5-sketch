import { isImageReady } from "../assets.js";
import { SCENE_CONSTANTS } from "../config/scene-constants.js";

const { mobileBreakpoint, moon: MOON } = SCENE_CONSTANTS;

export class MoonLayer {
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

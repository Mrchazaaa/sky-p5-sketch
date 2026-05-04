import { isImageReady } from "../assets.js";

export class MountainLayer {
  constructor(assets) {
    this.assets = assets;
  }

  draw(context, themeName, width, height) {
    const image = this.assets.mountains[themeName];

    if (!isImageReady(image)) {
      return;
    }

    const drawWidth = width;
    const drawHeight = drawWidth * (image.naturalHeight / image.naturalWidth);
    const drawY = height - drawHeight;

    context.drawImage(image, 0, drawY, drawWidth, drawHeight);
  }
}

import { themeConfig } from "./config/theme.js";

function createImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

export function createSceneAssets() {
  return {
    moon: {
      light: createImage(themeConfig.light.moonPath),
      dark: createImage(themeConfig.dark.moonPath),
    },
    mountains: {
      light: createImage(themeConfig.light.mountainsPath),
      dark: createImage(themeConfig.dark.mountainsPath),
    },
  };
}

export function isImageReady(image) {
  return Boolean(image && image.complete && image.naturalWidth > 0);
}

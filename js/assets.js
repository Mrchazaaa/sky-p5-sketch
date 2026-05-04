(function () {
  const { themeConfig } = window.SkySketchTheme;

  function createImage(src) {
    const image = new Image();
    image.src = src;
    return image;
  }

  function createSceneAssets() {
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

  function isImageReady(image) {
    return Boolean(image && image.complete && image.naturalWidth > 0);
  }

  window.SkySketchAssets = {
    createSceneAssets,
    isImageReady,
  };
})();

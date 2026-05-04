(function () {
  const themeConfig = {
    light: {
      skyColor: "#b0d0d3",
      cloudColor: "#ffffff",
      moonPath: "./assets/moon-light.svg",
      mountainsPath: "./assets/mountains.svg",
    },
    dark: {
      skyColor: "#18314f",
      cloudColor: "#a5b0e5",
      moonPath: "./assets/moon-dark.webp",
      mountainsPath: "./assets/mountains-dark.svg",
    },
  };
  const mountainsAspectRatio = 1920 / 412.92;

  let currentTheme = "light";
  const assetImages = {
    moonLight: createImage(themeConfig.light.moonPath),
    moonDark: createImage(themeConfig.dark.moonPath),
    mountainsLight: createImage(themeConfig.light.mountainsPath),
    mountainsDark: createImage(themeConfig.dark.mountainsPath),
  };

  function createImage(src) {
    const image = new Image();
    image.src = src;
    return image;
  }

  class Cloud {
    constructor(sketch, newWidth, newHeight, speed, startRandomly = false) {
      this.sketch = sketch;
      this.width = newWidth;
      this.height = newHeight;
      this.speed = speed;
      this.startRandomly = startRandomly;
      this.initialise();
    }

    initialise() {
      this.cloudPoints = [];
      const maxCloudPoints = 8;
      const minCloudPoints = 4;
      this.cloudWidth = 0.2;

      this.cloudPointNum = Math.floor(
        Math.random() * (maxCloudPoints - minCloudPoints) + minCloudPoints
      );

      const cloudPointMinWidth = (this.cloudWidth / (this.cloudPointNum - 1)) * 1.8;
      const cloudPointMaxWidth = cloudPointMinWidth * 2.3;

      for (let i = 0; i < this.cloudPointNum; i += 1) {
        let ellipseRadius;

        if (i === 0 || i === this.cloudPointNum - 1) {
          ellipseRadius = cloudPointMinWidth;
        } else if (i < Math.floor(this.cloudPointNum / 2)) {
          ellipseRadius =
            Math.random() * ((cloudPointMaxWidth - cloudPointMinWidth) / 2) +
            cloudPointMinWidth;
        } else if (i === Math.floor(this.cloudPointNum / 2) - 1) {
          ellipseRadius =
            Math.random() * (cloudPointMaxWidth - cloudPointMinWidth) + cloudPointMinWidth;
        } else {
          ellipseRadius =
            Math.random() * ((cloudPointMaxWidth - cloudPointMinWidth) / 2) +
            cloudPointMinWidth;
        }

        const xOffset = this.cloudWidth * (i / this.cloudPointNum) * this.height;
        const radius = ellipseRadius * this.height;

        this.cloudPoints.push([xOffset, radius, ellipseRadius]);
        this.lastTime = new Date();
      }

      this.startingPointPx = -((this.cloudWidth + cloudPointMaxWidth) * this.height);
      this.startingPointPerc = this.startingPointPx / this.width;
      this.xPerc = this.startRandomly ? Math.random() : this.startingPointPerc;
      this.x = this.xPerc * this.width;

      this.yPerc = Math.random() / 2;
      this.y = (this.height + 10 + cloudPointMaxWidth / 2) * this.yPerc;
    }

    move() {
      const newTime = new Date();
      let timeDiff = (newTime - this.lastTime) / 1000;

      timeDiff = Math.min(timeDiff, 0.1);

      const offset = (this.width / this.speed) * timeDiff;

      this.x += offset;
      this.xPerc = this.x / this.width;

      if (this.x >= this.width + this.cloudPoints[0][1] / 2) {
        const overshoot = this.x - (this.width + this.cloudPoints[0][1] / 2);
        this.startingPointPx =
          -((this.cloudWidth + this.cloudPoints[this.cloudPoints.length - 1][2]) * this.height);
        this.startingPointPerc = this.startingPointPx / this.width;
        this.xPerc = this.startingPointPerc - overshoot / this.width;
        this.x = this.xPerc * this.width;
      }

      this.lastTime = newTime;
    }

    updateSize(newWidth, newHeight) {
      this.width = newWidth;
      this.height = newHeight;
      this.x = this.xPerc * this.width;

      for (let i = 0; i < this.cloudPoints.length; i += 1) {
        this.y = this.height * this.yPerc;
        this.cloudPoints[i][0] = this.cloudWidth * (i / this.cloudPointNum) * this.height;
        this.cloudPoints[i][1] = this.cloudPoints[i][2] * this.height;
      }
    }

    draw() {
      this.sketch.rect(
        this.cloudPoints[0][0] + this.x - this.cloudPoints[0][1] / 2,
        this.y - 1,
        this.cloudPoints[this.cloudPoints.length - 1][0] +
          this.cloudPoints[this.cloudPoints.length - 1][1] / 2 +
          this.cloudPoints[0][1] / 2,
        10,
        0,
        0,
        5,
        5
      );

      for (let i = 0; i < this.cloudPoints.length; i += 1) {
        this.sketch.arc(
          this.cloudPoints[i][0] + this.x,
          this.y,
          this.cloudPoints[i][1],
          this.cloudPoints[i][1],
          this.sketch.PI,
          0,
          this.sketch.CHORD
        );
      }
    }
  }

  function sceneSketch(sketch, mountNode) {
    let width;
    let height;
    let cloudList = [];

    const cloudSpeeds = [12, 13, 15];
    const initialCloudCount = 4;
    const cloudCountLimit = 15;
    const cloudCreationSuccessRate = 0.005;

    sketch.setup = function () {
      width = mountNode.clientWidth;
      height = mountNode.clientHeight;

      sketch.createCanvas(width, height);

      cloudList = Array.from(
        { length: initialCloudCount },
        () =>
          new Cloud(
            sketch,
            width,
            height,
            cloudSpeeds[Math.floor(Math.random() * cloudSpeeds.length)],
            true
          )
      );
    };

    sketch.draw = function () {
      const theme = themeConfig[currentTheme];
      const context = sketch.drawingContext;

      if (cloudList.length < cloudCountLimit && Math.random() < cloudCreationSuccessRate) {
        const speed = cloudSpeeds[Math.floor(Math.random() * cloudSpeeds.length)];
        cloudList.push(new Cloud(sketch, width, height, speed));
      }

      sketch.background(theme.skyColor);
      drawMountains(context);
      drawMoon(context);

      sketch.noStroke();
      sketch.fill(theme.cloudColor);

      cloudList.forEach((cloud) => {
        cloud.move();
        cloud.draw();
      });
    };

    sketch.windowResized = function () {
      width = mountNode.clientWidth;
      height = mountNode.clientHeight;

      sketch.resizeCanvas(width, height);

      cloudList.forEach((cloud) => {
        cloud.updateSize(width, height);
      });
    };

    function drawMoon(context) {
      const moonImage = currentTheme === "dark" ? assetImages.moonDark : assetImages.moonLight;
      const moonSize = width < 768 ? 80 + width * 0.03 : 100 + width * 0.05;
      const moonX = width < 768 ? width * 0.9 - moonSize : width * 0.7 - moonSize / 2;
      const moonY = height * (width < 768 ? 0.05 : 0.1);

      if (moonImage.complete && moonImage.naturalWidth > 0) {
        context.drawImage(moonImage, moonX, moonY, moonSize, moonSize);
      }
    }

    function drawMountains(context) {
      const mountainsImage =
        currentTheme === "dark" ? assetImages.mountainsDark : assetImages.mountainsLight;

      if (mountainsImage.complete && mountainsImage.naturalWidth > 0) {
        const drawWidth = width;
        const drawHeight = drawWidth / mountainsAspectRatio;
        const drawY = height - drawHeight;

        context.drawImage(mountainsImage, 0, drawY, drawWidth, drawHeight);
      }
    }
  }

  function setTheme(theme) {
    if (themeConfig[theme]) {
      currentTheme = theme;
    }
  }

  function cloudsSketch(mountNode) {
    const originalReadyState = Object.getOwnPropertyDescriptor(document, "readyState");

    Object.defineProperty(document, "readyState", {
      get: () => "complete",
      configurable: true,
    });

    const p5Instance = new window.p5((sketch) => sceneSketch(sketch, mountNode), mountNode);

    if (originalReadyState) {
      Object.defineProperty(document, "readyState", originalReadyState);
    } else {
      delete document.readyState;
    }

    return p5Instance;
  }

  window.SkyBackground = {
    cloudsSketch,
    setTheme,
  };
})();

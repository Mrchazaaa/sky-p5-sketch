import { createSceneAssets } from "./assets.js";
import { themeConfig } from "./config/theme.js";
import { CloudLayer } from "./layers/cloud-layer.js";
import { MoonLayer } from "./layers/moon-layer.js";
import { MountainLayer } from "./layers/mountain-layer.js";

export class Scene {
  constructor(sketch, mountNode, initialTheme) {
    this.sketch = sketch;
    this.mountNode = mountNode;
    this.themeName = themeConfig[initialTheme] ? initialTheme : "light";
    this.assets = createSceneAssets();
    this.width = 0;
    this.height = 0;
    this.cloudLayer = null;
    this.moonLayer = new MoonLayer(this.assets);
    this.mountainLayer = new MountainLayer(this.assets);
  }

  setup() {
    this.width = this.mountNode.clientWidth;
    this.height = this.mountNode.clientHeight;
    this.sketch.createCanvas(this.width, this.height);
    this.cloudLayer = new CloudLayer(this.sketch, this.width, this.height);
  }

  resize() {
    this.width = this.mountNode.clientWidth;
    this.height = this.mountNode.clientHeight;
    this.sketch.resizeCanvas(this.width, this.height);

    if (this.cloudLayer) {
      this.cloudLayer.resize(this.width, this.height);
    }
  }

  setTheme(themeName) {
    if (themeConfig[themeName]) {
      this.themeName = themeName;
    }
  }

  draw() {
    const theme = themeConfig[this.themeName];
    const context = this.sketch.drawingContext;

    this.sketch.background(theme.skyColor);
    this.mountainLayer.draw(context, this.themeName, this.width, this.height);
    this.moonLayer.draw(context, this.themeName, this.width, this.height);

    if (this.cloudLayer) {
      this.cloudLayer.draw(theme);
    }
  }
}

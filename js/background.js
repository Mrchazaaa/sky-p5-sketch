import { Scene } from "./scene.js";

export function createScene(mountNode, initialTheme = "light") {
  let scene;

  const p5Instance = new window.p5((sketch) => {
    sketch.setup = function () {
      scene = new Scene(sketch, mountNode, initialTheme);
      scene.setup();
    };

    sketch.draw = function () {
      if (scene) {
        scene.draw();
      }
    };

    sketch.windowResized = function () {
      if (scene) {
        scene.resize();
      }
    };
  }, mountNode);

  return {
    setTheme(themeName) {
      if (scene) {
        scene.setTheme(themeName);
      }
    },
    destroy() {
      p5Instance.remove();
    },
  };
}

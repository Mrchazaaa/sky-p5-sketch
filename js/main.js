(function () {
  const themeToggle = document.getElementById("theme-toggle");
  const celestial = document.querySelector(".scene__celestial");
  const mountains = document.querySelector(".scene__mountains");
  const sketchRoot = document.getElementById("sketch");
  const themeToggleLabel = document.querySelector(".theme-toggle__label");

  if (!themeToggle || !celestial || !mountains || !sketchRoot || !window.SkyBackground) {
    return;
  }

  const assets = {
    light: {
      moon: "./assets/moon-light.svg",
      mountains: "./assets/mountains.svg",
    },
    dark: {
      moon: "./assets/moon-dark.webp",
      mountains: "./assets/mountains-dark.svg",
    },
  };

  let theme = determineTheme();

  applyTheme(theme);
  window.SkyBackground.cloudsSketch(sketchRoot);
  themeToggle.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    applyTheme(theme);
  });

  function determineTheme() {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6 ? "dark" : "light";
  }

  function applyTheme(nextTheme) {
    document.documentElement.dataset.theme = nextTheme;
    celestial.style.backgroundImage = `url(${assets[nextTheme].moon})`;
    mountains.src = assets[nextTheme].mountains;
    window.SkyBackground.setTheme(nextTheme);

    if (themeToggleLabel) {
      themeToggleLabel.textContent = nextTheme === "dark" ? "Dark" : "Light";
    }

    const nextActionText = nextTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";

    themeToggle.setAttribute("aria-label", nextActionText);
    themeToggle.setAttribute("title", nextActionText);
  }
})();

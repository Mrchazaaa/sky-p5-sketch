(function () {
  const themeToggle = document.getElementById("theme-toggle");
  const sketchRoot = document.getElementById("sketch");
  const themeToggleLabel = document.querySelector(".theme-toggle__label");

  if (!themeToggle || !sketchRoot || !window.SkyBackground) {
    return;
  }

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
    window.SkyBackground.setTheme(nextTheme);

    if (themeToggleLabel) {
      themeToggleLabel.textContent = nextTheme === "dark" ? "Dark" : "Light";
    }

    const nextActionText = nextTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";

    themeToggle.setAttribute("aria-label", nextActionText);
    themeToggle.setAttribute("title", nextActionText);
  }
})();

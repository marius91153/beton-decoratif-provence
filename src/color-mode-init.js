// Inlined before styles by colorModeHtml: choose the theme before first paint.
(() => {
  const root = document.documentElement;
  let choice;
  try { choice = localStorage.getItem("bdp-theme"); } catch {}
  if (choice === "light" || choice === "dark") {
    root.dataset.themePreference = choice;
    root.dataset.theme = choice;
  } else {
    root.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
})();

// Inlined after the page markup: CSS owns the palette and icon animation.
(() => {
  const key = "bdp-theme";
  const valid = value => value === "light" || value === "dark";
  const root = document.documentElement;
  const button = document.querySelector(".theme-toggle");
  const system = matchMedia("(prefers-color-scheme: dark)");
  let preference = valid(root.dataset.themePreference) ? root.dataset.themePreference : null;
  const apply = () => {
    const dark = (preference || (system.matches ? "dark" : "light")) === "dark";
    for (const element of [root, document.body]) {
      element.classList.toggle("dark", dark);
      element.classList.toggle("light", !dark);
    }
    button.setAttribute("aria-pressed", String(dark));
    button.title = dark ? "Activer le mode clair" : "Activer le mode sombre";
  };
  const readPreference = () => {
    try {
      const value = localStorage.getItem(key);
      preference = valid(value) ? value : null;
    } catch { preference = null; }
    apply();
  };
  button.addEventListener("click", () => {
    preference = root.classList.contains("dark") ? "light" : "dark";
    apply();
    try { localStorage.setItem(key, preference); } catch {}
  });
  system.addEventListener("change", () => { if (!preference) apply(); });
  window.addEventListener("storage", event => {
    if (event.key === key || event.key === null) readPreference();
  });
  window.addEventListener("pageshow", event => {
    if (event.persisted) readPreference();
  });
  apply();
  delete root.dataset.themePreference;
  button.disabled = false;
})();

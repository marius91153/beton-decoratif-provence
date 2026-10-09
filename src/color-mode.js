const key = "bdp-theme";
const valid = value => value === "light" || value === "dark";

export function initColorMode() {
  const root = document.documentElement;
  const button = document.querySelector(".theme-toggle");
  const system = matchMedia("(prefers-color-scheme: dark)");
  const listeners = new AbortController();
  let preference = valid(root.dataset.themePreference) ? root.dataset.themePreference : null;
  const apply = () => {
    const theme = preference || (system.matches ? "dark" : "light");
    if (preference && root.dataset.themePreference !== preference) root.dataset.themePreference = preference;
    else if (!preference && root.dataset.themePreference) delete root.dataset.themePreference;
    if (root.dataset.theme !== theme) root.dataset.theme = theme;
    button.setAttribute("aria-pressed", String(theme === "dark"));
    button.title = theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre";
  };
  const readPreference = () => {
    try {
      const value = localStorage.getItem(key);
      preference = valid(value) ? value : null;
    } catch { preference = null; }
    apply();
  };
  button.addEventListener("click", () => {
    preference = root.dataset.theme === "dark" ? "light" : "dark";
    apply();
    try { localStorage.setItem(key, preference); } catch {}
  }, { signal: listeners.signal });
  system.addEventListener("change", () => { if (!preference) apply(); }, { signal: listeners.signal });
  window.addEventListener("storage", event => {
    if (event.key === key || event.key === null) readPreference();
  }, { signal: listeners.signal });
  window.addEventListener("pageshow", event => {
    if (event.persisted) readPreference();
  }, { signal: listeners.signal });
  apply();
  button.disabled = false;
  root.dataset.themeReady = "true";
  return () => {
    listeners.abort();
    button.disabled = true;
    delete root.dataset.themeReady;
  };
}

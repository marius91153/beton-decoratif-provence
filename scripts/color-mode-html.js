import { readFileSync } from "node:fs";

// One build-time source of truth for all nine static entry pages.
const initialize = readFileSync(new URL("../src/color-mode-init.js", import.meta.url), "utf8")
  .replace(/^\s*\/\/[^\n]*\n/, "").trim().replace(/\s*\n\s*/g, " ");
const button = `<button class="theme-toggle" type="button" aria-label="Mode sombre" aria-pressed="false" title="Activer le mode sombre" disabled><svg class="theme-icon-moon" viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20.9 13.1A9 9 0 0 1 10.9 3.1 9 9 0 1 0 20.9 13.1Z"/></svg><svg class="theme-icon-sun" viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button>`;

export function colorModeHtml() {
  return {
    name: "color-mode-before-first-paint",
    transformIndexHtml: { order: "pre", handler(html) {
      const menu = /<button\b[^>]*class="menu-toggle"[^>]*>[\s\S]*?<\/button>/;
      if (menu.test(html)) {
        html = html.replace(menu, match => `<div class="header-actions">${button}${match}</div>`);
      } else {
        html = html.replace("<body>", `<body><div class="confirmation-actions">${button}</div>`)
          .replace("<main>", '<main class="confirmation">')
          .replace("</head>", '<script type="module" src="/src/confirmation.js"></script></head>');
      }
      return html.replace(/(<meta\b[^>]*charset="UTF-8"[^>]*>)/i, `$1<script>${initialize}</script>`)
        .replace("</head>", '<link rel="stylesheet" href="/src/color-mode.css"></head>');
    } },
  };
}

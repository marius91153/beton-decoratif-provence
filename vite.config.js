import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { pagesHtml } from "./scripts/pages-html.js";
import { inlineStyles, projectImages } from "./scripts/optimized-assets.js";

export default defineConfig(({ mode }) => ({
  base: mode === "pages" ? "/beton-decoratif-provence/" : "/",
  plugins: [projectImages(), ...(mode === "pages" ? [pagesHtml()] : []), inlineStyles()],
  build: {
    rolldownOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        merci: fileURLToPath(new URL("./merci/index.html", import.meta.url)),
      },
    },
  },
}));

import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { pagesHtml } from "./scripts/pages-html.js";
import { inlineStyles, projectImages } from "./scripts/optimized-assets.js";
import { seoPages } from "./scripts/seo-pages.js";
import { servicePages } from "./scripts/service-content.js";

export default defineConfig(({ mode }) => ({
  base: mode === "pages" ? "/beton-decoratif-provence/" : "/",
  plugins: [seoPages(), projectImages(), ...(mode === "pages" ? [pagesHtml()] : []), inlineStyles()],
  build: {
    rolldownOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        merci: fileURLToPath(new URL("./merci/index.html", import.meta.url)),
        ...Object.fromEntries(servicePages.map(page => [page.key, fileURLToPath(new URL(`./${page.slug}/index.html`, import.meta.url))])),
        privacy: fileURLToPath(new URL("./confidentialite/index.html", import.meta.url)),
        legal: fileURLToPath(new URL("./mentions-legales/index.html", import.meta.url)),
        notFound: fileURLToPath(new URL("./404.html", import.meta.url)),
      },
    },
  },
}));

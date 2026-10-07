import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        merci: fileURLToPath(new URL("./merci/index.html", import.meta.url)),
      },
    },
  },
});

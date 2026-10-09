import { initColorMode } from "./color-mode.js";
const dispose = initColorMode();
if (import.meta.hot) import.meta.hot.dispose(dispose);

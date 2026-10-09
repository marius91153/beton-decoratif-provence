import { initNavigation } from "./navigation.js";
import { initSmoothScroll } from "./smooth-scroll.js";
initNavigation();
const dispose = initSmoothScroll();
if (import.meta.hot) import.meta.hot.dispose(dispose);
document.querySelector("#year").textContent = String(new Date().getFullYear());

import { initNavigation } from "./navigation.js";
initNavigation();
document.querySelector("#year").textContent = String(new Date().getFullYear());

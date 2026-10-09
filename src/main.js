import { initSmoothScroll } from "./smooth-scroll.js";

const disposeSmoothScroll = initSmoothScroll();
if (import.meta.hot) import.meta.hot.dispose(disposeSmoothScroll);

const materials = {
  sable: {
    name: "Sable",
    description:
      "Un beige lumineux aux accents de pierre claire. Une inspiration pour accorder votre sol extérieur à une façade claire.",
  },
  greige: {
    name: "Greige",
    description:
      "Entre le gris et le beige, une nuance équilibrée qui dialogue avec les façades et les aménagements du jardin.",
  },
  argile: {
    name: "Argile",
    description:
      "Une tonalité terreuse, chaleureuse et feutrée. Une inspiration pour apporter une teinte chaude à une terrasse.",
  },
  craie: {
    name: "Craie",
    description:
      "Un blanc minéral, délicatement nuancé. Une inspiration pour imaginer un sol extérieur clair.",
  },
  graphite: {
    name: "Graphite",
    description:
      "Un gris profond au caractère architectural. Une inspiration pour souligner une allée ou créer un contraste avec la façade.",
  },
  terre: {
    name: "Terre cuite",
    description:
      "Une nuance solaire inspirée de la terre et des paysages méditerranéens. Une présence chaleureuse et expressive.",
  },
};

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");
function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Ouvrir le menu");
  navigation.classList.remove("is-open");
}
menuButton.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!expanded));
  menuButton.setAttribute(
    "aria-label",
    expanded ? "Ouvrir le menu" : "Fermer le menu",
  );
  navigation.classList.toggle("is-open", !expanded);
});
navigation
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.querySelectorAll(".mobile-actions a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuButton.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia("(min-width: 801px)").addEventListener("change", closeMenu);

const materialCards = [...document.querySelectorAll("[data-material]")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) =>
      item.setAttribute("aria-pressed", String(item === button)),
    );
    let count = 0;
    materialCards.forEach((card) => {
      card.hidden =
        button.dataset.filter !== "all" &&
        card.dataset.category !== button.dataset.filter;
      if (!card.hidden) count += 1;
    });
    document.querySelector("#filter-status").textContent =
      `${count} nuances disponibles`;
  });
});

const dialog = document.querySelector("#material-dialog");
let selectedMaterial;
let lastMaterialMessage = "";
materialCards.forEach((card) => {
  card.addEventListener("click", () => {
    selectedMaterial = card.dataset.material;
    const material = materials[selectedMaterial];
    document.querySelector("#dialog-title").textContent = material.name;
    document.querySelector("#dialog-description").textContent =
      material.description;
    document.querySelector("#dialog-swatch").className =
      `dialog-swatch swatch swatch-${selectedMaterial}`;
    dialog.showModal();
  });
});
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  }
});
document.querySelector("#choose-material").addEventListener("click", () => {
  const name = materials[selectedMaterial].name;
  document.querySelector("#selected-material").value = name;
  const message = document.querySelector("#project-message");
  const starter = `Je souhaite échanger sur un projet de béton imprimé avec une nuance ${name}.`;
  if (!message.value.trim() || message.value === lastMaterialMessage) {
    message.value = starter;
    lastMaterialMessage = starter;
  }
  document.querySelector("#project-type").value ||= "À définir ensemble";
  dialog.close();
  message.focus({ preventScroll: true });
  message.scrollIntoView({
    block: "center",
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
});
document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector("#project-type").value = link.dataset.service;
  });
});

document.querySelectorAll('a[href="#confidentialite"]').forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector("#confidentialite").open = true;
  });
});
document.querySelector("#year").textContent = String(new Date().getFullYear());

const form = document.querySelector("#project-form");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (form.dataset.contactMode === "email") {
    const values = new FormData(form);
    const subject = `Demande de devis — ${values.get("projet")}`;
    const body = [
      "Bonjour, voici mon projet :",
      "",
      `Nom : ${values.get("nom")}`,
      `E-mail : ${values.get("email")}`,
      `Ville : ${values.get("ville") || "Non précisée"}`,
      `Type de projet : ${values.get("projet")}`,
      `Nuance : ${values.get("nuance") || "À définir"}`,
      "",
      values.get("message"),
      "",
      "J’accepte que ces informations soient utilisées pour répondre à cette demande.",
    ].join("\n");
    const draft = document.querySelector("#email-draft");
    draft.href = `mailto:${form.dataset.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    draft.hidden = false;
    const status = document.querySelector("#form-status");
    status.textContent = "Votre e-mail est prêt. Ouvrez votre messagerie, puis envoyez-le pour nous transmettre votre demande.";
    status.hidden = false;
    draft.focus();
    return;
  }
  const button = form.querySelector('[type="submit"]');
  const error = document.querySelector("#form-error");
  error.hidden = true;
  button.disabled = true;
  form.setAttribute("aria-busy", "true");
  button.querySelector(".submit-label").textContent = "Envoi en cours…";
  try {
    const response = await fetch(import.meta.env.BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(form)).toString(),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error("Submission failed");
    window.location.assign(form.action);
  } catch {
    error.textContent =
      "Votre demande n’a pas pu être envoyée. Réessayez dans un instant ; vos informations sont conservées dans le formulaire.";
    error.hidden = false;
    button.disabled = false;
    form.removeAttribute("aria-busy");
    button.querySelector(".submit-label").textContent = "Envoyer ma demande";
  }
});

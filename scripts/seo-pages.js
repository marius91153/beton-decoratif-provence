import { servicePages } from "./service-content.js";

export const origin = "https://betondecoratifprovence.fr";
const arrow = `<svg class="arrow-icon" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const business = "Béton Décoratif Provence";
const email = "contact@betondecoratifprovence.fr";
const socialImage = `${origin}/images/partage-beton-provence.jpg`;
const escape = value => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const json = value => JSON.stringify(value).replaceAll("<", "\\u003c");
const brand = `<span class="brand-mark" aria-hidden="true">b<span>.</span></span><span class="brand-name">Béton Décoratif <span>PROVENCE</span></span>`;
const quote = page => `%BASE_URL%?projet=${page.key}#contact`;
const url = page => `${origin}/${page.slug}/`;
const links = servicePages.map(page => `<a href="%BASE_URL%${page.slug}/">${escape(page.name)}</a>`).join("");

function schema(page) {
  const organization = {
    "@type": "HomeAndConstructionBusiness", "@id": `${origin}/#entreprise`, name: business, url: `${origin}/`,
    legalName: "BETON IMPRIME PROVENCE", alternateName: "SARL Béton Imprimé Provence",
    identifier: { "@type": "PropertyValue", propertyID: "SIRET", value: "95361735400014" },
    address: { "@type": "PostalAddress", streetAddress: "5 chemin de la Curasse", postalCode: "13780", addressLocality: "Cuges-les-Pins", addressCountry: "FR" },
    logo: { "@type": "ImageObject", url: `${origin}/logo.svg`, width: 256, height: 256 },
    image: socialImage, telephone: "+33754253693", email,
    areaServed: { "@type": "Place", name: "Provence" },
    sameAs: ["https://www.facebook.com/share/19tE2S2scm/", "https://www.instagram.com/betondecoratifprovence/", "https://www.tiktok.com/@bton.dcoratif.pro", "https://share.google/DXVXiJCWUd30Av8cV"],
    contactPoint: { "@type": "ContactPoint", telephone: "+33754253693", email, contactType: "Demande de devis", availableLanguage: "fr", url: "https://wa.me/message/I7RZCIKHK42VP1" },
  };
  const website = { "@type": "WebSite", "@id": `${origin}/#site`, url: `${origin}/`, name: business, inLanguage: "fr-FR", publisher: { "@id": organization["@id"] } };
  const webpage = { "@type": "WebPage", "@id": `${page.url}#page`, url: page.url, name: page.title, description: page.description, inLanguage: "fr-FR", isPartOf: { "@id": website["@id"] }, about: { "@id": organization["@id"] }, primaryImageOfPage: { "@type": "ImageObject", url: socialImage } };
  const graph = [organization, website, webpage];
  if (page.service) {
    const service = { "@type": "Service", "@id": `${page.url}#service`, name: page.service.name, serviceType: page.service.name, url: page.url, description: page.description, provider: { "@id": organization["@id"] }, areaServed: organization.areaServed };
    graph.push(service, { "@type": "BreadcrumbList", "@id": `${page.url}#fil-ariane`, itemListElement: [{ "@type": "ListItem", position: 1, name: "Accueil", item: `${origin}/` }, { "@type": "ListItem", position: 2, name: page.service.name, item: page.url }] });
    webpage.mainEntity = { "@id": service["@id"] };
    webpage.breadcrumb = { "@id": `${page.url}#fil-ariane` };
  } else if (page.url === `${origin}/`) {
    organization.hasOfferCatalog = { "@type": "OfferCatalog", name: "Aménagements extérieurs en Provence", itemListElement: servicePages.map(item => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: item.name, url: url(item), provider: { "@id": organization["@id"] } } })) };
  }
  return `<script type="application/ld+json">${json({ "@context": "https://schema.org", "@graph": graph })}</script>`;
}

function metadata(page) {
  return `<meta property="og:type" content="website"><meta property="og:locale" content="fr_FR"><meta property="og:site_name" content="${business}"><meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:url" content="${page.url}"><meta property="og:image" content="${socialImage}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Terrasse réelle en béton imprimé de Béton Décoratif Provence"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(page.title)}"><meta name="twitter:description" content="${escape(page.description)}"><meta name="twitter:image" content="${socialImage}">${page.noindex ? "" : schema(page)}`;
}

function head(page) {
  return `<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="theme-color" content="#0c1117"><title>${escape(page.title)}</title><meta name="description" content="${escape(page.description)}"><meta name="robots" content="${page.noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}"><link rel="canonical" href="${page.url}"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preload" href="/node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/src/landing.css"><script type="module" src="/src/landing.js"></script>${metadata(page)}`;
}

function header() {
  return `<a class="skip-link" href="#contenu">Aller au contenu</a><header class="site-header"><div class="header-inner container"><a class="brand" href="%BASE_URL%" title="Retour à l’accueil">${brand}</a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="navigation" aria-label="Ouvrir le menu"><span></span><span></span></button><nav id="navigation" class="navigation" aria-label="Navigation principale"><a href="%BASE_URL%#services">Nos solutions</a><a href="%BASE_URL%#realisations">Réalisations</a><a href="%BASE_URL%#budget">Budget & devis</a><a class="button button-small" href="%BASE_URL%#contact">Votre projet <span aria-hidden="true">${arrow}</span></a></nav></div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="container"><div class="footer-top"><a class="brand" href="%BASE_URL%">${brand}</a><p>Le béton imprimé. Le caractère de vos extérieurs.</p><a href="tel:+33754253693">07 54 25 36 93</a></div><nav class="footer-services" aria-label="Nos solutions en béton">${links}</nav><p class="business-identity">Béton Décoratif Provence · SARL BETON IMPRIME PROVENCE<br>Siège social : 5 chemin de la Curasse, 13780 Cuges-les-Pins · SIRET 95361735400014</p><div class="footer-bottom"><span>© <span id="year">2026</span> ${business}</span><a href="mailto:${email}">${email}</a><a href="%BASE_URL%mentions-legales/">Mentions légales</a><a href="%BASE_URL%confidentialite/">Confidentialité</a><a href="https://share.google/DXVXiJCWUd30Av8cV" target="_blank" rel="noopener noreferrer">Notre profil Google <span class="sr-only">(nouvel onglet)</span></a></div></div></footer><nav class="mobile-actions" aria-label="Actions rapides"><a href="https://wa.me/message/I7RZCIKHK42VP1" target="_blank" rel="noopener noreferrer" aria-label="Écrire sur WhatsApp (nouvel onglet)">WhatsApp</a><a href="%BASE_URL%#contact">Demander un devis <span aria-hidden="true">→</span></a></nav>`;
}

function renderLegal() {
  const page = { title: `Mentions légales | ${business}`, description: "Identification de la société BETON IMPRIME PROVENCE, éditrice du site Béton Décoratif Provence, et coordonnées de contact.", url: `${origin}/mentions-legales/`, noindex: true };
  return `<!doctype html><html lang="fr"><head>${head(page)}</head><body>${header()}<main id="contenu" class="container legal-content"><p class="eyebrow">L’entreprise</p><h1>Mentions légales.</h1><p>Dernière mise à jour : 9 octobre 2026.</p><section><h2>Éditeur du site</h2><p>Le site Béton Décoratif Provence est édité par <strong>BETON IMPRIME PROVENCE</strong>, société à responsabilité limitée (SARL).</p><dl><dt>Siège social</dt><dd>5 chemin de la Curasse, 13780 Cuges-les-Pins, France</dd><dt>SIREN</dt><dd>953 617 354</dd><dt>SIRET du siège</dt><dd>953 617 354 00014</dd><dt>Représentants légaux</dt><dd>Marius Ionut Haralamov et Mihai Daniel Radulescu, gérants</dd></dl><p>Contact : <a href="mailto:${email}">${email}</a> · <a href="tel:+33754253693">07 54 25 36 93</a>.</p><p>Les informations d’identification peuvent être consultées dans l’<a href="https://annuaire-entreprises.data.gouv.fr/entreprise/beton-imprime-provence-953617354" target="_blank" rel="noopener noreferrer">Annuaire des entreprises <span class="sr-only">(nouvel onglet)</span></a>. Pour votre chantier, indiquez la commune du projet afin de confirmer les possibilités d’intervention.</p></section><section><h2>Hébergement</h2><p>Le site principal est hébergé par Netlify, Inc. Les coordonnées et informations de l’hébergeur sont disponibles sur <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer">netlify.com <span class="sr-only">(nouvel onglet)</span></a>. La version alternative est hébergée par GitHub, Inc. via GitHub Pages.</p></section><section><h2>Photographies et contenus</h2><p>Les photographies présentent des réalisations publiées sur les comptes de l’entreprise. Les liens « Voir la vidéo » permettent de consulter les publications d’origine. Les teintes affichées sont indicatives ; le choix du motif et de la couleur est confirmé pour chaque projet.</p><p>Pour toute demande de réutilisation d’une photographie ou d’un contenu, contactez l’entreprise. Le périmètre, la préparation et les finitions des travaux sont définis dans le devis correspondant à votre chantier.</p></section><section><h2>Données personnelles</h2><p>Les informations relatives aux demandes de devis, à leurs destinataires et à l’exercice de vos droits figurent sur la page <a href="%BASE_URL%confidentialite/">Confidentialité</a>.</p></section><a class="button" href="%BASE_URL%#contact">Contacter l’entreprise <span aria-hidden="true">${arrow}</span></a></main>${footer()}</body></html>`;
}

function renderService(page) {
  const seo = { title: page.title, description: page.description, url: url(page), service: page };
  const sections = page.sections.map(section => `<section class="article-block"><h2>${escape(section.title)}</h2>${section.paragraphs.map(text => `<p>${escape(text)}</p>`).join("")}</section>`).join("");
  const faq = page.questions.map(([question, answer]) => `<details><summary>${escape(question)}<span aria-hidden="true">+</span></summary><p>${escape(answer)}</p></details>`).join("");
  const related = servicePages.filter(item => item !== page).map(item => `<a class="related-card" href="%BASE_URL%${item.slug}/"><span>${escape(item.name)}</span><span aria-hidden="true">${arrow}</span></a>`).join("");
  return `<!doctype html><html lang="fr"><head>${head(seo)}</head><body>${header()}<main id="contenu"><section class="landing-hero"><div class="container"><nav class="breadcrumb" aria-label="Fil d’Ariane"><a href="%BASE_URL%">Accueil</a><span aria-hidden="true">/</span><span aria-current="page">${escape(page.name)}</span></nav><div class="landing-grid"><div><p class="eyebrow">${escape(page.eyebrow)}</p><h1>${escape(page.name)} en Provence<span>${escape(page.heading)}<br>${escape(page.accent)}</span></h1><p class="landing-intro">${escape(page.intro)}</p><div class="landing-actions"><a class="button" href="${quote(page)}">Demander mon devis gratuit <span aria-hidden="true">${arrow}</span></a><a class="phone-link" href="tel:+33754253693">07 54 25 36 93</a></div><p class="reassurance">Devis personnalisé · Gratuit · Sans engagement</p></div><figure class="landing-photo"><img src="/images/projets/${page.photo}.webp" alt="${escape(page.alt)}" width="1080" height="1920" fetchpriority="high" sizes="(max-width: 800px) calc(100vw - 40px), (max-width: 1320px) 45vw, 560px"><figcaption>${escape(page.caption)} <a href="https://www.tiktok.com/@bton.dcoratif.pro/video/${page.video}" target="_blank" rel="noopener noreferrer">Voir la vidéo <span class="sr-only">(nouvel onglet)</span><span aria-hidden="true">${arrow}</span></a></figcaption></figure></div></div></section><div class="container article-layout"><div class="article-copy">${sections}</div><aside class="project-checklist" aria-labelledby="checklist-title"><p class="eyebrow">Votre premier échange</p><h2 id="checklist-title">Préparons votre projet.</h2><ul>${page.checklist.map(text => `<li>${escape(text)}</li>`).join("")}</ul><p>Ajoutez votre commune et des photos d’ensemble. Nous pourrons préciser la faisabilité et le périmètre des travaux.</p><a class="button" href="https://wa.me/message/I7RZCIKHK42VP1" target="_blank" rel="noopener noreferrer">Envoyer mes photos <span class="sr-only">sur WhatsApp (nouvel onglet)</span><span aria-hidden="true">${arrow}</span></a></aside></div><section class="container landing-faq"><p class="eyebrow">Questions fréquentes</p><h2>Les repères pour votre projet.</h2><div class="faq-list">${faq}</div></section><section class="landing-cta"><div class="container"><div><p class="eyebrow">Béton Décoratif Provence</p><h2>Votre extérieur commence<br>par un échange.</h2><p>Indiquez votre commune et votre surface approximative pour un devis personnalisé.</p></div><a class="button" href="${quote(page)}">Parlons de mon projet <span aria-hidden="true">${arrow}</span></a></div></section><section class="container related-section"><h2>Découvrez aussi nos autres solutions.</h2><nav class="related-grid" aria-label="Autres aménagements extérieurs">${related}</nav></section></main>${footer()}</body></html>`;
}

function renderPrivacy() {
  const page = { title: `Confidentialité | ${business}`, description: "Comprendre les informations utilisées pour votre demande de devis et contacter Béton Décoratif Provence au sujet de vos données personnelles.", url: `${origin}/confidentialite/`, noindex: true };
  return `<!doctype html><html lang="fr"><head>${head(page)}</head><body>${header()}<main id="contenu" class="container legal-content"><p class="eyebrow">Vos informations</p><h1>Confidentialité.</h1><p>Dernière mise à jour : 9 octobre 2026.</p><p>Le responsable du traitement des demandes est la SARL BETON IMPRIME PROVENCE, SIRET 95361735400014, dont le siège est situé au 5 chemin de la Curasse, 13780 Cuges-les-Pins. Retrouvez ses coordonnées dans les <a href="%BASE_URL%mentions-legales/">mentions légales</a>.</p><section><h2>Votre demande de projet</h2><p>Les informations saisies servent à répondre à votre demande et à préparer un éventuel devis. Le nom, l’e-mail, le type de projet et le message sont nécessaires. La ville, le téléphone, la surface et la nuance sont facultatifs. Le formulaire demande également votre accord pour cette utilisation. Évitez d’y inclure des informations sensibles.</p><p>Le traitement d’une demande de devis vise les échanges précontractuels que vous sollicitez. Les informations ne sont pas utilisées sur ce site pour une inscription automatique à des communications commerciales.</p></section><section><h2>À qui sont transmises les informations ?</h2><p>Sur le site principal, le formulaire est traité par Netlify Forms et une notification est adressée à ${business} via <a href="mailto:${email}">${email}</a>. ImprovMX assure la redirection de cette adresse. Ces services participent au traitement et à l’acheminement de la demande.</p><p>Sur la version GitHub Pages, le formulaire prépare un e-mail dans votre messagerie. Vous devez l’envoyer vous-même pour transmettre votre demande. Un e-mail préparé n’est pas un message reçu.</p></section><section><h2>Conservation et droits</h2><p>Les informations sont nécessaires au suivi de votre demande et, si vous poursuivez le projet, à la relation commerciale et aux obligations qui s’y rattachent. Pour connaître les modalités de conservation appliquées à votre dossier, contactez-nous.</p><p>Vous pouvez nous contacter pour exercer vos droits d’accès, de rectification, d’effacement, de limitation ou d’opposition, selon les conditions applicables : <a href="mailto:${email}">${email}</a>. Indiquez la demande concernée sans transmettre de données sensibles. Vous pouvez également adresser une réclamation à la <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">CNIL <span class="sr-only">(nouvel onglet)</span></a>.</p></section><section><h2>Liens externes et navigation</h2><p>Les boutons Facebook, Instagram, TikTok et WhatsApp ouvrent les services correspondants, dont les règles de confidentialité s’appliquent à votre navigation. Aucun fil social, outil publicitaire ou outil de mesure d’audience n’est intégré au site. Les photographies et les polices sont hébergées avec ses fichiers.</p><p>L’hébergeur peut traiter les informations techniques nécessaires au fonctionnement du service. Cette page décrit le site actuel ; elle doit être révisée si de nouveaux outils ou usages sont ajoutés.</p></section><a class="button" href="%BASE_URL%#contact">Revenir à mon projet <span aria-hidden="true">${arrow}</span></a></main>${footer()}</body></html>`;
}

function render404() {
  const page = { title: `Page introuvable | ${business}`, description: "Cette adresse n’existe pas. Retrouvez les solutions de béton décoratif en Provence et contactez-nous pour votre projet.", url: `${origin}/404.html`, noindex: true };
  return `<!doctype html><html lang="fr"><head>${head(page)}</head><body>${header()}<main id="contenu" class="container legal-content"><p class="eyebrow">Erreur 404</p><h1>Retrouvons votre chemin.</h1><p>Cette adresse n’existe pas ou a changé. Découvrez nos solutions pour votre extérieur, ou revenez à l’accueil pour nous décrire votre projet.</p><nav class="related-grid" aria-label="Retrouver une solution">${links}</nav><a class="button" href="%BASE_URL%">Revenir à l’accueil <span aria-hidden="true">${arrow}</span></a></main>${footer()}</body></html>`;
}

export function seoPages() {
  return {
    name: "static-service-pages-and-seo",
    transformIndexHtml: { order: "pre", handler(html) {
      const marker = html.match(/<!-- service:([a-z]+) -->/);
      if (marker) {
        const page = servicePages.find(item => item.key === marker[1]);
        if (!page) throw new Error(`Unknown service page ${marker[1]}`);
        return renderService(page);
      }
      if (html.includes("<!-- page:privacy -->")) return renderPrivacy();
      if (html.includes("<!-- page:legal -->")) return renderLegal();
      if (html.includes("<!-- page:404 -->")) return render404();
      if (!html.includes('id="project-form"')) return html;
      const title = html.match(/<title>([^<]+)<\/title>/)[1];
      const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/)[1];
      return html.replace("</head>", `${metadata({ title, description, url: `${origin}/` })}</head>`);
    } },
  };
}

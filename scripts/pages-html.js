const contactEmail = "contact@betondecoratifprovence.fr";

export function pagesHtml() {
  return {
    name: "pages-contact",
    transformIndexHtml(html) {
      if (!html.includes('id="project-form"')) {
        if (!html.includes("Merci pour<br />votre confiance.")) return html;
        return html
          .replace("Merci pour<br />votre confiance.", "Parlons de<br />votre projet.")
          .replace(
            /Votre demande a été transmise\.[\s\S]*?inspirent\./,
            "Décrivez votre projet par e-mail. Nous pourrons échanger sur votre espace, vos envies et les matières qui vous inspirent.",
          );
      }
      return html.replace(
        /<form\b[^>]*id="project-form"[\s\S]*?<\/form>/,
        (form) => form
          .replace(
            /<form\b[^>]*>/,
            `<form id="project-form" data-contact-mode="email" data-contact-email="${contactEmail}" action="mailto:${contactEmail}" method="POST" enctype="text/plain">`,
          )
          .replace("Envoyer ma demande", "Préparer mon e-mail")
          .replace(
            /(<p id="contact-help"[^>]*>)[\s\S]*?(<\/p>)/,
            `$1Préparez votre demande, puis envoyez-la avec votre messagerie. Vous pouvez aussi écrire directement à <a href="mailto:${contactEmail}">${contactEmail}</a>.$2`,
          )
          .replace(
            "</form>",
            '<p id="form-status" class="field-help" role="status" hidden></p><a id="email-draft" class="button" hidden>Ouvrir ma messagerie <span aria-hidden="true">→</span></a></form>',
          ),
      );
    },
  };
}

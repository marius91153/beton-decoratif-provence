# Béton Décoratif Provence

First French-language website for the project: services, an interactive finish palette, the project process, frequently asked questions and a quote request form. Built with Vite and plain HTML, CSS and JavaScript. All visuals are local illustrations; they are not photographs of completed customer projects.

The visual direction follows the owner's other site, `urbiscor.ro`: a dark header and full-width hero, golden calls to action, Manrope headings, Inter body text and fixed quotation actions on mobile. `src/theme.css` defines this visual layer; `src/styles.css` provides the base layout and controls. Fontsource packages supply the locally hosted fonts under the SIL Open Font License, included in `public/fonts`.

## Develop

Use Node.js 24 LTS and npm. The cloud checkout is `/workspace/beton-decoratif-provence`; use the existing checkout, since each cloud task is already isolated.

```sh
npm ci
npm run dev
```

Build and check the production output:

```sh
npm run build
npm test
```

The tests run on Chromium at desktop and mobile sizes. They exercise navigation, finish filters and dialogs, quote request validation, successful submission, failed submission and narrow-screen layout. They mock Netlify's form endpoint; they do not establish live delivery. The test runner uses `/usr/bin/chromium` when available. Elsewhere, install a browser with `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to a compatible Chromium executable.

## Netlify

`netlify.toml` uses `npm run build`, publishes `dist` and selects Node.js 24. Connect this repository to the existing Netlify project and use the intended production branch. No Netlify credentials are required for local development.

Enable form detection in the Netlify project before deployment. The static `devis` form includes `data-netlify`, its form name and a honeypot. On Netlify, successful requests go to `/merci/`. Without JavaScript, the HTML form also submits natively. Configure submission notifications in Netlify, then verify a real submission after deployment. The local Vite server does not process form submissions.

## Before the first public release

- Approve the final brand details and design. The public Urbiscor site has now been inspected and its visual direction adapted to this project's French-language content.
- Confirm service descriptions, available finishes, coverage area and branding with the business owner.
- Add the business's legal identification, privacy contact, retention policy and any required legal notices. The current short data-use explanation is not a complete privacy policy.
- Replace illustrations with approved photographs if actual projects should be shown.
- Commit and push the reviewed source to GitHub, deploy on Netlify and verify the live form. Creating files locally does not publish the site.

No analytics, remote fonts or third-party image requests are included.

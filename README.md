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

The configured Netlify address is `https://beton-decoratif-provence.netlify.app/`, connected to the production branch `main`.

### Manual publication when production uploads are blocked

The tested alternative is a local build, a draft deployment using a file manifest, upload of the requested files, then publication of the ready deployment through Netlify's `restore` API. A direct production ZIP upload returned HTTP 403 for exhausted account credits; the preview-and-restore workflow was accepted on this account. It uses supported API operations and does not change the billing plan. Availability still depends on Netlify's current account rules.

```sh
npm run deploy:netlify
```

This command requires Python 3.11+ and a Netlify personal access token with access to the existing project. Provide it through the secure `BDP_NETLIFY_TOKEN` environment binding, or enter it at the hidden interactive prompt. Never place a token in a command argument or commit it. The script rebuilds for Netlify, includes the headers from `netlify.toml`, enables form detection and configures the quote notification for `contact@betondecoratifprovence.fr`. It only targets this project's verified site and repository. For a preview without publishing, use `npm run deploy:netlify -- --preview-only`.

Enable form detection in the Netlify project before deployment. The static `devis` form includes `data-netlify`, its form name and a honeypot. On Netlify, successful requests go to `/merci/`. Without JavaScript, the HTML form also submits natively. Configure submission notifications in Netlify, then verify a real submission after deployment. The local Vite server does not process form submissions.

## Before the first public release

- Approve the final brand details and design. The public Urbiscor site has now been inspected and its visual direction adapted to this project's French-language content.
- Confirm service descriptions, available finishes, coverage area and branding with the business owner.
- Add the business's legal identification, privacy contact, retention policy and any required legal notices. The current short data-use explanation is not a complete privacy policy.
- Replace illustrations with approved photographs if actual projects should be shown.
- Commit and push the reviewed source to GitHub, deploy on Netlify and verify the live form. Creating files locally does not publish the site.

No analytics, remote fonts or third-party image requests are included.

## GitHub Pages alternative

The business contact address is `contact@betondecoratifprovence.fr`. `npm run build:pages` builds the site for `/beton-decoratif-provence/` and changes the quote form into an email preparation flow. The visitor fills in the project, prepares the email, opens their mail app and sends it. Preparing the draft does not deliver a message. There is also a direct email link and a native mail form fallback. The Netlify build keeps its original form handler.

Validate this version with `npm run build:pages` followed by `PAGES_TEST=1 npm test`. `npm run deploy:pages` builds locally and pushes the generated files to `gh-pages`, preserving its history. It uses existing Git authentication and requires no Netlify account or Netlify credits. It does not activate the GitHub Pages setting.

GitHub Pages is already active from branch `gh-pages`, folder `/ (root)`, at `https://marius91153.github.io/beton-decoratif-provence/`. Its French page was verified through HTTP. A successful Git push alone does not confirm that a new release is live; check the public URL after GitHub finishes publishing. Future releases use the same deployment command.

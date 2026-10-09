# Béton Décoratif Provence

French-language website for stamped concrete (béton imprimé): outdoor terraces, access paths and pool surrounds, a gallery of the business's actual projects, an indicative color palette, the project process, frequently asked questions and a quote request form. Built with Vite and plain HTML, CSS and JavaScript. Six locally hosted photographs come from the owner's public TikTok posts; provenance and the limits of social-profile access are recorded in [docs/social-media-sources.md](docs/social-media-sources.md).

Facebook, Instagram, TikTok and WhatsApp buttons use the owner's supplied accounts. WhatsApp also appears in the fixed mobile contact bar and quotation section. The telephone link uses the number published in the TikTok biography, `07 54 25 36 93`. The site offers the free, personalized, no-obligation quote stated in that biography. Exposed-aggregate concrete (béton désactivé) is presented separately from stamped concrete.

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

The tests run on Chromium at desktop and mobile sizes. They exercise navigation, finish filters and dialogs, quote request validation, successful submission, failed submission and narrow-screen layout. Shared scroll tests also cover easing, idle frames, direction changes, keyboard/anchor interruption, native textarea/modal scrolling, motion preferences, touch gestures and document boundaries on both hosting builds. They mock Netlify's form endpoint; they do not establish live delivery. The test runner uses `/usr/bin/chromium` when available. Elsewhere, install a browser with `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to a compatible Chromium executable.

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

## SEO, discovery and quotation pages

The homepage targets stamped concrete in Provence. Four separate service URLs cover terraces, access paths, pool surrounds and exposed-aggregate concrete. Their HTML entry files are rendered by the pre-transform in `scripts/seo-pages.js`, using the French copy in `scripts/service-content.js`. Production contains complete static HTML, metadata, photographs, FAQs, breadcrumbs and links; content does not require JavaScript to be read or crawled. Update the sitemap and internal links when adding an indexable service.

The renderer supplies canonical URLs on the custom domain, Open Graph/Twitter sharing tags and a HomeAndConstructionBusiness/WebSite/WebPage graph. Each service adds Service and BreadcrumbList entities. The site identifies the owner-confirmed SARL BETON IMPRIME PROVENCE, SIRET 95361735400014, at its registered office in Cuges-les-Pins. The visible identity and structured address agree. Provence coverage remains qualified by the actual project commune; ratings, prices and opening hours are not invented. `public/images/partage-beton-provence.jpg` is a social-size crop of the existing real terrace photograph, not a new project. `public/logo.svg` uses the website's existing brand mark. No third-party embeds or tracking scripts are loaded.

`public/_redirects` permanently sends the production Netlify alias and the www hostname to the canonical custom domain while preserving the path. It does not configure DNS or redirect deploy-preview hostnames. Netlify reads these rules from the uploaded build. GitHub Pages retains canonical tags pointing to the equivalent primary-domain URL.

The service quotation actions open the homepage with a validated project parameter and the contact fragment. The optional telephone and surface fields are carried to Netlify or the Pages email draft; the existing required fields, consent, anti-spam field and error recovery remain enabled. Both hosts run the shared SEO/conversion tests in addition to their existing checks. No real notification is sent by the tests.

The legal, privacy and custom 404 pages are noindex; the confirmation remains noindex. The sitemap lists only the homepage and four service URLs. Local Vite preview uses its own fallback behavior; confirm a real HTTP 404 and canonical redirects on Netlify after publication.

## Confirmed business identity and remaining details

The owner supplied Google Business profile `https://share.google/DXVXiJCWUd30Av8cV`. It redirects to “SARL Béton Imprimé Provence”, knowledge ID `/g/11twj14ldl`. The official French company search identifies the active SARL BETON IMPRIME PROVENCE, SIRET 95361735400014, at 5 chemin de la Curasse, 13780 Cuges-les-Pins. On 2026-10-09 the owner explicitly confirmed this as the entity behind the current commercial brand. These facts are published consistently in the footer, `/mentions-legales/`, privacy information and the LocalBusiness-subtype graph. The Google profile is linked without cached ratings or reviews. Registry source: https://annuaire-entreprises.data.gouv.fr/entreprise/beton-imprime-provence-953617354.

The actual retention practices, precise service area and any additional mandatory legal information such as share capital/publication director should be completed with the owner. The privacy page describes the known current flow and a data-rights contact; it does not establish full legal compliance or an automatic deletion policy. Original high-resolution business photos can replace video-derived images while preserving source records.

Google Search Console ownership and sitemap submission require the appropriate property access; no connected Search Console capability is available here. Supply the primary sitemap URL `https://betondecoratifprovence.fr/sitemap.xml` when registering it. An indexable page and a sitemap do not guarantee Google indexing, rankings, traffic or enquiries. These outcomes require subsequent crawl/index monitoring and business results.

## Performance

`src/smooth-scroll.js` implements the Urbiscor wheel inertia using the browser's real scroll position, without Lenis or another dependency. The inspected reference uses a 1.15-second exponential easing curve, fine-pointer input and native touch. The animation runs only during wheel movement; keyboard, focus, anchor navigation and scrolling inside inputs/dialogs retain their native behavior. Reduced-motion changes cancel the effect immediately. HMR disposes the controller's listeners. Reference measurements and design details are documented in [docs/native-smooth-scroll.md](docs/native-smooth-scroll.md).

Production builds generate AVIF photographs with responsive WebP fallbacks using the pinned Sharp dependency. The original social photographs remain in `public/images/projets`; `scripts/optimized-assets.js` removes their video padding and generates fingerprinted files under `assets`. Phones receive a separate crop of the same hero photograph. Gallery images remain lazy-loaded; the hero retains high fetch priority. Fontsource Latin fonts are preloaded locally, with Latin Extended available for names. Preserve their Unicode-range order so accented text does not download both subsets.

The small minified stylesheets are inlined during the build, preserving their order and rewriting font URLs for both hosting paths. The confirmation page includes only font declarations and its own styles. Styling does not depend on JavaScript. Netlify caches fingerprinted assets for one year while HTML and `release.json` retain revalidation. GitHub Pages controls its own cache headers. The homepage's canonical URL and sitemap point to `https://betondecoratifprovence.fr/`; the confirmation page remains `noindex`.

Use PageSpeed Insights on the public custom domain for remote measurements. If Google blocks the audit, report that limitation rather than presenting local results as Google reports. For a comparable local audit, start `npm run preview -- --port 4173 --strictPort` after building, then use pinned Lighthouse 13.5.0 with Chromium. Measure mobile and desktop separately, with no concurrent builds or browser tests. Repeat only when a change or observed measurement variance warrants it. Stop that preview before running Playwright, since the test runner owns port 4173. The performance audit and its measurement limitations are recorded in [docs/performance-audit-2026-10-08.md](docs/performance-audit-2026-10-08.md).

## Automatic publication after a commit

Push commits to `main`. `.github/workflows/deploy.yml` builds and tests both site variants in GitHub Actions, then publishes GitHub Pages with the official Pages actions and Netlify through the tested preview-and-restore API workflow. Netlify does not build this release on its own infrastructure. Releases run in sequence so an older build cannot overwrite a newer release. `workflow_dispatch` allows retrying the latest `main` release from the Actions page. Both hosting jobs reject other source branches, including manual dispatches. Pages uses the `github-pages-actions` environment for this main-branch workflow; the legacy `github-pages` environment retains its existing `gh-pages` branch restriction.

GitHub Actions needs a repository secret named `BDP_NETLIFY_TOKEN`, containing a Netlify personal access token that can access this project. Configure it at **GitHub → repository Settings → Secrets and variables → Actions**. The same-named Codex secret belongs to a separate system and is not automatically available to GitHub Actions. Credentials are supplied only to the deployment steps, never committed or included in the site's client variables.

Also select **GitHub → repository Settings → Pages → Build and deployment → Source → GitHub Actions**. GitHub's workflow token can deploy Pages artifacts but cannot change this repository setting; the workflow checks it and reports a precise setup error. The available Codex GitHub integration also returned HTTP 403 when changing Pages settings or saving the Actions secret. Once these two repository settings are configured, subsequent pushes and workflow retries require no manual upload.

Both required GitHub settings are now configured, and the automatic release workflow successfully published both hosting variants on 2026-10-08. Netlify's own Git-triggered builds are stopped (`stop_builds: true`), while its GitHub repository connection remains intact. GitHub Actions builds the website and publishes through the supported API route, avoiding redundant builds on Netlify.

Each build includes `release.json` with its source commit and working-tree status. Compare that commit on both public hosts with the completed Actions run to confirm that the actual latest release is live. Local commits need to be pushed before the remote workflow runs. GitHub Actions results are visible at `https://github.com/marius91153/beton-decoratif-provence/actions/workflows/deploy.yml`.

## GitHub Pages alternative

The business contact address is `contact@betondecoratifprovence.fr`. `npm run build:pages` builds the site for `/beton-decoratif-provence/` and changes the quote form into an email preparation flow. The visitor fills in the project, prepares the email, opens their mail app and sends it. Preparing the draft does not deliver a message. There is also a direct email link and a native mail form fallback. The Netlify build keeps its original form handler.

Validate this version with `npm run build:pages` followed by `PAGES_TEST=1 npm test`. `npm run deploy:pages` requests the automatic release workflow for the pushed `main` branch; it requires GitHub Actions workflow-dispatch access through `gh`. The workflow runs both hosting jobs. Local, unpushed changes are not part of that release.

The workflow publishes GitHub Pages in Actions mode at `https://marius91153.github.io/beton-decoratif-provence/`. The previous `gh-pages` branch remains as release history. Check the workflow result and public `release.json` after GitHub finishes publishing.

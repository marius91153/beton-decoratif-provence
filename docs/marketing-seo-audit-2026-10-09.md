# Marketing and SEO improvements — 2026-10-09

## Baseline and scope

The public site served clean source 4d6c739bfc374e4b7e06d0217bf9f413beddd5c8. The page and original project photographs were accessible over certificate-verified HTTPS. It already had a French language declaration, homepage canonical URL, crawlable robots/sitemap, an actual HTTP 404, accessible controls, optimized local images/fonts and native wheel inertia. Previous Lighthouse results were local laboratory measurements, not remote PageSpeed or real-user data.

The main gap was the single-page content architecture: the sitemap listed only the home URL, there were no dedicated pages for different project needs, no structured business/service graph and no sharing metadata. The existing design and real work gallery were retained.

## Implemented changes

- Four static service pages: `/terrasse-beton-imprime/`, `/allee-beton-imprime/`, `/plage-piscine-beton-imprime/` and `/beton-desactive/`. Each explains distinct preparation, design, budget and maintenance considerations, uses the appropriate real photograph/source video, supplies FAQs, and links to related services and a project-specific quotation action.
- The homepage H1 now names Provence visibly, with budget/preparation information, additional buyer FAQs, useful internal links and an explicitly qualified coverage statement. No thin town-by-town doorway pages were added.
- Unique titles/descriptions, self-consistent primary-domain canonical/OG URLs, French social metadata, a real-photo 1200×630 sharing image and the existing brand mark at 256×256. The social preview is not fetched by normal page rendering.
- Linked HomeAndConstructionBusiness (LocalBusiness subtype), WebSite, WebPage, Service and BreadcrumbList entities. Business facts match the actual page. No fabricated ratings, prices, certificates or opening times or years of experience. FAQ rich-result eligibility is not promised.
- Five indexable URLs in the sitemap. Legal, privacy, confirmation and the custom 404 are noindex. Host-specific permanent redirect rules consolidate the production Netlify alias and www onto the primary host without changing DNS.
- The service CTA preselects the correct homepage project. Optional phone/surface fields help qualify an enquiry without adding required fields. The message minimum is reduced from 20 to 10 characters so a concise, already-qualified request can be submitted. Netlify's existing form flow and the Pages email-preparation flow remain distinct. Tests mock submissions.
- Responsive dark/gold service design, lightweight styles without the homepage palette/form CSS, visible focus states, native details/summary FAQs and reading/navigation without JavaScript. Local AVIF/WebP variants use actual image layout sizes; existing home cropping is preserved.
- Privacy information explains the known Netlify/ImprovMX/email flow, voluntary social-link navigation, data-rights contact and the absence of embedded advertising/analytics. This is not a claim of completed legal compliance.

## Local identity and external actions

The owner's Google share link resolves to “SARL Béton Imprimé Provence”, knowledge ID `/g/11twj14ldl`. Google's first search response was a JavaScript shell rather than an inspectable full business panel. The official `recherche-entreprises.api.gouv.fr` search returned an active BETON IMPRIME PROVENCE company at Cuges-les-Pins. The owner explicitly confirmed that this is the legal entity behind the commercial brand on 2026-10-09. SIRET 95361735400014 and registered office 5 chemin de la Curasse, 13780 Cuges-les-Pins are now visible on the home/service footers and legal page, and match the structured PostalAddress and identifier. The legal page links the official register; privacy identifies the same data controller. Share capital, precise publication responsibility and actual retention practices still require the owner’s operational information. The supplied Google profile is linked directly, without widgets, scraped review claims or third-party tracking.

Google Search Console access and the precise intervention area are not provided. The site can be prepared for crawling, but a published sitemap is not proof of submission, indexing or rankings. Submit the canonical sitemap in the authorized Search Console property and monitor pages/Core Web Vitals once property access is available. Keep real project/gallery content updated rather than manufacturing local landing pages or reviews.

## Verification

Build, browser and performance outcomes are recorded below. The release is subsequently verified against its own workflow and exact clean source commit. Raw captures, reports and release evidence are retained in `/workspace/scratch/marketing-seo-2026-10-09`.

### Production builds and functional checks

Both production builds completed with the unchanged pinned application dependencies and lockfile. The default target passed all 42 desktop/mobile tests; the Pages target passed all 30. New shared checks exercise real static routes and metadata, linked business/service identities, mobile navigation, project-specific quotation selection, optional fields, concise requests, JavaScript-free reading/FAQs, canonical sitemap contents and excluded utility pages. Existing native-scroll and form/error checks continue to run. No real form submission or email notification was sent.

Final visual checks at 1440px, 390px and 320px found no horizontal overflow or browser errors. Real hero photographs decoded and the mobile service CTA selected the correct project. Decorative outbound arrows use SVG so they do not depend on an unavailable symbol in the font subset.

### Local Lighthouse 13.5.0 / Chromium 151

Measurements used the validated default production build on local Vite preview, serially, with no concurrent builds or browser tests. These are laboratory measurements, not Google-hosted PageSpeed reports or field Core Web Vitals. Google's PageSpeed API previously returned quota exhaustion and its public analysis was blocked by automated-query protection. No claim is made that Google indexed these changes.

| Page | Target | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| home | mobile | 99 | 100 | 100 | 100 | 1.09s | 1.88s | 0ms | 0 |
| terrasse | mobile | 100 | 100 | 100 | 100 | 0.91s | 1.66s | 0ms | 0 |
| allee | mobile | 100 | 100 | 100 | 100 | 0.97s | 1.66s | 0ms | 0 |
| piscine | mobile | 100 | 100 | 100 | 100 | 0.91s | 1.51s | 0ms | 0 |
| desactive | mobile | 100 | 100 | 100 | 100 | 0.95s | 1.65s | 0ms | 0 |
| home | desktop | 100 | 100 | 100 | 100 | 0.29s | 0.45s | 0ms | 0 |
| piscine | desktop | 100 | 100 | 100 | 100 | 0.26s | 0.37s | 0ms | 0 |

The remaining network-tree diagnostic shows a short same-origin module chain (28–41 ms), with no useful external preconnect candidate. It does not justify adding an external connection or blocking inline application code. The image-size diagnostics estimate 12–19 KiB on two mobile service images and 30 KiB on a desktop gallery image. Responsive selection preserves high-density clarity; the gallery also reuses the hero photograph already fetched by the page. The existing responsive images, local formats and lazy gallery loading are retained rather than forcing low-resolution images to remove a diagnostic hint. Homepage mobile FCP/LCP are 1.09/1.88 seconds, with zero TBT and CLS; all four service pages score 100 in all categories on mobile.

### Publication verification procedure

Every push to main triggers the existing two-job tested release. Confirm the actual completed workflow, clean release.json on the custom domain and Pages, all nine HTML documents, the five-entry sitemap, matching business identity, asset bytes/cache headers, canonical host redirects and an actual custom HTTP 404. The retained `verify-live.py` records these outcomes in `live-verification.json`; `check-browser.mjs --public` independently checks visible rendering and the mobile quote action with certificate-verifying read-only transport. This transport check is functional evidence, not a remote timing measurement. Inspect the reports from this release rather than relying on previous deployments.

# Performance audit — 2026-10-08

The optimized homepage scored **100 performance, 100 accessibility, 100 best practices and 100 SEO** in local Lighthouse 13.5.0 on both mobile and desktop. These are laboratory measurements of the production builds, not a remote Google PageSpeed report or real-user Core Web Vitals.

## Measurement method and limits

The custom domain `https://betondecoratifprovence.fr/`, Netlify address and GitHub Pages address served the correct French website over verified HTTPS. Their baseline release was `05c00f84fee1a5f163ac4d016aa238c899f4f9bb`.

PageSpeed Insights was attempted through both its public web interface and its API. The API returned HTTP 429 with no anonymous quota available; Google's web analysis requests returned its automated-query protection page. No successful Google-hosted report was produced. The browser's global HTTPS trust store was left unchanged. Lighthouse ran against Vite production previews with the same Chromium executable, default mobile/desktop presets and simulated throttling before and after the changes. No build or browser-test workload ran concurrently with those measurements.

Mobile uses simulated network RTT 150 ms, throughput 1,638.4 Kbps and 4× CPU slowdown. Chromium was HeadlessChrome 151. Scores can vary with the browser, hardware, network, cache and test location. Intermediate builds scored 97–99 on mobile while the images and font loading were being tuned; the final optimized build scored 100. Local response times do not establish real hosting latency, and laboratory TBT is not real-user INP. This audit did not retrieve Chrome UX Report field data.

## Homepage results

| Category | Mobile before | Mobile after | Desktop before | Desktop after |
| --- | ---: | ---: | ---: | ---: |
| Performance | 97 | 100 | 100 | 100 |
| Accessibility | 97 | 100 | 97 | 100 |
| Best practices | 100 | 100 | 100 | 100 |
| SEO | 92 | 100 | 92 | 100 |

| Metric | Mobile before | Mobile after | Desktop before | Desktop after |
| --- | ---: | ---: | ---: | ---: |
| First Contentful Paint | 1.68 s | 0.99 s | 0.40 s | 0.26 s |
| Largest Contentful Paint | 2.42 s | 1.88 s | 0.50 s | 0.45 s |
| Total Blocking Time | 0 ms | 0 ms | 0 ms | 0 ms |
| Cumulative Layout Shift | 0.00002 | 0 | 0.001 | 0 |

The mobile audit transferred 321,307 bytes before and 162,098 bytes after, a reduction of approximately 50%. This describes the resources loaded during that audit, including nearby lazy images; it is not the size of every file published or a guarantee of each visitor's transfer total.

## Findings and changes

| Finding | Evidence before | Implemented change |
| --- | --- | --- |
| Oversized photographs | Approximately 119 KiB of estimated mobile image savings; the hero alone was 77,712 bytes | Generate fingerprinted AVIF images with responsive WebP fallbacks. Remove black video padding, retain the original project photographs, supply a phone-specific crop and let lazy images use their actual layout widths. The phone hero AVIF is 10,895 bytes, approximately 86% smaller. |
| Styles blocking the first render | Two stylesheet requests; estimated 810 ms of mobile savings | Inline the small minified CSS in its original cascade order, with font URLs rewritten for each hosting base path. Styling works without JavaScript. |
| Fonts discovered through CSS | HTML → stylesheet → Inter/Manrope request chain | Preload the two locally hosted Latin fonts. Keep Latin Extended available and the correct Unicode-range order. Remove unrelated language subsets from emitted CSS. |
| Excess styles on the confirmation page | The complete site's visual theme was loaded for a short confirmation | Include only font declarations and the page's existing styles; approximately 1.2 KiB compressed HTML. |
| Insufficient contrast | Filter counter 3.68:1 and palette numbers 3.29:1 | Use the active button's dark text color for its counter and a darker color for the palette numbers. |
| Visible/accessibility labels disagreed | Header and footer brand links failed the label audit | Derive the accessible name from the visible brand text; retain the decorative mark and home-link title. |
| Invalid/missing crawl instructions | Local preview returned HTML at `/robots.txt`, causing the SEO audit failure | Supply a valid `robots.txt`, a sitemap and the homepage canonical URL on the custom domain. The confirmation page remains deliberately `noindex`. |
| No explicit long-lived asset policy on Netlify | Fingerprinted resources had no project cache override | Cache `/assets/*` for one year with `immutable`. Keep HTML and `release.json` revalidation so subsequent releases remain visible. Pages controls its own cache headers. |

The final mobile image-delivery and render-blocking insights passed. Desktop still suggested approximately 30 KiB of image savings for the gallery's copy of the hero photograph: Chromium reused the already-downloaded, larger hero resource. Delivering another thumbnail would add a download while the hero still requires its photograph, so this estimate does not represent an equivalent reduction in actual page transfers. Keep this distinction when evaluating future audits.

The network-dependency insight still shows the ordinary HTML → small deferred JavaScript request. There are no suitable third-party preconnect candidates. The script supplies the existing controls and quote form, with 0 ms final TBT. Moving or removing working controls solely to clear that insight would not be justified.

## Verification

- Default production build: 18 Chromium checks passed across desktop/mobile, including navigation, filters/dialogs, form validation, mocked success/failure, 320 px layout and styling/native form availability without JavaScript.
- GitHub Pages build: 6 Chromium checks passed, including repository-base asset paths, confirmation/home navigation and email preparation without claiming delivery.
- All 10 project image elements decoded on mobile and desktop. AVIF and the WebP hero fallback both loaded; the two local font families loaded and no browser errors or HTTP failures were observed.
- Every generated Pages image variant, font, preload and public reference resolved below `/beton-decoratif-provence/`.
- The confirmation page was audited separately for performance, accessibility and best practices. Its `noindex` status is intentional, so it is not represented as an indexable SEO landing page.
- Form submissions were mocked for these checks. No real contact notification was sent for the performance task. The owner had already confirmed receipt of the separately authorized ImprovMX integration test.

The existing main-branch GitHub Actions workflow builds/tests each variant before publishing Netlify and Pages. Check its completed run and each host's `release.json` for the actual source commit; a local audit does not by itself prove publication. Raw HTML/JSON audit reports and post-publication verification are retained in the cloud workspace under `/workspace/scratch/performance-2026-10-08`.

## Repeat the audit

Run `npm ci`, `npm run build`, then `npm run preview -- --port 4173 --strictPort`. Use pinned Lighthouse 13.5.0 with the installed Chromium:

```sh
npm --prefix /tmp/bdp-lighthouse install --save-exact lighthouse@13.5.0
CHROME_PATH=/usr/bin/chromium /tmp/bdp-lighthouse/node_modules/.bin/lighthouse \
  http://127.0.0.1:4173/ --chrome-flags='--headless --no-sandbox' \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output=html --output-path=/tmp/bdp-mobile
```

For desktop, add `--preset=desktop` and use a different output path. Use an appropriate writable npm cache in the cloud environment. Do not run the audit concurrently with a build or test runner, and stop the audit preview before `npm test` takes ownership of port 4173.

Once Google permits the requests, run PageSpeed Insights on the public custom domain to measure the deployed website from Google's infrastructure and inspect any available field data. Review future assets at their rendered sizes, retain lazy loading below the hero and keep source images local rather than embedding social tracking widgets.

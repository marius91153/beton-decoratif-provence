# Display theme

## Current implementation — 2026-10-10

The palette and control animation remain entirely in CSS. A small minified classic script chooses the `light`/`dark` class on `<html>` before styles to avoid a theme flash. A second classic inline script after the body markup binds the accessible button and applies those classes to both `<html>` and `<body>`. Keeping the root class establishes the theme before the body exists and styles the viewport/native controls consistently.

There is no external color-mode JavaScript chunk or confirmation module. The button works independently of delayed application JavaScript. Only an explicit choice is stored in `bdp-theme`; otherwise the theme follows live system preference. Keyboard operation, cross-tab updates, restored history, clearing/invalid preferences and denied storage remain supported. CSS follows the OS when JavaScript is disabled. Photos, swatches, the 44px control, its motion preference and all nine static pages retain the existing design.

The build minifies both inline scripts using Vite's existing minifier, with no package/lockfile change. Theme changes schedule no JavaScript frames, fetch no resources and cause no layout shift. Inlining includes the tiny control in each HTML document rather than reusing an external cache entry. The former native wheel-inertia controller is removed separately in favor of existing CSS anchor smoothing.

Use `npm run build && npm test` and `npm run build:pages && PAGES_TEST=1 npm test`. Both targets exercise theme behavior with delayed unrelated modules and assert no initial color-mode/smooth-scroll JavaScript request. New performance evidence is recorded separately; the measurements below describe the prior implementation, not this revision.

## Current local measurements — 2026-10-10

The revised default build passed 58 browser checks on desktop/mobile. Four fresh, serial local Lighthouse 13.5.0 / Chromium 151 homepage audits confirmed light/dark OS preferences in fresh browsers. Mobile performance scored 100 light / 99 dark; desktop scored 100 in both themes. Accessibility, best practices and SEO scored 100 throughout. All four measured TBT 0 ms and CLS 0. Mobile LCP was 1.81 s light / 1.88 s dark; desktop LCP was 0.45 s in either theme. These are local laboratory results, not Google-hosted PageSpeed or field Core Web Vitals.

Using identical Python gzip settings, emitted JavaScript shrank from 4,513 to 2,941 bytes compressed. Homepage HTML grew from 21,719 to 22,140 bytes with the inlined control. The homepage HTML + its referenced JavaScript decreased by approximately 1 KB compressed, and one initial JavaScript request was eliminated. This compares payloads rather than measured CDN transfer sizes. Confirmation now needs no external JavaScript. The native CSS scrolling intentionally drops custom wheel easing. Reports and candidates are retained under `/workspace/scratch/css-inline-2026-10-10`.

## Archived implementation and measurements — 2026-10-09

## Reference and implementation

The public Urbiscor home page, its inline CSS, pre-paint initializer and compiled theme control were inspected. Browser checks confirmed light → dark and persistence after reload on desktop/mobile, plus system dark → manually selected light → persisted light. It uses `urbiscor-theme`, live system preference, cross-tab storage events, a constant accessible toggle name, `aria-pressed`, a contextual action title and a 44px square sun/moon control with gold corner accents. The icons translate/rotate/scale while exchanging opacity. Its root also interpolates registered color properties for approximately 480ms. Read-only reference transport excluded external integrations and Netlify telemetry; it is evidence for the theme, not a complete-site performance assessment. Initial transport cancellation output is retained separately.

Béton Décoratif Provence uses native JavaScript and CSS with no new package. It adopts the preference, persistence and visual control behavior using the site-specific `bdp-theme` key and French accessible text. Only an explicit visitor choice is saved; no valid choice follows `prefers-color-scheme`. The initializer runs before styles and paint. Native `color-scheme` styles browser controls; real images, photograph crops and swatch colors are preserved.

The control keeps a stable 44×44px layout space, appears once its listener/state are ready, and sits beside the mobile menu. Readiness styling uses the button's native enabled state instead of an ancestor readiness selector, limiting that update to the control. Header spacing adapts at small and intermediate widths. Confirmation has the same control in a separate top corner. All nine static pages include the shared palette and pre-paint script. CSS follows the system even without JavaScript, while the inactive manual button stays hidden. Storage denial affects persistence rather than the ability to change the current page. Clearing stored preferences, cross-tab changes and history restoration are handled. Event listeners are disposed on HMR.

The added animation is limited to the icon transforms/opacity and small corner accents (200–320ms); palette values update once and existing hover interactions remain available. No document-wide registered-color interpolation, screenshot transition, image filter, JavaScript animation loop or polling is introduced. Reduced-motion users receive an immediate update. No remote fonts, images or tracking dependency is added.

Vite hoists shared CSS before page styles. Initial production tests correctly found white cards overriding the dark palette; `inlineStyles` now appends the shared color-mode stylesheet last. This applies identically to both hosting builds and avoids `!important` cascade patches. The initial failed test log is retained; final validation uses the corrected build.

## Measurement method

Baseline is published source `0ed4548c2a037debc77b811ea63f4d5f57f280f5`. Fresh local Lighthouse 13.5.0 / Chromium 151 measured the existing homepage at 99 performance on mobile and 100 on desktop, with 100 accessibility/best practices/SEO on both. Mobile FCP/LCP were 1.13/1.89 seconds; desktop 0.29/0.45 seconds; TBT and CLS were zero.

Final measurements use production Vite preview, serially without concurrent builds, tests or browser sessions. Both themes are audited on home/service layouts at mobile/desktop sizes and on the smaller confirmation layout. These are local laboratory measurements, not Google-hosted PageSpeed or field INP/Core Web Vitals. Functional HTTPS verification separately uses certificate-verifying transport through the platform proxy and must not be reported as remote performance timing.

Build output, initial/final audits, reference observations and release verification are retained in `/workspace/scratch/dark-mode-2026-10-09`.

## Final validation

The final button-readiness optimization passed 58 default and 46 Pages checks, all executed on desktop/mobile (104 total). They exercise system changes, explicit preference persistence, cross-tab/reset behavior, every static page, keyboard activation, blocked storage, theme application before delayed modules, reduced motion, JavaScript-free reading and headers from 320px through intermediate widths. Toggling adds no network requests, JavaScript animation frames or layout shifts. Existing form, navigation, SEO and native scroll checks also passed. Submission endpoints are mocked; no real message was sent.

Ten fresh audits of the final default build (`lighthouse-control-*`) completed with the requested OS theme verified in the page, no saved preference and separate fresh browsers. Accessibility/best practices were 100 throughout; SEO was 100 on the eight indexable-page audits. Confirmation is intentionally noindex and omits the SEO category.

| Page | Device | Theme | Performance | FCP | LCP | TBT | CLS |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| Home | Mobile | Light | 100 | 1.11s | 1.74s | 0ms | 0 |
| Home | Mobile | Dark | 99 | 1.06s | 1.96s | 0ms | 0 |
| Home | Desktop | Light | 100 | 0.28s | 0.46s | 0ms | 0 |
| Home | Desktop | Dark | 100 | 0.30s | 0.45s | 0ms | 0 |
| Pool | Mobile | Light | 100 | 0.95s | 1.66s | 0ms | 0 |
| Pool | Mobile | Dark | 100 | 0.90s | 1.65s | 0ms | 0 |
| Pool | Desktop | Light | 100 | 0.25s | 0.37s | 0ms | 0 |
| Pool | Desktop | Dark | 100 | 0.25s | 0.37s | 0ms | 0 |
| Confirmation | Mobile | Light | 100 | 0.90s | 1.50s | 0ms | 0 |
| Confirmation | Mobile | Dark | 100 | 0.90s | 1.50s | 0ms | 0 |

The earlier ancestor-readiness candidate (`lighthouse-final-*`) scored 100 but measured 44–67ms TBT on the mobile pool page and 4ms on dark confirmation. The final button-local selector replaced it and all ten final runs measured zero TBT/CLS. Those earlier reports are retained, rather than treating their scores as final validation. Additional prior-source pool and confirmation mobile audits measured 100 performance and zero TBT/CLS; their first attempt used an IPv6-only preview with an IPv4 URL, failed before measurement, and was corrected with an explicit IPv4 binding. The execution transport interruption occurred after the optimized build; on reconnection, the retained build was checked and both final suites completed successfully.

Homepage scores remain at least the measured baseline (99 mobile, 100 desktop). Timing varies between runs; a single laboratory comparison does not prove identical field performance or zero implementation cost. Using identical local gzip settings, all emitted JavaScript grows from 3,833 to 4,513 bytes compressed (+680), and homepage HTML including the shared palette/initializer grows from 20,326 to 21,719 bytes (+1,393). These are build payload comparisons, not CDN transfer measurements. Initial module loading is distinct from the zero-request toggle. Dependencies, lockfile, original photographs and the native scroll controller are unchanged.

Publication uses the existing push-to-main workflow, which repeats both test suites before publishing each hosting build. Confirm that release's completed jobs and both public `release.json` values, then compare all nine HTML documents and their assets with the retained candidates. Netlify's known detected-form tag normalization is the only permitted HTML difference. Public-browser checks must additionally verify both themes, toggling and reload persistence on desktop/mobile; their certificate-verifying proxy transport is functional evidence only. The corresponding workflow and live verification results are retained beside the audit reports.

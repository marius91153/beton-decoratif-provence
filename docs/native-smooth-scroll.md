# Native CSS scrolling — 2026-10-10

The owner chose native browser scrolling instead of reproducing Urbiscor's Lenis wheel inertia. Home and service/utility layouts already include `html { scroll-behavior: smooth }` with a header offset. Their reduced-motion media query changes it to `auto`. No custom smooth-scroll module, wheel listener, animation frame loop or library is loaded.

`scroll-behavior` smooths anchor and programmatic scrolling. It does not add easing to mouse-wheel/touch gestures: those use the browser/device behavior, including any platform-provided inertia. The browser chooses the duration/easing for CSS scrolling. Fragment URLs, history, focus, keyboard, native touch, editable/nested areas and modal overscroll containment remain browser-owned.

Six shared checks on desktop/mobile cover wheel gestures without interception/JavaScript frames, animated anchors with JavaScript disabled and the header offset, keyboard/anchor navigation, textarea/modal scrolling, live reduced motion/zoom and real touch/document boundaries. The previous inertia-specific assertions were replaced to match the requested behavior; form/navigation/SEO checks remain enabled.

Use `npm run build && npm test` for Netlify and `npm run build:pages && PAGES_TEST=1 npm test` for GitHub Pages. Publication uses the existing tested main-branch workflow. Verify both completed hosting jobs and public `release.json` before claiming a live release.

The removed 2026-10-09 controller matched Urbiscor's 1.15-second fine-pointer exponential easing. Historical reference/measurement artifacts remain under `/workspace/scratch/smooth-scroll-2026-10-09`; those results are not measurements of this CSS-only revision.

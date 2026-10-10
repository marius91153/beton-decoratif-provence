# Native smooth scrolling

On 2026-10-09, the owner requested the smooth-scroll behavior of `https://urbiscor.ro/` on the BDP website, explicitly implemented without the Lenis library.

## Reference inspection

The live Urbiscor bundle `/assets/index-CXEfuy5d.js` initializes Lenis with `autoRaf: false`, `smoothWheel: true`, `syncTouch: false` and `duration: 1.15`. It enables the effect only for a fine pointer without a reduced-motion preference. Its scheduler requests animation frames while scrolling and stops when idle. The loaded `/assets/lenis-BBml_0t9.js` supplies exponential easing, pixel/line/page wheel normalization and a multiplier of 1.

A real Chromium wheel gesture of 600 pixels was measured on the public site, using a certificate-verifying HTTPS client for browser transport. The scroll position approached its target gradually and reached 600 pixels after approximately 1.1 seconds. Measurements of the independent native implementation closely followed the same curve:

| Approximate elapsed time | Urbiscor | BDP native |
| --- | ---: | ---: |
| 100 ms | 197 px | 196 px |
| 200 ms | 380 px | 379 px |
| 400 ms | 534 px | 534 px |
| 600 ms | 581 px | 581 px |
| 1,100 ms | 600 px | 600 px |

The gestures were recorded in separate sessions; their sample clocks differed by approximately 4 ms. These measurements compare behavior, not network performance or a guarantee of frame timing on every device. Raw samples are retained under `/workspace/scratch/smooth-scroll-2026-10-09`.

## Implementation

`src/smooth-scroll.js` uses `requestAnimationFrame` and `window.scrollTo` to move the actual browser scroll position. It adds no library, synthetic scrollbar, transformed page wrapper or continuously running animation loop. Each wheel gesture accumulates a bounded target and restarts a 1.15-second exponential transition from the current position. Pixel, line and page deltas are normalized; successive gestures can reverse direction.

Browser anchor navigation retains its existing CSS smoothing, fragment URLs, history and scroll offsets. Keyboard input, clicks, pointer/touch input, external scroll changes, resizing, visibility changes and history navigation cancel wheel inertia so it cannot pull the page away from the user's next action. A new wheel gesture takes priority over a browser anchor animation.

The controller attaches its non-passive wheel listener only when a fine pointer is available and reduced motion is disabled. Touch movement is not intercepted. Zoom/modifier gestures, horizontal wheel input, form controls, editable content and nested scrollable containers retain native handling. The material modal keeps scrolling inside its own viewport; CSS overscroll containment prevents scroll chaining behind it. `[data-native-scroll]` provides an optional explicit opt-out for future nested controls.

The existing application initializes the controller once. Abortable listeners are disposed by Vite's HMR lifecycle. Scroll-position and layout reads wait until an actual wheel gesture rather than forcing layout during startup. Package declarations and lockfiles remain unchanged. The production JavaScript remains approximately 3.3 KB compressed, less than 1 KB above the previous bundle.

## Verification

Six shared browser checks run on both desktop and mobile, on both hosting variants. They verify gradual bounded motion, accumulated/reversed gestures, no animation frames at rest, keyboard and anchor interruption, textarea/modal handling, runtime reduced-motion changes, zoom preservation, a real Chromium touch gesture and document boundaries. Existing quotation and navigation tests remain enabled; their POST requests are mocked.

The final Netlify build passed 30 browser checks and the final Pages build passed 18, for 48 checks across the two targets.

The final production build scored 100 in performance, accessibility, best practices and SEO in local Lighthouse 13.5.0 on both mobile and desktop. Mobile FCP was 0.93 s and LCP 1.89 s; desktop FCP was 0.33 s and LCP 0.45 s. Both reported 0 ms TBT and 0 CLS. The initial mobile candidate scored 99 with 120 ms TBT; the final measurement follows removal of the controller's eager scroll-position read. Both initial and final reports are retained under `/workspace/scratch/smooth-scroll-2026-10-09`. These are separate local laboratory runs, not a Google-hosted PageSpeed report or real-user metrics. The audits used the production preview, the installed Chromium 151, Lighthouse's default mobile/desktop presets and simulated throttling without concurrent builds or browser tests.

Use `npm run build && npm test` for Netlify and `npm run build:pages && PAGES_TEST=1 npm test` for GitHub Pages. Both targets include the shared scroll tests. Publication continues through the existing tested main-branch workflow; verify the completed run and public `release.json` before claiming a live release.

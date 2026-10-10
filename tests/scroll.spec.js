import { test, expect } from "@playwright/test";

async function probe(page) {
  await page.addInitScript(() => {
    const request = window.requestAnimationFrame.bind(window);
    const cancel = window.cancelAnimationFrame.bind(window);
    window.__scrollProbe = { positions: [], pending: new Set(), calls: 0, prevented: null };
    window.requestAnimationFrame = (callback) => {
      const id = request(time => {
        window.__scrollProbe.pending.delete(id);
        callback(time);
        window.__scrollProbe.positions.push(window.scrollY);
      });
      window.__scrollProbe.calls++;
      window.__scrollProbe.pending.add(id);
      return id;
    };
    window.cancelAnimationFrame = id => {
      window.__scrollProbe.pending.delete(id);
      cancel(id);
    };
  });
  await page.goto("./");
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    window.addEventListener("wheel", event => {
      window.__scrollProbe.prevented = event.defaultPrevented;
    }, { passive: true });
  });
  const viewport = page.viewportSize();
  await page.mouse.move(viewport.width / 2, viewport.height / 2);
}

async function near(page, position) {
  await expect.poll(() => page.evaluate(() => scrollY), { timeout: 5000 })
    .toBeGreaterThanOrEqual(position - 1);
  await expect.poll(() => page.evaluate(() => scrollY), { timeout: 5000 })
    .toBeLessThanOrEqual(position + 1);
}

test("wheel scrolling is browser-owned with no intercepted gestures or JavaScript animation frames", async ({ page }) => {
  await probe(page);
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "smooth");
  await page.mouse.wheel(0, 600);
  await near(page, 600);
  expect(await page.evaluate(() => window.__scrollProbe.prevented)).toBe(false);
  expect(await page.evaluate(() => window.__scrollProbe.calls)).toBe(0);
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => window.__scrollProbe.calls)).toBe(0);
});

test("CSS anchors animate without application JavaScript and respect the header offset", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: "no-preference", viewport: testInfo.project.use.viewport });
  const page = await context.newPage();
  const base = process.env.PAGES_TEST ? "/beton-decoratif-provence/" : "/";
  try {
    await page.goto("http://127.0.0.1:4173" + base);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("html")).toHaveCSS("scroll-behavior", "smooth");
    const target = await page.locator("#contact").evaluate(el => el.offsetTop);
    await page.locator('.hero-actions a[href="#contact"]').evaluate(el => el.click());
    await expect(page).toHaveURL(/#contact$/);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
    expect(await page.evaluate(() => scrollY)).toBeLessThan(target - 160);
    await expect.poll(() => page.locator("#contact").evaluate(el => el.getBoundingClientRect().top))
      .toBeLessThanOrEqual(160);
    await page.waitForTimeout(250);
    const top = await page.locator("#contact").evaluate(el => el.getBoundingClientRect().top);
    expect(top).toBeGreaterThanOrEqual(-1);
    expect(top).toBeLessThanOrEqual(160);
  } finally { await context.close(); }
});

test("keyboard and CSS anchor navigation remain usable after wheel gestures", async ({ page }, testInfo) => {
  await probe(page);
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await page.keyboard.press("Home");
  await near(page, 0);
  await page.waitForTimeout(1250);
  await near(page, 0);

  await page.mouse.wheel(0, 450);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  if (testInfo.project.name === "mobile") {
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  }
  await page.getByRole("navigation", { name: "Navigation principale" })
    .getByRole("link", { name: /Votre projet/ }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect.poll(() => page.locator("#contact").evaluate(element => element.getBoundingClientRect().top))
    .toBeLessThanOrEqual(160);
  await page.waitForTimeout(1250);
  const top = await page.locator("#contact").evaluate(element => element.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(-1);
  expect(top).toBeLessThanOrEqual(160);
});

test("textarea and modal scrolling stay native and do not move the background", async ({ page }) => {
  await probe(page);
  const message = page.getByLabel("Parlez-nous de votre projet");
  await message.fill(Array(80).fill("Une ligne du projet.").join("\n"));
  await message.hover();
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 350);
  await expect.poll(() => message.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  expect(await page.evaluate(() => scrollY)).toBe(before);
  expect(await page.evaluate(() => window.__scrollProbe.prevented)).toBe(false);

  await page.setViewportSize({ width: page.viewportSize().width, height: 480 });
  await page.getByRole("button", { name: /Sable Doux/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.hover();
  const background = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 400);
  await expect.poll(() => dialog.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  await page.mouse.wheel(0, 5000);
  await page.waitForTimeout(100);
  expect(await page.evaluate(() => scrollY)).toBe(background);
  expect(await page.evaluate(() => window.__scrollProbe.prevented)).toBe(false);
  expect(await page.evaluate(() => {
    const event = new WheelEvent("wheel", { deltaY: 400, ctrlKey: true, cancelable: true });
    window.dispatchEvent(event);
    return !event.defaultPrevented;
  })).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("CSS scrolling respects live reduced-motion preferences and preserves zoom gestures", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await probe(page);
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await page.mouse.wheel(0, 350);
  await near(page, 350);
  expect(await page.evaluate(() => window.__scrollProbe.prevented)).toBe(false);
  expect(await page.evaluate(() => window.__scrollProbe.calls)).toBe(0);

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "smooth");
  await page.mouse.wheel(0, 200);
  await near(page, 550);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  expect(await page.evaluate(() => window.__scrollProbe.calls)).toBe(0);
  const stopped = await page.evaluate(() => scrollY);
  await page.waitForTimeout(1250);
  expect(await page.evaluate(() => scrollY)).toBe(stopped);

  await page.emulateMedia({ reducedMotion: "no-preference" });
  const untouched = await page.evaluate(() => {
    const event = new WheelEvent("wheel", { deltaY: 400, ctrlKey: true, cancelable: true });
    window.dispatchEvent(event);
    return !event.defaultPrevented;
  });
  expect(untouched).toBe(true);
  expect(await page.evaluate(() => window.__scrollProbe.pending.size)).toBe(0);
});

test("touch scrolling and document boundaries remain usable", async ({ page }, testInfo) => {
  await probe(page);
  if (testInfo.project.name === "mobile") {
    const session = await page.context().newCDPSession(page);
    await page.evaluate(() => {
      window.__touchPrevented = [];
      window.addEventListener("touchmove", event => window.__touchPrevented.push(event.defaultPrevented), { passive: true });
    });
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 195, y: 650 }] });
    for (const y of [570, 490, 410, 330]) {
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 195, y }] });
      await page.waitForTimeout(40);
    }
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(200);
    expect(await page.evaluate(() => window.__touchPrevented.every(value => !value))).toBe(true);
    expect(await page.evaluate(() => window.__scrollProbe.calls)).toBe(0);
    await page.waitForTimeout(800);
    await session.detach();
  }
  await page.mouse.wheel(0, 1000000);
  const limit = await page.evaluate(() => document.scrollingElement.scrollHeight - innerHeight);
  await near(page, limit);
  await page.mouse.wheel(0, -1000000);
  await near(page, 0);
});

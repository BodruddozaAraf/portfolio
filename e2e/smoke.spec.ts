import { expect, test, type Page } from "@playwright/test";
import { profile, projects, research } from "../src/content";
import { PREFERENCES_KEY, VISITED_KEY } from "../src/lib/preferences-key";
import { TELEGRAM_TO } from "../src/lib/telegram";

// Smoke tests (docs/04-architecture.md, Testing): the pages load, Plain mode holds every
// project, the telegram composes a correct link, the 404 renders, and nothing logs an error.

/** Console errors and uncaught exceptions, collected for every test and checked at its end. */
function watchErrors(page: Page, allow: RegExp[] = []) {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error" && !allow.some((a) => a.test(m.text())))
      errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e)));
  return errors;
}

/** Skip the Chapter I loader: it shows once per session. */
async function visited(page: Page) {
  await page.addInitScript(
    (key) => sessionStorage.setItem(key, "1"),
    VISITED_KEY,
  );
}

test("home: the loader lifts on its own and the journal is there", async ({
  page,
}) => {
  const errors = watchErrors(page);
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-loader", "show");
  // never longer than LOADER_MAX_MS (9s), with room for a slow machine
  await expect(page.locator("html")).toHaveAttribute("data-loader", "done", {
    timeout: 15_000,
  });
  await expect(
    page.getByRole("heading", { level: 1, name: profile.name }),
  ).toBeVisible();
  for (const id of ["about", "bounties", "trail", "satchel", "send-word"])
    await expect(page.locator(`#${id}`)).toBeAttached();
  for (const p of projects)
    await expect(
      page.locator("#bounties").getByRole("link", { name: p.bountyTitle }),
    ).toBeAttached();
  expect(errors).toEqual([]);
});

test("home: the skip link reaches the journal", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard");
  await visited(page);
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to the journal" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  // the page glides there (and CleanHash drops the #about from the address)
  await expect(page.locator("#about h2").first()).toBeInViewport();
});

test("plain mode: every project, the thesis and the contacts, no effects", async ({
  page,
}) => {
  const errors = watchErrors(page);
  await page.goto("/plain");
  await expect(
    page.getByRole("heading", { level: 1, name: profile.name }),
  ).toBeVisible();
  const main = page.getByRole("main");
  for (const p of projects) await expect(main).toContainText(p.name);
  await expect(main).toContainText(research.title);
  await expect(
    main.getByRole("link", { name: profile.email }).first(),
  ).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("plain mode switch: the journal itself goes plain", async ({ page }) => {
  await page.addInitScript(
    (key) =>
      localStorage.setItem(
        key,
        JSON.stringify({ state: { plainMode: true }, version: 0 }),
      ),
    PREFERENCES_KEY,
  );
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-plain", "true");
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("telegram: checks the fields, then composes the mail", async ({
  page,
}) => {
  const errors = watchErrors(page);
  await visited(page);
  await page.goto("/#send-word");
  const form = page.getByRole("form", { name: "Telegram" });
  await form.scrollIntoViewIfNeeded();
  await form.getByRole("button", { name: "Send word" }).click();
  await expect(form.getByText("Put your name on it.")).toBeVisible();
  await expect(form.getByLabel("Your name")).toBeFocused();

  await form.getByLabel("Your name").fill("  Ada Lovelace ");
  await form.getByLabel("Your email").fill("ada@example.com");
  await form.getByLabel("The message").fill("Hello Araf,\nA job & a question?");
  await form.getByRole("button", { name: "Send word" }).click();

  // full motion transmits it in Morse first; then the two ways to send it
  const gmail = page.getByRole("link", { name: /Send via Gmail/ });
  await expect(gmail).toBeVisible({ timeout: 20_000 });
  const url = new URL((await gmail.getAttribute("href"))!);
  expect(url.origin + url.pathname).toBe("https://mail.google.com/mail/");
  expect(url.searchParams.get("to")).toBe(TELEGRAM_TO);
  expect(url.searchParams.get("su")).toBe(
    "Telegram from Ada Lovelace via bodruddozaaraf.me",
  );
  expect(url.searchParams.get("body")).toBe(
    "Hello Araf,\nA job & a question?\n\nAda Lovelace\nada@example.com",
  );
  const mailto = await page
    .getByRole("link", { name: "Use my mail app" })
    .getAttribute("href");
  expect(mailto).toMatch(new RegExp(`^mailto:${TELEGRAM_TO}\\?subject=`));
  expect(mailto).toContain("%0D%0A"); // CRLF line breaks (RFC 6068)
  expect(errors).toEqual([]);
});

for (const p of projects) {
  test(`case study: ${p.slug}`, async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto(`/bounties/${p.slug}`);
    await expect(
      page.getByRole("heading", { level: 1, name: p.bountyTitle }),
    ).toBeVisible();
    await expect(page.getByRole("main")).toContainText(p.name);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /\/og\//,
    );
    expect(errors).toEqual([]);
  });
}

test("research: the torn page", async ({ page }) => {
  const errors = watchErrors(page);
  await page.goto(`/research/${research.slug}`);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("main")).toContainText("image");
  expect(errors).toEqual([]);
});

test("404: off the map, with the way back", async ({ page }) => {
  // the browser logs the 404 response itself; nothing else may error
  const errors = watchErrors(page, [/status of 404/]);
  const res = await page.goto("/no-such-trail");
  expect(res?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: "Off the Map" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to camp" }).click();
  await expect(page).toHaveURL(/\/$/);
  expect(errors).toEqual([]);
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("no loader, no 3D, the hero is still there", async ({ page }) => {
    const errors = watchErrors(page);
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveAttribute(
      "data-loader",
      "show",
    );
    await expect(
      page.getByRole("heading", { level: 1, name: profile.name }),
    ).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
    expect(errors).toEqual([]);
  });
});

/**
 * The local preview server ignores public/_headers (only Cloudflare applies it).
 * This test adds those headers to every response itself, then runs the full
 * flow and fails if the Content-Security-Policy blocks anything the site needs.
 */
import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

/** Parse the "/*" block of public/_headers into { name: value }. */
function headersFromFile(): Record<string, string> {
  const headers: Record<string, string> = {};
  let inBlock = false;
  for (const line of readFileSync("public/_headers", "utf8").split("\n")) {
    if (line.startsWith("#") || line.trim() === "") continue;
    if (!line.startsWith(" ")) {
      inBlock = line.trim() === "/*";
      continue;
    }
    if (inBlock) {
      const [name, ...value] = line.trim().split(":");
      headers[name] = value.join(":").trim();
    }
  }
  return headers;
}

test("_headers defines the CSP and noindex", () => {
  const headers = headersFromFile();
  expect(headers["Content-Security-Policy"]).toContain("script-src 'self'");
  expect(headers["X-Robots-Tag"]).toContain("noindex");
});

test("the site works under its own Content-Security-Policy", async ({ page }) => {
  const extra = headersFromFile();
  await page.route("**/*", async (route) => {
    const response = await route.fetch();
    await route.fulfill({ response, headers: { ...response.headers(), ...extra } });
  });

  const violations: string[] = [];
  page.on("console", (msg) => {
    if (/Content Security Policy|Refused to/i.test(msg.text())) violations.push(msg.text());
  });

  await page.goto("/");
  await page.goto("/test");
  for (let item = 1; item <= 18; item++) {
    await page.locator(`#q${item}`).getByLabel("Never", { exact: true }).check();
    if (item < 18) await page.getByRole("button", { name: "Next" }).click();
  }
  await page.getByRole("button", { name: "Show my result" }).click();
  await expect(page.locator("#result")).toContainText("Screening score: 0 out of 6");

  // The stylesheet must still apply (it would be blocked if CSS were inlined).
  const bodyFont = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(bodyFont).toContain("system-ui");

  expect(violations).toEqual([]);
});

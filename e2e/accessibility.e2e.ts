/**
 * Automated WCAG 2.2 AA scan (axe-core) of every page state.
 * Automated checks catch roughly a third to half of issues; a manual pass
 * (keyboard, screen reader) is still part of milestone 5.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const WCAG_AA = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function expectNoViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze();
  // Print readable details if anything fails.
  expect(violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length}×)`)).toEqual([]);
}

test("home page", async ({ page }) => {
  await page.goto("/");
  await expectNoViolations(page);
});

test("questionnaire", async ({ page }) => {
  await page.goto("/test");
  await expectNoViolations(page);
});

test("result view (evidence section open)", async ({ page }) => {
  await page.goto("/test");
  for (let item = 1; item <= 18; item++) {
    await page.locator(`#q${item}`).getByLabel("Often", { exact: true }).check();
    if (item < 18) await page.getByRole("button", { name: "Next" }).click();
  }
  await page.getByRole("button", { name: "Show my result" }).click();
  await page.getByText("About the evidence").click();
  await expectNoViolations(page);
});

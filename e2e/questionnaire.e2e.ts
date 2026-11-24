import { expect, test, type Page } from "@playwright/test";

const LABELS = ["Never", "Rarely", "Sometimes", "Often", "Very Often"];

/** Answer the visible question, then press Enter to go on (keyboard path). */
async function answer(page: Page, item: number, code: number, pressEnter: boolean) {
  const question = page.locator(`#q${item}`);
  await expect(question).toBeVisible();
  await question.getByLabel(LABELS[code], { exact: true }).check();
  if (pressEnter) await page.keyboard.press("Enter");
}

test("golden case: answers stay on the page, result shows the cited figures", async ({ page }) => {
  await page.goto("/test");

  // Golden case (brief 5.5): items 1–3 Sometimes, item 4 Often, rest Never.
  const golden = [2, 2, 2, 3, ...Array(14).fill(0)];
  for (let i = 0; i < 18; i++) {
    await answer(page, i + 1, golden[i], i < 17);
  }

  // From here on, no request may leave the page (brief: nothing is sent).
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));

  await page.getByRole("button", { name: "Show my result" }).click();

  const result = page.locator("#result");
  await expect(result).toBeVisible();
  await expect(result).toBeFocused();
  await expect(result).toContainText("Screening score: 4 out of 6");
  await expect(result).toContainText("68.7%");
  await expect(result).toContainText("0.5%");
  await expect(result).toContainText("Inattention: 4 of 9");
  await expect(result).toContainText("Hyperactivity / impulsivity: 0 of 9");
  await expect(result).toContainText("not a diagnosis");
  await expect(result.getByRole("link", { name: /Table 4/ })).toHaveAttribute("href", /doi\.org/);

  expect(new URL(page.url()).search).toBe(""); // no ?q1=… in the URL
  expect(requests).toEqual([]);
});

test("one question at a time: Next unlocks after answering, Back returns", async ({ page }) => {
  await page.goto("/test");
  await expect(page.getByText("Question 1 of 18")).toBeVisible();
  await expect(page.locator("#q2")).toBeHidden();

  const next = page.getByRole("button", { name: "Next" });
  await expect(next).toBeDisabled();
  await answer(page, 1, 1, false);
  await expect(next).toBeEnabled();
  await next.click();

  await expect(page.getByText("Question 2 of 18")).toBeVisible();
  await expect(page.locator("#q1")).toBeHidden();

  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.locator("#q1").getByLabel("Rarely", { exact: true })).toBeChecked();
});

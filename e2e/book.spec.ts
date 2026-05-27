import { test, expect } from "@playwright/test";

test("the home page renders an interactive book", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("book-root")).toBeVisible();
  await expect(page.getByTestId("book-cover")).toBeVisible();
});

test("the cover responds to pointer X position", async ({ page }) => {
  await page.goto("/");
  const cover = page.getByTestId("book-cover");
  await expect(cover).toBeVisible();

  const { width, height } = page.viewportSize() ?? { width: 1280, height: 720 };

  // Move pointer to far right → book closed → cover rotateY ≈ 0
  await page.mouse.move(width - 5, height / 2);
  await page.waitForTimeout(500);
  const closedTransform = await cover.evaluate((el) => getComputedStyle(el).transform);

  // Move pointer to far left → book open → cover rotateY ≈ -174°
  await page.mouse.move(5, height / 2);
  await page.waitForTimeout(700);
  const openTransform = await cover.evaluate((el) => getComputedStyle(el).transform);

  expect(closedTransform).not.toEqual(openTransform);
});

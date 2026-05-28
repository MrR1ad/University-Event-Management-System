import { test, expect } from "@playwright/test";

test("frontend application loads without crashing", async ({ page }) => {
  const response = await page.goto("/");

  expect(response).not.toBeNull();
  expect(response.status()).toBeLessThan(500);

  const root = page.locator("#root");

  await expect(root).toHaveCount(1);

  const html = await page.content();

  expect(html).toContain("root");
  expect(html.length).toBeGreaterThan(0);
});
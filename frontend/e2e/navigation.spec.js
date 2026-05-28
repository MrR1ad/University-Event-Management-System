import { test, expect } from "@playwright/test";

test("application renders main page content", async ({ page }) => {
  await page.goto("/");

  await page.waitForLoadState("networkidle");

  const html = await page.content();

  expect(html.length).toBeGreaterThan(0);
  expect(html).toContain("root");

  const title = await page.title();

  expect(title).toBe("IUS Event Management");
});
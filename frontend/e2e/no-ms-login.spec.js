import { test, expect } from "@playwright/test";

test("e2e mode does not redirect to Microsoft login", async ({ page }) => {
  await page.goto("/");

  await page.waitForTimeout(1000);

  expect(page.url()).not.toContain("login.microsoftonline.com");
});
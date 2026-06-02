import { test, expect } from "@playwright/test";

test("student events page displays mocked event", async ({ page }) => {
  await page.route("**/api/auth/me", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        name: "Test Student",
        email: "student@test.com",
        roles: ["Student"],
        primaryRole: "Student",
      }),
    });
  });

  await page.route("**/api/events", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: 1,
          title: "Mocked E2E Event",
          category: "Workshop",
          description: "This event is mocked inside Playwright.",
          startDate: new Date(Date.now() + 86400000).toISOString(),
          endDate: new Date(Date.now() + 93600000).toISOString(),
          capacity: 100,
          registered: 10,
          status: "Upcoming",
          venueId: 1,
          venueName: "Main Hall",
          organizerId: 1,
          organizerName: "Organizer",
        },
      ]),
    });
  });

  await page.goto("/student");

  await page.waitForLoadState("networkidle");

  await expect(page.getByText("Mocked E2E Event")).toBeVisible();
});
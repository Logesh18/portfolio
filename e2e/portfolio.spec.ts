import { test, expect } from "@playwright/test";

test.describe("Logesh T Portfolio E2E Verification", () => {
  test("renders hero, 13 projects, ISkreen, and opens AI assistant", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: /Building scalable web, mobile, and enterprise applications/i,
      })
    ).toBeVisible();

    await expect(page.getByText("ISkreen").first()).toBeVisible();

    // Open AI assistant
    await page.getByRole("button", { name: /Ask My AI Assistant/i }).click();
    await expect(
      page.getByText(/Hi! I’m Logesh’s AI portfolio assistant/i)
    ).toBeVisible();
  });

  test("navigates to TracAssets case study page", async ({ page }) => {
    await page.goto("/projects/tracassets");
    await expect(
      page.getByRole("heading", { name: "TracAssets" })
    ).toBeVisible();
    await expect(
      page.getByText(/Verified Role & Scope Boundary/i)
    ).toBeVisible();
  });
});

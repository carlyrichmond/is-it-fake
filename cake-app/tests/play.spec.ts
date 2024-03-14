import { test, expect } from "@playwright/test";

test("play shows image and buttons", async ({ page }) => {
  await page.goto("/play");

  // Check image is present
  const cakeImage = page.getByTestId("cake-image");
  await expect(cakeImage).toBeDefined();

  // Check buttons
  const cakeButton = page.getByTestId("cake-button");
  await expect(cakeButton).toBeDefined();

  const notCakeButton = page.getByTestId("not-cake-button");
  await expect(notCakeButton).toBeDefined();
});

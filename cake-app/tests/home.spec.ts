import { test, expect } from "@playwright/test";

test("homepage has title information", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle("Is it (F)ake?!");

  // create a locator
  const paragraph = page.getByTestId("game-description");

  // Expect an attribute "to be strictly equal" to the value.
  await expect(paragraph).toContainText('Beat the models and find the cake!');
});

test("homepage shows rules wizard", async ({ page }) => {
  await page.goto("/");

  // Check the rules page is there
  const rulesTitle = page.getByTestId("rules-title");
  await expect(rulesTitle).toHaveText("How to play!");

  // Check the button navigation
  const rulesStep = page.getByTestId("rules-step-message");
  await expect(rulesStep).toContainText("You have 2 minutes to classify as many images as you can.");

  // Validate step changes on step click
  const nextStepButton = page.getByTestId("next-step-button");
  expect(nextStepButton).toBeDefined();

  const restartButton = page.getByTestId("restart-button");
  expect(restartButton).not.toBeVisible();

  nextStepButton.click();
  await expect(rulesStep).toContainText("For each image shown select the Cake button");

  nextStepButton.click();
  await expect(rulesStep).toContainText("Hit Play! above to start.");
  expect(nextStepButton).not.toBeVisible();
  expect(restartButton).toBeDefined();

});

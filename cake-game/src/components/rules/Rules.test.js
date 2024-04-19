import { test, expect } from '@playwright/experimental-ct-react';
import Rules from './Rules';

test.use({ viewport: { width: 500, height: 500 } });

test('should work', async ({ mount }) => {
  const component = await mount(<Rules />);
  await expect(component).toContainText('Classify the 10 provided images as quickly as you can.');
});
 
test(`[Rules Component]: Should render step 1`, async ({ mount }) => {
  const component = await mount(<Rules />);
  await expect(component).toContainText('Classify the 10 provided images as quickly as you can.');
});

test(`[Rules Component]: Should render step 2`, async ({ mount }) => {
  const component = await mount(<Rules />);
  await expect(component).toContainText('Classify the 10 provided images as quickly as you can.');

  const rulesStepMessage = component.getByTestId('rules-step-message');
  const nextStepButton = component.getByTestId('next-step-button');
  await nextStepButton.click();
  expect(await rulesStepMessage.innerHTML()).toContain('For each image shown select the <b>Cake</b> button');
});

test(`[Rules Component]: Should render step 3 and restart button`, async ({ mount }) => {
  const component = await mount(<Rules />);
  await expect(component).toContainText('Classify the 10 provided images as quickly as you can.');

  // Step 2
  const rulesStepMessage = component.getByTestId('rules-step-message');
  let nextStepButton = component.getByTestId('next-step-button');
  await nextStepButton.click();

  // Step 3
  await nextStepButton.click();
  expect(await rulesStepMessage.innerHTML()).toContain('Hit <b>Play!</b> above to start.');

  const restartButton = component.getByTestId('restart-button');
  expect(restartButton).toBeVisible();
});

test(`[Rules Component]: Should restart steps wizard`, async ({ mount }) => {
  const component = await mount(<Rules />);
  await expect(component).toContainText('Classify the 10 provided images as quickly as you can.');

  // Steps 2 and 3
  const rulesStepMessage = component.getByTestId('rules-step-message');
  const nextStepButton = component.getByTestId('next-step-button');
  await nextStepButton.click();
  await nextStepButton.click();
  expect(await rulesStepMessage.innerHTML()).toContain('Hit <b>Play!</b> above to start.');

  const restartButton = component.getByTestId('restart-button');
  await restartButton.click();

  expect(restartButton).toBeHidden();
  expect(nextStepButton).toBeVisible();

  await expect(component).toContainText('Classify the 10 provided images as quickly as you can.');
});
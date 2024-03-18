import { createDOM } from '@builder.io/qwik/testing';
import { test, expect } from 'vitest';
import { Rules } from './rules';
 
test(`[Rules Component]: Should render step 1`, async () => {
  const { screen, render } = await createDOM();
  await render(<Rules />);
  
  expect(screen.outerHTML).toContain('You have 2 minutes to classify as many images as you can.');
});

test(`[Rules Component]: Should render step 2`, async () => {
  const { screen, render, userEvent } = await createDOM();
  await render(<Rules />);
  
  expect(screen.outerHTML).toContain('You have 2 minutes to classify as many images as you can.');

  const rulesStepMessage = screen.querySelector('[data-testid="rules-step-message"]') as HTMLDivElement;
  await userEvent('[data-testid="next-step-button"]', 'click');
  expect(rulesStepMessage.innerHTML).toContain('For each image shown select the <b>Cake</b> button');

  const restartButton = screen.querySelector('[data-testid="restart-button"]') as HTMLDivElement;
  expect(restartButton).toBeUndefined();
});

test(`[Rules Component]: Should render step 3 and restart button`, async () => {
  const { screen, render, userEvent } = await createDOM();
  await render(<Rules />);
  
  expect(screen.outerHTML).toContain('You have 2 minutes to classify as many images as you can.');

  // Step 2
  const rulesStepMessage = screen.querySelector('[data-testid="rules-step-message"]') as HTMLDivElement;
  await userEvent('[data-testid="next-step-button"]', 'click');

  // Step 3
  await userEvent('[data-testid="next-step-button"]', 'click');
  expect(rulesStepMessage.innerHTML).toContain('Hit <b>Play!</b> above to start.');

  const restartButton = screen.querySelector('[data-testid="restart-button"]') as HTMLDivElement;
  expect(restartButton).toBeDefined();

  const nextStepButton = screen.querySelector('[data-testid="next-step-button"]') as HTMLDivElement;
  expect(nextStepButton).toBeUndefined();
});

test(`[Rules Component]: Should restart steps wizard`, async () => {
  const { screen, render, userEvent } = await createDOM();
  await render(<Rules />);
  
  expect(screen.outerHTML).toContain('You have 2 minutes to classify as many images as you can.');

  // Steps 2 and 3
  const rulesStepMessage = screen.querySelector('[data-testid="rules-step-message"]') as HTMLDivElement;
  await userEvent('[data-testid="next-step-button"]', 'click');
  await userEvent('[data-testid="next-step-button"]', 'click');
  expect(rulesStepMessage.innerHTML).toContain('Hit <b>Play!</b> above to start.');

  await userEvent('[data-testid="restart-button"]', 'click');

  // Check we are back to the start
  const restartButton = screen.querySelector('[data-testid="restart-button"]') as HTMLDivElement;
  expect(restartButton).toBeUndefined();

  const nextStepButton = screen.querySelector('[data-testid="next-step-button"]') as HTMLDivElement;
  expect(nextStepButton).toBeDefined();

  expect(screen.outerHTML).toContain('You have 2 minutes to classify as many images as you can.');
});
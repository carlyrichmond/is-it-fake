import { createDOM } from '@builder.io/qwik/testing';
import { test, expect } from 'vitest';
import { Hero } from './hero';
 
test(`[Hero Component]: Should render title`, async () => {
  const { screen, render } = await createDOM();
  await render(<Hero />);
  
  expect(screen.outerHTML).toContain('Is it <span class="highlight">(F)ake</span>?!');
});

test(`[Hero Component]: Should render call to action paragraph`, async () => {
  const { screen, render } = await createDOM();
  await render(<Hero />);
  
  expect(screen.outerHTML).toContain('Beat the models and find the cake!');
});
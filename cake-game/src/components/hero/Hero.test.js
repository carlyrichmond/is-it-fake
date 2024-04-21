import { test, expect } from '@playwright/experimental-ct-react';
import Hero from './Hero';

test.use({ viewport: { width: 500, height: 500 } });

test(`[Hero Component]: should render title`, async ({ mount }) => {
  const component = await mount(<Hero />);
  expect(component).toBeDefined();
});

/*test(`[Hero Component]: Should render title`, async ({ mount }) => {
  const component = await mount(<Hero />);
  expect(await component.innerHTML()).toContain('Is it <span class="highlight">(F)ake</span>?!');
});

test(`[Hero Component]: Should render call to action paragraph`, async ({ mount }) => {
  const component = await mount(<Hero />);
  expect(await component.innerHTML()).toContain('Beat the models and find the cake!');
});*/
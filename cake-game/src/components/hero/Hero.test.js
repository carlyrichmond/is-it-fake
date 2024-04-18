import { test, expect } from '@playwright/experimental-ct-react';
import Hero from './Hero';

test.use({ viewport: { width: 500, height: 500 } });

test('should work', async ({ mount }) => {
  const component = await mount(<Hero />);
  await expect(component).toContainText('Is it (F)ake?!');
});
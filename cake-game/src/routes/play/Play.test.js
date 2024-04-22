import { test, expect } from '@playwright/experimental-ct-react';
import Play from './Play';

test.use({ viewport: { width: 500, height: 500 } });

test('should work', async ({ mount }) => {
  const component = await mount(<Play />);
  expect(component).toBeDefined();
  //await expect(component).toContainText('Is it (F)ake?!');
});
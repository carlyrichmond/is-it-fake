import { test, expect } from '@playwright/experimental-ct-react';
import Error from './Error';

test.use({ viewport: { width: 500, height: 500 } });

test('should work', async ({ mount }) => {
  const component = await mount(<Error />);
  await expect(component).toContainText('The cake is a lie!');
});
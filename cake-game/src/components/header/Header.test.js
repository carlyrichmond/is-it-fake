import { test, expect } from '@playwright/experimental-ct-react';
import Header from './Header';

test.use({ viewport: { width: 500, height: 500 } });

test('should render', async ({ mount }) => {
  const component = await mount(<Header />);
  expect(component).toBeDefined();
});
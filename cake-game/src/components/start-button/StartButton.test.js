import { test, expect } from '@playwright/experimental-ct-react';
import StartButton from './StartButton';

test.use({ viewport: { width: 500, height: 500 } });

test('should render', async ({ mount }) => {
  const component = await mount(<StartButton />);
  expect(component).toBeDefined();
});
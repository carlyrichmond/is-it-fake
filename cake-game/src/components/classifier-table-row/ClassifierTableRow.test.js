import { test, expect } from '@playwright/experimental-ct-react';
import ClassifierTableRow from './ClassifierTableRow';

test.use({ viewport: { width: 500, height: 500 } });

test('should render', async ({ mount }) => {
  const component = await mount(<ClassifierTableRow />);
  expect(component).toBeDefined();
});
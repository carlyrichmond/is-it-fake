import { createDOM } from '@builder.io/qwik/testing';
import { test, expect } from 'vitest';

import { MobileNetClassification } from './mobilenet';

test(`[MobileNetClassification Component]: Should render`, async () => {
  const { screen, render } = await createDOM();
  await render(<MobileNetClassification />);
  
  expect(screen.outerHTML).toContain('MobileNet');
});
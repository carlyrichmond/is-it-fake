import { createDOM } from '@builder.io/qwik/testing';
import { test, expect } from 'vitest';

import { CocoSsdClassification } from './coco-ssd';

test(`[CocoSsdClassification Component]: Should render`, async () => {
  const { screen, render } = await createDOM();
  await render(<CocoSsdClassification />);
  
  expect(screen.outerHTML).toContain('COCO-SSD');
});
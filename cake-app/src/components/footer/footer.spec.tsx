import { createDOM } from '@builder.io/qwik/testing';
import { test, expect } from 'vitest';
import { Footer } from './footer';
 
test(`[Footer Component]: Should render footer message`, async () => {
  const { screen, render } = await createDOM();
  await render(<Footer />);
  
  expect(screen.outerHTML).toContain('Made by Carly Richmond');
});
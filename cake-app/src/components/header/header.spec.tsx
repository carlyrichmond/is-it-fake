import { createDOM } from '@builder.io/qwik/testing';
import { test, expect } from 'vitest';
import { Header } from './header';
 
test(`[Header Component]: Should render menu`, async () => {
  const { screen, render } = await createDOM();
  await render(<Header />);
  
  expect(screen.outerHTML).toContain('Play');
  expect(screen.outerHTML).toContain('Rules');
  expect(screen.outerHTML).toContain('GitHub');
});
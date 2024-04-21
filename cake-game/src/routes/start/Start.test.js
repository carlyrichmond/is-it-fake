import { test, expect } from '@playwright/experimental-ct-react';
import Start from './Start';

test.use({ viewport: { width: 500, height: 500 } });

test('should render', async ({ mount }) => {
  const component = await mount(<Start />);
  expect(component).toBeDefined();
  //await expect(component).toContainText('Is it (F)ake?!');
});

/*test('should enter username', async ({ mount }) => {
    const component = await mount(<Start />);
    expect(component).toBeDefined();

    const usernameInput = component.getByTestId('username-input');
    const username = 'rubber-ducky'
    await usernameInput.fill('username');

    await expect(await usernameInput.inputValue()).toBe(username);
  });*/
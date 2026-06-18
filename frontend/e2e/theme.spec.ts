import { test, expect } from '@playwright/test';
import { setupAuthMocks } from './mocks';

test.describe('Theme', () => {
  test('should toggle between light and dark mode', async ({ page }) => {
    setupAuthMocks(page);

    await page.goto('/');

    const html = page.locator('html');
    const themeBtn = page.locator('button[aria-label*="Cambiar"]');

    const initialClass = await html.getAttribute('class');
    const initialTheme = initialClass?.includes('dark') ? 'dark' : 'light';

    await themeBtn.click();
    await page.waitForTimeout(300);

    const afterToggle = await html.getAttribute('class');
    if (initialTheme === 'dark') {
      expect(afterToggle).not.toContain('dark');
    } else {
      expect(afterToggle).toContain('dark');
    }

    await themeBtn.click();
    await page.waitForTimeout(300);

    const afterSecondToggle = await html.getAttribute('class');
    expect(afterSecondToggle).toBe(initialClass);
  });

  test('should persist theme across page reload', async ({ page }) => {
    setupAuthMocks(page);

    await page.goto('/');

    const html = page.locator('html');
    const themeBtn = page.locator('button[aria-label*="Cambiar"]');

    const initialClass = await html.getAttribute('class');

    await themeBtn.click();
    await page.waitForTimeout(300);

    const newClass = await html.getAttribute('class');
    expect(newClass).not.toBe(initialClass);

    await page.reload();
    await page.waitForTimeout(300);

    const afterReload = await html.getAttribute('class');
    expect(afterReload).toBe(newClass);
  });
});

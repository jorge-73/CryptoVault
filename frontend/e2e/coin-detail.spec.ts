import { test, expect } from '@playwright/test';
import { setupCryptoMocks } from './mocks';

test.describe('Coin Detail', () => {
  test('should display coin stats', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/coin/bitcoin');

    await expect(page.locator('h1')).toContainText('Bitcoin', { timeout: 10000 });
    await expect(page.locator('text=$67,500').first()).toBeVisible();
    await expect(page.locator('text=+2.45%').first()).toBeVisible();
    await expect(page.locator('text=#1').first()).toBeVisible();
  });

  test('should render price chart with time range buttons', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/coin/bitcoin');

    const chartContainer = page.locator('.recharts-responsive-container');
    await expect(chartContainer).toBeVisible({ timeout: 10000 });

    await expect(page.locator('button', { hasText: '7d' })).toBeVisible();
    await expect(page.locator('button', { hasText: '30d' })).toBeVisible();
    await expect(page.locator('button', { hasText: '90d' })).toBeVisible();
  });

  test('should switch time range on button click', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/coin/bitcoin');

    const btn30d = page.locator('button', { hasText: '30d' });
    await expect(btn30d).toBeVisible({ timeout: 10000 });
    await btn30d.click();

    await expect(btn30d).toHaveClass(/bg-accent/);
  });

  test('should navigate back to dashboard', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/coin/bitcoin');

    const backLink = page.locator('a', { hasText: 'Volver al dashboard' });
    await expect(backLink).toBeVisible({ timeout: 10000 });
    await backLink.click();

    await page.waitForURL('/');
    await expect(page.locator('h1').first()).toContainText('Crypto Market');
  });
});

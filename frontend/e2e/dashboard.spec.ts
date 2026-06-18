import { test, expect } from '@playwright/test';
import { mockMarkets, setupCryptoMocks, setupAuthMocks, authConfig } from './mocks';

test.describe('Dashboard', () => {
  test('should show skeleton then render coin cards', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/');

    const skeleton = page.locator('.animate-pulse').first();
    await expect(skeleton).toBeVisible({ timeout: 3000 });

    const bitcoinCard = page.locator('a[href="/coin/bitcoin"]');
    await expect(bitcoinCard).toBeVisible({ timeout: 10000 });
    await expect(bitcoinCard).toContainText('btc');
    await expect(bitcoinCard).toContainText('$67,500.00');
    await expect(bitcoinCard).toContainText('+2.45%');

    await expect(skeleton).not.toBeVisible();
  });

  test('should render all 10 coin cards', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/');

    const cards = page.locator('a[href^="/coin/"]');
    await expect(cards).toHaveCount(mockMarkets.length, { timeout: 10000 });
  });

  test('should navigate to coin detail on click', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/');

    const bitcoinLink = page.locator('a[href="/coin/bitcoin"]');
    await expect(bitcoinLink).toBeVisible({ timeout: 10000 });
    await bitcoinLink.click();

    await page.waitForURL('/coin/bitcoin');
    await expect(page.locator('h1')).toContainText('Bitcoin');
  });

  test('should not show favorite button when not logged in', async ({ page }) => {
    authConfig.authenticated = false;
    setupCryptoMocks(page);
    setupAuthMocks(page);

    await page.goto('/');

    const favoriteBtn = page.locator('button[aria-label*="favoritos"]');
    await expect(favoriteBtn).toHaveCount(0, { timeout: 10000 });
  });
});

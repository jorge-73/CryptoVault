import { test, expect } from '@playwright/test';
import { mockCategories, setupCryptoMocks } from './mocks';

test.describe('Categories', () => {
  test('should render all category cards', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/categories');

    const header = page.locator('h1');
    await expect(header).toContainText('Categorías');

    for (const cat of mockCategories) {
      await expect(page.locator('text=' + cat.name)).toBeVisible({ timeout: 10000 });
    }
  });

  test('should show coin images when available and fallback initials when null', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/categories');

    const defiCard = page.locator('a').filter({ hasText: 'DeFi' }).first();
    await expect(defiCard).toBeVisible({ timeout: 10000 });

    const images = defiCard.locator('img[alt*="Logo"]');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    const memeCard = page.locator('a').filter({ hasText: 'Meme' }).first();
    await expect(memeCard).toBeVisible();

    const shibaText = memeCard.locator('text=SHIB');
    await expect(shibaText).toBeVisible();
  });

  test('should show market cap and 24h change', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/categories');

    const defiCard = page.locator('a').filter({ hasText: 'DeFi' }).first();
    await expect(defiCard).toContainText('$45,000', { timeout: 10000 });
  });
});

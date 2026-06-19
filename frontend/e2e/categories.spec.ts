import { test, expect } from '@playwright/test';
import { mockCategories, setupCryptoMocks } from './mocks';

test.describe('Categories', () => {
  test('should render all category cards', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/categories');

    const header = page.locator('h1');
    await expect(header).toContainText('Crypto Sectors');

    for (const cat of mockCategories) {
      await expect(page.locator(`text=${cat.name}`).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('should show coin images when available and fallback initials when null', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/categories');

    const defiCard = page.locator('article').filter({ hasText: 'DeFi' }).first();
    await expect(defiCard).toBeVisible({ timeout: 10000 });

    const images = defiCard.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);

    const memeCard = page.locator('article').filter({ hasText: 'Meme' }).first();
    await expect(memeCard).toBeVisible();

    const fallback = memeCard.locator('span:has-text("s"), span:has-text("p")').first();
    await expect(fallback).toBeVisible();
  });

  test('should show market cap and 24h change', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/categories');

    const defiCard = page.locator('article').filter({ hasText: 'DeFi' }).first();
    await expect(defiCard).toContainText('$45.00B', { timeout: 10000 });
    await expect(defiCard).toContainText('+2.30%');
  });
});

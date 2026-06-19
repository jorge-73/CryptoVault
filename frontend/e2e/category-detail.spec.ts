import { test, expect } from '@playwright/test';
import { mockCategories, setupCryptoMocks } from './mocks';

test.describe('Category Detail', () => {
  test('should show category header with name and description', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/categories/defi');

    await expect(page.locator('h1')).toContainText('DeFi', { timeout: 10000 });
    await expect(page.getByText('Decentralized finance protocols')).toBeVisible();
  });

  test('should show stat cards with market cap and volume', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/categories/defi');

    await expect(page.getByText('$45.00B').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('$2.10B').first()).toBeVisible();
  });

  test('should show coin table with coins', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/categories/defi');

    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 10000 });

    const rows = table.locator('tbody tr');
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test('should filter coins by search', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/categories/defi');

    const searchInput = page.locator('input[aria-label="Buscar moneda"]');
    await expect(searchInput).toBeVisible({ timeout: 10000 });

    await searchInput.fill('bitcoin');

    await expect(page.locator('table tbody tr')).toHaveCount(1);
    await expect(page.getByText('Bitcoin')).toBeVisible();
  });

  test('should sort coins by price column', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/categories/defi');

    const priceHeader = page.locator('th', { hasText: 'Precio' });
    await expect(priceHeader).toBeVisible({ timeout: 10000 });

    await priceHeader.click();
    await expect(priceHeader.locator('svg')).toBeVisible();

    await priceHeader.click();
    await expect(priceHeader.locator('svg')).toBeVisible();
  });

  test('should show 24h badge for each coin', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/categories/defi');

    const badges = page.locator('table tbody tr td:nth-child(4)');
    await expect(badges.first()).toBeVisible({ timeout: 10000 });
  });

  test('should show empty state when search has no results', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/categories/defi');

    const searchInput = page.locator('input[aria-label="Buscar moneda"]');
    await searchInput.fill('zzznotacoin');

    await expect(page.getByText('Sin resultados')).toBeVisible({ timeout: 10000 });
  });

  test('should link category card to detail page', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/categories');

    const card = page.locator('article').filter({ hasText: 'DeFi' }).first();
    await expect(card).toBeVisible({ timeout: 10000 });

    await card.locator('..').click();
    await expect(page).toHaveURL(/\/categories\/defi/, { timeout: 10000 });
  });
});

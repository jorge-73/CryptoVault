import { test, expect } from '@playwright/test';
import { mockMarkets, setupCryptoMocks } from './mocks';

test.describe('Market', () => {
  test('should render page header and market overview', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/market');

    const header = page.locator('h1');
    await expect(header).toContainText('Mercado', { timeout: 10000 });
  });

  test('should render desktop table with all coins', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/market');

    await page.setViewportSize({ width: 1280, height: 900 });

    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 10000 });

    const rows = table.locator('tbody tr');
    await expect(rows).toHaveCount(10, { timeout: 10000 });
  });

  test('should sort coins by price on column click', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/market');

    await page.setViewportSize({ width: 1280, height: 900 });

    const priceHeader = page.locator('th', { hasText: 'Precio' });
    await expect(priceHeader).toBeVisible({ timeout: 10000 });

    await priceHeader.click();
    await expect(priceHeader.locator('svg')).toBeVisible();

    const rows = page.locator('table tbody tr');
    const firstRow = rows.first();
    await expect(firstRow).toBeVisible();
  });

  test('should navigate to coin detail on click', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/market');

    await page.setViewportSize({ width: 1280, height: 900 });

    const bitcoinLink = page.locator('a[href="/coin/bitcoin"]').first();
    await expect(bitcoinLink).toBeVisible({ timeout: 10000 });
    await bitcoinLink.click();

    await page.waitForURL('/coin/bitcoin');
    await expect(page.locator('h1')).toContainText('Bitcoin');
  });

  test('should filter coins by search query', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/market');

    await page.setViewportSize({ width: 1280, height: 900 });

    await page.locator('table tbody tr').first().waitFor({ state: 'visible', timeout: 10000 });

    const searchInput = page.getByPlaceholder('Buscar moneda...');
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.click();
    await page.keyboard.type('bitcoin');

    const rows = page.locator('table tbody tr');
    await expect(rows).toHaveCount(1);
    await expect(page.getByText('Bitcoin').first()).toBeVisible();
  });

  test('should filter coins by top selector', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/market');

    await page.setViewportSize({ width: 1280, height: 900 });

    const top10Btn = page.getByRole('button', { name: 'Top 10', exact: true });
    await expect(top10Btn).toBeVisible({ timeout: 10000 });
    await top10Btn.click();

    const rows = page.locator('table tbody tr');
    await expect(rows).toHaveCount(10, { timeout: 10000 });

    const top50Btn = page.getByRole('button', { name: 'Top 50', exact: true });
    await top50Btn.click();
    await expect(rows).toHaveCount(10, { timeout: 10000 });
  });
});

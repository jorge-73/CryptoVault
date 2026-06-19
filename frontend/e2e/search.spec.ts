import { test, expect } from '@playwright/test';
import { setupCryptoMocks } from './mocks';

test.describe('Search', () => {
  test('should show search results when typing', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/');

    const searchInput = page.locator('input[aria-label="Buscar criptomonedas"]');
    await expect(searchInput).toBeVisible();

    await searchInput.fill('bit');

    const dropdown = page.locator('[role="listbox"]');
    await expect(dropdown).toBeVisible({ timeout: 5000 });
    await expect(dropdown.locator('text=Bitcoin')).toBeVisible();
  });

  test('should navigate to coin detail on result click', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/');

    const searchInput = page.locator('input[aria-label="Buscar criptomonedas"]');
    await searchInput.fill('bit');

    const dropdown = page.locator('[role="listbox"]');
    await expect(dropdown).toBeVisible({ timeout: 5000 });

    await page.locator('button[role="option"]').first().click();
    await expect(page).toHaveURL(/\/coin\//);
  });

  test('should show no results for non-existent query', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/');

    const searchInput = page.locator('input[aria-label="Buscar criptomonedas"]');
    await searchInput.fill('zzzzzzz');

    const dropdown = page.locator('[role="listbox"]');
    await expect(dropdown).toBeVisible({ timeout: 5000 });
    await expect(dropdown).toContainText('Sin resultados');
  });

  test('should clear query on X button click', async ({ page }) => {
    setupCryptoMocks(page);

    await page.goto('/');

    const searchInput = page.locator('input[aria-label="Buscar criptomonedas"]');
    await searchInput.fill('bitcoin');

    const clearBtn = page.locator('button[aria-label="Limpiar búsqueda"]');
    await expect(clearBtn).toBeVisible();

    await clearBtn.click();
    await expect(searchInput).toHaveValue('');
    await expect(page.locator('[role="listbox"]')).not.toBeVisible();
  });
});

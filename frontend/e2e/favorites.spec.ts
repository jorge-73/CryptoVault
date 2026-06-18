import { test, expect } from '@playwright/test';
import { mockMarkets, setupAllMocks, authConfig, mockFavorites } from './mocks';

test.describe('Favorites', () => {
  test.beforeEach(() => {
    authConfig.authenticated = true;
    mockFavorites.length = 0;
  });

  test('should add a favorite from dashboard', async ({ page }) => {
    setupAllMocks(page);

    await page.goto('/');

    const favButton = page.locator('button[aria-label*="Añadir"]').first();
    await expect(favButton).toBeVisible({ timeout: 10000 });
    await favButton.click();

    const toast = page.locator('[data-sonner-toast]');
    await expect(toast).toContainText('Añadido', { timeout: 5000 });
  });

  test('should show favorited coin in profile page', async ({ page }) => {
    mockFavorites.push('bitcoin');
    setupAllMocks(page);

    await page.goto('/profile');

    await expect(page.locator(`text=${mockMarkets[0].name}`)).toBeVisible({ timeout: 10000 });
  });

  test('should remove a favorite from profile', async ({ page }) => {
    mockFavorites.push('bitcoin');
    setupAllMocks(page);

    await page.goto('/profile');

    const removeButton = page.locator('button[aria-label*="Quitar"]').first();
    await expect(removeButton).toBeVisible({ timeout: 10000 });
    await removeButton.click();

    const toast = page.locator('[data-sonner-toast]');
    await expect(toast).toContainText('Eliminado', { timeout: 5000 });
  });
});

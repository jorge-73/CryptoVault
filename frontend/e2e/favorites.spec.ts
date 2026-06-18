import { test, expect } from '@playwright/test';
import { mockMarkets, setupCryptoMocks } from './mocks';

const PASSWORD = 'password123';

test.describe('Favorites', () => {
  test('should add a favorite from dashboard', async ({ page }) => {
    const email = `e2e-fav-${Date.now()}@test.com`;
    await page.request.post('http://localhost:4001/api/auth/register', {
      data: { email, password: PASSWORD },
    });

    setupCryptoMocks(page);

    await page.goto('/');
    await page.waitForTimeout(500);

    const favButton = page.locator('button[aria-label*="Añadir"]').first();
    await expect(favButton).toBeVisible({ timeout: 10000 });
    await favButton.click();

    const toast = page.locator('[data-sonner-toast]');
    await expect(toast).toContainText('Añadido', { timeout: 5000 });
  });

  test('should show favorited coin in profile page', async ({ page }) => {
    const email = `e2e-fav-${Date.now()}@test.com`;
    await page.request.post('http://localhost:4001/api/auth/register', {
      data: { email, password: PASSWORD },
    });

    setupCryptoMocks(page);

    await page.goto('/');
    await page.waitForTimeout(500);

    const favButton = page.locator('button[aria-label*="Añadir"]').first();
    await expect(favButton).toBeVisible({ timeout: 10000 });
    await favButton.click();
    await expect(page.locator('[data-sonner-toast]')).toContainText('Añadido', { timeout: 5000 });

    await page.goto('/profile');
    await page.waitForTimeout(500);

    await expect(page.locator('text=' + mockMarkets[0].name)).toBeVisible({ timeout: 10000 });
  });

  test('should remove a favorite from profile', async ({ page }) => {
    const email = `e2e-fav-${Date.now()}@test.com`;
    await page.request.post('http://localhost:4001/api/auth/register', {
      data: { email, password: PASSWORD },
    });

    setupCryptoMocks(page);

    await page.goto('/');
    await page.waitForTimeout(500);

    const favButton = page.locator('button[aria-label*="Añadir"]').first();
    await expect(favButton).toBeVisible({ timeout: 10000 });
    await favButton.click();
    await expect(page.locator('[data-sonner-toast]')).toContainText('Añadido', { timeout: 5000 });

    await page.goto('/profile');
    await page.waitForTimeout(500);

    const removeButton = page.locator('button[aria-label*="Quitar"]').first();
    await expect(removeButton).toBeVisible({ timeout: 10000 });
    await removeButton.click();

    await expect(page.locator('[data-sonner-toast]')).toContainText('Eliminado', { timeout: 5000 });

    await expect(page.locator('text=' + mockMarkets[0].name)).not.toBeVisible();
  });
});

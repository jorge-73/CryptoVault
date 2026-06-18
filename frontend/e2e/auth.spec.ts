import { test, expect } from '@playwright/test';
import { setupAllMocks, authConfig } from './mocks';

const TEST_EMAIL = 'e2e-auth@test.com';
const TEST_PASSWORD = 'password123';

test.describe('Auth flow', () => {
  test.beforeEach(({ page }) => {
    authConfig.authenticated = true;
    setupAllMocks(page);
  });

  test('register a new user and redirect to dashboard', async ({ page }) => {
    await page.goto('/auth/register');

    await page.fill('#name', 'Test User');
    await page.fill('#email', TEST_EMAIL);
    await page.fill('#password', TEST_PASSWORD);
    await page.click('button[type="submit"]');

    await page.waitForURL('/');
    await expect(page.locator('header')).toContainText('Test User');
  });

  test('show error on register with invalid email', async ({ page }) => {
    await page.goto('/auth/register');

    await page.fill('#email', 'not-an-email');
    await page.fill('#password', TEST_PASSWORD);
    await page.evaluate(() => {
      const input = document.querySelector('#email') as HTMLInputElement;
      if (input) input.type = 'text';
    });
    await page.click('button[type="submit"]');

    const toast = page.locator('[data-sonner-toast]');
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test('login with valid credentials and redirect to dashboard', async ({ page }) => {
    await page.goto('/auth/login');

    await page.fill('#email', TEST_EMAIL);
    await page.fill('#password', TEST_PASSWORD);
    await page.click('button[type="submit"]');

    await page.waitForURL('/');
    await expect(page.locator('header')).toContainText('Test User');
  });

  test('show error on login with invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');

    await page.fill('#email', TEST_EMAIL);
    await page.fill('#password', 'wrongpassword');
    await page.click('button[type="submit"]');

    const toast = page.locator('[data-sonner-toast]');
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test('logout clears user from header', async ({ page }) => {
    await page.goto('/auth/login');
    await page.fill('#email', TEST_EMAIL);
    await page.fill('#password', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    const logoutBtn = page.locator('button[aria-label="Cerrar sesión"]');
    await logoutBtn.click();

    await expect(page.locator('header')).toContainText('Iniciar sesión', { timeout: 5000 });
    await expect(page.locator('header')).not.toContainText('Test User');
  });
});

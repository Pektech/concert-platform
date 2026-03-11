import { test, expect } from '@playwright/test';

test.describe('Concert Page - Button Visibility', () => {
  test('should show Sign in to Review when not logged in', async ({ page }) => {
    await page.goto('/concerts/cmmif1rh4000gvgwg81643abk');
    
    await page.waitForTimeout(2000);
    
    await expect(page.getByRole('heading', { name: /radiohead/i })).toBeVisible({ timeout: 10000 });
    
    const signInButton = page.getByRole('link', { name: /sign in to review/i });
    await expect(signInButton).toBeVisible({ timeout: 5000 });
  });

  test('should show Write Review when logged in', async ({ page }) => {
    const uniqueEmail = `concert_test_${Date.now()}@example.com`;
    
    await page.goto('/signup');
    await page.getByLabel('Name').fill('Concert Test User');
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Password').fill('SecurePass123!');
    await page.locator('form button[type="submit"]').click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Password').fill('SecurePass123!');
    await page.locator('form button[type="submit"]').click();
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10000 });
    
    await page.goto('/concerts/cmmif1rh4000gvgwg81643abk');
    
    await page.waitForTimeout(2000);
    
    await expect(page.getByRole('heading', { name: /radiohead/i })).toBeVisible({ timeout: 10000 });
    
    const writeReviewLink = page.getByRole('link', { name: /write review/i });
    await expect(writeReviewLink).toBeVisible({ timeout: 5000 });
  });

  test('concert page should load with local concert data', async ({ page }) => {
    await page.goto('/concerts/cmmif1rh4000gvgwg81643abk');
    
    await page.waitForTimeout(2000);
    
    await expect(page.getByRole('heading', { name: /radiohead/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/red rocks/i)).toBeVisible();
    await expect(page.getByText(/reviews/i)).toBeVisible();
  });
});
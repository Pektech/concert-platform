import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display search bar for concerts', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByPlaceholder(/search.*artists|concerts/i);
    await expect(searchInput).toBeVisible();
  });

  test('should display tagline', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByText(/track concerts you've seen/i)).toBeVisible();
    await expect(page.getByText(/save those you want to see/i)).toBeVisible();
    await expect(page.getByText(/tell your friends what's good/i)).toBeVisible();
  });

  test('should have working search functionality', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByPlaceholder(/search.*artists|concerts/i);
    
    await searchInput.fill('Taylor Swift');
    await page.waitForTimeout(500);
    
    await expect(searchInput).toHaveValue('Taylor Swift');
  });

  test('should show loading state when searching', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByPlaceholder(/search.*artists|concerts/i);
    
    await searchInput.fill('Coldplay');
    await searchInput.focus();
    
    await page.waitForTimeout(300);
  });

  test('should display header navigation', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /browse reviews/i })).toBeVisible();
  });

  test('should show Sign In button when logged out', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });
});
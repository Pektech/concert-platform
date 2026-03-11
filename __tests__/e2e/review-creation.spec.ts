import { test, expect } from '@playwright/test';

test.describe('Review Creation Flow', () => {
  test.beforeEach(async ({ page }) => {
    const uniqueEmail = `review_test_${Date.now()}@example.com`;
    
    await page.goto('/signup');
    await page.getByLabel('Name').fill('Review Test User');
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Password').fill('SecurePass123!');
    await page.locator('form button[type="submit"]').click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Password').fill('SecurePass123!');
    await page.locator('form button[type="submit"]').click();
    await expect(page).not.toHaveURL(/\/login/, { timeout: 10000 });
  });

  test('should show back to home link on reviews page', async ({ page }) => {
    await page.goto('/reviews');
    
    const backLink = page.getByRole('link', { name: /back to home/i });
    await expect(backLink).toBeVisible();
  });

  test('should have working star rating input', async ({ page }) => {
    await page.goto('/concerts/test-concert-id/review/new');
    
    const stars = page.locator('button[aria-label*="star"]');
    await expect(stars.first()).toBeVisible();
    
    await stars.nth(4).click();
  });

  test('should have review text textarea', async ({ page }) => {
    await page.goto('/concerts/test-concert-id/review/new');
    
    const textarea = page.getByPlaceholder(/share your experience/i);
    await expect(textarea).toBeVisible();
    
    await textarea.fill('This was an amazing concert! The energy was incredible.');
    await expect(textarea).toHaveValue('This was an amazing concert! The energy was incredible.');
  });

  test('should have setlist highlights textarea', async ({ page }) => {
    await page.goto('/concerts/test-concert-id/review/new');
    
    const textarea = page.getByPlaceholder(/standout songs/i);
    await expect(textarea).toBeVisible();
    
    await textarea.fill('Bohemian Rhapsody, We Will Rock You');
    await expect(textarea).toHaveValue('Bohemian Rhapsody, We Will Rock You');
  });

  test('should have attended checkbox', async ({ page }) => {
    await page.goto('/concerts/test-concert-id/review/new');
    
    const checkbox = page.locator('input[type="checkbox"]');
    await expect(checkbox.first()).toBeVisible();
    
    await checkbox.first().check();
    await expect(checkbox.first()).toBeChecked();
  });

  test('should have submit button', async ({ page }) => {
    await page.goto('/concerts/test-concert-id/review/new');
    
    const submitButton = page.getByRole('button', { name: /submit review/i });
    await expect(submitButton).toBeVisible();
  });

  test('should have back to concert link', async ({ page }) => {
    await page.goto('/concerts/test-concert-id/review/new');
    
    const backLink = page.getByRole('link', { name: /back to concert/i });
    await expect(backLink).toBeVisible();
  });

  test('should require star rating before submit', async ({ page }) => {
    await page.goto('/concerts/test-concert-id/review/new');
    
    const submitButton = page.getByRole('button', { name: /submit review/i });
    await submitButton.click();
    
    await expect(page.getByText(/rating is required/i)).toBeVisible();
  });

  test('should show write review page title', async ({ page }) => {
    await page.goto('/concerts/test-concert-id/review/new');
    
    await expect(page.getByText(/write a review/i)).toBeVisible();
  });
});
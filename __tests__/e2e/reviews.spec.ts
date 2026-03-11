import { test, expect } from '@playwright/test';

test.describe('Reviews Page', () => {
  test('should display recent reviews page', async ({ page }) => {
    await page.goto('/reviews');
    
    await expect(page).toHaveTitle(/Reviews/);
    await expect(page.getByText(/recent reviews/i)).toBeVisible();
  });

  test('should show seeded reviews from database', async ({ page }) => {
    await page.goto('/reviews');
    
    await expect(page.getByRole('link', { name: /alex johnson|sarah chen|mike wilson|emma davis|chris martinez/i }).first()).toBeVisible();
  });

  test('should display review ratings', async ({ page }) => {
    await page.goto('/reviews');
    
    const starElements = page.locator('[aria-label*="star"], [class*="star"]').first();
    await expect(starElements).toBeVisible({ timeout: 10000 });
  });

  test('should show attended badge for attended reviews', async ({ page }) => {
    await page.goto('/reviews');
    
    await expect(page.getByText('✓ Attended').first()).toBeVisible();
  });

  test('should display concert info with artist and venue', async ({ page }) => {
    await page.goto('/reviews');
    
    await expect(page.getByRole('link', { name: /taylor swift|radiohead|kendrick lamar|daft punk|fleetwood mac/i }).first()).toBeVisible();
    await expect(page.getByText(/madison square garden|red rocks|the forum|the o2|hollywood bowl/i).first()).toBeVisible();
  });

  test('should show setlist highlights section', async ({ page }) => {
    await page.goto('/reviews');
    
    await expect(page.getByText(/setlist highlights/i).first()).toBeVisible();
  });

  test('should have working user profile links', async ({ page }) => {
    await page.goto('/reviews');
    
    const profileLink = page.locator('a[href*="/profiles/"]').first();
    await expect(profileLink).toBeVisible();
  });

  test('should have working concert links', async ({ page }) => {
    await page.goto('/reviews');
    
    const concertLink = page.locator('a[href*="/concerts/"]').first();
    await expect(concertLink).toBeVisible();
  });

  test('should display review text content', async ({ page }) => {
    await page.goto('/reviews');
    
    await expect(page.getByText(/incredible|phenomenal|amazing|great|nostalgic/i).first()).toBeVisible();
  });

  test('should show back to home link', async ({ page }) => {
    await page.goto('/reviews');
    
    const backLink = page.getByRole('link', { name: /back to home/i });
    await expect(backLink).toBeVisible();
  });
});
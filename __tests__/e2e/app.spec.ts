import { test, expect } from '@playwright/test';

test.describe('Review Flow', () => {
  test.describe('Create Review', () => {
    test('should require authentication to create review', async ({ page }) => {
      await page.goto('/concerts/abc123/review/new');
      
      await expect(page).toHaveURL(/\/login/);
    });

    test('should display review form when authenticated', async ({ page }) => {
      const uniqueEmail = `review_create_${Date.now()}@example.com`;
      
      await page.goto('/signup');
      await page.getByLabel('Name').fill('Review User');
      await page.getByLabel('Email').fill(uniqueEmail);
      await page.getByLabel('Password').fill('SecurePass123!');
      await page.locator('form button[type="submit"]').click();
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
      
      await page.getByLabel('Email').fill(uniqueEmail);
      await page.getByLabel('Password').fill('SecurePass123!');
      await page.locator('form button[type="submit"]').click();
      
      await expect(page).not.toHaveURL(/\/login/, { timeout: 10000 });
      
      await page.goto('/concerts/test-concert-id/review/new');
      
      await expect(page.getByText('Write a Review')).toBeVisible();
      await expect(page.getByText('Rating')).toBeVisible();
    });
  });

  test.describe('Edit Review', () => {
    test('should require authentication to edit review', async ({ page }) => {
      await page.goto('/reviews/abc123/edit');
      
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Browse Reviews', () => {
    test('should display browse reviews page', async ({ page }) => {
      await page.goto('/reviews');
      
      await expect(page).toHaveTitle(/Reviews/);
      await expect(page.getByText(/reviews|recent/i).first()).toBeVisible();
    });

    test('should show reviews list or empty state', async ({ page }) => {
      await page.goto('/reviews');
      
      await expect(page.getByText(/recent reviews|discover concert/i).first()).toBeVisible();
    });
  });
});

test.describe('Profile', () => {
  test('should require authentication for own profile', async ({ page }) => {
    await page.goto('/profile');
    
    await expect(page).toHaveURL(/\/login/);
  });

  test('should display profile when authenticated', async ({ page }) => {
    const uniqueEmail = `profile_${Date.now()}@example.com`;
    
    await page.goto('/signup');
    await page.getByLabel('Name').fill('Profile User');
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Password').fill('SecurePass123!');
    await page.locator('form button[type="submit"]').click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Password').fill('SecurePass123!');
    await page.locator('form button[type="submit"]').click();
    await page.waitForLoadState('networkidle');
    
    await page.goto('/profile');
    
    await expect(page).toHaveTitle(/Profile/);
    await expect(page.getByText(/profile|reviews/i).first()).toBeVisible();
  });
});

test.describe('Error Handling', () => {
  test('should redirect to login for nonexistent page when logged out', async ({ page }) => {
    await page.goto('/nonexistent-page-xyz');
    
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show error for invalid concert ID when logged in', async ({ page }) => {
    const uniqueEmail = `error_${Date.now()}@example.com`;
    
    await page.goto('/signup');
    await page.getByLabel('Name').fill('Error Test User');
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Password').fill('SecurePass123!');
    await page.locator('form button[type="submit"]').click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Password').fill('SecurePass123!');
    await page.locator('form button[type="submit"]').click();
    await page.waitForLoadState('networkidle');
    
    await page.goto('/concerts/invalid-concert-id-xyz');
    
    await expect(page.getByText(/error|not found|something went wrong/i).first()).toBeVisible();
  });

  test('should show 404 for invalid review ID when logged in', async ({ page }) => {
    const uniqueEmail = `review404_${Date.now()}@example.com`;
    
    await page.goto('/signup');
    await page.getByLabel('Name').fill('Review 404 User');
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Password').fill('SecurePass123!');
    await page.locator('form button[type="submit"]').click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    
    await page.getByLabel('Email').fill(uniqueEmail);
    await page.getByLabel('Password').fill('SecurePass123!');
    await page.locator('form button[type="submit"]').click();
    await page.waitForLoadState('networkidle');
    
    await page.goto('/reviews/invalid-review-id-xyz');
    
    await expect(page.getByRole('heading', { name: /404|not found/i }).first()).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should display header on all public pages', async ({ page }) => {
    const pages = ['/', '/login', '/signup', '/reviews'];
    
    for (const path of pages) {
      await page.goto(path);
      await expect(page.locator('header')).toBeVisible();
    }
  });

  test('should show Sign In button when logged out', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('header').getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('should navigate between login and signup', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByRole('link', { name: /sign up/i }).click();
    await expect(page).toHaveURL(/\/signup/);
    
    await page.getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('API Health', () => {
  test('autocomplete API should return valid response', async ({ page }) => {
    const response = await page.request.get('/api/concerts/autocomplete?q=test');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('results');
    expect(Array.isArray(data.results)).toBeTruthy();
  });

  test('search API should return valid response', async ({ page }) => {
    const response = await page.request.get('/api/concerts/search?artist=test');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('concerts');
    expect(data).toHaveProperty('pagination');
  });
});
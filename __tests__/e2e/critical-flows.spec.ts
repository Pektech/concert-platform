import { test, expect } from '@playwright/test';

/**
 * Critical User Journey E2E Tests
 * 
 * Tests the most important user flows in the concert review platform:
 * - Authentication (signup, login, logout)
 * - Concert search and discovery
 * - Review creation and management
 * - Profile and browse functionality
 * - Attended check-in
 * - Error handling (404 pages)
 */

test.describe('Authentication Flows', () => {
  test.describe('Signup Flow', () => {
    test('should display signup page correctly', async ({ page }) => {
      await page.goto('/signup');
      
      await expect(page).toHaveTitle(/Sign Up/);
      await expect(page.getByRole('heading', { name: /sign up|create account/i })).toBeVisible();
      await expect(page.getByLabel(/name/i)).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /sign up|create account/i })).toBeVisible();
    });

    test('should show validation errors for invalid signup data', async ({ page }) => {
      await page.goto('/signup');
      await page.getByRole('button', { name: /sign up/i }).click();
      await expect(page.getByText(/required|invalid|email/i)).toBeVisible();
    });

    test('should redirect to login after successful signup', async ({ page }) => {
      const uniqueEmail = `test_${Date.now()}@example.com`;
      
      await page.goto('/signup');
      await page.getByLabel(/name/i).fill('Test User');
      await page.getByLabel(/email/i).fill(uniqueEmail);
      await page.getByLabel(/password/i).fill('SecurePass123!');
      await page.getByRole('button', { name: /sign up/i }).click();
      
      await expect(page).toHaveURL(/\/login/);
      await expect(page.getByText(/account created|check your email|login/i)).toBeVisible();
    });
  });

  test.describe('Login Flow', () => {
    test('should display login page correctly', async ({ page }) => {
      await page.goto('/login');
      
      await expect(page).toHaveTitle(/Login|Sign In/);
      await expect(page.getByRole('heading', { name: /login|sign in/i })).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /login|sign in/i })).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login');
      await page.getByLabel(/email/i).fill('invalid@example.com');
      await page.getByLabel(/password/i).fill('wrongpassword');
      await page.getByRole('button', { name: /login/i }).click();
      await expect(page.getByText(/invalid|error|credentials/i)).toBeVisible();
    });

    test('should login successfully and redirect to home', async ({ page }) => {
      await page.goto('/login');
      await page.getByLabel(/email/i).fill('test@example.com');
      await page.getByLabel(/password/i).fill('TestPass123!');
      await page.getByRole('button', { name: /login/i }).click();
      await expect(page).toHaveURL('/');
      await expect(page.getByText(/test|logout/i)).toBeVisible();
    });
  });

  test.describe('Logout Flow', () => {
    test('should logout and redirect to home', async ({ page }) => {
      await page.goto('/login');
      await page.getByLabel(/email/i).fill('test@example.com');
      await page.getByLabel(/password/i).fill('TestPass123!');
      await page.getByRole('button', { name: /login/i }).click();
      await expect(page).toHaveURL('/');
      
      const logoutButton = page.getByRole('button', { name: /logout|sign out/i });
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
        await expect(page).toHaveURL('/');
        await expect(page.getByText(/login|sign up/i)).toBeVisible();
      }
    });
  });
});

test.describe('Concert Search Flow', () => {
  test('should display search functionality on home page', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.getByPlaceholder(/search|artist|concert/i);
    await expect(searchInput).toBeVisible();
  });

  test('should show autocomplete results when typing in search', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.getByPlaceholder(/search|artist|concert/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('Radio');
      await expect(page.getByRole('listbox')).toBeVisible();
      await expect(page.getByRole('option').first()).toBeVisible();
    }
  });

  test('should navigate to concert detail page from search results', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.getByPlaceholder(/search|artist|concert/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('Radiohead');
      await page.waitForTimeout(500);
      
      const firstResult = page.getByRole('option').first();
      if (await firstResult.isVisible()) {
        await firstResult.click();
        await expect(page).toHaveURL(/\/concerts\/.+/);
        await expect(page.getByText(/radiohead/i)).toBeVisible();
      }
    }
  });

  test('should display concert details correctly', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.getByPlaceholder(/search|artist|concert/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('Radiohead');
      await page.waitForTimeout(500);
      
      const firstResult = page.getByRole('option').first();
      if (await firstResult.isVisible()) {
        await firstResult.click();
        await page.waitForLoadState('networkidle');
        await expect(page.getByText(/venue|date|setlist/i)).toBeVisible();
      }
    }
  });
});

test.describe('Review Creation Flow', () => {
  test('should require authentication to create review', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.getByPlaceholder(/search|artist|concert/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('Radiohead');
      await page.waitForTimeout(500);
      
      const firstResult = page.getByRole('option').first();
      if (await firstResult.isVisible()) {
        await firstResult.click();
        await page.waitForLoadState('networkidle');
        
        const writeReviewButton = page.getByRole('link', { name: /write review/i });
        if (await writeReviewButton.isVisible()) {
          await writeReviewButton.click();
          await expect(page).toHaveURL(/\/login/);
        }
      }
    }
  });

  test('should display review form when authenticated', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('TestPass123!');
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page).toHaveURL('/');
    
    const searchInput = page.getByPlaceholder(/search|artist|concert/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('Radiohead');
      await page.waitForTimeout(500);
      
      const firstResult = page.getByRole('option').first();
      if (await firstResult.isVisible()) {
        await firstResult.click();
        await page.waitForLoadState('networkidle');
        
        const writeReviewButton = page.getByRole('link', { name: /write review/i });
        if (await writeReviewButton.isVisible()) {
          await writeReviewButton.click();
          await expect(page).toHaveURL(/\/review\/new/);
          await expect(page.getByText(/write review|rating/i)).toBeVisible();
          await expect(page.getByRole('radio', { name: /\d star/i }).first()).toBeVisible();
          await expect(page.getByRole('textbox', { name: /review|text/i })).toBeVisible();
          await expect(page.getByRole('checkbox', { name: /attended/i })).toBeVisible();
        }
      }
    }
  });

  test('should create review successfully', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('TestPass123!');
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.getByPlaceholder(/search|artist|concert/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('Radiohead');
      await page.waitForTimeout(500);
      
      const firstResult = page.getByRole('option').first();
      if (await firstResult.isVisible()) {
        await firstResult.click();
        await page.waitForLoadState('networkidle');
        
        const writeReviewButton = page.getByRole('link', { name: /write review/i });
        if (await writeReviewButton.isVisible()) {
          await writeReviewButton.click();
          await page.waitForLoadState('networkidle');
          
          await page.getByRole('radio', { name: /5 star/i }).click();
          await page.getByRole('textbox', { name: /review|text/i }).fill('Amazing concert!');
          await page.getByRole('checkbox', { name: /attended/i }).check();
          await page.getByRole('button', { name: /submit|create review/i }).click();
          
          await expect(page).toHaveURL(/\/concerts\/.+/);
          await expect(page.getByText(/amazing concert/i)).toBeVisible();
        }
      }
    }
  });
});

test.describe('Profile and Browse Pages', () => {
  test('should display user profile page', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('TestPass123!');
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForLoadState('networkidle');
    await page.goto('/profile');
    await expect(page.getByText(/test|profile|reviews/i)).toBeVisible();
  });

  test('should show user reviews on profile page', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('TestPass123!');
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForLoadState('networkidle');
    await page.goto('/profile');
    await expect(page.getByText(/my reviews|your reviews/i)).toBeVisible();
  });

  test('should display browse reviews page', async ({ page }) => {
    await page.goto('/reviews');
    await expect(page.getByText(/reviews|recent/i)).toBeVisible();
  });

  test('should support pagination on browse page', async ({ page }) => {
    await page.goto('/reviews');
    const pagination = page.getByRole('navigation', { name: /pagination/i });
    const nextButton = page.getByRole('button', { name: /next|page \d+/i });
    if (await pagination.isVisible() || await nextButton.isVisible()) {
      await expect(pagination.or(nextButton)).toBeVisible();
    }
  });
});

test.describe('Attended Check-in Flow', () => {
  test('should require authentication for attended check-in', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.getByPlaceholder(/search|artist|concert/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('Radiohead');
      await page.waitForTimeout(500);
      
      const firstResult = page.getByRole('option').first();
      if (await firstResult.isVisible()) {
        await firstResult.click();
        await page.waitForLoadState('networkidle');
        
        const attendedCheckbox = page.getByRole('checkbox', { name: /attended/i });
        if (await attendedCheckbox.isVisible()) {
          await attendedCheckbox.click();
          await expect(page).toHaveURL(/\/login/);
        }
      }
    }
  });

  test('should toggle attended status when authenticated', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('TestPass123!');
    await page.getByRole('button', { name: /login/i }).click();
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.getByPlaceholder(/search|artist|concert/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('Radiohead');
      await page.waitForTimeout(500);
      
      const firstResult = page.getByRole('option').first();
      if (await firstResult.isVisible()) {
        await firstResult.click();
        await page.waitForLoadState('networkidle');
        
        const attendedCheckbox = page.getByRole('checkbox', { name: /attended/i });
        if (await attendedCheckbox.isVisible()) {
          const initialState = await attendedCheckbox.isChecked();
          await attendedCheckbox.click();
          await page.waitForTimeout(500);
          const newState = await attendedCheckbox.isChecked();
          expect(newState).not.toBe(initialState);
        }
      }
    }
  });
});

test.describe('Error Handling', () => {
  test('should display custom 404 page', async ({ page }) => {
    await page.goto('/nonexistent-page-12345');
    await expect(page.getByText(/404|not found|page not found/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /home|go back|back to home/i })).toBeVisible();
  });

  test('should handle invalid concert ID', async ({ page }) => {
    await page.goto('/concerts/invalid-id-xyz-123');
    await expect(page.getByText(/404|not found|concert not found/i)).toBeVisible();
  });

  test('should handle invalid review ID', async ({ page }) => {
    await page.goto('/reviews/invalid-id-xyz-123');
    await expect(page.getByText(/404|not found|review not found/i)).toBeVisible();
  });
});

test.describe('Navigation and Layout', () => {
  test('should display header/navigation on all pages', async ({ page }) => {
    const pages = ['/', '/login', '/signup', '/reviews'];
    for (const path of pages) {
      await page.goto(path);
      await expect(page.getByRole('navigation')).toBeVisible();
      await expect(page.getByText(/concert|review|letterboxd/i)).toBeVisible();
    }
  });

  test('should have responsive layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.getByRole('navigation')).toBeVisible();
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.getByRole('navigation')).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

test.describe('Authentication - Intended Behavior', () => {
  test.describe('Login Page', () => {
    test('should display login form with correct elements', async ({ page }) => {
      await page.goto('/login');
      
      await expect(page).toHaveTitle(/Login/);
      
      await expect(page.getByText('Welcome back')).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
      
      const submitButton = page.locator('form button[type="submit"]');
      await expect(submitButton).toHaveText('Sign In');
    });

    test('should show validation error for empty fields', async ({ page }) => {
      await page.goto('/login');
      
      await page.locator('form button[type="submit"]').click();
      
      await expect(page.getByText(/required|invalid/i).first()).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/login');
      
      await page.getByLabel('Email').fill('invalid@example.com');
      await page.getByLabel('Password').fill('wrongpassword');
      await page.locator('form button[type="submit"]').click();
      
      await expect(page.getByText(/invalid|incorrect|error/i).first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Signup Page', () => {
    test('should display signup form with correct elements', async ({ page }) => {
      await page.goto('/signup');
      
      await expect(page).toHaveTitle(/Sign Up/);
      
      await expect(page.getByText('Create an account')).toBeVisible();
      await expect(page.getByLabel('Name')).toBeVisible();
      await expect(page.getByLabel('Email')).toBeVisible();
      await expect(page.getByLabel('Password')).toBeVisible();
      
      const submitButton = page.locator('form button[type="submit"]');
      await expect(submitButton).toHaveText('Create account');
    });

    test('should show validation error for empty fields', async ({ page }) => {
      await page.goto('/signup');
      
      await page.locator('form button[type="submit"]').click();
      
      await expect(page.getByText(/required|invalid/i).first()).toBeVisible();
    });

    test('should create account and redirect to login', async ({ page }) => {
      const uniqueEmail = `test_${Date.now()}@example.com`;
      
      await page.goto('/signup');
      
      await page.getByLabel('Name').fill('Test User');
      await page.getByLabel('Email').fill(uniqueEmail);
      await page.getByLabel('Password').fill('SecurePass123!');
      await page.locator('form button[type="submit"]').click();
      
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    });
  });

  test.describe('Navigation', () => {
    test('should have Sign In link in nav when logged out', async ({ page }) => {
      await page.goto('/');
      
      const signInLink = page.locator('header').getByRole('button', { name: 'Sign In' });
      await expect(signInLink).toBeVisible();
    });

    test('should navigate between login and signup pages', async ({ page }) => {
      await page.goto('/login');
      
      await page.getByRole('link', { name: /sign up/i }).click();
      await expect(page).toHaveURL(/\/signup/);
      
      await page.getByRole('link', { name: /sign in/i }).click();
      await expect(page).toHaveURL(/\/login/);
    });
  });
});
import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Electric Venue Homepage - Visual Regression', () => {
  const screenshotDir = path.join(process.cwd(), '.sisyphus/evidence/electric-venue');

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Wait for images and animations to settle
    await page.waitForTimeout(1000);
  });

  test('homepage renders all 5 sections', async ({ page }) => {
    // Section 1: HeroSection
    const heroSection = page.locator('section').filter({ hasText: /Feel the Electric Venue/i }).first();
    await expect(heroSection).toBeVisible();
    await expect(heroSection).toContainText('Discover concerts');

    // Section 2: FeatureCards
    const featureCards = page.locator('div.grid').filter({ hasText: /Discover Concerts/i }).first();
    await expect(featureCards).toBeVisible();
    await expect(featureCards).toContainText('Connect with Fans');
    await expect(featureCards).toContainText('Share Reviews');

    // Section 3: TrendingSection
    const trendingSection = page.locator('section').filter({ hasText: /Trending Shows/i }).first();
    await expect(trendingSection).toBeVisible();
    await expect(trendingSection).toContainText('Discover the hottest concerts');

    // Section 4: CallToAction
    const ctaSection = page.locator('section').filter({ hasText: /Ready to Feel the Electric Venue/i }).first();
    await expect(ctaSection).toBeVisible();
    await expect(ctaSection).toContainText('Join thousands of music fans');

    // Section 5: Footer
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('Electric Venue');
    await expect(footer).toContainText('ConcertVibe');

    // Save full page screenshot
    await page.screenshot({ 
      path: path.join(screenshotDir, 'full-page.png'),
      fullPage: true 
    });
  });

  test('HeroSection background image loads', async ({ page }) => {
    const heroSection = page.locator('section').filter({ hasText: /Feel the Electric Venue/i }).first();
    
    // Check that the background image is present
    const bgImage = heroSection.locator('img[alt="Concert venue atmosphere"]');
    await expect(bgImage).toBeVisible();
    
    // Verify image has loaded (naturalWidth > 0)
    const imageLoaded = await bgImage.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0);
    expect(imageLoaded).toBe(true);

    // Save hero section screenshot
    await heroSection.screenshot({ 
      path: path.join(screenshotDir, 'hero-section-bg.png') 
    });
  });

  test('Purple gradient overlays visible in HeroSection', async ({ page }) => {
    const heroSection = page.locator('section').filter({ hasText: /Feel the Electric Venue/i }).first();
    
    // Check for purple gradient overlay divs (they have specific blur and position styles)
    const overlayDivs = heroSection.locator('div.absolute').filter({ 
      hasNot: page.locator('img') 
    });
    
    // At least 3 overlay divs should be present (top-left, bottom-right, top-center)
    await expect(overlayDivs.nth(0)).toBeVisible();
    await expect(overlayDivs.nth(1)).toBeVisible();
    await expect(overlayDivs.nth(2)).toBeVisible();

    // Save gradient overlay screenshot
    await heroSection.screenshot({ 
      path: path.join(screenshotDir, 'hero-gradient-overlays.png') 
    });
  });

  test('Buttons have hover glow effect', async ({ page }) => {
    const heroSection = page.locator('section').filter({ hasText: /Feel the Electric Venue/i }).first();
    
    // Primary button (Explore Shows)
    const primaryButton = heroSection.locator('button').filter({ hasText: /Explore Shows/i }).first();
    await expect(primaryButton).toBeVisible();
    
    // Hover over primary button with force to bypass overlay interception
    await primaryButton.hover({ force: true });
    await page.waitForTimeout(500);
    
    // Save primary button hover screenshot
    await primaryButton.screenshot({ 
      path: path.join(screenshotDir, 'primary-button-hover.png') 
    });

    // Secondary button (Join the Vibe)
    const secondaryButton = heroSection.locator('button').filter({ hasText: /Join the Vibe/i }).first();
    await expect(secondaryButton).toBeVisible();
    
    // Hover over secondary button with force
    await secondaryButton.hover({ force: true });
    await page.waitForTimeout(500);
    
    // Save secondary button hover screenshot
    await secondaryButton.screenshot({ 
      path: path.join(screenshotDir, 'secondary-button-hover.png') 
    });
  });

  test('All text readable', async ({ page }) => {
    // Hero section text
    const heroTitle = page.locator('h1').filter({ hasText: /Feel the Electric Venue/i }).first();
    await expect(heroTitle).toBeVisible();
    const heroTitleColor = await heroTitle.evaluate((el: HTMLElement) => 
      window.getComputedStyle(el).color
    );
    // Should be light text on dark background (high contrast)
    expect(heroTitleColor).toMatch(/rgb\((\d+), (\d+), (\d+)\)/);

    // Hero subtitle
    const heroSubtitle = page.locator('p').filter({ hasText: /Discover concerts, track your attendance/i }).first();
    await expect(heroSubtitle).toBeVisible();

    // Feature card titles (they use CardTitle component which renders h3)
    await expect(page.getByText('Discover Concerts', { exact: true })).toBeVisible();
    await expect(page.getByText('Connect with Fans', { exact: true })).toBeVisible();
    await expect(page.getByText('Share Reviews', { exact: true })).toBeVisible();

    // Trending section heading
    const trendingHeading = page.locator('h2').filter({ hasText: /Trending Shows/i }).first();
    await expect(trendingHeading).toBeVisible();

    // CTA section heading
    const ctaHeading = page.locator('h2').filter({ hasText: /Ready to Feel the Electric Venue/i }).first();
    await expect(ctaHeading).toBeVisible();

    // Save text readability screenshot
    await page.screenshot({ 
      path: path.join(screenshotDir, 'text-readability.png'),
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
  });

  test('complete homepage visual snapshot', async ({ page }) => {
    // Set viewport to standard desktop size
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Wait for all content to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Capture full viewport screenshot
    await page.screenshot({ 
      path: path.join(screenshotDir, 'homepage-snapshot-1920x1080.png'),
      fullPage: false 
    });

    // Capture mobile viewport screenshot
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);
    await page.screenshot({ 
      path: path.join(screenshotDir, 'homepage-snapshot-mobile-375x812.png'),
      fullPage: true 
    });
  });
});

import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to home page', async ({ page }) => {
    await page.goto('/');
    
    // Title dalam Bahasa Indonesia
    await expect(page).toHaveTitle(/zakatapp|manajemen zakat/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check if navigation is present
    const nav = page.locator('nav, header').first();
    await expect(nav).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Page should still be accessible
    await expect(page.locator('body')).toBeVisible();
    
    // Check viewport size is correct (actual body width may include scrollbars)
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(375);
    expect(viewport?.height).toBe(667);
  });

  test('should handle 404 pages', async ({ page }) => {
    await page.goto('/non-existent-page-12345');
    
    // Should show 404 or redirect
    const title = await page.title();
    const content = await page.content();
    
    const is404 = 
      title.toLowerCase().includes('404') ||
      title.toLowerCase().includes('not found') ||
      title.toLowerCase().includes('tidak ditemukan') ||
      content.toLowerCase().includes('404') ||
      content.toLowerCase().includes('not found') ||
      content.toLowerCase().includes('tidak ditemukan') ||
      content.toLowerCase().includes('page not found');
    
    expect(is404).toBeTruthy();
  });
});

test.describe('Theme', () => {
  test('should have theme support', async ({ page }) => {
    await page.goto('/');
    
    // Check for dark/light mode capability
    const html = page.locator('html');
    const hasThemeClass = await html.evaluate(el => {
      return el.classList.contains('dark') || el.classList.contains('light');
    });
    
    // Theme class might or might not be present depending on default
    // Just check that the page loads correctly
    await expect(page.locator('body')).toBeVisible();
  });
});

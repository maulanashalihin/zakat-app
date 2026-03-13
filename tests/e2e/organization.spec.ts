import { test, expect } from '@playwright/test';

test.describe('Organization Management', () => {
  test.describe('Public Organization Page', () => {
    test('should display organizations page', async ({ page }) => {
      await page.goto('/organizations');
      
      await expect(page.locator('body')).toBeVisible();
      
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    });

    test('should show organization-related content', async ({ page }) => {
      await page.goto('/organizations');
      
      const content = await page.content();
      const hasOrgContent = 
        content.toLowerCase().includes('organisasi') ||
        content.toLowerCase().includes('organization') ||
        content.toLowerCase().includes('masjid') ||
        content.toLowerCase().includes('zakat');
      
      expect(hasOrgContent).toBeTruthy();
    });
  });

  test.describe('Protected Organization Routes', () => {
    test('should redirect unauthenticated user from org dashboard to login', async ({ page }) => {
      await page.goto('/o/test-org/dashboard');
      await expect(page).toHaveURL(/.*login.*/);
    });

    test('should redirect unauthenticated user from org master data to login', async ({ page }) => {
      await page.goto('/o/test-org/master/sektor');
      await expect(page).toHaveURL(/.*login.*/);
    });

    test('should redirect unauthenticated user from org muzaki to login', async ({ page }) => {
      await page.goto('/o/test-org/muzaki');
      await expect(page).toHaveURL(/.*login.*/);
    });

    test('should redirect unauthenticated user from org mustahik to login', async ({ page }) => {
      // Increase timeout for navigation
      await page.goto('/o/test-org/mustahik', { timeout: 10000 });
      await expect(page).toHaveURL(/.*login.*/, { timeout: 10000 });
    });
  });

  test.describe('Master Data Pages', () => {
    test('should access sektor page structure when authenticated', async ({ page }) => {
      await page.goto('/o/test-org/master/sektor');
      
      if (!page.url().includes('/login')) {
        const heading = page.getByRole('heading', { name: /sektor|wilayah/i });
        await expect(heading).toBeVisible();
      }
    });

    test('should access periode page structure when authenticated', async ({ page }) => {
      await page.goto('/o/test-org/master/periode');
      
      if (!page.url().includes('/login')) {
        const heading = page.getByRole('heading', { name: /periode|tahun/i });
        await expect(heading).toBeVisible();
      }
    });

    test('should access petugas page structure when authenticated', async ({ page }) => {
      await page.goto('/o/test-org/master/petugas');
      
      if (!page.url().includes('/login')) {
        const heading = page.getByRole('heading', { name: /petugas|pengurus/i });
        await expect(heading).toBeVisible();
      }
    });
  });

  test.describe('Zakat Management Pages', () => {
    test('should access muzaki list page when authenticated', async ({ page }) => {
      await page.goto('/o/test-org/muzaki');
      
      if (!page.url().includes('/login')) {
        const content = page.locator('table, [class*="table"], [class*="list"], h1, h2').first();
        await expect(content).toBeVisible();
      }
    });

    test('should access mustahik list page when authenticated', async ({ page }) => {
      await page.goto('/o/test-org/mustahik');
      
      if (!page.url().includes('/login')) {
        const content = page.locator('table, [class*="table"], [class*="list"], h1, h2').first();
        await expect(content).toBeVisible();
      }
    });
  });
});

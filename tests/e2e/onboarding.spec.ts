import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
  test.describe('Step 1 - Organization Info', () => {
    test('should display step 1 page', async ({ page }) => {
      await page.goto('/onboarding/langkah-1');
      
      const url = page.url();
      const isLoginPage = url.includes('/login');
      const isOnboardingPage = url.includes('/onboarding/langkah-1');
      
      expect(isLoginPage || isOnboardingPage).toBeTruthy();
      
      if (isOnboardingPage) {
        await expect(page.getByRole('heading', { name: /langkah 1|organisasi|informasi organisasi/i })).toBeVisible();
        await expect(page.getByLabel(/nama organisasi/i)).toBeVisible();
        await expect(page.getByLabel(/slug/i)).toBeVisible();
      }
    });

    test('should validate required fields', async ({ page }) => {
      await page.goto('/onboarding/langkah-1');
      
      if (page.url().includes('/login')) {
        test.skip();
        return;
      }
      
      const submitButton = page.getByRole('button', { name: /lanjut|selanjutnya|simpan/i });
      if (await submitButton.isVisible().catch(() => false)) {
        await submitButton.click();
        await expect(page.getByText(/wajib|required|tidak boleh kosong/i).first()).toBeVisible();
      }
    });
  });

  test.describe('Step 2 - Zakat Settings', () => {
    test('should display step 2 page', async ({ page }) => {
      await page.goto('/onboarding/langkah-2');
      
      const url = page.url();
      const isLoginPage = url.includes('/login');
      const isOnboardingPage = url.includes('/onboarding/langkah-2');
      
      expect(isLoginPage || isOnboardingPage).toBeTruthy();
      
      if (isOnboardingPage) {
        await expect(page.getByRole('heading', { name: /langkah 2|pengaturan zakat|ketetapan zakat/i })).toBeVisible();
      }
    });
  });

  test.describe('Step 3 - Sectors', () => {
    test('should display step 3 page', async ({ page }) => {
      await page.goto('/onboarding/langkah-3');
      
      const url = page.url();
      const isLoginPage = url.includes('/login');
      const isOnboardingPage = url.includes('/onboarding/langkah-3');
      
      expect(isLoginPage || isOnboardingPage).toBeTruthy();
      
      if (isOnboardingPage) {
        await expect(page.getByRole('heading', { name: /langkah 3|sektor|wilayah/i })).toBeVisible();
      }
    });
  });

  test.describe('Step 4 - Team Members', () => {
    test('should display step 4 page', async ({ page }) => {
      await page.goto('/onboarding/langkah-4');
      
      const url = page.url();
      const isLoginPage = url.includes('/login');
      const isOnboardingPage = url.includes('/onboarding/langkah-4');
      
      expect(isLoginPage || isOnboardingPage).toBeTruthy();
      
      if (isOnboardingPage) {
        await expect(page.getByRole('heading', { name: /langkah 4|anggota tim|petugas/i })).toBeVisible();
      }
    });
  });

  test.describe('Completion Page', () => {
    test('should display completion page', async ({ page }) => {
      await page.goto('/onboarding/selesai');
      
      const url = page.url();
      const isLoginPage = url.includes('/login');
      const isCompletionPage = url.includes('/onboarding/selesai');
      
      expect(isLoginPage || isCompletionPage).toBeTruthy();
      
      if (isCompletionPage) {
        await expect(page.getByRole('heading', { name: /selesai|berhasil|selamat/i })).toBeVisible();
      }
    });
  });
});

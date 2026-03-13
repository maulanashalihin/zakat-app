import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.describe('Public Pages', () => {
    test('should display login page', async ({ page }) => {
      await page.goto('/login');
      
      await expect(page).toHaveTitle(/login|masuk/i);
      // Heading dalam Bahasa Indonesia: "Selamat Datang"
      await expect(page.getByRole('heading', { name: /selamat datang|masuk/i })).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      // Button submit dalam Bahasa Indonesia: "Masuk"
      await expect(page.getByRole('button', { name: /^masuk$/i })).toBeVisible();
    });

    test('should display register page', async ({ page }) => {
      await page.goto('/register');
      
      // Title dalam Bahasa Indonesia: "Daftar - ZakatApp"
      await expect(page).toHaveTitle(/daftar|register/i);
      // Heading dalam Bahasa Indonesia: "Buat Akun"
      await expect(page.getByRole('heading', { name: /buat akun|daftar/i })).toBeVisible();
      await expect(page.getByLabel(/nama/i)).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
    });

    test('should navigate from login to register', async ({ page }) => {
      await page.goto('/login');
      
      // Link dalam Bahasa Indonesia: "Daftar Gratis"
      const registerLink = page.getByRole('link', { name: /daftar/i });
      await registerLink.click();
      
      await expect(page).toHaveURL(/.*register.*/);
    });

    test('should display forgot password page', async ({ page }) => {
      await page.goto('/forgot-password');
      
      // Heading dalam Bahasa Indonesia: "Lupa Password"
      await expect(page.getByRole('heading', { name: /lupa password/i })).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
    });
  });

  test.describe('Form Validation', () => {
    test('should show error for empty login form', async ({ page }) => {
      await page.goto('/login');
      
      // Try to submit empty form
      await page.getByRole('button', { name: /^masuk$/i }).click();
      
      // HTML5 validation akan mencegah submit, form masih di halaman yang sama
      await expect(page).toHaveURL(/.*login.*/);
    });

    test('should show password requirements on register', async ({ page }) => {
      await page.goto('/register');
      
      // Fill in weak password
      await page.getByLabel(/password/i).fill('weak');
      
      // Should show password requirements
      await expect(page.getByText(/minimal 8 karakter/i)).toBeVisible();
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect unauthenticated user from dashboard to login', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Should be redirected to login
      await expect(page).toHaveURL(/.*login.*/);
    });

    test('should redirect unauthenticated user from org dashboard to login', async ({ page }) => {
      await page.goto('/o/test-org/dashboard');
      
      await expect(page).toHaveURL(/.*login.*/);
    });
  });

  test.describe('Google OAuth', () => {
    test('should have Google login button', async ({ page }) => {
      await page.goto('/login');
      
      // Button dalam Bahasa Indonesia: "Masuk dengan Google"
      const googleButton = page.getByRole('button', { name: /google|masuk dengan google/i });
      await expect(googleButton).toBeVisible();
    });
  });
});

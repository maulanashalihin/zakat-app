import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    name: 'layangkit',
    include: ['tests/unit/**/*.{test,spec}.{js,ts}'],
    exclude: [
      'node_modules/',
      'tests/e2e/',
      // Exclude tests that import SvelteKit-specific modules we can't mock
      'tests/unit/lib/auth/google.test.ts',
      'tests/unit/lib/auth/session.test.ts',
    ],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/unit/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/static/**',
        '**/.svelte-kit/**',
        '**/migrations/**',
      ],
    },
  },
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib'),
      '$app/environment': path.resolve('./tests/unit/mocks/app.ts'),
      '$app/navigation': path.resolve('./tests/unit/mocks/app.ts'),
      '$app/stores': path.resolve('./tests/unit/mocks/app.ts'),
    },
  },
});

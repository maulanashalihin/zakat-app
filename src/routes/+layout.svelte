<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { Hexagon, Sun, Moon } from 'lucide-svelte';
  import { theme } from '$lib/stores/theme.svelte';

  let { children } = $props();

  let isDashboardRoute = $derived(page.url.pathname.startsWith('/dashboard') || page.url.pathname.startsWith('/admin') || page.url.pathname.startsWith('/o/'));
  let isAuthPage = $derived(['/login', '/register', '/forgot-password', '/reset-password'].some(path => page.url.pathname.startsWith(path)));
  let isOnboarding = $derived(page.url.pathname.startsWith('/onboarding'));
  let isHomePage = $derived(page.url.pathname === '/');

  function toggleTheme() {
    theme.toggle();
  }
</script>

{#if isAuthPage || isOnboarding}
  {@render children()}
{:else if isDashboardRoute}
  {@render children()}
{:else if isHomePage}
  {@render children()}
{:else}
  <div class="min-h-screen flex flex-col grain" style="background-color: var(--bg-primary); --border-color: transparent;">
    <header class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-transparent transition-colors"
            style="background-color: color-mix(in srgb, var(--bg-primary), transparent 20%);">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <a href="/" class="flex items-center gap-2">
            <Hexagon class="w-8 h-8 text-green-600" />
            <span class="font-bold text-xl" style="color: var(--text-primary);">ZakatApp</span>
          </a>
          <nav class="hidden md:flex items-center gap-6">
            <a href="/" class="text-sm font-medium transition-colors" style="color: var(--text-secondary);">Beranda</a>
            <a href="/login" class="text-sm font-medium transition-colors hover:text-green-600" style="color: var(--text-secondary);">Masuk</a>
          </nav>
          <div class="flex items-center gap-3">
            <button onclick={toggleTheme} class="p-2 rounded-lg transition-colors" style="color: var(--text-secondary);" aria-label="Toggle theme">
              {#if theme.current === 'dark'}
                <Sun class="w-5 h-5" />
              {:else}
                <Moon class="w-5 h-5" />
              {/if}
            </button>
            <a href="/register" class="hidden sm:inline-flex">
              <button class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors">Daftar</button>
            </a>
          </div>
        </div>
      </div>
    </header>
    <main class="flex-1 pt-16">
      {@render children()}
    </main>
  </div>
{/if}

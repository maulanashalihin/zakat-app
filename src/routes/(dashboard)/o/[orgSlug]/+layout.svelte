<script>
  import { page } from '$app/state';
  import { Sun, Moon, Menu, X, Building2, Users, HandHeart, MapPin, Settings, UsersRound, FileText, Calendar, LogOut } from 'lucide-svelte';
  import { theme } from '$lib/stores/theme.svelte';

  let { children, data } = $props();

  const organization = data.organization;
  const user = data.user;

  // Check active route
  let currentPath = $derived(page.url.pathname);

  // Mobile sidebar state
  let mobileMenuOpen = $state(false);

  function isActive(path) {
    return currentPath === path || currentPath.startsWith(path + '/');
  }

  function toggleTheme() {
    theme.toggle();
  }

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }

  async function handleLogout() {
    try {
      await fetch('/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }
</script>

<svelte:head>
  <title>{organization.name} - ZakatApp</title>
</svelte:head>

<div class="min-h-screen flex bg-slate-50 dark:bg-slate-950">
  <!-- Mobile Overlay -->
  {#if mobileMenuOpen}
    <button
      type="button"
      class="fixed inset-0 z-40 lg:hidden bg-black/50 backdrop-blur-sm"
      onclick={closeMobileMenu}
      aria-label="Close menu"
    ></button>
  {/if}

  <!-- Sidebar -->
  <aside
    class="fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col shrink-0 transition-transform duration-300 ease-in-out lg:translate-x-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700 shadow-[0_0_50px_rgb(0,0,0,0.1)] dark:shadow-[0_0_50px_rgb(0,0,0,0.4)]"
    class:-translate-x-full={!mobileMenuOpen}
  >
    <!-- Org Header -->
    <div class="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
      <a href="/o/{organization.slug}/dashboard" class="flex items-center gap-3 group overflow-hidden flex-1">
        {#if organization.logo_url}
          <img src={organization.logo_url} alt={organization.name} class="w-10 h-10 rounded-xl object-cover shrink-0 shadow-md" />
        {:else}
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-extrabold shrink-0 bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-lg shadow-primary-500/40">
            {organization.name.charAt(0).toUpperCase()}
          </div>
        {/if}
        <div class="flex-1 min-w-0 overflow-hidden">
          <h2 class="font-extrabold truncate text-slate-900 dark:text-white">{organization.name}</h2>
          <p class="text-xs font-medium text-slate-500 dark:text-slate-400 truncate capitalize">
            {user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : user.role === 'petugas' ? 'Petugas' : 'Viewer'}
          </p>
        </div>
      </a>
      <!-- Close button for mobile -->
      <button
        type="button"
        class="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 ml-2"
        onclick={closeMobileMenu}
        aria-label="Close menu"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-6 px-4 scrollbar-smooth">
      <!-- Main -->
      <div class="space-y-1">
        <a
          href="/o/{organization.slug}/dashboard"
          onclick={closeMobileMenu}
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 {isActive('/o/' + organization.slug + '/dashboard') ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/40' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}"
        >
          <Building2 class="w-5 h-5 shrink-0" />
          <span>Dashboard</span>
        </a>

        {#if user.role === 'admin' || user.role === 'super_admin' || user.role === 'petugas'}
          <a
            href="/o/{organization.slug}/muzaki"
            onclick={closeMobileMenu}
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 {isActive('/o/' + organization.slug + '/muzaki') ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/40' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}"
          >
            <Users class="w-5 h-5 shrink-0" />
            <span>Muzaki</span>
          </a>
        {/if}

        {#if user.role === 'admin' || user.role === 'super_admin'}
          <a
            href="/o/{organization.slug}/mustahik"
            onclick={closeMobileMenu}
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 {isActive('/o/' + organization.slug + '/mustahik') ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/40' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}"
          >
            <HandHeart class="w-5 h-5 shrink-0" />
            <span>Mustahik</span>
          </a>
        {/if}

        <a
          href="/o/{organization.slug}/sektor"
          onclick={closeMobileMenu}
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 {isActive('/o/' + organization.slug + '/sektor') ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/40' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}"
        >
          <MapPin class="w-5 h-5 shrink-0" />
          <span>Rekap Sektor</span>
        </a>
      </div>

      {#if user.role === 'admin' || user.role === 'super_admin'}
        <div class="mt-8">
          <div class="px-4 mb-3">
            <span class="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Master Data</span>
          </div>
          <div class="space-y-1">
            <a
              href="/o/{organization.slug}/master/sektor"
              onclick={closeMobileMenu}
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 {isActive('/o/' + organization.slug + '/master/sektor') ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/40' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}"
            >
              <MapPin class="w-5 h-5 shrink-0" />
              <span>Sektor</span>
            </a>

            <a
              href="/o/{organization.slug}/master/petugas"
              onclick={closeMobileMenu}
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 {isActive('/o/' + organization.slug + '/master/petugas') ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/40' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}"
            >
              <UsersRound class="w-5 h-5 shrink-0" />
              <span>Petugas</span>
            </a>

            <a
              href="/o/{organization.slug}/master/periode"
              onclick={closeMobileMenu}
              class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 {isActive('/o/' + organization.slug + '/master/periode') ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/40' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}"
            >
              <Calendar class="w-5 h-5 shrink-0" />
              <span>Periode</span>
            </a>
          </div>
        </div>
      {/if}
    </nav>

    <!-- User Menu -->
    <div class="p-4 border-t border-slate-200 dark:border-slate-700">
      <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-3">
        {#if user.avatar}
          <img src={user.avatar} alt={user.name} class="w-9 h-9 rounded-full object-cover shadow-sm" />
        {:else}
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
        {/if}
        <div class="flex-1 min-w-0 overflow-hidden">
          <p class="text-sm font-bold truncate text-slate-900 dark:text-white">{user.name}</p>
          <p class="text-xs truncate text-slate-500 dark:text-slate-400">{user.email}</p>
        </div>
      </div>
      
      <div class="space-y-2">
        <a
          href="/profile"
          onclick={closeMobileMenu}
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <Settings class="w-5 h-5 shrink-0" />
          <span>Profile</span>
        </a>
        <button
          onclick={toggleTheme}
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          aria-label="Toggle theme"
        >
          {#if theme.current === 'dark'}
            <Sun class="w-5 h-5 shrink-0" />
            <span>Light Mode</span>
          {:else}
            <Moon class="w-5 h-5 shrink-0" />
            <span>Dark Mode</span>
          {/if}
        </button>
        <button
          onclick={handleLogout}
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <LogOut class="w-5 h-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 overflow-auto w-full min-w-0">
    <!-- Mobile Header -->
    <div class="lg:hidden sticky top-0 z-30 px-4 py-3 flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <button
        type="button"
        class="p-2 rounded-lg text-slate-600 dark:text-slate-400"
        onclick={toggleMobileMenu}
        aria-label="Open menu"
      >
        <Menu class="w-6 h-6" />
      </button>
      <span class="font-extrabold text-slate-900 dark:text-white truncate">{organization.name}</span>
    </div>

    <!-- Page Content -->
    <div class="min-h-[calc(100vh-4rem)]">
      {@render children()}
    </div>
  </main>
</div>

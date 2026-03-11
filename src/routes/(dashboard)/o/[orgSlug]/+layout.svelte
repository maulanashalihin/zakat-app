<script>
  import { page } from '$app/state';
  import { Sun, Moon, Menu, X } from 'lucide-svelte';
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
</script>

<div class="min-h-screen flex" style="background-color: var(--bg-primary);">
  <!-- Mobile Overlay -->
  {#if mobileMenuOpen}
    <button
      type="button"
      class="fixed inset-0 z-40 lg:hidden"
      style="background-color: rgba(0,0,0,0.5);"
      onclick={closeMobileMenu}
      aria-label="Close menu"
    ></button>
  {/if}

  <!-- Sidebar -->
  <aside 
    class="fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col shrink-0 transition-transform duration-300 ease-in-out lg:translate-x-0"
    class:-translate-x-full={!mobileMenuOpen}
    style="background-color: var(--bg-secondary); border-right: 1px solid var(--border-primary);"
  >
    <!-- Org Header -->
    <div class="h-16 flex items-center px-4" style="border-bottom: 1px solid var(--border-primary);">
      <a href="/o/{organization.slug}/dashboard" class="flex items-center gap-3 group overflow-hidden flex-1">
        {#if organization.logo_url}
          <img src={organization.logo_url} alt={organization.name} class="w-10 h-10 rounded-lg object-cover shrink-0" />
        {:else}
          <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold shrink-0" style="background-color: var(--accent-bg); color: var(--accent-primary);">
            {organization.name.charAt(0).toUpperCase()}
          </div>
        {/if}
        <div class="flex-1 min-w-0 overflow-hidden">
          <h2 class="font-semibold truncate" style="color: var(--text-primary);">{organization.name}</h2>
          <p class="text-xs truncate" style="color: var(--text-tertiary);">
            {user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : user.role === 'petugas' ? 'Petugas' : 'Viewer'}
          </p>
        </div>
      </a>
      <!-- Close button for mobile -->
      <button
        type="button"
        class="lg:hidden p-2 rounded-lg ml-2"
        style="color: var(--text-tertiary);"
        onclick={closeMobileMenu}
        aria-label="Close menu"
      >
        <X class="w-5 h-5" />
      </button>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 scrollbar-smooth">
      <!-- Main -->
      <div class="space-y-1">
        <a 
          href="/o/{organization.slug}/dashboard" 
          onclick={closeMobileMenu}
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          class:sidebar-link-active={isActive('/o/' + organization.slug + '/dashboard')}
          class:sidebar-link-inactive={!isActive('/o/' + organization.slug + '/dashboard')}
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span>Dashboard</span>
        </a>
        
        {#if user.role === 'admin' || user.role === 'super_admin' || user.role === 'petugas'}
          <a 
            href="/o/{organization.slug}/muzaki" 
            onclick={closeMobileMenu}
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            class:sidebar-link-active={isActive('/o/' + organization.slug + '/muzaki')}
            class:sidebar-link-inactive={!isActive('/o/' + organization.slug + '/muzaki')}
          >
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Muzaki</span>
          </a>
        {/if}
        
        {#if user.role === 'admin' || user.role === 'super_admin'}
          <a 
            href="/o/{organization.slug}/mustahik" 
            onclick={closeMobileMenu}
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            class:sidebar-link-active={isActive('/o/' + organization.slug + '/mustahik')}
            class:sidebar-link-inactive={!isActive('/o/' + organization.slug + '/mustahik')}
          >
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Mustahik</span>
          </a>
        {/if}
        
        <a 
          href="/o/{organization.slug}/sektor" 
          onclick={closeMobileMenu}
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          class:sidebar-link-active={isActive('/o/' + organization.slug + '/sektor')}
          class:sidebar-link-inactive={!isActive('/o/' + organization.slug + '/sektor')}
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.806-.984A1 1 0 0120 6.382V7m0 13V7" />
          </svg>
          <span>Rekap Sektor</span>
        </a>
      </div>
      
      {#if user.role === 'admin' || user.role === 'super_admin'}
        <div class="mt-6 space-y-1">
          <div class="px-3 mb-2">
            <span class="text-xs font-medium uppercase tracking-wider" style="color: var(--text-tertiary);">Master Data</span>
          </div>
          
          <a 
            href="/o/{organization.slug}/master/sektor" 
            onclick={closeMobileMenu}
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            class:sidebar-link-active={isActive('/o/' + organization.slug + '/master/sektor')}
            class:sidebar-link-inactive={!isActive('/o/' + organization.slug + '/master/sektor')}
          >
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Sektor</span>
          </a>
          
          <a 
            href="/o/{organization.slug}/master/petugas" 
            onclick={closeMobileMenu}
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            class:sidebar-link-active={isActive('/o/' + organization.slug + '/master/petugas')}
            class:sidebar-link-inactive={!isActive('/o/' + organization.slug + '/master/petugas')}
          >
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span>Petugas</span>
          </a>
          
          <a 
            href="/o/{organization.slug}/master/periode" 
            onclick={closeMobileMenu}
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            class:sidebar-link-active={isActive('/o/' + organization.slug + '/master/periode')}
            class:sidebar-link-inactive={!isActive('/o/' + organization.slug + '/master/periode')}
          >
            <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Periode</span>
          </a>
        </div>
      {/if}
    </nav>
    
    <!-- Theme Toggle -->
    <div class="px-3 pb-2">
      <button
        onclick={toggleTheme}
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
        style="color: var(--text-tertiary);"
        aria-label="Toggle theme"
      >
        {#if theme.current === 'dark'}
          <Sun class="w-5 h-5" />
          <span>Light Mode</span>
        {:else}
          <Moon class="w-5 h-5" />
          <span>Dark Mode</span>
        {/if}
      </button>
    </div>
    
    <!-- User Menu -->
    <div class="p-3" style="border-top: 1px solid var(--border-primary);">
      <div class="flex items-center gap-3 p-2 rounded-xl" style="background-color: var(--bg-tertiary);">
        {#if user.avatar}
          <img src={user.avatar} alt={user.name} class="w-8 h-8 rounded-full" />
        {:else}
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium" style="background-color: var(--bg-hover); color: var(--text-secondary);">
            {user.name.charAt(0).toUpperCase()}
          </div>
        {/if}
        <div class="flex-1 min-w-0 overflow-hidden">
          <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{user.name}</p>
          <p class="text-xs truncate" style="color: var(--text-tertiary);">{user.email}</p>
        </div>
        <form action="/auth/logout" method="POST">
          <button type="submit" class="p-1.5 rounded-lg transition-colors" style="color: var(--text-tertiary);" title="Logout">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 overflow-auto w-full min-w-0">
    <!-- Mobile Header -->
    <div class="lg:hidden sticky top-0 z-30 px-4 py-3 flex items-center gap-3" style="background-color: var(--bg-secondary); border-bottom: 1px solid var(--border-primary);">
      <button
        type="button"
        class="p-2 rounded-lg"
        style="color: var(--text-secondary);"
        onclick={toggleMobileMenu}
        aria-label="Open menu"
      >
        <Menu class="w-6 h-6" />
      </button>
      <span class="font-semibold truncate" style="color: var(--text-primary);">{organization.name}</span>
    </div>
    
    <!-- Page Content -->
    <div class="min-h-[calc(100vh-4rem)]">
      {@render children()}
    </div>
  </main>
</div>

<script>
  let { children, data } = $props();
  
  const organization = data.organization;
  const user = data.user;
  const sectors = data.sectors;
</script>

<div class="min-h-screen bg-slate-50 flex">
  <!-- Sidebar -->
  <aside class="w-64 bg-white border-r flex flex-col">
    <!-- Org Header -->
    <div class="p-4 border-b">
      <div class="flex items-center gap-3">
        {#if organization.logo_url}
          <img src={organization.logo_url} alt={organization.name} class="w-10 h-10 rounded-lg object-cover" />
        {:else}
          <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
            {organization.name.charAt(0).toUpperCase()}
          </div>
        {/if}
        <div class="flex-1 min-w-0">
          <h2 class="font-semibold text-slate-900 truncate">{organization.name}</h2>
          <p class="text-xs text-slate-500 truncate">{user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : user.role === 'petugas' ? 'Petugas' : 'Viewer'}</p>
        </div>
      </div>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-1">
      <a href="/o/{organization.slug}/dashboard" class="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100">
        <svg class="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Dashboard
      </a>
      
      {#if user.role === 'admin' || user.role === 'super_admin' || user.role === 'petugas'}
        <a href="/o/{organization.slug}/muzaki" class="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100">
          <svg class="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Muzaki
        </a>
      {/if}
      
      {#if user.role === 'admin' || user.role === 'super_admin'}
        <a href="/o/{organization.slug}/mustahik" class="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100">
          <svg class="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Mustahik
        </a>
      {/if}
      
      <a href="/o/{organization.slug}/sektor" class="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100">
        <svg class="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.806-.984A1 1 0 0120 6.382V7m0 13V7" />
        </svg>
        Rekap Sektor
      </a>
      
      {#if user.role === 'admin' || user.role === 'super_admin'}
        <div class="pt-4 mt-4 border-t">
          <p class="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Master Data</p>
          
          <a href="/o/{organization.slug}/master/sektor" class="flex items-center px-3 py-2 mt-1 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100">
            <svg class="w-5 h-5 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Sektor
          </a>
        </div>
      {/if}
    </nav>
    
    <!-- User Menu -->
    <div class="p-4 border-t">
      <div class="flex items-center gap-3">
        {#if user.avatar}
          <img src={user.avatar} alt={user.name} class="w-8 h-8 rounded-full" />
        {:else}
          <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-medium">
            {user.name.charAt(0).toUpperCase()}
          </div>
        {/if}
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-slate-900 truncate">{user.name}</p>
          <p class="text-xs text-slate-500 truncate">{user.email}</p>
        </div>
        <form action="/auth/logout" method="POST">
          <button type="submit" class="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="flex-1 overflow-auto">
    {@render children()}
  </main>
</div>

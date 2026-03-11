<script>
  let { children, data } = $props();
  
  const user = data.user;
</script>

<div class="min-h-screen bg-slate-50 flex">
  <!-- Sidebar -->
  <aside class="w-64 bg-slate-900 text-white flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-slate-700">
      <h2 class="font-bold text-lg">Super Admin</h2>
      <p class="text-xs text-slate-400">Zakat App Platform</p>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-1">
      <a href="/admin/dashboard" class="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Dashboard
      </a>
      
      <a href="/admin/organizations" class="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white">
        <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Organisasi
      </a>
    </nav>
    
    <!-- User Menu -->
    <div class="p-4 border-t border-slate-700">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{user.name}</p>
          <p class="text-xs text-slate-400 truncate">{user.email}</p>
        </div>
        <form action="/auth/logout" method="POST">
          <button type="submit" class="p-1.5 text-slate-400 hover:text-white">
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

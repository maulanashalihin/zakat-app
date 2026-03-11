<script>
  let { data } = $props();
  
  const stats = data.stats;
  const recentOrganizations = data.recentOrganizations;
  
  function formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(num);
  }
  
  function formatDate(timestamp) {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('id-ID');
  }
</script>

<svelte:head>
  <title>Super Admin Dashboard | ZakatApp</title>
</svelte:head>

<div class="p-6">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-2xl font-bold text-slate-900">Super Admin Dashboard</h1>
    <p class="text-slate-600">Overview platform Zakat App</p>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500">Total Organisasi</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">{formatNumber(stats.organizations)}</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500">Total Users</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">{formatNumber(stats.users)}</p>
        </div>
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500">Total Muzaki</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">{formatNumber(stats.muzaki)}</p>
        </div>
        <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500">Total Mustahik</p>
          <p class="text-3xl font-bold text-slate-900 mt-2">{formatNumber(stats.mustahik)}</p>
        </div>
        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
    </div>
  </div>

  <!-- Quick Actions -->
  <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
    <h2 class="text-lg font-semibold text-slate-900 mb-4">Aksi Cepat</h2>
    <div class="flex flex-wrap gap-3">
      <a href="/admin/organizations" class="btn-primary">
        <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Buat Organisasi Baru
      </a>
    </div>
  </div>

  <!-- Recent Organizations -->
  <div class="bg-white rounded-lg shadow-sm p-6">
    <h2 class="text-lg font-semibold text-slate-900 mb-4">Organisasi Terbaru</h2>
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-slate-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nama</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Slug</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Dibuat</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          {#each recentOrganizations as org}
            <tr class="hover:bg-slate-50">
              <td class="px-4 py-3 font-medium text-slate-900">{org.name}</td>
              <td class="px-4 py-3 text-slate-600 text-sm">{org.slug}</td>
              <td class="px-4 py-3 text-slate-500 text-sm">{formatDate(org.created_at)}</td>
              <td class="px-4 py-3 text-right">
                <a href="/o/{org.slug}/dashboard" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Lihat
                </a>
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="4" class="px-4 py-8 text-center text-slate-500">
                Belum ada organisasi
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

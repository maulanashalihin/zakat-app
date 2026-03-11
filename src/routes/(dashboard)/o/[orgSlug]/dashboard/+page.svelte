<script>
  let { data } = $props();
  
  const organization = data.organization;
  const stats = data.stats;
  const settings = data.settings;
  const recentMuzaki = data.recentMuzaki || [];
  
  function formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(num);
  }
  
  function formatCurrency(num) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  }
  
  function formatDate(timestamp) {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('id-ID');
  }
</script>

<svelte:head>
  <title>Dashboard - {organization.name} | ZakatApp</title>
</svelte:head>

<div class="p-4 lg:p-6" style="background-color: var(--bg-primary); min-height: 100%;">
  <!-- Page Header -->
  <div class="mb-6 lg:mb-8">
    <h1 class="text-xl lg:text-2xl font-bold" style="color: var(--text-primary);">Dashboard</h1>
    <p class="text-sm lg:text-base" style="color: var(--text-secondary);">Selamat datang di {organization.name}</p>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
    <!-- Muzaki Card -->
    <div class="rounded-lg shadow-sm p-3 lg:p-6" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
      <div class="flex items-center justify-between">
        <div class="min-w-0">
          <p class="text-xs lg:text-sm font-medium truncate" style="color: var(--text-tertiary);">Total Muzaki</p>
          <p class="text-lg lg:text-3xl font-bold mt-1 lg:mt-2" style="color: var(--text-primary);">{formatNumber(stats.muzakiCount)}</p>
        </div>
        <div class="w-8 h-8 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center shrink-0" style="background-color: rgba(59, 130, 246, 0.1);">
          <svg class="w-4 h-4 lg:w-6 lg:h-6" style="color: #3b82f6;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>
      <p class="text-xs lg:text-sm mt-1 lg:mt-2" style="color: var(--text-tertiary);">{formatNumber(stats.totalJiwa)} jiwa</p>
    </div>

    <!-- Mustahik Card -->
    <div class="rounded-lg shadow-sm p-3 lg:p-6" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
      <div class="flex items-center justify-between">
        <div class="min-w-0">
          <p class="text-xs lg:text-sm font-medium truncate" style="color: var(--text-tertiary);">Total Mustahik</p>
          <p class="text-lg lg:text-3xl font-bold mt-1 lg:mt-2" style="color: var(--text-primary);">{formatNumber(stats.mustahikCount)}</p>
        </div>
        <div class="w-8 h-8 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center shrink-0" style="background-color: rgba(34, 197, 94, 0.1);">
          <svg class="w-4 h-4 lg:w-6 lg:h-6" style="color: #22c55e;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
      <p class="text-xs lg:text-sm mt-1 lg:mt-2" style="color: var(--text-tertiary);">Penerima zakat</p>
    </div>

    <!-- Beras Card -->
    <div class="rounded-lg shadow-sm p-3 lg:p-6" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
      <div class="flex items-center justify-between">
        <div class="min-w-0">
          <p class="text-xs lg:text-sm font-medium truncate" style="color: var(--text-tertiary);">Total Beras</p>
          <p class="text-lg lg:text-3xl font-bold mt-1 lg:mt-2" style="color: var(--text-primary);">{formatNumber(stats.totalBeras)}</p>
        </div>
        <div class="w-8 h-8 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center shrink-0" style="background-color: rgba(245, 158, 11, 0.1);">
          <svg class="w-4 h-4 lg:w-6 lg:h-6" style="color: #f59e0b;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
      </div>
      <p class="text-xs lg:text-sm mt-1 lg:mt-2" style="color: var(--text-tertiary);">Kilogram</p>
    </div>

    <!-- Uang Card -->
    <div class="rounded-lg shadow-sm p-3 lg:p-6" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
      <div class="flex items-center justify-between">
        <div class="min-w-0">
          <p class="text-xs lg:text-sm font-medium truncate" style="color: var(--text-tertiary);">Total Uang</p>
          <p class="text-lg lg:text-2xl font-bold mt-1 lg:mt-2 truncate" style="color: var(--text-primary);">{formatNumber(stats.totalUang)}</p>
        </div>
        <div class="w-8 h-8 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center shrink-0" style="background-color: rgba(16, 185, 129, 0.1);">
          <svg class="w-4 h-4 lg:w-6 lg:h-6" style="color: #10b981;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <p class="text-xs lg:text-sm mt-1 lg:mt-2" style="color: var(--text-tertiary);">Rupiah</p>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
    <!-- Quick Actions -->
    <div class="rounded-lg shadow-sm p-4 lg:p-6" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
      <h2 class="text-base lg:text-lg font-semibold mb-3 lg:mb-4" style="color: var(--text-primary);">Aksi Cepat</h2>
      <div class="flex flex-col gap-2">
        <a href="/o/{organization.slug}/muzaki/tambah" class="btn-primary text-sm lg:text-base py-2">
          <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Muzaki
        </a>
        <a href="/o/{organization.slug}/mustahik/tambah" class="btn-secondary text-sm lg:text-base py-2">
          <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Mustahik
        </a>
        <a href="/o/{organization.slug}/sektor" class="btn-secondary text-sm lg:text-base py-2">
          <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Lihat Rekap
        </a>
      </div>
    </div>

    <!-- Settings Info -->
    <div class="rounded-lg shadow-sm p-4 lg:p-6" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
      <h2 class="text-base lg:text-lg font-semibold mb-3 lg:mb-4" style="color: var(--text-primary);">Setting Zakat</h2>
      <div class="space-y-3">
        <div class="p-3 rounded-lg" style="background-color: var(--bg-tertiary);">
          <p class="text-xs lg:text-sm" style="color: var(--text-tertiary);">Beras per Jiwa</p>
          <p class="text-base lg:text-xl font-semibold" style="color: var(--text-primary);">{settings.default_beras_per_jiwa ?? 2.5} kg</p>
        </div>
        <div class="p-3 rounded-lg" style="background-color: var(--bg-tertiary);">
          <p class="text-xs lg:text-sm" style="color: var(--text-tertiary);">Uang per Jiwa</p>
          <p class="text-base lg:text-xl font-semibold" style="color: var(--text-primary);">Rp {formatNumber(settings.default_uang_per_jiwa ?? 40000)}</p>
        </div>
        <div class="p-3 rounded-lg" style="background-color: var(--bg-tertiary);">
          <p class="text-xs lg:text-sm" style="color: var(--text-tertiary);">Jumlah Sektor</p>
          <p class="text-base lg:text-xl font-semibold" style="color: var(--text-primary);">{stats.sectorCount} sektor</p>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="rounded-lg shadow-sm p-4 lg:p-6" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
      <h2 class="text-base lg:text-lg font-semibold mb-3 lg:mb-4" style="color: var(--text-primary);">Aktivitas Terbaru</h2>
      <div class="space-y-3">
        {#if recentMuzaki.length > 0}
          {#each recentMuzaki as muzaki}
            <div class="flex items-center gap-3 p-2 rounded-lg" style="background-color: var(--bg-tertiary);">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0" style="background-color: var(--bg-hover); color: var(--text-secondary);">
                {muzaki.name.charAt(0).toUpperCase()}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate" style="color: var(--text-primary);">{muzaki.name}</p>
                <p class="text-xs" style="color: var(--text-tertiary);">{muzaki.jumlah_jiwa} jiwa • {formatDate(muzaki.created_at)}</p>
              </div>
              <div class="text-right shrink-0">
                {#if muzaki.jenis_zakat === 'beras'}
                  <p class="text-xs font-medium" style="color: #f59e0b;">{muzaki.jumlah_beras} kg</p>
                {:else if muzaki.jenis_zakat === 'uang'}
                  <p class="text-xs font-medium" style="color: #10b981;">Rp {formatNumber(muzaki.jumlah_uang)}</p>
                {:else}
                  <p class="text-xs font-medium" style="color: var(--text-tertiary);">Mixed</p>
                {/if}
              </div>
            </div>
          {/each}
        {:else}
          <p class="text-sm text-center py-4" style="color: var(--text-tertiary);">Belum ada aktivitas</p>
        {/if}
      </div>
      <a href="/o/{organization.slug}/muzaki" class="text-sm mt-3 block text-center" style="color: #3b82f6;">Lihat Semua</a>
    </div>
  </div>
</div>

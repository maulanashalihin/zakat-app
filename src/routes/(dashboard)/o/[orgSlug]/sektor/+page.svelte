<script>
  let { data } = $props();
  
  const organization = data.organization;
  const sectors = data.sectors;
  
  function formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(num || 0);
  }
</script>

<svelte:head>
  <title>Rekap per Sektor - {organization.name} | ZakatApp</title>
</svelte:head>

<div class="p-4 lg:p-6" style="background-color: var(--bg-primary); min-height: 100%;">
  <!-- Header -->
  <div class="mb-4 lg:mb-6">
    <h1 class="text-xl lg:text-2xl font-bold" style="color: var(--text-primary);">Rekap per Sektor</h1>
    <p class="text-sm lg:text-base" style="color: var(--text-secondary);">Ringkasan pengumpulan zakat per sektor</p>
  </div>

  <!-- Sektor Cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
    {#each sectors as sector}
      <div class="rounded-lg shadow-sm p-4 lg:p-6" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary); border-left: 4px solid {sector.color || '#3b82f6'}">
        <div class="flex items-center gap-3 mb-3 lg:mb-4">
          <div class="w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center shrink-0" style="background-color: {sector.color || '#3b82f6'}20;">
            <svg class="w-4 h-4 lg:w-5 lg:h-5" style="color: {sector.color || '#3b82f6'};" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div class="min-w-0">
            <h3 class="font-semibold text-sm lg:text-base truncate" style="color: var(--text-primary);">{sector.name}</h3>
            <span class="inline-flex items-center px-1.5 lg:px-2 py-0.5 rounded text-xs font-medium" style="background-color: {sector.is_active ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)'}; color: {sector.is_active ? '#10b981' : 'var(--text-tertiary)'};">
              {sector.is_active ? 'Aktif' : 'Nonaktif'}
            </span>
          </div>
        </div>
        
        <div class="space-y-2 lg:space-y-3 text-sm">
          <div class="flex justify-between items-center">
            <span style="color: var(--text-secondary);">Muzaki</span>
            <span class="font-medium" style="color: var(--text-primary);">{formatNumber(sector.muzakiCount)}</span>
          </div>
          <div class="flex justify-between items-center">
            <span style="color: var(--text-secondary);">Total Jiwa</span>
            <span class="font-medium" style="color: var(--text-primary);">{formatNumber(sector.totalJiwa)}</span>
          </div>
          <div class="flex justify-between items-center">
            <span style="color: var(--text-secondary);">Total Beras</span>
            <span class="font-medium" style="color: #f59e0b;">{formatNumber(sector.totalBeras)} kg</span>
          </div>
          <div class="flex justify-between items-center">
            <span style="color: var(--text-secondary);">Total Uang</span>
            <span class="font-medium" style="color: #10b981;">Rp {formatNumber(sector.totalUang)}</span>
          </div>
          <div class="flex justify-between items-center">
            <span style="color: var(--text-secondary);">Mustahik</span>
            <span class="font-medium" style="color: var(--text-primary);">{formatNumber(sector.mustahikCount)}</span>
          </div>
        </div>
        
        <div class="mt-3 lg:mt-4 pt-3 lg:pt-4" style="border-top: 1px solid var(--border-primary);">
          <a href="/o/{organization.slug}/muzaki?sector={sector.id}" class="text-sm font-medium flex items-center gap-1" style="color: #3b82f6;">
            Lihat Detail
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    {:else}
      <div class="col-span-full rounded-lg shadow-sm p-8 lg:p-12 text-center" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
        <svg class="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4" style="color: var(--text-muted);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.806-.984A1 1 0 0120 6.382V7m0 13V7" />
        </svg>
        <h3 class="text-base lg:text-lg font-medium mb-1 lg:mb-2" style="color: var(--text-primary);">Belum ada sektor</h3>
        <p class="text-sm" style="color: var(--text-secondary);">Tambah sektor melalui menu Master Data {'>'} Sektor</p>
      </div>
    {/each}
  </div>
</div>

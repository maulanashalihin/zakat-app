<script>
  let { data, form } = $props();
  
  const savedSectors = $derived(data.savedSectors || []);
  const errors = $derived(form?.errors || {});
  
  // Initialize with saved sectors or default 3 empty ones
  let sectors = $state(
    savedSectors.length > 0 
      ? savedSectors.map((s, i) => ({ 
          id: crypto.randomUUID(), 
          name: s.name || '', 
          color: s.color || getDefaultColor(i) 
        }))
      : [
          { id: crypto.randomUUID(), name: '', color: '#22c55e' },
          { id: crypto.randomUUID(), name: '', color: '#3b82f6' },
          { id: crypto.randomUUID(), name: '', color: '#f59e0b' }
        ]
  );
  
  function getDefaultColor(index) {
    const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];
    return colors[index % colors.length];
  }
  
  function addSector() {
    sectors = [...sectors, { 
      id: crypto.randomUUID(), 
      name: '', 
      color: getDefaultColor(sectors.length) 
    }];
  }
  
  function removeSector(index) {
    sectors = sectors.filter((_, i) => i !== index);
  }
</script>

<svelte:head>
  <title>Setup Sektor - ZakatApp</title>
</svelte:head>

<div class="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6">
  <div class="mb-6">
    <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Sektor Zakat</h2>
    <p class="text-slate-600 dark:text-slate-400 mt-1">
      Buat sektor untuk memudahkan pembagian wilayah pengumpulan
    </p>
  </div>

  <form method="POST" class="space-y-6">
    <!-- Sectors List -->
    <div class="space-y-3">
      {#each sectors as sector, i (sector.id)}
        <div class="flex gap-3 items-start">
          <div class="flex-1">
            <input
              type="text"
              name="sectorNames"
              bind:value={sector.name}
              placeholder="Nama sektor (contoh: Sektor Utara)"
              class="input w-full"
              required
            />
          </div>
          <input
            type="color"
            name="sectorColors"
            bind:value={sector.color}
            class="w-12 h-11 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
          />
          {#if sectors.length > 1}
            <button
              type="button"
              onclick={() => removeSector(i)}
              class="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Hapus sektor"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          {/if}
        </div>
      {/each}
    </div>

    <!-- Add Sector Button -->
    <button
      type="button"
      onclick={addSector}
      class="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center justify-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Tambah Sektor
    </button>

    {#if errors?.sectors}
      <p class="text-sm text-red-500">{errors.sectors}</p>
    {/if}

    <!-- Preview -->
    <div class="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
      <h3 class="font-medium text-slate-900 dark:text-white mb-3">Preview Sektor</h3>
      <div class="flex flex-wrap gap-2">
        {#each sectors as sector}
          {#if sector.name}
            <span
              class="px-3 py-1 rounded-full text-sm font-medium"
              style="background-color: {sector.color}20; color: {sector.color}; border: 1px solid {sector.color}40;"
            >
              {sector.name}
            </span>
          {/if}
        {/each}
      </div>
    </div>

    <div class="flex justify-end gap-3">
      <button type="submit" class="btn-primary px-8 py-3">
        Lanjutkan →
      </button>
    </div>
  </form>
</div>

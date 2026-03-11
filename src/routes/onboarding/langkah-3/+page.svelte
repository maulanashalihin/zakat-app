<script>
  import { enhance } from '$app/forms';
  import { Plus, X, MapPin, ArrowRight } from 'lucide-svelte';

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

<div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8 relative transform -rotate-1 hover:rotate-0 transition-transform duration-500">
  <div class="flex gap-2 mb-6 px-2">
    <div class="w-3 h-3 rounded-full bg-red-400"></div>
    <div class="w-3 h-3 rounded-full bg-amber-400"></div>
    <div class="w-3 h-3 rounded-full bg-green-400"></div>
  </div>

  <div class="mb-8">
    <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Sektor Zakat</h2>
    <p class="text-slate-600 dark:text-slate-400 font-medium mt-1">
      Buat sektor untuk memudahkan pembagian wilayah pengumpulan
    </p>
  </div>

  <form method="POST" class="space-y-5" use:enhance>
    <!-- Sectors List -->
    <div class="space-y-3">
      {#each sectors as sector, i (sector.id)}
        <div class="flex gap-3 items-center">
          <div class="flex-1">
            <div class="relative">
              <MapPin class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                name={'sectors[' + i + '][name]'}
                value={sector.name}
                placeholder="Nama sektor (contoh: Sektor Utara)"
                class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                required
              />
            </div>
          </div>
          <input
            type="color"
            name={'sectors[' + i + '][color]'}
            value={sector.color}
            class="w-12 h-[50px] rounded-xl border-2 border-slate-200 dark:border-slate-700 cursor-pointer overflow-hidden transition-transform hover:scale-105"
          />
          {#if sectors.length > 1}
            <button
              type="button"
              onclick={() => removeSector(i)}
              class="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
              title="Hapus sektor"
            >
              <X class="w-5 h-5" />
            </button>
          {/if}
        </div>
      {/each}
    </div>

    <!-- Add Sector Button -->
    <button
      type="button"
      onclick={addSector}
      class="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all flex items-center justify-center gap-2 font-bold"
    >
      <Plus class="w-5 h-5" />
      Tambah Sektor
    </button>

    {#if errors?.sectors}
      <p class="text-sm text-red-600 dark:text-red-400 font-medium">{errors.sectors}</p>
    {/if}

    <!-- Preview -->
    {#if sectors.some(s => s.name)}
      <div class="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
        <h3 class="font-extrabold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Preview Sektor</h3>
        <div class="flex flex-wrap gap-2">
          {#each sectors as sector}
            {#if sector.name}
              <span
                class="px-4 py-2 rounded-full text-sm font-bold transition-transform hover:scale-105 cursor-default"
                style="background-color: {sector.color}20; color: {sector.color}; border: 2px solid {sector.color}40;"
              >
                {sector.name}
              </span>
            {/if}
          {/each}
        </div>
      </div>
    {/if}

    <div class="pt-4">
      <button type="submit" class="w-full flex items-center justify-center gap-2 py-4 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1">
        Lanjutkan
        <ArrowRight class="w-5 h-5" />
      </button>
    </div>
  </form>
</div>

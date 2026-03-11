<script>
  import { MapPin, Plus, Edit, Trash2, Check, X } from 'lucide-svelte';

  let { data, form } = $props();

  const organization = data.organization;
  const sectors = data.sectors;

  let showAddForm = $state(false);
  let editingId = $state(null);

  const colorOptions = [
    { value: '#3b82f6', name: 'Blue' },
    { value: '#10b981', name: 'Green' },
    { value: '#f59e0b', name: 'Amber' },
    { value: '#ef4444', name: 'Red' },
    { value: '#8b5cf6', name: 'Purple' },
    { value: '#06b6d4', name: 'Cyan' },
    { value: '#ec4899', name: 'Pink' },
    { value: '#84cc16', name: 'Lime' }
  ];
</script>

<svelte:head>
  <title>Master Sektor - {organization.name} | ZakatApp</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 lg:p-8">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <div>
      <h1 class="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Master Sektor</h1>
      <p class="text-slate-600 dark:text-slate-400 font-medium mt-1">Kelola wilayah/sektor pengumpulan zakat</p>
    </div>
    <button onclick={() => showAddForm = !showAddForm} class="inline-flex items-center justify-center gap-2 py-4 px-6 {showAddForm ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200' : 'bg-primary-600 hover:bg-primary-500 text-white'} rounded-xl font-bold text-lg transition-all">
      {#if showAddForm}
        <X class="w-5 h-5" />
        Batal
      {:else}
        <Plus class="w-5 h-5" />
        Tambah Sektor
      {/if}
    </button>
  </div>

  <!-- Add Form -->
  {#if showAddForm}
    <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8 mb-8">
      <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">Tambah Sektor Baru</h3>
      <form method="POST" action="?/create" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2">
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama Sektor <span class="text-red-500">*</span></label>
            <input type="text" name="name" class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium" required placeholder="Contoh: Banjaran" />
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Warna</label>
            <div class="flex flex-wrap gap-3">
              {#each colorOptions as color}
                <label class="cursor-pointer group">
                  <input type="radio" name="color" value={color.value} class="sr-only peer" checked={color.value === '#3b82f6'} />
                  <div class="w-10 h-10 rounded-xl border-2 border-transparent peer-checked:border-slate-900 dark:peer-checked:border-white peer-checked:scale-110 transition-all shadow-md group-hover:scale-110" style="background-color: {color.value}" title={color.name}></div>
                </label>
              {/each}
            </div>
          </div>
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Deskripsi</label>
          <input type="text" name="description" class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium" placeholder="Opsional" />
        </div>
        {#if form?.error}
          <p class="text-sm text-red-600 dark:text-red-400 font-medium">{form.error}</p>
        {/if}
        <div class="flex justify-end gap-3">
          <button type="submit" class="inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1">
            <Check class="w-5 h-5" />
            Simpan
          </button>
        </div>
      </form>
    </div>
  {/if}

  <!-- Sectors Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {#each sectors as sector}
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] overflow-hidden group hover:-translate-y-1 transition-all duration-300" style="border-left: 6px solid {sector.color || '#3b82f6'}">
        <div class="p-6">
          {#if editingId === sector.id}
            <!-- Edit Mode -->
            <form method="POST" action="?/update" class="space-y-4">
              <input type="hidden" name="id" value={sector.id} />
              <div>
                <input type="text" name="name" value={sector.name} class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" required />
              </div>
              <div class="flex gap-2 flex-wrap">
                {#each colorOptions as color}
                  <label class="cursor-pointer">
                    <input type="radio" name="color" value={color.value} class="sr-only peer" checked={color.value === sector.color} />
                    <div class="w-8 h-8 rounded-lg border-2 peer-checked:border-slate-900 dark:peer-checked:border-white peer-checked:scale-110 transition-all" style="background-color: {color.value}"></div>
                  </label>
                {/each}
              </div>
              <div>
                <input type="text" name="description" value={sector.description || ''} class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white" placeholder="Deskripsi" />
              </div>
              <div>
                <select name="is_active" class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold">
                  <option value="1" selected={sector.is_active === 1}>✓ Aktif</option>
                  <option value="0" selected={sector.is_active === 0}>○ Nonaktif</option>
                </select>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="submit" class="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all">
                  <Check class="w-5 h-5 inline mr-1" />
                  Simpan
                </button>
                <button type="button" onclick={() => editingId = null} class="flex-1 py-3 px-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition-all">
                  Batal
                </button>
              </div>
            </form>
          {:else}
            <!-- View Mode -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 rounded-full shrink-0" style="background-color: {sector.color || '#3b82f6'}"></div>
                <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">{sector.name}</h3>
              </div>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold {sector.is_active === 1 ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}">
                {sector.is_active === 1 ? '✓ Aktif' : '○ Nonaktif'}
              </span>
            </div>
            {#if sector.description}
              <p class="text-slate-600 dark:text-slate-400 font-medium mb-4">{sector.description}</p>
            {/if}
            <div class="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button onclick={() => editingId = sector.id} class="flex-1 py-3 px-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                <Edit class="w-4 h-4" />
                Edit
              </button>
              <form method="POST" action="?/delete" class="flex-1 inline" onsubmit={(e) => !confirm('Yakin ingin menghapus sektor ini?') && e.preventDefault()}>
                <input type="hidden" name="id" value={sector.id} />
                <button type="submit" class="w-full py-3 px-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                  <Trash2 class="w-4 h-4" />
                  Hapus
                </button>
              </form>
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <div class="col-span-full">
        <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-12 text-center">
          <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <MapPin class="w-12 h-12 text-slate-400" />
          </div>
          <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Belum ada sektor</h3>
          <p class="text-slate-500 dark:text-slate-400 font-medium">Klik "Tambah Sektor" untuk membuat sektor pertama</p>
        </div>
      </div>
    {/each}
  </div>
</div>

<script>
  import { Calendar, Plus, Edit, Trash2, Check, X, TrendingUp } from 'lucide-svelte';

  let { data, form } = $props();

  const organization = data.organization;
  const periods = data.periods;

  let showAddForm = $state(false);
  let editingId = $state(null);

  // Get current year for defaults
  const currentYearMasehi = new Date().getFullYear();
  const currentYearHijri = Math.floor((currentYearMasehi - 622) * 0.97) + 1;
</script>

<svelte:head>
  <title>Master Periode - {organization.name} | ZakatApp</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 lg:p-8">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <div>
      <h1 class="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Master Periode</h1>
      <p class="text-slate-600 dark:text-slate-400 font-medium mt-1">Kelola periode pengumpulan zakat</p>
    </div>
    <button onclick={() => showAddForm = !showAddForm} class="inline-flex items-center justify-center gap-2 py-4 px-6 {showAddForm ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200' : 'bg-primary-600 hover:bg-primary-500 text-white'} rounded-xl font-bold text-lg transition-all">
      {#if showAddForm}
        <X class="w-5 h-5" />
        Batal
      {:else}
        <Plus class="w-5 h-5" />
        Tambah Periode
      {/if}
    </button>
  </div>

  <!-- Add Form -->
  {#if showAddForm}
    <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8 mb-8">
      <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">Tambah Periode Baru</h3>
      <form method="POST" action="?/create" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="lg:col-span-2">
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama Periode <span class="text-red-500">*</span></label>
            <div class="relative">
              <Calendar class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" name="name" class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium" required placeholder="Contoh: Ramadhan 1446 H" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tahun Hijriyah <span class="text-red-500">*</span></label>
            <div class="relative">
              <TrendingUp class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="number" name="yearHijri" value={currentYearHijri} min="1400" max="1500" class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium" required />
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Tahun Masehi <span class="text-red-500">*</span></label>
            <div class="relative">
              <Calendar class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="number" name="yearMasehi" value={currentYearMasehi} min="2000" max="2100" class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium" required />
            </div>
          </div>
          <div class="lg:col-span-2">
            <label class="flex items-center gap-3 cursor-pointer p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary-500 transition-colors">
              <input type="checkbox" name="isActive" value="1" class="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
              <div class="flex-1">
                <p class="font-bold text-slate-900 dark:text-white">Jadikan periode aktif</p>
                <p class="text-sm text-slate-500 dark:text-slate-400">Periode aktif akan digunakan sebagai default untuk transaksi baru</p>
              </div>
            </label>
          </div>
        </div>
        {#if form?.error}
          <div class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p class="text-sm text-red-600 dark:text-red-400 font-medium">{form.error}</p>
          </div>
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

  <!-- Periods Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {#each periods as period}
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] overflow-hidden group hover:-translate-y-1 transition-all duration-300" class:border-primary-500={period.is_active === 1}>
        <div class="p-6">
          {#if editingId === period.id}
            <!-- Edit Mode -->
            <form method="POST" action="?/update" class="space-y-4">
              <input type="hidden" name="id" value={period.id} />
              <div>
                <div class="relative">
                  <Calendar class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" name="name" value={period.name} class="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" required />
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <input type="number" name="yearHijri" value={period.year_hijri} min="1400" max="1500" class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" required />
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">Hijriyah</p>
                </div>
                <div>
                  <input type="number" name="yearMasehi" value={period.year_masehi} min="2000" max="2100" class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" required />
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">Masehi</p>
                </div>
              </div>
              <div>
                <select name="isActive" class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold">
                  <option value="1" selected={period.is_active === 1}>✓ Aktif</option>
                  <option value="0" selected={period.is_active === 0}>○ Nonaktif</option>
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
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center {period.is_active === 1 ? 'bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg shadow-primary-500/40' : 'bg-slate-100 dark:bg-slate-800'}">
                  <Calendar class="w-7 h-7 {period.is_active === 1 ? 'text-white' : 'text-slate-400'}" />
                </div>
                <div>
                  <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">{period.name}</h3>
                  <p class="text-sm text-slate-600 dark:text-slate-400 font-medium">{period.year_hijri} H / {period.year_masehi} M</p>
                </div>
              </div>
              {#if period.is_active === 1}
                <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-primary-400 to-primary-600 text-white shadow-lg shadow-primary-500/40">
                  <Check class="w-3 h-3 mr-1" />
                  Aktif
                </span>
              {:else}
                <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  ○ Nonaktif
                </span>
              {/if}
            </div>

            <div class="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              {#if period.is_active !== 1}
                <form method="POST" action="?/setActive" class="flex-1 inline">
                  <input type="hidden" name="id" value={period.id} />
                  <button type="submit" class="w-full py-3 px-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                    <Check class="w-4 h-4" />
                    Jadikan Aktif
                  </button>
                </form>
              {/if}
              <button onclick={() => editingId = period.id} class="flex-1 py-3 px-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                <Edit class="w-4 h-4" />
                Edit
              </button>
              <form method="POST" action="?/delete" class="flex-1 inline" onsubmit={(e) => !confirm('Yakin ingin menghapus periode ini?') && e.preventDefault()}>
                <input type="hidden" name="id" value={period.id} />
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
            <Calendar class="w-12 h-12 text-slate-400" />
          </div>
          <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Belum ada periode</h3>
          <p class="text-slate-500 dark:text-slate-400 font-medium">Klik "Tambah Periode" untuk membuat periode pertama</p>
        </div>
      </div>
    {/each}
  </div>
</div>

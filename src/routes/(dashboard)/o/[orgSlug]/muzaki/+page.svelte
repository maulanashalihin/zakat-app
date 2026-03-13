<script>
  import { Users, Plus, Search, Filter, Edit, Trash2, MapPin, LayoutGrid, Table2 } from 'lucide-svelte';

  let { data } = $props();

  const organization = data.organization;
  const sectors = data.sectors;
  const muzaki = data.muzaki;
  const user = data.user;

  let viewMode = $state('card'); // 'card' or 'table'

  function formatDate(timestamp) {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  function formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(num);
  }
</script>

<svelte:head>
  <title>Data Muzaki - {organization.name} | ZakatApp</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-3 sm:p-4 lg:p-8">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
    <div>
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Data Muzaki</h1>
      <p class="text-slate-600 dark:text-slate-400 font-medium mt-1">Pembayar zakat fitrah</p>
    </div>
    <div class="flex items-center gap-3">
      <!-- View Toggle (Desktop only) -->
      <div class="hidden md:flex items-center bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
        <button 
          onclick={() => viewMode = 'card'}
          class="p-2 rounded-lg transition-all {viewMode === 'card' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' : 'text-slate-500'}"
          title="Card view"
        >
          <LayoutGrid class="w-5 h-5" />
        </button>
        <button 
          onclick={() => viewMode = 'table'}
          class="p-2 rounded-lg transition-all {viewMode === 'table' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' : 'text-slate-500'}"
          title="Table view"
        >
          <Table2 class="w-5 h-5" />
        </button>
      </div>
      {#if user.currentRole === 'admin' || user.currentRole === 'petugas' || user.globalRole === 'super_admin'}
        <a href="/o/{organization.slug}/muzaki/tambah" class="inline-flex items-center justify-center gap-2 py-3 sm:py-4 px-4 sm:px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-base sm:text-lg transition-all duration-200 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1">
          <Plus class="w-5 h-5" />
          <span class="hidden sm:inline">Tambah Muzaki</span>
          <span class="sm:hidden">Tambah</span>
        </a>
      {/if}
    </div>
  </div>

  <!-- Filters -->
  <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[1.5rem] lg:rounded-[2rem] p-4 sm:p-6 mb-6">
    <form class="flex flex-col lg:flex-row gap-3 sm:gap-4">
      <div class="flex-1 relative">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          name="search"
          placeholder="Cari nama muzaki..."
          class="w-full pl-12 pr-4 py-3 sm:py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
        />
      </div>
      <div class="grid grid-cols-2 lg:flex gap-3 sm:gap-4">
        <div class="relative">
          <Filter class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-slate-400" />
          <select name="sector" class="w-full pl-9 sm:pl-12 pr-2 sm:pr-4 py-3 sm:py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium appearance-none cursor-pointer">
            <option value="">Semua Sektor</option>
            {#each sectors as sector}
              <option value={sector.id}>{sector.name}</option>
            {/each}
          </select>
        </div>
        <div class="relative">
          <Filter class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-slate-400" />
          <select name="type" class="w-full pl-9 sm:pl-12 pr-2 sm:pr-4 py-3 sm:py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium appearance-none cursor-pointer">
            <option value="">Semua Jenis</option>
            <option value="beras">Beras</option>
            <option value="uang">Uang</option>
          </select>
        </div>
        <button type="submit" class="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 sm:px-6 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm sm:text-base border-2 border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all">
          <Search class="w-4 sm:w-5 h-4 sm:h-5" />
          <span>Filter</span>
        </button>
      </div>
    </form>
  </div>

  <!-- Card View (Mobile & Optional Desktop) -->
  {#if viewMode === 'card'}
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
      {#each muzaki as m}
        <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[1.5rem] lg:rounded-[2rem] p-4 sm:p-6 hover:-translate-y-1 transition-all">
          <!-- Header -->
          <div class="flex items-start gap-3 sm:gap-4 mb-4">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl font-extrabold bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-md shrink-0">
              {m.name.charAt(0).toUpperCase()}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">{m.name}</h3>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{formatDate(m.created_at)}</p>
            </div>
            <span class="inline-flex items-center px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-bold {m.jenis_zakat === 'beras' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'}">
              {m.jenis_zakat === 'beras' ? '🌾' : '💵'}
              <span class="hidden sm:inline ml-1">{m.jenis_zakat === 'beras' ? 'Beras' : 'Uang'}</span>
            </span>
          </div>

          <!-- Details -->
          <div class="space-y-2 sm:space-y-3 mb-4">
            <div class="flex items-center justify-between p-2 sm:p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <MapPin class="w-4 h-4" />
                Sektor
              </span>
              <span class="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300">{m.sector_name}</span>
            </div>
            <div class="flex items-center justify-between p-2 sm:p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Jumlah Jiwa</span>
              <span class="text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-300">{m.jumlah_jiwa} jiwa</span>
            </div>
            <div class="flex items-center justify-between p-2 sm:p-3 {m.jenis_zakat === 'beras' ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20'} rounded-xl">
              <span class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Jumlah</span>
              <span class="text-sm sm:text-base font-bold {m.jenis_zakat === 'beras' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}">
                {#if m.jenis_zakat === 'beras'}
                  {formatNumber(m.jumlah_beras)} kg
                {:else}
                  Rp {formatNumber(m.jumlah_uang)}
                {/if}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <a href="/o/{organization.slug}/muzaki/{m.id}/edit" class="flex-1 py-2.5 sm:py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-bold text-sm flex items-center justify-center gap-2">
              <Edit class="w-4 h-4" />
              Edit
            </a>
            {#if user.currentRole === 'admin' || user.globalRole === 'super_admin'}
              <form action="/o/{organization.slug}/muzaki/{m.id}/hapus" method="POST" class="flex-1" onsubmit={(e) => !confirm('Yakin ingin menghapus?') && e.preventDefault()}>
                <button type="submit" class="w-full py-2.5 sm:py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-bold text-sm flex items-center justify-center gap-2">
                  <Trash2 class="w-4 h-4" />
                  Hapus
                </button>
              </form>
            {/if}
          </div>
        </div>
      {:else}
        <div class="col-span-full">
          <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[1.5rem] lg:rounded-[2rem] p-8 sm:p-12 text-center">
            <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Users class="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
            </div>
            <p class="text-slate-500 dark:text-slate-400 font-bold text-lg">Belum ada data muzaki</p>
            <p class="text-slate-400 dark:text-slate-500 text-sm mt-1">Mulai dengan menambahkan muzaki pertama Anda</p>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Table View (Desktop only) -->
  {#if viewMode === 'table'}
    <div class="hidden md:block bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">No</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sektor</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Jiwa</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Jenis</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Jumlah</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tanggal</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            {#each muzaki as m, i}
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <td class="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">{i + 1}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-md shrink-0">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <span class="text-sm font-bold text-slate-900 dark:text-white">{m.name}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    <MapPin class="w-3 h-3 mr-1.5" />
                    {m.sector_name}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">{m.jumlah_jiwa}</td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold {m.jenis_zakat === 'beras' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'}">
                    {m.jenis_zakat === 'beras' ? '🌾 Beras' : '💵 Uang'}
                  </span>
                </td>
                <td class="px-6 py-4">
                  {#if m.jenis_zakat === 'beras'}
                    <span class="text-sm font-bold text-amber-600 dark:text-amber-400">{formatNumber(m.jumlah_beras)} kg</span>
                  {:else if m.jenis_zakat === 'uang'}
                    <span class="text-sm font-bold text-emerald-600 dark:text-emerald-400">Rp {formatNumber(m.jumlah_uang)}</span>
                  {:else}
                    <span class="text-sm font-bold text-slate-500 dark:text-slate-400">Mixed</span>
                  {/if}
                </td>
                <td class="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">{formatDate(m.created_at)}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <a href="/o/{organization.slug}/muzaki/{m.id}/edit" class="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors" title="Edit">
                      <Edit class="w-4 h-4" />
                    </a>
                    {#if user.currentRole === 'admin' || user.globalRole === 'super_admin'}
                      <form action="/o/{organization.slug}/muzaki/{m.id}/hapus" method="POST" class="inline" onsubmit={(e) => !confirm('Yakin ingin menghapus?') && e.preventDefault()}>
                        <button type="submit" class="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" title="Hapus">
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </form>
                    {/if}
                  </div>
                </td>
              </tr>
            {:else}
              <tr>
                <td colspan="8" class="px-6 py-16 text-center">
                  <div class="flex flex-col items-center">
                    <div class="w-20 h-20 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Users class="w-10 h-10 text-slate-400" />
                    </div>
                    <p class="text-slate-500 dark:text-slate-400 font-bold text-lg">Belum ada data muzaki</p>
                    <p class="text-slate-400 dark:text-slate-500 text-sm mt-1">Mulai dengan menambahkan muzaki pertama Anda</p>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>

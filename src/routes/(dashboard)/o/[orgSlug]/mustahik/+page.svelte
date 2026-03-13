<script>
  import { HandHeart, Plus, Search, Edit, Trash2, MapPin, LayoutGrid, Table2, Briefcase, UserPlus, PackageOpen, Truck, X } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  let { data } = $props();

  const organization = data.organization;
  const sectors = data.sectors || [];
  const user = data.user;
  const mustahikList = data.mustahik || [];

  // Filter state
  let searchQuery = $state('');
  let selectedSector = $state('');
  let selectedStatus = $state('');
  let selectedPrioritas = $state('');

  let viewMode = $state('card');

  // Get filtered data - using $derived.by() for complex derivations
  let filteredMustahik = $derived.by(() => {
    let result = mustahikList;

    if (searchQuery.trim()) {
      const search = searchQuery.trim().toLowerCase();
      result = result.filter(m => m.name.toLowerCase().includes(search));
    }

    if (selectedSector) {
      result = result.filter(m => m.sector_id === selectedSector);
    }

    if (selectedStatus) {
      result = result.filter(m => m.status_distribusi === selectedStatus);
    }

    if (selectedPrioritas) {
      result = result.filter(m => m.kategori_prioritas === selectedPrioritas);
    }

    return result;
  });

  let filteredStats = $derived.by(() => ({
    total: filteredMustahik.length,
    belum: filteredMustahik.filter(m => m.status_distribusi === 'belum_disalurkan').length,
    siap: filteredMustahik.filter(m => m.status_distribusi === 'siap_disalurkan').length,
    sudah: filteredMustahik.filter(m => m.status_distribusi === 'sudah_disalurkan').length
  }));

  function clearFilters() {
    searchQuery = '';
    selectedSector = '';
    selectedStatus = '';
    selectedPrioritas = '';
  }

  function formatDate(timestamp) {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  function getAsnafLabel(kategori) {
    const labels = {
      fakir: 'Fakir',
      miskin: 'Miskin',
      amil: 'Amil',
      mualaf: 'Mualaf',
      riqab: 'Riqab',
      gharim: 'Gharim',
      fisabilillah: 'Fisabilillah',
      ibnu_sabil: 'Ibnu Sabil'
    };
    return labels[kategori] || '-';
  }

  function getAsnafColor(kategori) {
    const colors = {
      fakir: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
      miskin: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
      amil: 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
      mualaf: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
      riqab: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
      gharim: 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-400',
      fisabilillah: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400',
      ibnu_sabil: 'bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400'
    };
    return colors[kategori] || 'bg-slate-100 dark:bg-slate-800 text-slate-600';
  }

  function getPrioritasLabel(prioritas) {
    const labels = {
      tinggi: 'Tinggi',
      sedang: 'Sedang',
      rendah: 'Rendah'
    };
    return labels[prioritas] || '-';
  }

  function getStatusLabel(status) {
    const labels = {
      belum_disalurkan: 'Belum',
      siap_disalurkan: 'Siap',
      sudah_disalurkan: 'Sudah'
    };
    return labels[status] || '-';
  }

  function getStatusColor(status) {
    const colors = {
      belum_disalurkan: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700',
      siap_disalurkan: 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      sudah_disalurkan: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
    };
    return colors[status] || 'bg-slate-100 dark:bg-slate-800 text-slate-600';
  }

  function getSectorName(id) {
    const sector = sectors.find(s => s.id === id);
    return sector ? sector.name : '-';
  }

  const hasActiveFilters = $derived(searchQuery || selectedSector || selectedStatus || selectedPrioritas);
</script>

<svelte:head>
  <title>Data Mustahik - {organization.name} | ZakatApp</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-3 sm:p-4 lg:p-8">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 lg:mb-8">
    <div>
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Data Mustahik</h1>
      <p class="text-slate-600 dark:text-slate-400 font-medium mt-1">Penerima zakat fitrah</p>
    </div>
    <div class="flex items-center gap-3">
      {#if user.currentRole === 'admin' || user.globalRole === 'super_admin'}
        <a href="/o/{organization.slug}/mustahik/alokasi" class="inline-flex items-center justify-center gap-2 py-3 px-4 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-400 rounded-xl font-bold text-sm transition-all">
          <PackageOpen class="w-5 h-5" />
          <span class="hidden sm:inline">Alokasi</span>
        </a>
      {/if}
      <a href="/o/{organization.slug}/mustahik/distribusi" class="inline-flex items-center justify-center gap-2 py-3 px-4 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-xl font-bold text-sm transition-all">
        <Truck class="w-5 h-5" />
        <span class="hidden sm:inline">Distribusi</span>
      </a>
      
      <div class="hidden md:flex items-center bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
        <button 
          onclick={() => viewMode = 'card'}
          class="p-2 rounded-lg transition-all {viewMode === 'card' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'text-slate-500'}"
          title="Card view"
        >
          <LayoutGrid class="w-5 h-5" />
        </button>
        <button 
          onclick={() => viewMode = 'table'}
          class="p-2 rounded-lg transition-all {viewMode === 'table' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'text-slate-500'}"
          title="Table view"
        >
          <Table2 class="w-5 h-5" />
        </button>
      </div>
      {#if user.currentRole === 'admin' || user.globalRole === 'super_admin'}
        <a href="/o/{organization.slug}/mustahik/tambah" class="inline-flex items-center justify-center gap-2 py-3 sm:py-4 px-4 sm:px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-base sm:text-lg transition-all duration-200 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1">
          <Plus class="w-5 h-5" />
          <span class="hidden sm:inline">Tambah Mustahik</span>
          <span class="sm:hidden">Tambah</span>
        </a>
      {/if}
    </div>
  </div>

  <!-- Stats Summary -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
    <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-2xl p-4">
      <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total Mustahik</p>
      <p class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{filteredStats.total}</p>
    </div>
    <div class="bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/40 dark:border-slate-700/40 rounded-2xl p-4">
      <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">⏳ Belum</p>
      <p class="text-2xl sm:text-3xl font-bold text-slate-600 dark:text-slate-300">{filteredStats.belum}</p>
    </div>
    <div class="bg-amber-50/80 dark:bg-amber-900/20 backdrop-blur-xl border border-amber-200/40 dark:border-amber-800/40 rounded-2xl p-4">
      <p class="text-xs sm:text-sm text-amber-600 dark:text-amber-400">⚡ Siap</p>
      <p class="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">{filteredStats.siap}</p>
    </div>
    <div class="bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-xl border border-blue-200/40 dark:border-blue-800/40 rounded-2xl p-4">
      <p class="text-xs sm:text-sm text-blue-600 dark:text-blue-400">✓ Sudah</p>
      <p class="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{filteredStats.sudah}</p>
    </div>
  </div>

  <!-- Simple Filter - Single Line -->
  <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-lg rounded-2xl p-3 mb-6">
    <div class="flex flex-wrap items-center gap-2">
      <!-- Search -->
      <div class="relative flex-1 min-w-[200px]">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari nama..."
          class="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
        />
      </div>

      <!-- Sector -->
      <select
        bind:value={selectedSector}
        class="px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
      >
        <option value="">📍 Sektor</option>
        {#each sectors as sector}
          <option value={sector.id}>{sector.name}</option>
        {/each}
      </select>

      <!-- Status -->
      <select
        bind:value={selectedStatus}
        class="px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
      >
        <option value="">📋 Status</option>
        <option value="belum_disalurkan">⏳ Belum</option>
        <option value="siap_disalurkan">⚡ Siap</option>
        <option value="sudah_disalurkan">✓ Sudah</option>
      </select>

      <!-- Prioritas -->
      <select
        bind:value={selectedPrioritas}
        class="px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
      >
        <option value="">🎯 Prioritas</option>
        <option value="tinggi">🔴 Tinggi</option>
        <option value="sedang">🟡 Sedang</option>
        <option value="rendah">🟢 Rendah</option>
      </select>

      <!-- Clear -->
      {#if hasActiveFilters}
        <button
          onclick={clearFilters}
          class="flex items-center justify-center w-9 h-9 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all"
          title="Hapus filter"
        >
          <X class="w-4 h-4" />
        </button>
      {/if}
    </div>
  </div>

  <!-- Results Count -->
  <div class="mb-4 flex items-center justify-between">
    <p class="text-sm text-slate-600 dark:text-slate-400">
      Menampilkan <span class="font-bold text-slate-900 dark:text-white">{filteredMustahik.length}</span> data
    </p>
  </div>

  <!-- Card View -->
  {#if viewMode === 'card'}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      {#each filteredMustahik as m}
        <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[1.5rem] lg:rounded-[2rem] p-4 sm:p-6 hover:-translate-y-1 transition-all">
          <div class="flex items-start gap-3 sm:gap-4 mb-4">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-xl font-extrabold bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md shrink-0">
              {m.name.charAt(0).toUpperCase()}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">{m.name}</h3>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{formatDate(m.created_at)}</p>
            </div>
            <span class="inline-flex items-center px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-bold {m.status_distribusi === 'sudah_disalurkan' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : m.status_distribusi === 'siap_disalurkan' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}">
              {#if m.status_distribusi === 'sudah_disalurkan'}
                ✓
              {:else if m.status_distribusi === 'siap_disalurkan'}
                ⚡
              {:else}
                ⏳
              {/if}
              <span class="hidden sm:inline ml-1">
                {m.status_distribusi === 'sudah_disalurkan' ? 'Sudah' : m.status_distribusi === 'siap_disalurkan' ? 'Siap' : 'Belum'}
              </span>
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
            <div class="p-2 sm:p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <MapPin class="w-3 h-3" /> Sektor
              </span>
              <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">{m.sector_name}</span>
            </div>
            <div class="p-2 sm:p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <UserPlus class="w-3 h-3" /> Jiwa
              </span>
              <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">{m.jumlah_jiwa} jiwa</span>
            </div>
            {#if m.pekerjaan}
              <div class="p-2 sm:p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Briefcase class="w-3 h-3" /> Pekerjaan
                </span>
                <span class="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">{m.pekerjaan}</span>
              </div>
            {/if}
            {#if m.tanggungan != null && m.tanggungan > 0}
              <div class="p-2 sm:p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span class="text-xs text-slate-500 dark:text-slate-400">Tanggungan</span>
                <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">{m.tanggungan} orang</span>
              </div>
            {/if}
          </div>

          <div class="flex flex-wrap gap-2 mb-4">
            {#if m.kategori_asnaf}
              <span class="px-2 sm:px-3 py-1 rounded-lg text-xs font-bold {getAsnafColor(m.kategori_asnaf)}">
                {getAsnafLabel(m.kategori_asnaf)}
              </span>
            {/if}
            {#if m.kategori_prioritas}
              <span class="px-2 sm:px-3 py-1 rounded-lg text-xs font-bold bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">
                {getPrioritasLabel(m.kategori_prioritas)}
              </span>
            {/if}
          </div>

          <div class="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <a href="/o/{organization.slug}/mustahik/{m.id}/edit" class="flex-1 py-2.5 sm:py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-bold text-sm flex items-center justify-center gap-2">
              <Edit class="w-4 h-4" />
              Edit
            </a>
            {#if user.currentRole === 'admin' || user.globalRole === 'super_admin'}
              <form action="/o/{organization.slug}/mustahik/{m.id}/hapus" method="POST" class="flex-1" onsubmit={(e) => !confirm('Yakin ingin menghapus?') && e.preventDefault()}>
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
              <HandHeart class="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
            </div>
            <p class="text-slate-500 dark:text-slate-400 font-bold text-lg">Tidak ada data mustahik</p>
            <p class="text-slate-400 dark:text-slate-500 text-sm mt-1">Coba ubah filter atau tambahkan mustahik baru</p>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Table View -->
  {#if viewMode === 'table'}
    <div class="hidden md:block bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sektor</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status Ekonomi</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Prioritas</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Alokasi</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            {#each filteredMustahik as m}
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-extrabold bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md shrink-0">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span class="text-sm font-bold text-slate-900 dark:text-white">{m.name}</span>
                      <p class="text-xs text-slate-500">{m.jumlah_jiwa} jiwa</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span class="text-sm text-slate-700 dark:text-slate-300">{m.sector_name}</span>
                </td>
                <td class="px-4 py-3">
                  {#if m.kategori_asnaf}
                    <span class="px-2 py-1 rounded-lg text-xs font-bold {getAsnafColor(m.kategori_asnaf)}">
                      {getAsnafLabel(m.kategori_asnaf)}
                    </span>
                  {:else}
                    <span class="text-xs text-slate-400">-</span>
                  {/if}
                </td>
                <td class="px-4 py-3">
                  {#if m.kategori_prioritas}
                    <span class="text-sm {m.kategori_prioritas === 'tinggi' ? 'text-red-600' : m.kategori_prioritas === 'sedang' ? 'text-amber-600' : 'text-green-600'}">
                      {getPrioritasLabel(m.kategori_prioritas)}
                    </span>
                  {:else}
                    <span class="text-xs text-slate-400">-</span>
                  {/if}
                </td>
                <td class="px-4 py-3">
                  {#if m.alokasi_beras || m.alokasi_uang_lokal}
                    <div class="text-xs">
                      {#if m.alokasi_beras}
                        <span class="text-amber-600 font-medium">{m.alokasi_beras} kg</span>
                      {/if}
                      {#if m.alokasi_beras && m.alokasi_uang_lokal}
                        <span class="text-slate-400 mx-1">+</span>
                      {/if}
                      {#if m.alokasi_uang_lokal}
                        <span class="text-green-600 font-medium">Rp {(m.alokasi_uang_lokal).toLocaleString('id-ID')}</span>
                      {/if}
                    </div>
                  {:else}
                    <span class="text-xs text-slate-400">-</span>
                  {/if}
                </td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold {m.status_distribusi === 'sudah_disalurkan' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : m.status_distribusi === 'siap_disalurkan' ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}">
                    {m.status_distribusi === 'sudah_disalurkan' ? '✓ Sudah' : m.status_distribusi === 'siap_disalurkan' ? '⚡ Siap' : '⏳ Belum'}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <a href="/o/{organization.slug}/mustahik/{m.id}/edit" class="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors" title="Edit">
                      <Edit class="w-4 h-4" />
                    </a>
                    {#if user.currentRole === 'admin' || user.globalRole === 'super_admin'}
                      <form action="/o/{organization.slug}/mustahik/{m.id}/hapus" method="POST" class="inline" onsubmit={(e) => !confirm('Yakin ingin menghapus?') && e.preventDefault()}>
                        <button type="submit" class="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" title="Hapus">
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </form>
                    {/if}
                  </div>
                </td>
              </tr>
            {:else}
              <tr>
                <td colspan="7" class="px-6 py-16 text-center">
                  <div class="flex flex-col items-center">
                    <div class="w-20 h-20 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <HandHeart class="w-10 h-10 text-slate-400" />
                    </div>
                    <p class="text-slate-500 dark:text-slate-400 font-bold text-lg">Tidak ada data mustahik</p>
                    <p class="text-slate-400 dark:text-slate-500 text-sm mt-1">Coba ubah filter atau tambahkan mustahik baru</p>
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

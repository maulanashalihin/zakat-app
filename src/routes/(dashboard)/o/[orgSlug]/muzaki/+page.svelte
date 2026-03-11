<script>
  import { Users, Plus, Search, Filter, Edit, Trash2, ArrowUpRight } from 'lucide-svelte';

  let { data } = $props();

  const organization = data.organization;
  const sectors = data.sectors;
  const muzaki = data.muzaki;
  const user = data.user;

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

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 lg:p-8">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <div>
      <h1 class="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Data Muzaki</h1>
      <p class="text-slate-600 dark:text-slate-400 font-medium mt-1">Pembayar zakat fitrah</p>
    </div>
    {#if user.role === 'admin' || user.role === 'petugas' || user.role === 'super_admin'}
      <a href="/o/{organization.slug}/muzaki/tambah" class="inline-flex items-center justify-center gap-2 py-4 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1">
        <Plus class="w-5 h-5" />
        Tambah Muzaki
      </a>
    {/if}
  </div>

  <!-- Filters -->
  <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-6 mb-8">
    <form class="flex flex-col lg:flex-row gap-4">
      <div class="flex-1 relative">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          name="search"
          placeholder="Cari nama muzaki..."
          class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
        />
      </div>
      <div class="min-w-[180px] relative">
        <Filter class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <select name="sector" class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium appearance-none cursor-pointer">
          <option value="">Semua Sektor</option>
          {#each sectors as sector}
            <option value={sector.id}>{sector.name}</option>
          {/each}
        </select>
      </div>
      <div class="min-w-[150px] relative">
        <Filter class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <select name="type" class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium appearance-none cursor-pointer">
          <option value="">Semua Jenis</option>
          <option value="beras">Beras</option>
          <option value="uang">Uang</option>
        </select>
      </div>
      <button type="submit" class="flex items-center justify-center gap-2 py-3.5 px-6 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold border-2 border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all">
        <Search class="w-5 h-5" />
        Filter
      </button>
    </form>
  </div>

  <!-- Table -->
  <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] overflow-hidden">
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
                  {#if user.role === 'admin' || user.role === 'super_admin'}
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
</div>

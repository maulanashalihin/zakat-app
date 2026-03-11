<script>
  import { MapPin, TrendingUp, Users, HandHeart, Package, DollarSign, ArrowRight } from 'lucide-svelte';

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

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 lg:p-8">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Rekap per Sektor</h1>
    <p class="text-slate-600 dark:text-slate-400 font-medium mt-1">Ringkasan pengumpulan zakat per sektor</p>
  </div>

  <!-- Sektor Cards -->
  <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
    {#each sectors as sector}
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] overflow-hidden group hover:-translate-y-1 transition-all duration-300">
        <!-- Card Header with Color -->
        <div class="p-6 border-b border-slate-200 dark:border-slate-700" style="border-left: 6px solid {sector.color || '#3b82f6'}">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style="background-color: {sector.color || '#3b82f6'}20">
                <MapPin class="w-7 h-7" style="color: {sector.color || '#3b82f6'}" />
              </div>
              <div>
                <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">{sector.name}</h3>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mt-1 {sector.is_active ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}">
                  {sector.is_active ? '✓ Aktif' : '○ Nonaktif'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="p-6 space-y-4">
          <div class="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Users class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span class="text-sm font-bold text-slate-600 dark:text-slate-400">Muzaki</span>
            </div>
            <span class="text-2xl font-extrabold text-slate-900 dark:text-white">{formatNumber(sector.muzakiCount)}</span>
          </div>

          <div class="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <TrendingUp class="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span class="text-sm font-bold text-slate-600 dark:text-slate-400">Total Jiwa</span>
            </div>
            <span class="text-2xl font-extrabold text-slate-900 dark:text-white">{formatNumber(sector.totalJiwa)}</span>
          </div>

          <div class="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                <Package class="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <span class="text-sm font-bold text-slate-600 dark:text-slate-400">Total Beras</span>
            </div>
            <span class="text-xl font-extrabold text-amber-600 dark:text-amber-400">{formatNumber(sector.totalBeras)} <span class="text-sm font-bold">kg</span></span>
          </div>

          <div class="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                <DollarSign class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span class="text-sm font-bold text-slate-600 dark:text-slate-400">Total Uang</span>
            </div>
            <span class="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">Rp {formatNumber(sector.totalUang)}</span>
          </div>

          <div class="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <HandHeart class="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <span class="text-sm font-bold text-slate-600 dark:text-slate-400">Mustahik</span>
            </div>
            <span class="text-2xl font-extrabold text-slate-900 dark:text-white">{formatNumber(sector.mustahikCount)}</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-4 pt-0">
          <a href="/o/{organization.slug}/muzaki?sector={sector.id}" class="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl font-bold transition-all group">
            Lihat Detail Sektor
            <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    {:else}
      <div class="col-span-full">
        <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-12 text-center">
          <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <MapPin class="w-12 h-12 text-slate-400" />
          </div>
          <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Belum ada sektor</h3>
          <p class="text-slate-500 dark:text-slate-400 font-medium mb-6">Tambah sektor melalui menu Master Data → Sektor</p>
          <a href="/o/{organization.slug}/master/sektor" class="inline-flex items-center justify-center gap-2 py-3 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all">
            <Plus class="w-5 h-5" />
            Tambah Sektor Pertama
          </a>
        </div>
      </div>
    {/each}
  </div>
</div>

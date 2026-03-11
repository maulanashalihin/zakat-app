<script>
  import { Building2, Users, HandHeart, Package, DollarSign, ArrowUpRight, TrendingUp, Calendar, MapPin, Settings } from 'lucide-svelte';

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
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>Dashboard - {organization.name} | ZakatApp</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 lg:p-8">
  <!-- Page Header -->
  <div class="mb-8">
    <h1 class="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Dashboard</h1>
    <p class="text-slate-600 dark:text-slate-400 font-medium">Selamat datang di {organization.name}</p>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
    <!-- Muzaki Card -->
    <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      <div class="absolute -right-8 -top-8 w-32 h-32 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-2xl group-hover:bg-blue-400/20 transition-all"></div>
      <div class="relative">
        <div class="flex items-center justify-between mb-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/40">
            <Users class="w-7 h-7 text-white" />
          </div>
          <div class="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full">
            <TrendingUp class="w-3 h-3" />
            +{formatNumber(stats.muzakiCount)}
          </div>
        </div>
        <p class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Muzaki</p>
        <p class="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">{formatNumber(stats.muzakiCount)}</p>
        <p class="text-sm text-slate-500 dark:text-slate-400 font-medium mt-2">{formatNumber(stats.totalJiwa)} jiwa</p>
      </div>
    </div>

    <!-- Mustahik Card -->
    <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      <div class="absolute -right-8 -top-8 w-32 h-32 bg-green-400/10 dark:bg-green-400/5 rounded-full blur-2xl group-hover:bg-green-400/20 transition-all"></div>
      <div class="relative">
        <div class="flex items-center justify-between mb-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/40">
            <HandHeart class="w-7 h-7 text-white" />
          </div>
          <div class="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
            <ArrowUpRight class="w-3 h-3" />
            Aktif
          </div>
        </div>
        <p class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Mustahik</p>
        <p class="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">{formatNumber(stats.mustahikCount)}</p>
        <p class="text-sm text-slate-500 dark:text-slate-400 font-medium mt-2">Penerima zakat</p>
      </div>
    </div>

    <!-- Beras Card -->
    <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      <div class="absolute -right-8 -top-8 w-32 h-32 bg-amber-400/10 dark:bg-amber-400/5 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all"></div>
      <div class="relative">
        <div class="flex items-center justify-between mb-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/40">
            <Package class="w-7 h-7 text-white" />
          </div>
        </div>
        <p class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Beras</p>
        <p class="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">{formatNumber(stats.totalBeras)}</p>
        <p class="text-sm text-slate-500 dark:text-slate-400 font-medium mt-2">Kilogram</p>
      </div>
    </div>

    <!-- Uang Card -->
    <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      <div class="absolute -right-8 -top-8 w-32 h-32 bg-emerald-400/10 dark:bg-emerald-400/5 rounded-full blur-2xl group-hover:bg-emerald-400/20 transition-all"></div>
      <div class="relative">
        <div class="flex items-center justify-between mb-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/40">
            <DollarSign class="w-7 h-7 text-white" />
          </div>
          <div class="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
            <ArrowUpRight class="w-3 h-3" />
            +12%
          </div>
        </div>
        <p class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Uang</p>
        <p class="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{formatCurrency(stats.totalUang)}</p>
        <p class="text-sm text-slate-500 dark:text-slate-400 font-medium mt-2">Rupiah</p>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Quick Actions -->
    <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/40">
          <Building2 class="w-6 h-6 text-white" />
        </div>
        <h2 class="text-xl font-extrabold text-slate-900 dark:text-white">Aksi Cepat</h2>
      </div>
      <div class="space-y-3">
        <a href="/o/{organization.slug}/muzaki/tambah" class="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold shadow-lg shadow-primary-500/40 hover:shadow-xl hover:-translate-y-0.5 transition-all group">
          <span class="flex items-center gap-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Muzaki
          </span>
          <ArrowUpRight class="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </a>
        <a href="/o/{organization.slug}/mustahik/tambah" class="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
          <span class="flex items-center gap-3">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Tambah Mustahik
          </span>
          <ArrowUpRight class="w-5 h-5 text-primary-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </a>
        <a href="/o/{organization.slug}/sektor" class="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-lg hover:-translate-y-0.5 transition-all group">
          <span class="flex items-center gap-3">
            <MapPin class="w-5 h-5 text-primary-600" />
            Lihat Rekap
          </span>
          <ArrowUpRight class="w-5 h-5 text-primary-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </a>
      </div>
    </div>

    <!-- Settings Info -->
    <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/40">
          <Settings class="w-6 h-6 text-white" />
        </div>
        <h2 class="text-xl font-extrabold text-slate-900 dark:text-white">Setting Zakat</h2>
      </div>
      <div class="space-y-4">
        <div class="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10 border border-amber-200 dark:border-amber-800">
          <div class="flex items-center gap-2 mb-2">
            <Package class="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <p class="text-sm font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Beras per Jiwa</p>
          </div>
          <p class="text-3xl font-extrabold text-slate-900 dark:text-white">{settings.default_beras_per_jiwa ?? 2.5} <span class="text-lg font-bold text-amber-600 dark:text-amber-400">kg</span></p>
        </div>
        <div class="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10 border border-emerald-200 dark:border-emerald-800">
          <div class="flex items-center gap-2 mb-2">
            <DollarSign class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <p class="text-sm font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Uang per Jiwa</p>
          </div>
          <p class="text-3xl font-extrabold text-slate-900 dark:text-white">Rp <span class="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatNumber(settings.default_uang_per_jiwa ?? 40000)}</span></p>
        </div>
        <div class="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-800">
          <div class="flex items-center gap-2 mb-2">
            <MapPin class="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <p class="text-sm font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Jumlah Sektor</p>
          </div>
          <p class="text-3xl font-extrabold text-slate-900 dark:text-white">{stats.sectorCount} <span class="text-lg font-bold text-blue-600 dark:text-blue-400">sektor</span></p>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/40">
            <Calendar class="w-6 h-6 text-white" />
          </div>
          <h2 class="text-xl font-extrabold text-slate-900 dark:text-white">Aktivitas</h2>
        </div>
        <a href="/o/{organization.slug}/muzaki" class="text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors">Lihat Semua</a>
      </div>
      <div class="space-y-3">
        {#if recentMuzaki.length > 0}
          {#each recentMuzaki as muzaki}
            <div class="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-all group">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-extrabold bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-md shrink-0">
                {muzaki.name.charAt(0).toUpperCase()}
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-slate-900 dark:text-white truncate">{muzaki.name}</p>
                <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">{muzaki.jumlah_jiwa} jiwa • {formatDate(muzaki.created_at)}</p>
              </div>
              <div class="text-right shrink-0">
                {#if muzaki.jenis_zakat === 'beras'}
                  <p class="text-sm font-bold text-amber-600 dark:text-amber-400">{muzaki.jumlah_beras} kg</p>
                {:else if muzaki.jenis_zakat === 'uang'}
                  <p class="text-sm font-bold text-emerald-600 dark:text-emerald-400">Rp {formatNumber(muzaki.jumlah_uang)}</p>
                {:else}
                  <p class="text-sm font-bold text-slate-500 dark:text-slate-400">Mixed</p>
                {/if}
              </div>
            </div>
          {/each}
        {:else}
          <div class="text-center py-12">
            <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Calendar class="w-10 h-10 text-slate-400" />
            </div>
            <p class="text-slate-500 dark:text-slate-400 font-medium">Belum ada aktivitas</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

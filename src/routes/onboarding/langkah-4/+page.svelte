<script>
  import { Building2, Settings, MapPin, Users, CheckCircle, ArrowRight, Edit3 } from 'lucide-svelte';

  let { data } = $props();

  const step1 = $derived(data.step1);
  const step2 = $derived(data.step2);
  const step3 = $derived(data.step3);
</script>

<svelte:head>
  <title>Konfirmasi - ZakatApp</title>
</svelte:head>

<div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8 relative transform -rotate-1 hover:rotate-0 transition-transform duration-500">
  <div class="flex gap-2 mb-6 px-2">
    <div class="w-3 h-3 rounded-full bg-red-400"></div>
    <div class="w-3 h-3 rounded-full bg-amber-400"></div>
    <div class="w-3 h-3 rounded-full bg-green-400"></div>
  </div>

  <div class="mb-8">
    <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Konfirmasi Data</h2>
    <p class="text-slate-600 dark:text-slate-400 font-medium mt-1">
      Periksa kembali data organisasi Anda sebelum menyelesaikan setup
    </p>
  </div>

  <form method="POST" class="space-y-6">
    <!-- Step 1: Organization Info -->
    <div class="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Building2 class="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 class="font-bold text-slate-900 dark:text-white">Informasi Organisasi</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Langkah 1</p>
          </div>
        </div>
        <a href="/onboarding/langkah-1" class="text-sm text-primary-600 hover:text-primary-500 font-medium flex items-center gap-1">
          <Edit3 class="w-4 h-4" />
          Edit
        </a>
      </div>
      
      <div class="space-y-3">
        <div>
          <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Nama</p>
          <p class="font-semibold text-slate-900 dark:text-white">{step1?.name || '-'}</p>
        </div>
        <div>
          <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Slug/URL</p>
          <p class="font-medium text-slate-700 dark:text-slate-300">{step1?.slug || '-'}</p>
        </div>
        {#if step1?.address}
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Alamat</p>
            <p class="font-medium text-slate-700 dark:text-slate-300">{step1.address}</p>
          </div>
        {/if}
        {#if step1?.phone}
          <div>
            <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Telepon</p>
            <p class="font-medium text-slate-700 dark:text-slate-300">{step1.phone}</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Step 2: Zakat Settings -->
    <div class="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Settings class="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 class="font-bold text-slate-900 dark:text-white">Ketetapan Zakat</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Langkah 2</p>
          </div>
        </div>
        <a href="/onboarding/langkah-2" class="text-sm text-primary-600 hover:text-primary-500 font-medium flex items-center gap-1">
          <Edit3 class="w-4 h-4" />
          Edit
        </a>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white dark:bg-slate-800 rounded-xl p-3">
          <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Beras per Jiwa</p>
          <p class="text-lg font-bold text-slate-900 dark:text-white">{step2?.defaultBerasPerJiwa || '-'} kg</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-xl p-3">
          <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Uang per Jiwa</p>
          <p class="text-lg font-bold text-slate-900 dark:text-white">Rp {step2?.defaultUangPerJiwa?.toLocaleString('id-ID') || '-'}</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-xl p-3">
          <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Tahun Hijriyah</p>
          <p class="text-lg font-bold text-slate-900 dark:text-white">{step2?.yearHijri || '-'}</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-xl p-3">
          <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Tahun Masehi</p>
          <p class="text-lg font-bold text-slate-900 dark:text-white">{step2?.yearMasehi || '-'}</p>
        </div>
      </div>
      
      {#if step2?.periodName}
        <div class="mt-3 bg-white dark:bg-slate-800 rounded-xl p-3">
          <p class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Nama Periode</p>
          <p class="font-semibold text-slate-900 dark:text-white">{step2.periodName}</p>
        </div>
      {/if}
    </div>

    <!-- Step 3: Sectors -->
    <div class="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <MapPin class="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 class="font-bold text-slate-900 dark:text-white">Sektor/Wilayah</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Langkah 3</p>
          </div>
        </div>
        <a href="/onboarding/langkah-3" class="text-sm text-primary-600 hover:text-primary-500 font-medium flex items-center gap-1">
          <Edit3 class="w-4 h-4" />
          Edit
        </a>
      </div>
      
      <div class="flex flex-wrap gap-2">
        {#each step3?.sectors || [] as sector}
          <span 
            class="px-3 py-1.5 rounded-full text-sm font-medium"
            style="background-color: {sector.color}20; color: {sector.color}; border: 1px solid {sector.color}40;"
          >
            {sector.name}
          </span>
        {:else}
          <p class="text-slate-500 dark:text-slate-400 text-sm italic">Tidak ada sektor yang ditambahkan</p>
        {/each}
      </div>
    </div>

    <!-- Info Note -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
      <div class="flex gap-3">
        <Users class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p class="text-sm font-medium text-blue-900 dark:text-blue-100">
            Tambah Petugas Nanti
          </p>
          <p class="text-xs text-blue-700 dark:text-blue-300 mt-1">
            Anda bisa menambahkan petugas dan mengatur hak akses setelah masuk ke dashboard. Klik menu "Master Data &gt; Petugas" nanti.
          </p>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="pt-4">
      <button type="submit" class="w-full flex items-center justify-center gap-2 py-4 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1">
        <CheckCircle class="w-5 h-5" />
        Selesaikan Setup
        <ArrowRight class="w-5 h-5" />
      </button>
    </div>
  </form>
</div>

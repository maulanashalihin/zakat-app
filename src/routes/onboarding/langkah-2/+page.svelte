<script>
  import { Calculator, TrendingUp, ArrowRight } from 'lucide-svelte';

  let { data, form } = $props();

  const defaults = $derived(data.defaults || {});
  const savedData = $derived(data.savedData || {});
  const values = $derived(form?.values || savedData || defaults);
  const errors = $derived(form?.errors || {});
</script>

<svelte:head>
  <title>Setup Zakat - ZakatApp</title>
</svelte:head>

<div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8 relative transform -rotate-1 hover:rotate-0 transition-transform duration-500">
  <div class="flex gap-2 mb-6 px-2">
    <div class="w-3 h-3 rounded-full bg-red-400"></div>
    <div class="w-3 h-3 rounded-full bg-amber-400"></div>
    <div class="w-3 h-3 rounded-full bg-green-400"></div>
  </div>

  <div class="mb-8">
    <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Setting Zakat</h2>
    <p class="text-slate-600 dark:text-slate-400 font-medium mt-1">
      Tentukan nilai zakat dan periode pengumpulan
    </p>
  </div>

  <form method="POST" class="space-y-6">
    <!-- Zakat Rates -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <!-- Beras per Jiwa -->
      <div>
        <label for="defaultBerasPerJiwa" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          Beras per Jiwa <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            type="number"
            id="defaultBerasPerJiwa"
            name="defaultBerasPerJiwa"
            value={values.defaultBerasPerJiwa ?? 2.5}
            step="0.1"
            min="0.5"
            max="10"
            class="w-full pl-4 pr-12 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            required
          />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500 dark:text-slate-400">kg</span>
        </div>
        <p class="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">Standar: 2.5 kg atau 3.5 kg</p>
        {#if errors?.defaultBerasPerJiwa}
          <p class="mt-1 text-sm text-red-600 dark:text-red-400 font-medium">{errors.defaultBerasPerJiwa}</p>
        {/if}
      </div>

      <!-- Uang per Jiwa -->
      <div>
        <label for="defaultUangPerJiwa" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          Uang per Jiwa <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500 dark:text-slate-400">Rp</span>
          <input
            type="number"
            id="defaultUangPerJiwa"
            name="defaultUangPerJiwa"
            value={values.defaultUangPerJiwa ?? 50000}
            step="1000"
            min="10000"
            max="200000"
            class="w-full pl-10 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            required
          />
        </div>
        <p class="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">Standar: Rp 40.000 - Rp 60.000</p>
        {#if errors?.defaultUangPerJiwa}
          <p class="mt-1 text-sm text-red-600 dark:text-red-400 font-medium">{errors.defaultUangPerJiwa}</p>
        {/if}
      </div>
    </div>

    <!-- Date Range -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label for="startDate" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          Tanggal Mulai
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={values.startDate || ''}
          class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
        />
      </div>

      <div>
        <label for="endDate" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          Tanggal Berakhir
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={values.endDate || ''}
          class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
        />
      </div>
    </div>

    <!-- Summary Card -->
    <div class="bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/20 rounded-2xl p-5 border border-primary-100 dark:border-primary-800">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-sm">
          <Calculator class="w-5 h-5" />
        </div>
        <h3 class="font-extrabold text-slate-900 dark:text-white">Ringkasan Setting</h3>
      </div>
      <ul class="text-sm text-slate-600 dark:text-slate-300 font-medium space-y-2">
        <li class="flex items-start gap-2">
          <span class="text-primary-500 mt-0.5">•</span>
          <span>Setiap jiwa membayar <strong class="text-slate-900 dark:text-white">{values.defaultBerasPerJiwa ?? 2.5} kg</strong> beras atau <strong class="text-slate-900 dark:text-white">Rp {(values.defaultUangPerJiwa ?? 40000).toLocaleString('id-ID')}</strong></span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-primary-500 mt-0.5">•</span>
          <span>Keluarga 5 jiwa akan membayar <strong class="text-slate-900 dark:text-white">{(values.defaultBerasPerJiwa ?? 2.5) * 5} kg</strong> beras</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-primary-500 mt-0.5">•</span>
          <span>Anda bisa mengubah setting ini kapan saja</span>
        </li>
      </ul>
    </div>

    <div class="pt-4">
      <button type="submit" class="w-full flex items-center justify-center gap-2 py-4 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1">
        Lanjutkan
        <ArrowRight class="w-5 h-5" />
      </button>
    </div>
  </form>
</div>

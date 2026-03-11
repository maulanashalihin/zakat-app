<script>
  let { data, form } = $props();
  
  const defaults = $derived(data.defaults);
  const savedData = $derived(data.savedData);
  const values = $derived(form?.values || savedData || defaults);
  const errors = $derived(form?.errors || {});
</script>

<svelte:head>
  <title>Setup Zakat - ZakatApp</title>
</svelte:head>

<div class="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6">
  <div class="mb-6">
    <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Setting Zakat</h2>
    <p class="text-slate-600 dark:text-slate-400 mt-1">
      Tentukan nilai zakat dan periode pengumpulan
    </p>
  </div>

  <form method="POST" class="space-y-6">
    <!-- Zakat Rates -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Beras per Jiwa -->
      <div>
        <label for="defaultBerasPerJiwa" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Beras per Jiwa <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            type="number"
            id="defaultBerasPerJiwa"
            name="defaultBerasPerJiwa"
            value={values.defaultBerasPerJiwa || 2.5}
            step="0.1"
            min="0.5"
            max="10"
            class="input w-full pr-12"
            required
          />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">kg</span>
        </div>
        <p class="mt-1 text-xs text-slate-500">Standar: 2.5 kg atau 3.5 kg</p>
        {#if errors?.defaultBerasPerJiwa}
          <p class="mt-1 text-sm text-red-500">{errors.defaultBerasPerJiwa}</p>
        {/if}
      </div>

      <!-- Uang per Jiwa -->
      <div>
        <label for="defaultUangPerJiwa" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Uang per Jiwa <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">Rp</span>
          <input
            type="number"
            id="defaultUangPerJiwa"
            name="defaultUangPerJiwa"
            value={values.defaultUangPerJiwa || 40000}
            step="1000"
            min="10000"
            max="200000"
            class="input w-full pl-10"
            required
          />
        </div>
        <p class="mt-1 text-xs text-slate-500">Standar: Rp 35.000 - Rp 50.000</p>
        {#if errors?.defaultUangPerJiwa}
          <p class="mt-1 text-sm text-red-500">{errors.defaultUangPerJiwa}</p>
        {/if}
      </div>
    </div>

    <!-- Date Range -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="startDate" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Tanggal Mulai
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={values.startDate || ''}
          class="input w-full"
        />
      </div>

      <div>
        <label for="endDate" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Tanggal Berakhir
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={values.endDate || ''}
          class="input w-full"
        />
      </div>
    </div>

    <!-- Summary Card -->
    <div class="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
      <h3 class="font-medium text-slate-900 dark:text-white mb-2">Ringkasan Setting</h3>
      <ul class="text-sm text-slate-600 dark:text-slate-400 space-y-1">
        <li>• Setiap jiwa membayar <strong>{values.defaultBerasPerJiwa || 2.5} kg</strong> beras atau <strong>Rp {(values.defaultUangPerJiwa || 40000).toLocaleString()}</strong></li>
        <li>• Keluarga 5 jiwa akan membayar <strong>{(values.defaultBerasPerJiwa || 2.5) * 5} kg</strong> beras</li>
        <li>• Anda bisa mengubah setting ini kapan saja</li>
      </ul>
    </div>

    <div class="flex justify-end gap-3">
      <button type="submit" class="btn-primary px-8 py-3">
        Lanjutkan →
      </button>
    </div>
  </form>
</div>

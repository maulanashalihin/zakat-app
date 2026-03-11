<script>
  let { data, form } = $props();
  
  const defaults = data.defaults;
  const savedData = data.savedData;
  const values = form?.values || savedData || defaults;
  const errors = form?.errors || {};
</script>

<div class="bg-white rounded-lg shadow-sm p-6">
  <div class="mb-6">
    <h2 class="text-2xl font-bold text-slate-900">Setting Zakat</h2>
    <p class="text-slate-600 mt-1">
      Tentukan nilai zakat dan periode pengumpulan
    </p>
  </div>

  <form method="POST" class="space-y-6">
    <!-- Zakat Rates -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Beras per Jiwa -->
      <div>
        <label for="defaultBerasPerJiwa" class="block text-sm font-medium text-slate-700 mb-1">
          Beras per Jiwa <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            type="number"
            id="defaultBerasPerJiwa"
            name="defaultBerasPerJiwa"
            value={values.defaultBerasPerJiwa}
            step="0.1"
            min="0"
            class="input w-full pr-12 {errors.defaultBerasPerJiwa ? 'border-red-500' : ''}"
            required
          />
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">kg</span>
        </div>
        {#if errors.defaultBerasPerJiwa}
          <p class="text-red-500 text-sm mt-1">{errors.defaultBerasPerJiwa}</p>
        {:else}
          <p class="text-slate-500 text-sm mt-1">Standar: 2.5 kg</p>
        {/if}
      </div>

      <!-- Uang per Jiwa -->
      <div>
        <label for="defaultUangPerJiwa" class="block text-sm font-medium text-slate-700 mb-1">
          Uang per Jiwa <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">Rp</span>
          <input
            type="number"
            id="defaultUangPerJiwa"
            name="defaultUangPerJiwa"
            value={values.defaultUangPerJiwa}
            step="1000"
            min="0"
            class="input w-full pl-10 {errors.defaultUangPerJiwa ? 'border-red-500' : ''}"
            required
          />
        </div>
        {#if errors.defaultUangPerJiwa}
          <p class="text-red-500 text-sm mt-1">{errors.defaultUangPerJiwa}</p>
        {:else}
          <p class="text-slate-500 text-sm mt-1">Standar: Rp 40.000</p>
        {/if}
      </div>
    </div>

    <!-- Period Info -->
    <div class="border-t pt-6">
      <h3 class="text-lg font-medium text-slate-900 mb-4">Periode Zakat</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Tahun Hijriyah -->
        <div>
          <label for="yearHijri" class="block text-sm font-medium text-slate-700 mb-1">
            Tahun Hijriyah <span class="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="yearHijri"
            name="yearHijri"
            value={values.yearHijri}
            min="1400"
            max="1500"
            class="input w-full {errors.yearHijri ? 'border-red-500' : ''}"
            required
          />
          {#if errors.yearHijri}
            <p class="text-red-500 text-sm mt-1">{errors.yearHijri}</p>
          {/if}
        </div>

        <!-- Tahun Masehi -->
        <div>
          <label for="yearMasehi" class="block text-sm font-medium text-slate-700 mb-1">
            Tahun Masehi <span class="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="yearMasehi"
            name="yearMasehi"
            value={values.yearMasehi}
            min="2000"
            max="2100"
            class="input w-full {errors.yearMasehi ? 'border-red-500' : ''}"
            required
          />
          {#if errors.yearMasehi}
            <p class="text-red-500 text-sm mt-1">{errors.yearMasehi}</p>
          {/if}
        </div>

        <!-- Nama Periode -->
        <div>
          <label for="periodName" class="block text-sm font-medium text-slate-700 mb-1">
            Nama Periode <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="periodName"
            name="periodName"
            value={values.periodName}
            placeholder="Ramadhan 1446 H"
            class="input w-full"
            required
          />
        </div>
      </div>
    </div>

    <!-- Info Box -->
    <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-amber-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="text-sm text-amber-800">
          <p class="font-medium">Catatan</p>
          <p class="mt-1">
            Setting ini bisa diubah nanti melalui menu Pengaturan. 
            Nilai default hanya sebagai patokan awal perhitungan zakat.
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between pt-4 border-t">
      <a href="/onboarding/langkah-1" class="btn-secondary">
        <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </a>
      <button type="submit" class="btn-primary">
        Lanjut ke Langkah 3
        <svg class="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </form>
</div>

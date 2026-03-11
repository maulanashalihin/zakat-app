<script>
  let { data, form } = $props();
  
  const savedData = $derived(data.savedData);
  const values = $derived(form?.values || savedData || {});
  const errors = $derived(form?.errors || {});
</script>

<svelte:head>
  <title>Setup Organisasi - ZakatApp</title>
</svelte:head>

<div class="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6">
  <div class="mb-6">
    <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Buat Organisasi</h2>
    <p class="text-slate-600 dark:text-slate-400 mt-1">
      Masukkan informasi lembaga atau masjid Anda
    </p>
  </div>

  <form method="POST" class="space-y-6">
    <!-- Organization Name -->
    <div>
      <label for="name" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        Nama Lembaga / Masjid <span class="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={values.name || ''}
        placeholder="Contoh: Masjid Al-Fatihah"
        class="input w-full"
        required
      />
      {#if errors?.name}
        <p class="mt-1 text-sm text-red-500">{errors.name}</p>
      {/if}
    </div>

    <!-- Description -->
    <div>
      <label for="description" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        Deskripsi
      </label>
      <textarea
        id="description"
        name="description"
        value={values.description || ''}
        placeholder="Deskripsi singkat tentang organisasi"
        class="input w-full"
        rows="3"
      ></textarea>
    </div>

    <!-- Location -->
    <div>
      <label for="location" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        Lokasi
      </label>
      <input
        type="text"
        id="location"
        name="location"
        value={values.location || ''}
        placeholder="Contoh: Jl. Sudirman No. 123, Jakarta"
        class="input w-full"
      />
    </div>

    <!-- Year -->
    <div>
      <label for="year" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        Tahun Zakat <span class="text-red-500">*</span>
      </label>
      <input
        type="number"
        id="year"
        name="year"
        value={values.year || new Date().getFullYear()}
        class="input w-full"
        min="2000"
        max="2100"
        required
      />
    </div>

    <div class="flex justify-end">
      <button type="submit" class="btn-primary px-8 py-3">
        Lanjutkan →
      </button>
    </div>
  </form>
</div>

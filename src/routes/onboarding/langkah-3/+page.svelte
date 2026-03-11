<script>
  let { data, form } = $props();
  
  // Initialize sectors array
  let sectors = $state(form?.values?.sectors || data?.savedData?.sectors || [
    { name: '', color: '#3b82f6', description: '' }
  ]);
  
  const errors = form?.errors || {};
  
  // Suggested colors
  const colorOptions = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#06b6d4', // cyan
    '#ec4899', // pink
    '#84cc16', // lime
  ];
  
  // Suggested sector names
  const suggestedNames = ['Banjaran', 'Cangkuang', 'Pangalengan', 'Arjasari', 'Cimaung', 'Margahayu'];
  
  function addSector() {
    sectors = [...sectors, { name: '', color: colorOptions[sectors.length % colorOptions.length], description: '' }];
  }
  
  function removeSector(index) {
    if (sectors.length > 1) {
      sectors = sectors.filter((_, i) => i !== index);
    }
  }
  
  function useSuggestion(name) {
    // Check if already used
    const existing = sectors.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (!existing) {
      if (sectors.length === 1 && sectors[0].name === '') {
        sectors[0].name = name;
      } else {
        sectors = [...sectors, { name, color: colorOptions[sectors.length % colorOptions.length], description: '' }];
      }
    }
  }
</script>

<div class="bg-white rounded-lg shadow-sm p-6">
  <div class="mb-6">
    <h2 class="text-2xl font-bold text-slate-900">Buat Sektor/Wilayah</h2>
    <p class="text-slate-600 mt-1">
      Tentukan wilayah pengumpulan zakat
    </p>
  </div>

  <!-- Suggested Names -->
  <div class="mb-6">
    <p class="text-sm text-slate-600 mb-2">Nama yang sering digunakan:</p>
    <div class="flex flex-wrap gap-2">
      {#each suggestedNames as name}
        <button
          type="button"
          onclick={() => useSuggestion(name)}
          class="text-sm px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-colors"
        >
          + {name}
        </button>
      {/each}
    </div>
  </div>

  <form method="POST" class="space-y-4">
    {#if errors.sectors}
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-600 text-sm">{errors.sectors}</p>
      </div>
    {/if}

    <!-- Sectors List -->
    <div class="space-y-4">
      {#each sectors as sector, i (i)}
        <div class="flex gap-3 items-start p-4 bg-slate-50 rounded-lg">
          <!-- Color Picker -->
          <div class="flex flex-wrap gap-1 w-20">
            {#each colorOptions.slice(0, 4) as color}
              <button
                type="button"
                onclick={() => sectors[i].color = color}
                class="w-6 h-6 rounded-full border-2 transition-all {sector.color === color ? 'border-slate-900 scale-110' : 'border-transparent'}"
                style="background-color: {color}"
              ></button>
            {/each}
          </div>
          
          <!-- Name Input -->
          <div class="flex-1">
            <input
              type="text"
              name="sectors[{i}].name"
              bind:value={sectors[i].name}
              placeholder="Nama sektor/wilayah"
              class="input w-full"
              required
            />
            <input type="hidden" name="sectors[{i}].color" bind:value={sectors[i].color} />
          </div>
          
          <!-- Remove Button -->
          {#if sectors.length > 1}
            <button
              type="button"
              onclick={() => removeSector(i)}
              class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Hapus sektor"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          {/if}
        </div>
      {/each}
    </div>

    <!-- Add Button -->
    <button
      type="button"
      onclick={addSector}
      class="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-slate-400 hover:text-slate-800 transition-colors flex items-center justify-center"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Tambah Sektor
    </button>

    <!-- Info Box -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="text-sm text-blue-800">
          <p class="font-medium">Tips</p>
          <p class="mt-1">
            Sektor membantu membagi wilayah pengumpulan. Setiap petugas bisa ditugaskan 
            ke sektor tertentu. Minimal 1 sektor diperlukan.
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between pt-4 border-t">
      <a href="/onboarding/langkah-2" class="btn-secondary">
        <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </a>
      <button type="submit" class="btn-primary">
        Lanjut ke Langkah 4
        <svg class="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </form>
</div>

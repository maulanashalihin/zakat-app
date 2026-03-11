<script>
  let { data, form } = $props();
  
  const organization = data.organization;
  const sectors = data.sectors;
  const settings = data.settings;
  const muzaki = data.muzaki;
  
  const errors = $derived(form?.errors || {});
  
  let jenisZakat = $state(form?.values?.jenisZakat || muzaki.jenis_zakat || 'uang');
  let jumlahJiwa = $state(parseInt(form?.values?.jumlahJiwa) || muzaki.jumlah_jiwa || 1);
  
  // Calculate default amounts
  let defaultBeras = $derived((settings?.default_beras_per_jiwa || 2.5) * jumlahJiwa);
  let defaultUang = $derived((settings?.default_uang_per_jiwa || 40000) * jumlahJiwa);
</script>

<svelte:head>
  <title>Edit Muzaki - {organization.name} | ZakatApp</title>
</svelte:head>

<div class="p-4 lg:p-6 max-w-3xl mx-auto" style="background-color: var(--bg-primary); min-height: 100%;">
  <!-- Header -->
  <div class="mb-4 lg:mb-6">
    <a href="/o/{organization.slug}/muzaki" class="text-sm flex items-center gap-1 mb-2" style="color: var(--text-tertiary);">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Kembali
    </a>
    <h1 class="text-xl lg:text-2xl font-bold" style="color: var(--text-primary);">Edit Muzaki</h1>
    <p class="text-sm lg:text-base" style="color: var(--text-secondary);">Update data pembayar zakat</p>
  </div>

  <!-- Form -->
  <form method="POST" class="space-y-4 lg:space-y-6">
    <div class="rounded-lg shadow-sm p-4 lg:p-6 space-y-4 lg:space-y-6" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
      <!-- Name -->
      <div>
        <label for="name" class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Nama Lengkap <span style="color: var(--error);">*</span></label>
        <input
          type="text"
          id="name"
          name="name"
          value={form?.values?.name ?? muzaki.name}
          class="input w-full"
          placeholder="Nama pembayar zakat"
          required
        />
        {#if errors.name}
          <p class="text-sm mt-1" style="color: var(--error);">{errors.name}</p>
        {/if}
      </div>

      <!-- Address -->
      <div>
        <label for="address" class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Alamat</label>
        <textarea
          id="address"
          name="address"
          rows="2"
          class="input w-full"
          placeholder="Alamat lengkap"
        >{form?.values?.address ?? muzaki.address ?? ''}</textarea>
      </div>

      <!-- Sector -->
      <div>
        <label for="sectorId" class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Sektor <span style="color: var(--error);">*</span></label>
        <select id="sectorId" name="sectorId" class="input w-full" required>
          <option value="">Pilih Sektor</option>
          {#each sectors as sector}
            <option value={sector.id} selected={(form?.values?.sectorId ?? muzaki.sector_id) === sector.id}>{sector.name}</option>
          {/each}
        </select>
        {#if errors.sectorId}
          <p class="text-sm mt-1" style="color: var(--error);">{errors.sectorId}</p>
        {/if}
      </div>

      <!-- Jumlah Jiwa -->
      <div>
        <label for="jumlahJiwa" class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Jumlah Jiwa <span style="color: var(--error);">*</span></label>
        <input
          type="number"
          id="jumlahJiwa"
          name="jumlahJiwa"
          bind:value={jumlahJiwa}
          min="1"
          class="input w-full"
          required
        />
        {#if errors.jumlahJiwa}
          <p class="text-sm mt-1" style="color: var(--error);">{errors.jumlahJiwa}</p>
        {/if}
      </div>

      <!-- Jenis Zakat -->
      <div>
        <label class="block text-sm font-medium mb-2" style="color: var(--text-secondary);">Jenis Zakat</label>
        <div class="flex flex-wrap gap-2 lg:gap-4">
          <label class="flex items-center gap-2 cursor-pointer flex-1 sm:flex-none">
            <input type="radio" name="jenisZakat" value="uang" bind:group={jenisZakat} class="sr-only peer" />
            <div class="px-3 lg:px-4 py-2 rounded-lg border-2 border-transparent peer-checked:border-green-500 peer-checked:bg-green-500/10 transition-all text-center w-full sm:w-auto" style="background-color: var(--bg-tertiary);">
              <span class="text-sm lg:text-base" style="color: var(--text-primary);">Uang</span>
            </div>
          </label>
          <label class="flex items-center gap-2 cursor-pointer flex-1 sm:flex-none">
            <input type="radio" name="jenisZakat" value="beras" bind:group={jenisZakat} class="sr-only peer" />
            <div class="px-3 lg:px-4 py-2 rounded-lg border-2 border-transparent peer-checked:border-amber-500 peer-checked:bg-amber-500/10 transition-all text-center w-full sm:w-auto" style="background-color: var(--bg-tertiary);">
              <span class="text-sm lg:text-base" style="color: var(--text-primary);">Beras</span>
            </div>
          </label>
          <label class="flex items-center gap-2 cursor-pointer flex-1 sm:flex-none">
            <input type="radio" name="jenisZakat" value="keduanya" bind:group={jenisZakat} class="sr-only peer" />
            <div class="px-3 lg:px-4 py-2 rounded-lg border-2 border-transparent peer-checked:border-blue-500 peer-checked:bg-blue-500/10 transition-all text-center w-full sm:w-auto" style="background-color: var(--bg-tertiary);">
              <span class="text-sm lg:text-base" style="color: var(--text-primary);">Keduanya</span>
            </div>
          </label>
        </div>
      </div>

      <!-- Jumlah Beras (if applicable) -->
      {#if jenisZakat === 'beras' || jenisZakat === 'keduanya'}
        <div>
          <label for="jumlahBeras" class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Jumlah Beras (kg)</label>
          <input
            type="number"
            id="jumlahBeras"
            name="jumlahBeras"
            value={form?.values?.jumlahBeras ?? muzaki.jumlah_beras ?? defaultBeras}
            step="0.1"
            min="0"
            class="input w-full"
          />
          <p class="text-xs lg:text-sm mt-1" style="color: var(--text-tertiary);">Default: {defaultBeras} kg</p>
        </div>
      {/if}

      <!-- Jumlah Uang (if applicable) -->
      {#if jenisZakat === 'uang' || jenisZakat === 'keduanya'}
        <div>
          <label for="jumlahUang" class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Jumlah Uang (Rp)</label>
          <input
            type="number"
            id="jumlahUang"
            name="jumlahUang"
            value={form?.values?.jumlahUang ?? muzaki.jumlah_uang ?? defaultUang}
            min="0"
            class="input w-full"
          />
          <p class="text-xs lg:text-sm mt-1" style="color: var(--text-tertiary);">Default: Rp {defaultUang.toLocaleString('id-ID')}</p>
        </div>
      {/if}

      {#if form?.error}
        <div class="p-3 lg:p-4 rounded-lg" style="background-color: var(--error-bg);">
          <p class="text-sm" style="color: var(--error);">{form.error}</p>
        </div>
      {/if}
    </div>

    <!-- Actions -->
    <div class="flex flex-col sm:flex-row gap-3">
      <a href="/o/{organization.slug}/muzaki" class="btn-secondary text-center order-2 sm:order-1">Batal</a>
      <button type="submit" class="btn-primary order-1 sm:order-2">Simpan Perubahan</button>
    </div>
  </form>
</div>

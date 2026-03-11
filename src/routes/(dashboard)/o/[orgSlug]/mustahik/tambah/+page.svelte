<script>
  let { data, form } = $props();
  
  const organization = data.organization;
  const sectors = data.sectors;
  
  const errors = $derived(form?.errors || {});
  const values = $derived(form?.values || {});
</script>

<svelte:head>
  <title>Tambah Mustahik - {organization.name} | ZakatApp</title>
</svelte:head>

<div class="p-4 lg:p-6 max-w-3xl mx-auto" style="background-color: var(--bg-primary); min-height: 100%;">
  <!-- Header -->
  <div class="mb-4 lg:mb-6">
    <a href="/o/{organization.slug}/mustahik" class="text-sm flex items-center gap-1 mb-2" style="color: var(--text-tertiary);">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Kembali
    </a>
    <h1 class="text-xl lg:text-2xl font-bold" style="color: var(--text-primary);">Tambah Mustahik</h1>
    <p class="text-sm lg:text-base" style="color: var(--text-secondary);">Catat penerima zakat fitrah</p>
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
          value={values.name || ''}
          class="input w-full"
          placeholder="Nama penerima zakat"
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
        >{values.address || ''}</textarea>
      </div>

      <!-- Sector -->
      <div>
        <label for="sectorId" class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Sektor <span style="color: var(--error);">*</span></label>
        <select id="sectorId" name="sectorId" class="input w-full" required>
          <option value="">Pilih Sektor</option>
          {#each sectors as sector}
            <option value={sector.id} selected={values.sectorId === sector.id}>{sector.name}</option>
          {/each}
        </select>
        {#if errors.sectorId}
          <p class="text-sm mt-1" style="color: var(--error);">{errors.sectorId}</p>
        {/if}
      </div>

      <!-- Kategori -->
      <div>
        <label for="kategori" class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Kategori</label>
        <select id="kategori" name="kategori" class="input w-full">
          <option value="">Pilih Kategori</option>
          <option value="fakir" selected={values.kategori === 'fakir'}>Fakir</option>
          <option value="miskin" selected={values.kategori === 'miskin'}>Miskin</option>
          <option value="amil" selected={values.kategori === 'amil'}>Amil</option>
          <option value="mualaf" selected={values.kategori === 'mualaf'}>Mualaf</option>
          <option value="riqab" selected={values.kategori === 'riqab'}>Riqab</option>
          <option value="gharim" selected={values.kategori === 'gharim'}>Gharim</option>
          <option value="fisabilillah" selected={values.kategori === 'fisabilillah'}>Fisabilillah</option>
          <option value="ibnu_sabil" selected={values.kategori === 'ibnu_sabil'}>Ibnu Sabil</option>
        </select>
      </div>

      <!-- Jumlah Jiwa -->
      <div>
        <label for="jumlahJiwa" class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Jumlah Jiwa <span style="color: var(--error);">*</span></label>
        <input
          type="number"
          id="jumlahJiwa"
          name="jumlahJiwa"
          value={values.jumlahJiwa || '1'}
          min="1"
          class="input w-full"
          required
        />
      </div>

      <!-- Keterangan -->
      <div>
        <label for="keterangan" class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Keterangan</label>
        <textarea
          id="keterangan"
          name="keterangan"
          rows="2"
          class="input w-full"
          placeholder="Keterangan tambahan (opsional)"
        >{values.keterangan || ''}</textarea>
      </div>

      {#if form?.error}
        <div class="p-3 lg:p-4 rounded-lg" style="background-color: var(--error-bg);">
          <p class="text-sm" style="color: var(--error);">{form.error}</p>
        </div>
      {/if}
    </div>

    <!-- Actions -->
    <div class="flex flex-col sm:flex-row gap-3">
      <a href="/o/{organization.slug}/mustahik" class="btn-secondary text-center order-2 sm:order-1">Batal</a>
      <button type="submit" class="btn-primary order-1 sm:order-2">Simpan</button>
    </div>
  </form>
</div>

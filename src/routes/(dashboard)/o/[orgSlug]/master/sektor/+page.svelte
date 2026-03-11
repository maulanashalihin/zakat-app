<script>
  let { data, form } = $props();
  
  const organization = data.organization;
  const sectors = data.sectors;
  
  let showAddForm = $state(false);
  let editingId = $state(null);
  
  const colorOptions = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'
  ];
</script>

<svelte:head>
  <title>Master Sektor - {organization.name} | ZakatApp</title>
</svelte:head>

<div class="p-4 lg:p-6" style="background-color: var(--bg-primary); min-height: 100%;">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 lg:mb-6">
    <div>
      <h1 class="text-xl lg:text-2xl font-bold" style="color: var(--text-primary);">Master Sektor</h1>
      <p class="text-sm lg:text-base" style="color: var(--text-secondary);">Kelola wilayah/sektor pengumpulan zakat</p>
    </div>
    <button onclick={() => showAddForm = !showAddForm} class="btn-primary text-sm lg:text-base px-3 py-2 lg:px-4 lg:py-2 self-start">
      {#if showAddForm}
        Batal
      {:else}
        <svg class="w-4 h-4 mr-1 lg:mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Sektor
      {/if}
    </button>
  </div>

  <!-- Add Form -->
  {#if showAddForm}
    <div class="rounded-lg shadow-sm p-4 lg:p-6 mb-4 lg:mb-6" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
      <h3 class="text-base lg:text-lg font-medium mb-3 lg:mb-4" style="color: var(--text-primary);">Tambah Sektor Baru</h3>
      <form method="POST" action="?/create" class="space-y-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Nama Sektor <span style="color: var(--error);">*</span></label>
            <input type="text" name="name" class="input w-full" required placeholder="Contoh: Banjaran" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Warna</label>
            <div class="flex flex-wrap gap-2">
              {#each colorOptions as color}
                <label class="cursor-pointer">
                  <input type="radio" name="color" value={color} class="sr-only peer" checked={color === '#3b82f6'} />
                  <div class="w-8 h-8 rounded-full border-2 border-transparent peer-checked:scale-110 transition-all" style="background-color: {color}; --tw-border-opacity: 1; border-color: var(--text-primary);"></div>
                </label>
              {/each}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Deskripsi</label>
            <input type="text" name="description" class="input w-full" placeholder="Opsional" />
          </div>
        </div>
        {#if form?.error}
          <p class="text-sm" style="color: var(--error);">{form.error}</p>
        {/if}
        <div class="flex justify-end">
          <button type="submit" class="btn-primary">Simpan</button>
        </div>
      </form>
    </div>
  {/if}

  <!-- Mobile Cards View -->
  <div class="lg:hidden space-y-3">
    {#each sectors as sector}
      <div class="rounded-lg shadow-sm p-4" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
        {#if editingId === sector.id}
          <form method="POST" action="?/update" class="space-y-3">
            <input type="hidden" name="id" value={sector.id} />
            <input type="text" name="name" value={sector.name} class="input w-full" required />
            <div class="flex gap-2 flex-wrap">
              {#each colorOptions as color}
                <label class="cursor-pointer">
                  <input type="radio" name="color" value={color} class="sr-only peer" checked={color === sector.color} />
                  <div class="w-6 h-6 rounded-full border-2 border-transparent peer-checked:scale-110 transition-all" style="background-color: {color}; --tw-border-opacity: 1; border-color: var(--text-primary);"></div>
                </label>
              {/each}
            </div>
            <input type="text" name="description" value={sector.description || ''} class="input w-full" />
            <select name="is_active" class="input w-full">
              <option value="1" selected={sector.is_active === 1}>Aktif</option>
              <option value="0" selected={sector.is_active === 0}>Nonaktif</option>
            </select>
            <div class="flex gap-2">
              <button type="submit" class="font-medium text-sm" style="color: #10b981;">Simpan</button>
              <button type="button" onclick={() => editingId = null} class="font-medium text-sm" style="color: var(--text-tertiary);">Batal</button>
            </div>
          </form>
        {:else}
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded-full shrink-0" style="background-color: {sector.color || '#3b82f6'}"></div>
              <div>
                <h3 class="font-medium" style="color: var(--text-primary);">{sector.name}</h3>
                <p class="text-xs" style="color: var(--text-tertiary);">{sector.description || '-'}</p>
              </div>
            </div>
            {#if sector.is_active === 1}
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0" style="background-color: rgba(16, 185, 129, 0.1); color: #10b981;">Aktif</span>
            {:else}
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0" style="background-color: var(--bg-tertiary); color: var(--text-tertiary);">Nonaktif</span>
            {/if}
          </div>
          <div class="flex items-center gap-3 pt-3" style="border-top: 1px solid var(--border-primary);">
            <button onclick={() => editingId = sector.id} class="text-sm font-medium" style="color: #3b82f6;">Edit</button>
            <form method="POST" action="?/delete" class="inline">
              <input type="hidden" name="id" value={sector.id} />
              <button type="submit" class="text-sm font-medium" style="color: #ef4444;" onclick={(e) => !confirm('Yakin ingin menghapus sektor ini?') && e.preventDefault()}>Hapus</button>
            </form>
          </div>
        {/if}
      </div>
    {:else}
      <div class="rounded-lg shadow-sm p-8 text-center" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
        <p style="color: var(--text-tertiary);">Belum ada sektor. Klik "Tambah Sektor" untuk membuat.</p>
      </div>
    {/each}
  </div>

  <!-- Desktop Table View -->
  <div class="hidden lg:block rounded-lg shadow-sm overflow-hidden" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
    <table class="w-full">
      <thead style="background-color: var(--bg-tertiary);">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-medium uppercase" style="color: var(--text-tertiary);">Sektor</th>
          <th class="px-4 py-3 text-left text-xs font-medium uppercase" style="color: var(--text-tertiary);">Deskripsi</th>
          <th class="px-4 py-3 text-left text-xs font-medium uppercase" style="color: var(--text-tertiary);">Status</th>
          <th class="px-4 py-3 text-right text-xs font-medium uppercase" style="color: var(--text-tertiary);">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y" style="border-color: var(--border-primary);">
        {#each sectors as sector}
          <tr style="background-color: var(--bg-secondary);" class="hover:bg-opacity-80">
            {#if editingId === sector.id}
              <td class="px-4 py-3" colspan="4">
                <form method="POST" action="?/update" class="flex items-center gap-4 flex-wrap">
                  <input type="hidden" name="id" value={sector.id} />
                  <input type="text" name="name" value={sector.name} class="input flex-1 min-w-[150px]" required />
                  <div class="flex gap-2">
                    {#each colorOptions as color}
                      <label class="cursor-pointer">
                        <input type="radio" name="color" value={color} class="sr-only peer" checked={color === sector.color} />
                        <div class="w-6 h-6 rounded-full border-2 border-transparent peer-checked:scale-110 transition-all" style="background-color: {color}; --tw-border-opacity: 1; border-color: var(--text-primary);"></div>
                      </label>
                    {/each}
                  </div>
                  <input type="text" name="description" value={sector.description || ''} class="input w-48" />
                  <select name="is_active" class="input w-32">
                    <option value="1" selected={sector.is_active === 1}>Aktif</option>
                    <option value="0" selected={sector.is_active === 0}>Nonaktif</option>
                  </select>
                  <div class="flex gap-2">
                    <button type="submit" class="font-medium text-sm" style="color: #10b981;">Simpan</button>
                    <button type="button" onclick={() => editingId = null} class="font-medium text-sm" style="color: var(--text-tertiary);">Batal</button>
                  </div>
                </form>
              </td>
            {:else}
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-4 h-4 rounded-full" style="background-color: {sector.color || '#3b82f6'}"></div>
                  <span class="font-medium" style="color: var(--text-primary);">{sector.name}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-sm" style="color: var(--text-secondary);">{sector.description || '-'}</td>
              <td class="px-4 py-3">
                {#if sector.is_active === 1}
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style="background-color: rgba(16, 185, 129, 0.1); color: #10b981;">Aktif</span>
                {:else}
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style="background-color: var(--bg-tertiary); color: var(--text-tertiary);">Nonaktif</span>
                {/if}
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-3">
                  <button onclick={() => editingId = sector.id} class="text-sm font-medium" style="color: #3b82f6;">Edit</button>
                  <form method="POST" action="?/delete" class="inline">
                    <input type="hidden" name="id" value={sector.id} />
                    <button type="submit" class="text-sm font-medium" style="color: #ef4444;" onclick={(e) => !confirm('Yakin ingin menghapus sektor ini?') && e.preventDefault()}>Hapus</button>
                  </form>
                </div>
              </td>
            {/if}
          </tr>
        {:else}
          <tr>
            <td colspan="4" class="px-4 py-8 text-center" style="color: var(--text-tertiary);">Belum ada sektor. Klik "Tambah Sektor" untuk membuat.</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

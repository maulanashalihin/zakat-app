<script>
  let { data, form } = $props();
  
  const organization = data.organization;
  const periods = data.periods;
  
  let showAddForm = $state(false);
  let editingId = $state(null);
  
  // Get current year for defaults
  const currentYearMasehi = new Date().getFullYear();
  const currentYearHijri = Math.floor((currentYearMasehi - 622) * 0.97) + 1;
</script>

<svelte:head>
  <title>Master Periode - {organization.name} | ZakatApp</title>
</svelte:head>

<div class="p-4 lg:p-6" style="background-color: var(--bg-primary); min-height: 100%;">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 lg:mb-6">
    <div>
      <h1 class="text-xl lg:text-2xl font-bold" style="color: var(--text-primary);">Master Periode</h1>
      <p class="text-sm lg:text-base" style="color: var(--text-secondary);">Kelola periode pengumpulan zakat</p>
    </div>
    <button onclick={() => showAddForm = !showAddForm} class="btn-primary text-sm lg:text-base px-3 py-2 lg:px-4 lg:py-2 self-start">
      {#if showAddForm}
        Batal
      {:else}
        <svg class="w-4 h-4 mr-1 lg:mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Periode
      {/if}
    </button>
  </div>

  <!-- Add Form -->
  {#if showAddForm}
    <div class="rounded-lg shadow-sm p-4 lg:p-6 mb-4 lg:mb-6" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
      <h3 class="text-base lg:text-lg font-medium mb-3 lg:mb-4" style="color: var(--text-primary);">Tambah Periode Baru</h3>
      <form method="POST" action="?/create" class="space-y-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="lg:col-span-2">
            <label class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Nama Periode <span style="color: var(--error);">*</span></label>
            <input type="text" name="name" class="input w-full" required placeholder="Contoh: Ramadhan 1446 H" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Tahun Hijriyah <span style="color: var(--error);">*</span></label>
            <input type="number" name="yearHijri" value={currentYearHijri} min="1400" max="1500" class="input w-full" required />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Tahun Masehi <span style="color: var(--error);">*</span></label>
            <input type="number" name="yearMasehi" value={currentYearMasehi} min="2000" max="2100" class="input w-full" required />
          </div>
          <div class="lg:col-span-2">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="isActive" value="1" class="sr-only peer" />
              <div class="w-11 h-6 rounded-full peer bg-gray-600 peer-checked:bg-green-500 relative transition-colors">
                <div class="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-5"></div>
              </div>
              <span class="text-sm" style="color: var(--text-secondary);">Jadikan periode aktif</span>
            </label>
            <p class="text-xs mt-1" style="color: var(--text-tertiary);">Periode aktif akan digunakan sebagai default untuk transaksi baru</p>
          </div>
        </div>
        {#if form?.error}
          <p class="text-sm" style="color: var(--error);">{form.error}</p>
        {/if}
        {#if form?.success}
          <p class="text-sm" style="color: var(--success);">{form.message}</p>
        {/if}
        <div class="flex justify-end">
          <button type="submit" class="btn-primary">Simpan</button>
        </div>
      </form>
    </div>
  {/if}

  <!-- Mobile Cards View -->
  <div class="lg:hidden space-y-3">
    {#each periods as period}
      <div class="rounded-lg shadow-sm p-4" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
        {#if editingId === period.id}
          <form method="POST" action="?/update" class="space-y-3">
            <input type="hidden" name="id" value={period.id} />
            <input type="text" name="name" value={period.name} class="input w-full" required />
            <div class="grid grid-cols-2 gap-3">
              <input type="number" name="yearHijri" value={period.year_hijri} min="1400" max="1500" class="input w-full" required />
              <input type="number" name="yearMasehi" value={period.year_masehi} min="2000" max="2100" class="input w-full" required />
            </div>
            <select name="isActive" class="input w-full">
              <option value="1" selected={period.is_active === 1}>Aktif</option>
              <option value="0" selected={period.is_active === 0}>Nonaktif</option>
            </select>
            <div class="flex gap-2">
              <button type="submit" class="font-medium text-sm" style="color: #10b981;">Simpan</button>
              <button type="button" onclick={() => editingId = null} class="font-medium text-sm" style="color: var(--text-tertiary);">Batal</button>
            </div>
          </form>
        {:else}
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="font-medium" style="color: var(--text-primary);">{period.name}</h3>
              <p class="text-xs" style="color: var(--text-tertiary);">{period.year_hijri} H / {period.year_masehi} M</p>
            </div>
            {#if period.is_active === 1}
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium shrink-0" style="background-color: rgba(16, 185, 129, 0.1); color: #10b981;">Aktif</span>
            {:else}
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium shrink-0" style="background-color: var(--bg-tertiary); color: var(--text-tertiary);">Nonaktif</span>
            {/if}
          </div>
          
          <div class="flex items-center gap-3 pt-3" style="border-top: 1px solid var(--border-primary);">
            {#if period.is_active !== 1}
              <form method="POST" action="?/setActive" class="inline">
                <input type="hidden" name="id" value={period.id} />
                <button type="submit" class="text-sm font-medium" style="color: #10b981;">Jadikan Aktif</button>
              </form>
            {/if}
            <button onclick={() => editingId = period.id} class="text-sm font-medium" style="color: #3b82f6;">Edit</button>
            <form method="POST" action="?/delete" class="inline">
              <input type="hidden" name="id" value={period.id} />
              <button type="submit" class="text-sm font-medium" style="color: #ef4444;" onclick={(e) => !confirm('Yakin ingin menghapus periode ini?') && e.preventDefault()}>Hapus</button>
            </form>
          </div>
        {/if}
      </div>
    {:else}
      <div class="rounded-lg shadow-sm p-8 text-center" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
        <p style="color: var(--text-tertiary);">Belum ada periode. Klik "Tambah Periode" untuk membuat.</p>
      </div>
    {/each}
  </div>

  <!-- Desktop Table View -->
  <div class="hidden lg:block rounded-lg shadow-sm overflow-hidden" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
    <table class="w-full">
      <thead style="background-color: var(--bg-tertiary);">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-medium uppercase" style="color: var(--text-tertiary);">Periode</th>
          <th class="px-4 py-3 text-left text-xs font-medium uppercase" style="color: var(--text-tertiary);">Tahun</th>
          <th class="px-4 py-3 text-left text-xs font-medium uppercase" style="color: var(--text-tertiary);">Status</th>
          <th class="px-4 py-3 text-right text-xs font-medium uppercase" style="color: var(--text-tertiary);">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y" style="border-color: var(--border-primary);">
        {#each periods as period}
          <tr style="background-color: var(--bg-secondary);" class="hover:bg-opacity-80">
            {#if editingId === period.id}
              <td class="px-4 py-3" colspan="4">
                <form method="POST" action="?/update" class="flex items-center gap-4 flex-wrap">
                  <input type="hidden" name="id" value={period.id} />
                  <input type="text" name="name" value={period.name} class="input flex-1 min-w-[200px]" required />
                  <input type="number" name="yearHijri" value={period.year_hijri} min="1400" max="1500" class="input w-28" required />
                  <input type="number" name="yearMasehi" value={period.year_masehi} min="2000" max="2100" class="input w-28" required />
                  <select name="isActive" class="input w-28">
                    <option value="1" selected={period.is_active === 1}>Aktif</option>
                    <option value="0" selected={period.is_active === 0}>Nonaktif</option>
                  </select>
                  <div class="flex gap-2">
                    <button type="submit" class="font-medium text-sm" style="color: #10b981;">Simpan</button>
                    <button type="button" onclick={() => editingId = null} class="font-medium text-sm" style="color: var(--text-tertiary);">Batal</button>
                  </div>
                </form>
              </td>
            {:else}
              <td class="px-4 py-3">
                <p class="font-medium" style="color: var(--text-primary);">{period.name}</p>
              </td>
              <td class="px-4 py-3 text-sm" style="color: var(--text-secondary);">{period.year_hijri} H / {period.year_masehi} M</td>
              <td class="px-4 py-3">
                {#if period.is_active === 1}
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style="background-color: rgba(16, 185, 129, 0.1); color: #10b981;">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    Aktif
                  </span>
                {:else}
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style="background-color: var(--bg-tertiary); color: var(--text-tertiary);">Nonaktif</span>
                {/if}
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-3">
                  {#if period.is_active !== 1}
                    <form method="POST" action="?/setActive" class="inline">
                      <input type="hidden" name="id" value={period.id} />
                      <button type="submit" class="text-sm font-medium" style="color: #10b981;">Jadikan Aktif</button>
                    </form>
                  {/if}
                  <button onclick={() => editingId = period.id} class="text-sm font-medium" style="color: #3b82f6;">Edit</button>
                  <form method="POST" action="?/delete" class="inline">
                    <input type="hidden" name="id" value={period.id} />
                    <button type="submit" class="text-sm font-medium" style="color: #ef4444;" onclick={(e) => !confirm('Yakin ingin menghapus periode ini?') && e.preventDefault()}>Hapus</button>
                  </form>
                </div>
              </td>
            {/if}
          </tr>
        {:else}
          <tr>
            <td colspan="4" class="px-4 py-8 text-center" style="color: var(--text-tertiary);">Belum ada periode. Klik "Tambah Periode" untuk membuat.</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

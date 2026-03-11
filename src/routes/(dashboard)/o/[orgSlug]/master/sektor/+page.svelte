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

<div class="p-6">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Master Sektor</h1>
      <p class="text-slate-600">Kelola wilayah/sektor pengumpulan zakat</p>
    </div>
    <button onclick={() => showAddForm = !showAddForm} class="btn-primary">
      {#if showAddForm}
        Batal
      {:else}
        <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Sektor
      {/if}
    </button>
  </div>

  <!-- Add Form -->
  {#if showAddForm}
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 class="text-lg font-medium text-slate-900 mb-4">Tambah Sektor Baru</h3>
      <form method="POST" action="?/create" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nama Sektor</label>
            <input type="text" name="name" class="input w-full" required placeholder="Contoh: Banjaran" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Warna</label>
            <div class="flex flex-wrap gap-2">
              {#each colorOptions as color}
                <label class="cursor-pointer">
                  <input type="radio" name="color" value={color} class="sr-only peer" checked={color === '#3b82f6'} />
                  <div class="w-8 h-8 rounded-full border-2 border-transparent peer-checked:border-slate-900 peer-checked:scale-110 transition-all" style="background-color: {color}"></div>
                </label>
              {/each}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
            <input type="text" name="description" class="input w-full" placeholder="Opsional" />
          </div>
        </div>
        {#if form?.error}
          <p class="text-red-500 text-sm">{form.error}</p>
        {/if}
        <div class="flex justify-end">
          <button type="submit" class="btn-primary">Simpan</button>
        </div>
      </form>
    </div>
  {/if}

  <!-- Table -->
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <table class="w-full">
      <thead class="bg-slate-50">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sektor</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Deskripsi</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
          <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        {#each sectors as sector}
          <tr class="hover:bg-slate-50">
            {#if editingId === sector.id}
              <td class="px-4 py-3" colspan="4">
                <form method="POST" action="?/update" class="flex items-center gap-4">
                  <input type="hidden" name="id" value={sector.id} />
                  <input type="text" name="name" value={sector.name} class="input flex-1" required />
                  <div class="flex gap-2">
                    {#each colorOptions as color}
                      <label class="cursor-pointer">
                        <input type="radio" name="color" value={color} class="sr-only peer" checked={color === sector.color} />
                        <div class="w-6 h-6 rounded-full border-2 border-transparent peer-checked:border-slate-900 peer-checked:scale-110 transition-all" style="background-color: {color}"></div>
                      </label>
                    {/each}
                  </div>
                  <input type="text" name="description" value={sector.description || ''} class="input w-48" />
                  <select name="is_active" class="input w-32">
                    <option value="1" selected={sector.is_active === 1}>Aktif</option>
                    <option value="0" selected={sector.is_active === 0}>Nonaktif</option>
                  </select>
                  <div class="flex gap-2">
                    <button type="submit" class="text-green-600 hover:text-green-800 font-medium text-sm">Simpan</button>
                    <button type="button" onclick={() => editingId = null} class="text-slate-500 hover:text-slate-700 font-medium text-sm">Batal</button>
                  </div>
                </form>
              </td>
            {:else}
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-4 h-4 rounded-full" style="background-color: {sector.color || '#3b82f6'}"></div>
                  <span class="font-medium text-slate-900">{sector.name}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-slate-600 text-sm">{sector.description || '-'}</td>
              <td class="px-4 py-3">
                {#if sector.is_active === 1}
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Aktif
                  </span>
                {:else}
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    Nonaktif
                  </span>
                {/if}
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-3">
                  <button onclick={() => editingId = sector.id} class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Edit
                  </button>
                  <form method="POST" action="?/delete" class="inline">
                    <input type="hidden" name="id" value={sector.id} />
                    <button type="submit" class="text-red-600 hover:text-red-800 text-sm font-medium" onclick={(e) => !confirm('Yakin ingin menghapus sektor ini?') && e.preventDefault()}>
                      Hapus
                    </button>
                  </form>
                </div>
              </td>
            {/if}
          </tr>
        {:else}
          <tr>
            <td colspan="4" class="px-4 py-8 text-center text-slate-500">
              Belum ada sektor. Klik "Tambah Sektor" untuk membuat.
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

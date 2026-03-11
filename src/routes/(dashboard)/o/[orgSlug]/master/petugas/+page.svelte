<script>
  let { data, form } = $props();
  
  const organization = data.organization;
  const sectors = data.sectors;
  const users = data.users;
  const user = data.user;
  
  let showAddForm = $state(false);
  let editingId = $state(null);
  
  function formatDate(timestamp) {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('id-ID');
  }
  
  function getRoleLabel(role) {
    const labels = {
      'super_admin': 'Super Admin',
      'admin': 'Admin',
      'petugas': 'Petugas',
      'viewer': 'Viewer'
    };
    return labels[role] || role;
  }
  
  function getRoleBadgeColor(role) {
    const colors = {
      'super_admin': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      'admin': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      'petugas': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'viewer': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  }
</script>

<svelte:head>
  <title>Master Petugas - {organization.name} | ZakatApp</title>
</svelte:head>

<div class="p-4 lg:p-6" style="background-color: var(--bg-primary); min-height: 100%;">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 lg:mb-6">
    <div>
      <h1 class="text-xl lg:text-2xl font-bold" style="color: var(--text-primary);">Master Petugas</h1>
      <p class="text-sm lg:text-base" style="color: var(--text-secondary);">Kelola tim pengurus zakat</p>
    </div>
    <button onclick={() => showAddForm = !showAddForm} class="btn-primary text-sm lg:text-base px-3 py-2 lg:px-4 lg:py-2 self-start">
      {#if showAddForm}
        Batal
      {:else}
        <svg class="w-4 h-4 mr-1 lg:mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Petugas
      {/if}
    </button>
  </div>

  <!-- Add Form -->
  {#if showAddForm}
    <div class="rounded-lg shadow-sm p-4 lg:p-6 mb-4 lg:mb-6" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
      <h3 class="text-base lg:text-lg font-medium mb-3 lg:mb-4" style="color: var(--text-primary);">Tambah Petugas Baru</h3>
      <form method="POST" action="?/create" class="space-y-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Nama Lengkap <span style="color: var(--error);">*</span></label>
            <input type="text" name="name" class="input w-full" required placeholder="Nama petugas" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Email <span style="color: var(--error);">*</span></label>
            <input type="email" name="email" class="input w-full" required placeholder="email@example.com" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Peran <span style="color: var(--error);">*</span></label>
            <select name="role" class="input w-full" required>
              <option value="">Pilih Peran</option>
              <option value="admin">Admin</option>
              <option value="petugas">Petugas</option>
              <option value="viewer">Viewer (Hanya Lihat)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Sektor (Opsional)</label>
            <select name="sectorId" class="input w-full">
              <option value="">Semua Sektor</option>
              {#each sectors as sector}
                <option value={sector.id}>{sector.name}</option>
              {/each}
            </select>
            <p class="text-xs mt-1" style="color: var(--text-tertiary);">Untuk membatasi akses petugas ke sektor tertentu</p>
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
    {#each users as u}
      {@const sector = sectors.find(s => s.id === u.sector_id)}
      <div class="rounded-lg shadow-sm p-4" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
        {#if editingId === u.id}
          <form method="POST" action="?/update" class="space-y-3">
            <input type="hidden" name="id" value={u.id} />
            <input type="text" name="name" value={u.name} class="input w-full" required />
            <select name="role" class="input w-full" required>
              <option value="admin" selected={u.role === 'admin'}>Admin</option>
              <option value="petugas" selected={u.role === 'petugas'}>Petugas</option>
              <option value="viewer" selected={u.role === 'viewer'}>Viewer</option>
            </select>
            <select name="sectorId" class="input w-full">
              <option value="">Semua Sektor</option>
              {#each sectors as sector}
                <option value={sector.id} selected={u.sector_id === sector.id}>{sector.name}</option>
              {/each}
            </select>
            <select name="isActive" class="input w-full">
              <option value="1" selected={u.is_active === 1}>Aktif</option>
              <option value="0" selected={u.is_active === 0}>Nonaktif</option>
            </select>
            <div class="flex gap-2">
              <button type="submit" class="font-medium text-sm" style="color: #10b981;">Simpan</button>
              <button type="button" onclick={() => editingId = null} class="font-medium text-sm" style="color: var(--text-tertiary);">Batal</button>
            </div>
          </form>
        {:else}
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0" style="background-color: var(--bg-tertiary); color: var(--text-primary);">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 class="font-medium" style="color: var(--text-primary);">{u.name}</h3>
                <p class="text-xs" style="color: var(--text-tertiary);">{u.email}</p>
              </div>
            </div>
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium shrink-0 {getRoleBadgeColor(u.role)}">
              {getRoleLabel(u.role)}
            </span>
          </div>
          
          <div class="space-y-1 text-sm mb-3">
            {#if sector}
              <p style="color: var(--text-secondary);">Sektor: <span style="color: var(--text-primary);">{sector.name}</span></p>
            {/if}
            <p style="color: var(--text-secondary);">Status: 
              {#if u.is_active === 1}
                <span style="color: #10b981;">Aktif</span>
              {:else}
                <span style="color: var(--text-tertiary);">Nonaktif</span>
              {/if}
            </p>
            <p style="color: var(--text-tertiary);">Ditambahkan: {formatDate(u.created_at)}</p>
          </div>
          
          <div class="flex items-center gap-3 pt-3" style="border-top: 1px solid var(--border-primary);">
            {#if u.id !== user.id}
              <button onclick={() => editingId = u.id} class="text-sm font-medium" style="color: #3b82f6;">Edit</button>
              <form method="POST" action="?/delete" class="inline">
                <input type="hidden" name="id" value={u.id} />
                <button type="submit" class="text-sm font-medium" style="color: #ef4444;" onclick={(e) => !confirm('Yakin ingin menghapus petugas ini?') && e.preventDefault()}>Hapus</button>
              </form>
            {:else}
              <span class="text-xs" style="color: var(--text-tertiary);">(Akun Anda)</span>
            {/if}
          </div>
        {/if}
      </div>
    {:else}
      <div class="rounded-lg shadow-sm p-8 text-center" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
        <p style="color: var(--text-tertiary);">Belum ada petugas. Klik "Tambah Petugas" untuk membuat.</p>
      </div>
    {/each}
  </div>

  <!-- Desktop Table View -->
  <div class="hidden lg:block rounded-lg shadow-sm overflow-hidden" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
    <table class="w-full">
      <thead style="background-color: var(--bg-tertiary);">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-medium uppercase" style="color: var(--text-tertiary);">Petugas</th>
          <th class="px-4 py-3 text-left text-xs font-medium uppercase" style="color: var(--text-tertiary);">Peran</th>
          <th class="px-4 py-3 text-left text-xs font-medium uppercase" style="color: var(--text-tertiary);">Sektor</th>
          <th class="px-4 py-3 text-left text-xs font-medium uppercase" style="color: var(--text-tertiary);">Status</th>
          <th class="px-4 py-3 text-right text-xs font-medium uppercase" style="color: var(--text-tertiary);">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y" style="border-color: var(--border-primary);">
        {#each users as u}
          {@const sector = sectors.find(s => s.id === u.sector_id)}
          <tr style="background-color: var(--bg-secondary);" class="hover:bg-opacity-80">
            {#if editingId === u.id}
              <td class="px-4 py-3" colspan="5">
                <form method="POST" action="?/update" class="flex items-center gap-4 flex-wrap">
                  <input type="hidden" name="id" value={u.id} />
                  <input type="text" name="name" value={u.name} class="input flex-1 min-w-[150px]" required />
                  <select name="role" class="input w-32">
                    <option value="admin" selected={u.role === 'admin'}>Admin</option>
                    <option value="petugas" selected={u.role === 'petugas'}>Petugas</option>
                    <option value="viewer" selected={u.role === 'viewer'}>Viewer</option>
                  </select>
                  <select name="sectorId" class="input w-40">
                    <option value="">Semua Sektor</option>
                    {#each sectors as sector}
                      <option value={sector.id} selected={u.sector_id === sector.id}>{sector.name}</option>
                    {/each}
                  </select>
                  <select name="isActive" class="input w-28">
                    <option value="1" selected={u.is_active === 1}>Aktif</option>
                    <option value="0" selected={u.is_active === 0}>Nonaktif</option>
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
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0" style="background-color: var(--bg-tertiary); color: var(--text-primary);">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p class="font-medium" style="color: var(--text-primary);">{u.name}</p>
                    <p class="text-xs" style="color: var(--text-tertiary);">{u.email}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getRoleBadgeColor(u.role)}">
                  {getRoleLabel(u.role)}
                </span>
              </td>
              <td class="px-4 py-3 text-sm" style="color: var(--text-secondary);">{sector?.name || '-'}</td>
              <td class="px-4 py-3">
                {#if u.is_active === 1}
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style="background-color: rgba(16, 185, 129, 0.1); color: #10b981;">Aktif</span>
                {:else}
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style="background-color: var(--bg-tertiary); color: var(--text-tertiary);">Nonaktif</span>
                {/if}
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-3">
                  {#if u.id !== user.id}
                    <button onclick={() => editingId = u.id} class="text-sm font-medium" style="color: #3b82f6;">Edit</button>
                    <form method="POST" action="?/delete" class="inline">
                      <input type="hidden" name="id" value={u.id} />
                      <button type="submit" class="text-sm font-medium" style="color: #ef4444;" onclick={(e) => !confirm('Yakin ingin menghapus petugas ini?') && e.preventDefault()}>Hapus</button>
                    </form>
                  {:else}
                    <span class="text-xs" style="color: var(--text-tertiary);">(Anda)</span>
                  {/if}
                </div>
              </td>
            {/if}
          </tr>
        {:else}
          <tr>
            <td colspan="5" class="px-4 py-8 text-center" style="color: var(--text-tertiary);">Belum ada petugas. Klik "Tambah Petugas" untuk membuat.</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

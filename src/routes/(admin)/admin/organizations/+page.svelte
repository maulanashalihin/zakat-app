<script>
  let { data, form } = $props();
  
  const organizations = data.organizations;
  
  let showAddForm = $state(false);
  
  function formatDate(timestamp) {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('id-ID');
  }
</script>

<svelte:head>
  <title>Kelola Organisasi | ZakatApp</title>
</svelte:head>

<div class="p-6">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Kelola Organisasi</h1>
      <p class="text-slate-600">Semua lembaga/masjid dalam platform</p>
    </div>
    <button onclick={() => showAddForm = !showAddForm} class="btn-primary">
      {#if showAddForm}
        Batal
      {:else}
        <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Buat Organisasi
      {/if}
    </button>
  </div>

  <!-- Add Form -->
  {#if showAddForm}
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 class="text-lg font-medium text-slate-900 mb-4">Buat Organisasi Baru</h3>
      <form method="POST" action="?/create" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nama Organisasi</label>
            <input type="text" name="name" class="input w-full" required placeholder="Masjid Al-Hidayah" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" name="email" class="input w-full" placeholder="info@example.com" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Telepon</label>
            <input type="tel" name="phone" class="input w-full" placeholder="08123456789" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
            <input type="text" name="address" class="input w-full" placeholder="Alamat lengkap" />
          </div>
        </div>
        {#if form?.error}
          <p class="text-red-500 text-sm">{form.error}</p>
        {/if}
        <div class="flex justify-end">
          <button type="submit" class="btn-primary">Buat Organisasi</button>
        </div>
      </form>
    </div>
  {/if}

  <!-- Table -->
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <table class="w-full">
      <thead class="bg-slate-50">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Organisasi</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Kontak</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Statistik</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Dibuat</th>
          <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        {#each organizations as org}
          <tr class="hover:bg-slate-50">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {org.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p class="font-medium text-slate-900">{org.name}</p>
                  <p class="text-xs text-slate-500">/{org.slug}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-sm text-slate-600">
              {#if org.email}<div>{org.email}</div>{/if}
              {#if org.phone}<div>{org.phone}</div>{/if}
            </td>
            <td class="px-4 py-3 text-sm text-slate-600">
              <div>{org.userCount} users</div>
              <div>{org.muzakiCount} muzaki</div>
            </td>
            <td class="px-4 py-3 text-slate-500 text-sm">{formatDate(org.created_at)}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-3">
                <a href="/o/{org.slug}/dashboard" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Lihat
                </a>
                <form method="POST" action="?/delete" class="inline">
                  <input type="hidden" name="id" value={org.id} />
                  <button type="submit" class="text-red-600 hover:text-red-800 text-sm font-medium" onclick={(e) => !confirm('Yakin ingin menghapus organisasi ini? Semua data akan hilang.') && e.preventDefault()}>
                    Hapus
                  </button>
                </form>
              </div>
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="5" class="px-4 py-8 text-center text-slate-500">
              Belum ada organisasi
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

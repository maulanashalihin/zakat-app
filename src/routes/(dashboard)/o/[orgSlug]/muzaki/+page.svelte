<script>
  let { data } = $props();
  
  const organization = data.organization;
  const sectors = data.sectors;
  const muzaki = data.muzaki;
  const user = data.user;
  
  function formatDate(timestamp) {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('id-ID');
  }
  
  function formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(num);
  }
</script>

<div class="p-6">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Data Muzaki</h1>
      <p class="text-slate-600">Pembayar zakat fitrah</p>
    </div>
    {#if user.role === 'admin' || user.role === 'petugas' || user.role === 'super_admin'}
      <a href="/o/{organization.slug}/muzaki/tambah" class="btn-primary">
        <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Muzaki
      </a>
    {/if}
  </div>

  <!-- Filters -->
  <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
    <form class="flex flex-wrap gap-4">
      <div class="flex-1 min-w-[200px]">
        <input
          type="text"
          name="search"
          placeholder="Cari nama..."
          class="input w-full"
        />
      </div>
      {#if user.role !== 'petugas'}
        <div class="w-48">
          <select name="sector" class="input w-full">
            <option value="">Semua Sektor</option>
            {#each sectors as sector}
              <option value={sector.id}>{sector.name}</option>
            {/each}
          </select>
        </div>
      {/if}
      <button type="submit" class="btn-secondary">Filter</button>
    </form>
  </div>

  <!-- Table -->
  <div class="bg-white rounded-lg shadow-sm overflow-hidden">
    <table class="w-full">
      <thead class="bg-slate-50">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Nama</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Alamat</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sektor</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Jiwa</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Zakat</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tanggal</th>
          <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Aksi</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-100">
        {#each muzaki as m}
          {@const sector = sectors.find(s => s.id === m.sector_id)}
          <tr class="hover:bg-slate-50">
            <td class="px-4 py-3 font-medium text-slate-900">{m.name}</td>
            <td class="px-4 py-3 text-slate-600 text-sm truncate max-w-xs">{m.address}</td>
            <td class="px-4 py-3">
              {#if sector}
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style="background-color: {sector.color || '#3b82f6'}20; color: {sector.color || '#3b82f6'}">
                  {sector.name}
                </span>
              {:else}
                <span class="text-slate-400">-</span>
              {/if}
            </td>
            <td class="px-4 py-3 text-slate-600">{m.jumlah_jiwa}</td>
            <td class="px-4 py-3">
              <div class="text-sm">
                {#if m.jenis_zakat === 'beras' || m.jenis_zakat === 'keduanya'}
                  <span class="text-amber-600">{m.jumlah_beras} kg beras</span>
                {/if}
                {#if m.jenis_zakat === 'uang' || m.jenis_zakat === 'keduanya'}
                  <span class="text-emerald-600">Rp {formatNumber(m.jumlah_uang)}</span>
                {/if}
              </div>
            </td>
            <td class="px-4 py-3 text-slate-500 text-sm">{formatDate(m.created_at)}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex items-center justify-end gap-2">
                <a href="/o/{organization.slug}/muzaki/{m.id}" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Edit
                </a>
                <form method="POST" action="?/delete" class="inline">
                  <input type="hidden" name="id" value={m.id} />
                  <button type="submit" class="text-red-600 hover:text-red-800 text-sm font-medium" onclick={(e) => !confirm('Yakin ingin menghapus?') && e.preventDefault()}>
                    Hapus
                  </button>
                </form>
              </div>
            </td>
          </tr>
        {:else}
          <tr>
            <td colspan="7" class="px-4 py-8 text-center text-slate-500">
              <div class="flex flex-col items-center">
                <svg class="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>Belum ada data muzaki</p>
                <a href="/o/{organization.slug}/muzaki/tambah" class="text-blue-600 hover:text-blue-800 mt-2">Tambah data pertama</a>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

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

<svelte:head>
  <title>Data Muzaki - {organization.name} | ZakatApp</title>
</svelte:head>

<div class="p-4 lg:p-6" style="background-color: var(--bg-primary); min-height: 100%;">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 lg:mb-6">
    <div>
      <h1 class="text-xl lg:text-2xl font-bold" style="color: var(--text-primary);">Data Muzaki</h1>
      <p class="text-sm lg:text-base" style="color: var(--text-secondary);">Pembayar zakat fitrah</p>
    </div>
    {#if user.role === 'admin' || user.role === 'petugas' || user.role === 'super_admin'}
      <a href="/o/{organization.slug}/muzaki/tambah" class="btn-primary text-sm lg:text-base px-3 py-2 lg:px-4 lg:py-2 self-start">
        <svg class="w-4 h-4 mr-1 lg:mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Muzaki
      </a>
    {/if}
  </div>

  <!-- Filters -->
  <div class="rounded-lg shadow-sm p-3 lg:p-4 mb-4 lg:mb-6" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
    <form class="flex flex-col sm:flex-row gap-3">
      <div class="flex-1 min-w-0">
        <input
          type="text"
          name="search"
          placeholder="Cari nama..."
          class="input w-full text-sm lg:text-base"
        />
      </div>
      <div class="min-w-[140px]">
        <select name="sector" class="input w-full text-sm lg:text-base">
          <option value="">Semua Sektor</option>
          {#each sectors as sector}
            <option value={sector.id}>{sector.name}</option>
          {/each}
        </select>
      </div>
      <div class="min-w-[120px]">
        <select name="type" class="input w-full text-sm lg:text-base">
          <option value="">Semua Jenis</option>
          <option value="beras">Beras</option>
          <option value="uang">Uang</option>
        </select>
      </div>
      <button type="submit" class="btn-secondary text-sm lg:text-base px-3 py-2">
        Filter
      </button>
    </form>
  </div>

  <!-- Table -->
  <div class="rounded-lg shadow-sm overflow-hidden" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
    <div class="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0">
      <table class="w-full min-w-[700px] lg:min-w-0">
        <thead>
          <tr style="background-color: var(--bg-tertiary);">
            <th class="px-2 lg:px-4 py-3 text-left text-xs lg:text-sm font-medium" style="color: var(--text-secondary);">No</th>
            <th class="px-2 lg:px-4 py-3 text-left text-xs lg:text-sm font-medium" style="color: var(--text-secondary);">Nama</th>
            <th class="px-2 lg:px-4 py-3 text-left text-xs lg:text-sm font-medium" style="color: var(--text-secondary);">Sektor</th>
            <th class="px-2 lg:px-4 py-3 text-left text-xs lg:text-sm font-medium" style="color: var(--text-secondary);">Jiwa</th>
            <th class="px-2 lg:px-4 py-3 text-left text-xs lg:text-sm font-medium" style="color: var(--text-secondary);">Jenis</th>
            <th class="px-2 lg:px-4 py-3 text-left text-xs lg:text-sm font-medium" style="color: var(--text-secondary);">Jumlah</th>
            <th class="px-2 lg:px-4 py-3 text-left text-xs lg:text-sm font-medium" style="color: var(--text-secondary);">Tanggal</th>
            <th class="px-2 lg:px-4 py-3 text-left text-xs lg:text-sm font-medium" style="color: var(--text-secondary);">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y" style="border-color: var(--border-primary);">
          {#each muzaki as m, i}
            <tr style="background-color: var(--bg-secondary);">
              <td class="px-2 lg:px-4 py-3 text-xs lg:text-sm" style="color: var(--text-secondary);">{i + 1}</td>
              <td class="px-2 lg:px-4 py-3 text-xs lg:text-sm font-medium truncate max-w-[120px] lg:max-w-none" style="color: var(--text-primary);">
                {m.name}
              </td>
              <td class="px-2 lg:px-4 py-3 text-xs lg:text-sm truncate max-w-[100px] lg:max-w-none" style="color: var(--text-secondary);">{m.sector_name}</td>
              <td class="px-2 lg:px-4 py-3 text-xs lg:text-sm" style="color: var(--text-secondary);">{m.jumlah_jiwa}</td>
              <td class="px-2 lg:px-4 py-3 text-xs lg:text-sm">
                <span class="inline-flex px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full text-xs font-medium"
                  style="background-color: {m.jenis_zakat === 'beras' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)'}; color: {m.jenis_zakat === 'beras' ? '#f59e0b' : '#10b981'};">
                  {m.jenis_zakat === 'beras' ? 'Beras' : 'Uang'}
                </span>
              </td>
              <td class="px-2 lg:px-4 py-3 text-xs lg:text-sm font-medium" style="color: var(--text-primary);">
                {#if m.jenis_zakat === 'beras'}
                  {formatNumber(m.jumlah_beras)} kg
                {:else if m.jenis_zakat === 'uang'}
                  Rp {formatNumber(m.jumlah_uang)}
                {:else}
                  Mixed
                {/if}
              </td>
              <td class="px-2 lg:px-4 py-3 text-xs lg:text-sm" style="color: var(--text-tertiary);">{formatDate(m.created_at)}</td>
              <td class="px-2 lg:px-4 py-3">
                <div class="flex items-center gap-1 lg:gap-2">
                  <a href="/o/{organization.slug}/muzaki/{m.id}/edit" class="p-1.5 lg:p-2 rounded-lg hover:opacity-80" style="color: #3b82f6;" title="Edit">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </a>
                  {#if user.role === 'admin' || user.role === 'super_admin'}
                    <form action="/o/{organization.slug}/muzaki/{m.id}/hapus" method="POST" class="inline" onsubmit={(e) => !confirm('Yakin ingin menghapus?') && e.preventDefault()}>
                      <button type="submit" class="p-1.5 lg:p-2 rounded-lg hover:opacity-80" style="color: #ef4444;" title="Hapus">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </form>
                  {/if}
                </div>
              </td>
            </tr>
          {:else}
            <tr style="background-color: var(--bg-secondary);">
              <td colspan="8" class="px-4 py-8 text-center text-sm" style="color: var(--text-tertiary);">
                Belum ada data muzaki
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

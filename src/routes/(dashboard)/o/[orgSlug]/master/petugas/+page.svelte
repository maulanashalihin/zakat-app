<script>
  import { UsersRound, Plus, Edit, Trash2, Check, X, User, Mail, Shield } from 'lucide-svelte';

  let { data, form } = $props();

  const organization = data.organization;
  const sectors = data.sectors;
  const users = data.users;
  const user = data.user;

  let showAddForm = $state(false);
  let editingId = $state(null);

  function formatDate(timestamp) {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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

  function getRoleColor(role) {
    const colors = {
      'super_admin': 'from-purple-400 to-purple-600',
      'admin': 'from-blue-400 to-blue-600',
      'petugas': 'from-green-400 to-green-600',
      'viewer': 'from-slate-400 to-slate-600'
    };
    return colors[role] || 'from-slate-400 to-slate-600';
  }
</script>

<svelte:head>
  <title>Master Petugas - {organization.name} | ZakatApp</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 lg:p-8">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <div>
      <h1 class="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Master Petugas</h1>
      <p class="text-slate-600 dark:text-slate-400 font-medium mt-1">Kelola tim pengurus zakat</p>
    </div>
    <button onclick={() => showAddForm = !showAddForm} class="inline-flex items-center justify-center gap-2 py-4 px-6 {showAddForm ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200' : 'bg-primary-600 hover:bg-primary-500 text-white'} rounded-xl font-bold text-lg transition-all">
      {#if showAddForm}
        <X class="w-5 h-5" />
        Batal
      {:else}
        <Plus class="w-5 h-5" />
        Tambah Petugas
      {/if}
    </button>
  </div>

  <!-- Add Form -->
  {#if showAddForm}
    <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8 mb-8">
      <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">Tambah Petugas Baru</h3>
      <form method="POST" action="?/create" class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama Lengkap <span class="text-red-500">*</span></label>
            <div class="relative">
              <User class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="text" name="name" class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium" required placeholder="Nama petugas" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email <span class="text-red-500">*</span></label>
            <div class="relative">
              <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input type="email" name="email" class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium" required placeholder="email@example.com" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Peran <span class="text-red-500">*</span></label>
            <div class="relative">
              <Shield class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select name="role" class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium appearance-none cursor-pointer" required>
                <option value="">Pilih Peran</option>
                <option value="admin">Admin</option>
                <option value="petugas">Petugas</option>
                <option value="viewer">Viewer (Hanya Lihat)</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Sektor (Opsional)</label>
            <div class="relative">
              <UsersRound class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select name="sectorId" class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium appearance-none cursor-pointer">
                <option value="">Semua Sektor</option>
                {#each sectors as sector}
                  <option value={sector.id}>{sector.name}</option>
                {/each}
              </select>
            </div>
            <p class="text-xs mt-2 text-slate-500 dark:text-slate-400 font-medium">Untuk membatasi akses petugas ke sektor tertentu</p>
          </div>
        </div>
        {#if form?.error}
          <div class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p class="text-sm text-red-600 dark:text-red-400 font-medium">{form.error}</p>
          </div>
        {/if}
        {#if form?.success}
          <div class="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <p class="text-sm text-green-600 dark:text-green-400 font-medium">{form.message}</p>
          </div>
        {/if}
        <div class="flex justify-end gap-3">
          <button type="submit" class="inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1">
            <Check class="w-5 h-5" />
            Simpan
          </button>
        </div>
      </form>
    </div>
  {/if}

  <!-- Petugas Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {#each users as u}
      {@const sector = sectors.find(s => s.id === u.sector_id)}
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] overflow-hidden group hover:-translate-y-1 transition-all duration-300">
        <div class="p-6">
          {#if editingId === u.id}
            <!-- Edit Mode -->
            <form method="POST" action="?/update" class="space-y-4">
              <input type="hidden" name="id" value={u.id} />
              <div>
                <input type="text" name="name" value={u.name} class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold" required />
              </div>
              <div>
                <select name="role" class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold">
                  <option value="admin" selected={u.role === 'admin'}>Admin</option>
                  <option value="petugas" selected={u.role === 'petugas'}>Petugas</option>
                  <option value="viewer" selected={u.role === 'viewer'}>Viewer</option>
                </select>
              </div>
              <div>
                <select name="sectorId" class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                  <option value="">Semua Sektor</option>
                  {#each sectors as sector}
                    <option value={sector.id} selected={u.sector_id === sector.id}>{sector.name}</option>
                  {/each}
                </select>
              </div>
              <div>
                <select name="isActive" class="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold">
                  <option value="1" selected={u.is_active === 1}>✓ Aktif</option>
                  <option value="0" selected={u.is_active === 0}>○ Nonaktif</option>
                </select>
              </div>
              <div class="flex gap-3 pt-2">
                <button type="submit" class="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all">
                  <Check class="w-5 h-5 inline mr-1" />
                  Simpan
                </button>
                <button type="button" onclick={() => editingId = null} class="flex-1 py-3 px-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition-all">
                  Batal
                </button>
              </div>
            </form>
          {:else}
            <!-- View Mode -->
            <div class="flex items-start gap-4 mb-4">
              <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-extrabold text-white shadow-lg shrink-0 bg-gradient-to-br {getRoleColor(u.role)}">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xl font-extrabold text-slate-900 dark:text-white truncate">{u.name}</h3>
                <div class="flex items-center gap-2 mt-1">
                  <Mail class="w-4 h-4 text-slate-400" />
                  <p class="text-sm text-slate-600 dark:text-slate-400 truncate">{u.email}</p>
                </div>
                <div class="flex items-center gap-2 mt-2">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r {getRoleColor(u.role)} text-white">
                    {getRoleLabel(u.role)}
                  </span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold {u.is_active === 1 ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}">
                    {u.is_active === 1 ? '✓ Aktif' : '○ Nonaktif'}
                  </span>
                </div>
              </div>
            </div>

            <div class="space-y-3 mb-4 pb-4 border-t border-slate-200 dark:border-slate-700 pt-4">
              {#if sector}
                <div class="flex items-center gap-2 text-sm">
                  <UsersRound class="w-4 h-4 text-slate-400" />
                  <span class="text-slate-600 dark:text-slate-400 font-medium">Sektor:</span>
                  <span class="text-slate-900 dark:text-white font-bold">{sector.name}</span>
                </div>
              {/if}
              <div class="flex items-center gap-2 text-sm">
                <Shield class="w-4 h-4 text-slate-400" />
                <span class="text-slate-600 dark:text-slate-400 font-medium">Bergabung:</span>
                <span class="text-slate-900 dark:text-white font-bold">{formatDate(u.created_at)}</span>
              </div>
            </div>

            <div class="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              {#if u.id !== user.id}
                <button onclick={() => editingId = u.id} class="flex-1 py-3 px-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                  <Edit class="w-4 h-4" />
                  Edit
                </button>
                <form method="POST" action="?/delete" class="flex-1 inline" onsubmit={(e) => !confirm('Yakin ingin menghapus petugas ini?') && e.preventDefault()}>
                  <input type="hidden" name="id" value={u.id} />
                  <button type="submit" class="w-full py-3 px-4 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                    <Trash2 class="w-4 h-4" />
                    Hapus
                  </button>
                </form>
              {:else}
                <span class="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-center">
                  • Akun Anda
                </span>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    {:else}
      <div class="col-span-full">
        <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-12 text-center">
          <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <UsersRound class="w-12 h-12 text-slate-400" />
          </div>
          <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Belum ada petugas</h3>
          <p class="text-slate-500 dark:text-slate-400 font-medium">Klik "Tambah Petugas" untuk membuat tim Anda</p>
        </div>
      </div>
    {/each}
  </div>
</div>

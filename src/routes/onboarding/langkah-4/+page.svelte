<script>
  let { data, form } = $props();
  
  const user = $derived(data.user);
  const errors = $derived(form?.errors || {});
</script>

<svelte:head>
  <title>Setup Tim - ZakatApp</title>
</svelte:head>

<div class="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-6">
  <div class="mb-6">
    <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Daftar Tim</h2>
    <p class="text-slate-600 dark:text-slate-400 mt-1">
      Tambahkan petugas yang akan membantu mengelola zakat
    </p>
  </div>

  <form method="POST" class="space-y-6">
    <!-- Admin Info Card -->
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div class="flex items-center">
        <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div class="ml-3">
          <p class="font-medium text-slate-900 dark:text-white">{user.name}</p>
          <p class="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
        </div>
        <span class="ml-auto px-2 py-1 text-xs font-medium rounded bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300">
          Admin
        </span>
      </div>
    </div>

    <!-- Team Members (optional) -->
    <div>
      <label for="teamEmails" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        Email Anggota Tim (opsional)
      </label>
      <textarea
        id="teamEmails"
        name="teamEmails"
        placeholder="Masukkan email petugas, pisahkan dengan koma atau baris baru"
        class="input w-full"
        rows="3"
      ></textarea>
      <p class="mt-1 text-xs text-slate-500">Contoh: petugas1@email.com, petugas2@email.com</p>
    </div>

    <!-- Role Selection -->
    <div>
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Role untuk Anggota Tim
      </label>
      <div class="space-y-2">
        <label class="flex items-center p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
          <input type="radio" name="teamRole" value="petugas" checked class="mr-3" />
          <div>
            <p class="font-medium text-slate-900 dark:text-white">Petugas</p>
            <p class="text-sm text-slate-500">Bisa mencatat dan mengedit data muzaki/mustahik</p>
          </div>
        </label>
        <label class="flex items-center p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
          <input type="radio" name="teamRole" value="viewer" class="mr-3" />
          <div>
            <p class="font-medium text-slate-900 dark:text-white">Viewer</p>
            <p class="text-sm text-slate-500">Hanya bisa melihat data, tidak bisa mengedit</p>
          </div>
        </label>
      </div>
    </div>

    {#if errors?.team}
      <p class="text-sm text-red-500">{errors.team}</p>
    {/if}

    <div class="flex justify-end gap-3 pt-4">
      <button type="submit" class="btn-primary px-8 py-3">
        Selesai →
      </button>
    </div>
  </form>
</div>

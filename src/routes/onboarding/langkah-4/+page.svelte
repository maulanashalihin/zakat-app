<script>
  import { Users, UserPlus, Eye, Shield, ArrowRight, Mail } from 'lucide-svelte';

  let { data, form } = $props();

  const user = $derived(data.user || { name: '', email: '' });
  const errors = $derived(form?.errors || {});
</script>

<svelte:head>
  <title>Setup Tim - ZakatApp</title>
</svelte:head>

<div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8 relative transform -rotate-1 hover:rotate-0 transition-transform duration-500">
  <div class="flex gap-2 mb-6 px-2">
    <div class="w-3 h-3 rounded-full bg-red-400"></div>
    <div class="w-3 h-3 rounded-full bg-amber-400"></div>
    <div class="w-3 h-3 rounded-full bg-green-400"></div>
  </div>

  <div class="mb-8">
    <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Daftar Tim</h2>
    <p class="text-slate-600 dark:text-slate-400 font-medium mt-1">
      Tambahkan petugas yang akan membantu mengelola zakat
    </p>
  </div>

  <form method="POST" class="space-y-6">
    <!-- Admin Info Card -->
    <div class="bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/20 rounded-2xl p-5 border border-primary-100 dark:border-primary-800">
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-primary-500/40">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div class="flex-1">
          <p class="font-extrabold text-slate-900 dark:text-white text-lg">{user.name}</p>
          <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">{user.email}</p>
        </div>
        <span class="px-3 py-1.5 text-xs font-bold rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
          Admin Utama
        </span>
      </div>
    </div>

    <!-- Team Members (optional) -->
    <div>
      <label for="teamEmails" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
        Email Anggota Tim <span class="text-slate-400 dark:text-slate-500 font-normal">(opsional)</span>
      </label>
      <div class="relative">
        <Mail class="absolute left-4 top-4 w-5 h-5 text-slate-400" />
        <textarea
          id="teamEmails"
          name="teamEmails"
          placeholder="Masukkan email petugas, pisahkan dengan koma atau baris baru"
          class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
          rows="3"
        ></textarea>
      </div>
      <p class="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">Contoh: petugas1@email.com, petugas2@email.com</p>
    </div>

    <!-- Role Selection -->
    <div>
      <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
        Role untuk Anggota Tim
      </label>
      <div class="space-y-3">
        <label class="flex items-center p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group">
          <input type="radio" name="teamRole" value="petugas" checked class="w-5 h-5 text-primary-600 focus:ring-primary-500" />
          <div class="ml-4 flex-1">
            <div class="flex items-center gap-2">
              <Users class="w-5 h-5 text-primary-600" />
              <p class="font-extrabold text-slate-900 dark:text-white">Petugas</p>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Bisa mencatat dan mengedit data muzaki/mustahik</p>
          </div>
        </label>
        <label class="flex items-center p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 cursor-pointer hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all group">
          <input type="radio" name="teamRole" value="viewer" class="w-5 h-5 text-primary-600 focus:ring-primary-500" />
          <div class="ml-4 flex-1">
            <div class="flex items-center gap-2">
              <Eye class="w-5 h-5 text-primary-600" />
              <p class="font-extrabold text-slate-900 dark:text-white">Viewer</p>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Hanya bisa melihat data, tidak bisa mengedit</p>
          </div>
        </label>
      </div>
    </div>

    {#if errors?.team}
      <p class="text-sm text-red-600 dark:text-red-400 font-medium">{errors.team}</p>
    {/if}

    <div class="pt-4">
      <button type="submit" class="w-full flex items-center justify-center gap-2 py-4 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1">
        Selesai
        <ArrowRight class="w-5 h-5" />
      </button>
    </div>
  </form>
</div>

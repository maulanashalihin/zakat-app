<script lang="ts">
  import { onMount } from 'svelte';
  import { Shield, Building2, ArrowLeft } from 'lucide-svelte';
  import { theme } from '$lib/stores/theme.svelte';

  onMount(() => {
    theme.init();
  });
</script>

<svelte:head>
  <title>Kebijakan Privasi - ZakatApp</title>
  <meta name="description" content="Kebijakan privasi ZakatApp - Bagaimana kami melindungi data Anda.">
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
  <header class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <a href="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-500/40">
            <Building2 class="w-5 h-5" />
          </div>
          <span class="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">Zakat<span class="text-primary-600 dark:text-primary-400">App</span></span>
        </a>
        <a href="/" class="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-bold transition-colors">
          <ArrowLeft class="w-5 h-5" />
          Kembali
        </a>
      </div>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 py-12">
    <div class="text-center mb-12">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg shadow-primary-500/40 mb-6">
        <Shield class="w-10 h-10 text-white" />
      </div>
      <h1 class="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Kebijakan Privasi</h1>
      <p class="text-lg text-slate-600 dark:text-slate-400 font-medium">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>

    <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8 space-y-8">
      <section>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">1. Informasi yang Kami Kumpulkan</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">
          Kami mengumpulkan informasi yang Anda berikan saat mendaftar, termasuk nama, email, nama organisasi, dan data terkait pengelolaan zakat.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">2. Bagaimana Kami Menggunakan Informasi</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">
          Informasi yang kami gunakan hanya untuk menyediakan dan meningkatkan layanan ZakatApp, termasuk:
        </p>
        <ul class="space-y-2 text-slate-600 dark:text-slate-400 font-medium ml-6">
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Menyediakan akses ke platform</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Mengirimkan notifikasi penting</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Meningkatkan kualitas layanan</span>
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">3. Keamanan Data</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Kami menggunakan enkripsi dan langkah-langkah keamanan industri standar untuk melindungi data Anda. Data organisasi Anda terisolasi dan tidak dapat diakses oleh organisasi lain.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">4. Berbagi Informasi</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Kami tidak menjual atau membagikan data Anda kepada pihak ketiga tanpa izin Anda, kecuali diwajibkan oleh hukum.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">5. Hak Anda</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">
          Anda memiliki hak untuk:
        </p>
        <ul class="space-y-2 text-slate-600 dark:text-slate-400 font-medium ml-6">
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Mengakses data Anda</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Memperbarui atau menghapus data</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Menghapus akun Anda kapan saja</span>
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">6. Kontak</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami.
        </p>
      </section>
    </div>
  </main>

  <footer class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 mt-12">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-slate-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-slate-900">
            <Building2 class="w-4 h-4" />
          </div>
          <span class="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">Zakat<span class="text-primary-600 dark:text-primary-400">App</span></span>
        </div>
        <div class="flex flex-wrap justify-center gap-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <a href="/panduan" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Panduan</a>
          <a href="/kebijakan-privasi" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Kebijakan Privasi</a>
          <a href="/syarat-ketentuan" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Syarat & Ketentuan</a>
        </div>
        <div class="text-sm text-slate-400 dark:text-slate-500 font-medium">
          &copy; {new Date().getFullYear()} ZakatApp. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
</div>

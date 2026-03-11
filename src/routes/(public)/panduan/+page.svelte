<script lang="ts">
  import { onMount } from 'svelte';
  import { BookOpen, CheckCircle, Users, Building2, ArrowLeft } from 'lucide-svelte';
  import { theme } from '$lib/stores/theme.svelte';

  onMount(() => {
    theme.init();
  });
</script>

<svelte:head>
  <title>Panduan Penggunaan - ZakatApp</title>
  <meta name="description" content="Panduan lengkap menggunakan ZakatApp untuk mengelola zakat fitrah masjid dan lembaga amil zakat.">
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
  <!-- Header -->
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

  <!-- Content -->
  <main class="max-w-4xl mx-auto px-4 py-12">
    <!-- Hero -->
    <div class="text-center mb-12">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg shadow-primary-500/40 mb-6">
        <BookOpen class="w-10 h-10 text-white" />
      </div>
      <h1 class="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Panduan Penggunaan</h1>
      <p class="text-lg text-slate-600 dark:text-slate-400 font-medium">Panduan lengkap menggunakan ZakatApp</p>
    </div>

    <!-- Quick Start -->
    <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8 mb-8">
      <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
        <CheckCircle class="w-7 h-7 text-primary-600" />
        Mulai Menggunakan
      </h2>
      <div class="space-y-6">
        <div class="flex gap-4">
          <div class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold shrink-0">1</div>
          <div>
            <h3 class="font-bold text-slate-900 dark:text-white text-lg mb-2">Daftar Akun</h3>
            <p class="text-slate-600 dark:text-slate-400 font-medium">Kunjungi halaman <a href="/register" class="text-primary-600 dark:text-primary-400 hover:underline">pendaftaran</a> dan isi data masjid/lembaga Anda.</p>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold shrink-0">2</div>
          <div>
            <h3 class="font-bold text-slate-900 dark:text-white text-lg mb-2">Setup Organisasi</h3>
            <p class="text-slate-600 dark:text-slate-400 font-medium">Lengkapi informasi organisasi, pengaturan zakat, sektor wilayah, dan tim petugas.</p>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold shrink-0">3</div>
          <div>
            <h3 class="font-bold text-slate-900 dark:text-white text-lg mb-2">Mulai Input Data</h3>
            <p class="text-slate-600 dark:text-slate-400 font-medium">Tambah data muzaki dan mustahik melalui menu yang tersedia.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Features -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-lg rounded-[2rem] p-6">
        <div class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
          <Users class="w-6 h-6" />
        </div>
        <h3 class="font-extrabold text-slate-900 dark:text-white text-xl mb-3">Manajemen Muzaki</h3>
        <ul class="space-y-2 text-slate-600 dark:text-slate-400 font-medium">
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Tambah muzaki baru dengan data lengkap</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Filter berdasarkan sektor dan petugas</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Export data untuk laporan</span>
          </li>
        </ul>
      </div>

      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-lg rounded-[2rem] p-6">
        <div class="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
          <CheckCircle class="w-6 h-6" />
        </div>
        <h3 class="font-extrabold text-slate-900 dark:text-white text-xl mb-3">Manajemen Mustahik</h3>
        <ul class="space-y-2 text-slate-600 dark:text-slate-400 font-medium">
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Kelola penerima zakat per sektor</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Kategorikan berdasarkan asnaf</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Track distribusi zakat</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Tips -->
    <div class="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-[2rem] p-8">
      <h2 class="text-2xl font-extrabold text-amber-800 dark:text-amber-300 mb-4">Tips Penggunaan</h2>
      <ul class="space-y-3 text-amber-700 dark:text-amber-400 font-medium">
        <li class="flex items-start gap-3">
          <CheckCircle class="w-5 h-5 mt-0.5 shrink-0" />
          <span>Pastikan data sektor sudah lengkap sebelum input muzaki</span>
        </li>
        <li class="flex items-start gap-3">
          <CheckCircle class="w-5 h-5 mt-0.5 shrink-0" />
          <span>Gunakan fitur export untuk backup data secara berkala</span>
        </li>
        <li class="flex items-start gap-3">
          <CheckCircle class="w-5 h-5 mt-0.5 shrink-0" />
          <span>Undang petugas melalui menu Master Data > Petugas</span>
        </li>
      </ul>
    </div>
  </main>

  <!-- Footer -->
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

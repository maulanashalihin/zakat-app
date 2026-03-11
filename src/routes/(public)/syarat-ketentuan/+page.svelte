<script lang="ts">
  import { onMount } from 'svelte';
  import { FileText, Building2, ArrowLeft } from 'lucide-svelte';
  import { theme } from '$lib/stores/theme.svelte';

  onMount(() => {
    theme.init();
  });
</script>

<svelte:head>
  <title>Syarat & Ketentuan - ZakatApp</title>
  <meta name="description" content="Syarat dan ketentuan penggunaan ZakatApp.">
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
        <FileText class="w-10 h-10 text-white" />
      </div>
      <h1 class="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">Syarat & Ketentuan</h1>
      <p class="text-lg text-slate-600 dark:text-slate-400 font-medium">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>

    <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8 space-y-8">
      <section>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">1. Penerimaan Syarat</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Dengan menggunakan ZakatApp, Anda menyetujui untuk terikat dengan syarat dan ketentuan ini. Jika Anda tidak setuju, harap tidak menggunakan layanan kami.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">2. Layanan</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">
          ZakatApp menyediakan platform untuk mengelola zakat fitrah, termasuk:
        </p>
        <ul class="space-y-2 text-slate-600 dark:text-slate-400 font-medium ml-6">
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Manajemen data muzaki (pembayar zakat)</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Manajemen data mustahik (penerima zakat)</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Pelaporan dan ekspor data</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Manajemen tim dan sektor wilayah</span>
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">3. Akun Pengguna</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">
          Anda bertanggung jawab untuk:
        </p>
        <ul class="space-y-2 text-slate-600 dark:text-slate-400 font-medium ml-6">
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Menjaga kerahasiaan akun Anda</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Semua aktivitas yang terjadi di akun Anda</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Memberikan informasi yang akurat dan lengkap</span>
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">4. Penggunaan yang Dilarang</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-4">
          Anda dilarang menggunakan ZakatApp untuk:
        </p>
        <ul class="space-y-2 text-slate-600 dark:text-slate-400 font-medium ml-6">
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Aktivitas ilegal atau melanggar hukum</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Menyebarkan data palsu atau menyesatkan</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Mengakses sistem secara tidak sah</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-primary-500 mt-1">•</span>
            <span>Menyalahgunakan data organisasi lain</span>
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">5. Biaya</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          ZakatApp disediakan secara gratis untuk DKM dan lembaga amil zakat. Kami berhak mengubah kebijakan biaya di masa depan dengan pemberitahuan sebelumnya.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">6. Batasan Tanggung Jawab</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          ZakatApp disediakan "sebagaimana adanya" tanpa jaminan apapun. Kami tidak bertanggung jawab atas kerugian langsung atau tidak langsung yang timbul dari penggunaan layanan.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">7. Perubahan Syarat</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Kami berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan efektif setelah dipublikasikan di halaman ini.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">8. Hukum yang Berlaku</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia.
        </p>
      </section>

      <section>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">9. Kontak</h2>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Untuk pertanyaan mengenai syarat dan ketentuan ini, silakan hubungi kami.
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

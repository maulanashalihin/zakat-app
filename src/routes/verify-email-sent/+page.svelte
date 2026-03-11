<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { Mail, ArrowLeft, RefreshCw, Building2 } from 'lucide-svelte';
  import { theme } from '$lib/stores/theme.svelte';

  let email = $state('');
  let resending = $state(false);
  let resendMessage = $state('');
  let isSuccess = $state(false);

  onMount(() => {
    theme.init();
    email = page.url.searchParams.get('email') || '';
  });

  async function resendEmail() {
    if (!email) return;

    resending = true;
    resendMessage = '';

    try {
      const res = await fetch('/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json() as { message?: string };

      if (res.ok) {
        resendMessage = 'Email verifikasi berhasil dikirim! Silakan cek inbox Anda.';
        isSuccess = true;
      } else {
        resendMessage = data.message || 'Gagal mengirim email. Silakan coba lagi.';
        isSuccess = false;
      }
    } catch (err) {
      resendMessage = 'Terjadi kesalahan. Silakan coba lagi nanti.';
      isSuccess = false;
    } finally {
      resending = false;
    }
  }
</script>

<svelte:head>
  <title>Verifikasi Email - ZakatApp</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden font-sans selection:bg-primary-500 selection:text-white bg-slate-50 dark:bg-slate-950">
  <!-- Background Effects -->
  <div class="absolute inset-0 pointer-events-none -z-10">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-400/20 blur-[120px] rounded-full"></div>
    <div class="absolute top-40 -right-20 w-72 h-72 bg-emerald-300/30 rounded-full mix-blend-multiply filter blur-[80px] animate-blob"></div>
    <div class="absolute top-40 -left-20 w-72 h-72 bg-teal-300/30 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000"></div>
  </div>

  <div class="w-full max-w-md relative z-10">
    <!-- Logo -->
    <div class="text-center mb-8">
      <a href="/" class="inline-flex items-center gap-3 group">
        <div class="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-500/40 transition-transform duration-300 group-hover:scale-105">
          <Building2 class="w-6 h-6" />
        </div>
        <span class="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">Zakat<span class="text-primary-600 dark:text-primary-400">App</span></span>
      </a>
    </div>

    <!-- Card -->
    <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8 relative transform -rotate-1 hover:rotate-0 transition-transform duration-500">
      <div class="flex gap-2 mb-6 px-2">
        <div class="w-3 h-3 rounded-full bg-red-400"></div>
        <div class="w-3 h-3 rounded-full bg-amber-400"></div>
        <div class="w-3 h-3 rounded-full bg-green-400"></div>
      </div>

      <!-- Icon -->
      <div class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg shadow-blue-500/40 mb-4">
          <Mail class="w-10 h-10 text-white" />
        </div>
      </div>

      <!-- Content -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Cek Email Anda</h1>
        <p class="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          Kami telah mengirimkan link verifikasi ke <strong class="text-slate-900 dark:text-white">{email || 'email Anda'}</strong>. Silakan cek inbox dan klik link untuk verifikasi.
        </p>
      </div>

      <!-- Tip Box -->
      <div class="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 mb-6">
        <p class="text-sm text-slate-600 dark:text-slate-300 font-medium">
          <span class="font-bold">Tip:</span> Jika tidak menemukan email di inbox, cek folder spam atau junk.
        </p>
      </div>

      <!-- Message -->
      {#if resendMessage}
        <div class="p-4 rounded-xl mb-6 {isSuccess ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'}">
          <p class="text-sm font-medium {isSuccess ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">{resendMessage}</p>
        </div>
      {/if}

      <!-- Actions -->
      <div class="space-y-3">
        <button
          onclick={resendEmail}
          disabled={resending}
          class="w-full flex items-center justify-center gap-2 py-4 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {#if resending}
            <RefreshCw class="w-5 h-5 animate-spin" />
            Mengirim...
          {:else}
            <RefreshCw class="w-5 h-5" />
            Kirim Ulang Email
          {/if}
        </button>

        <a href="/login" class="w-full flex items-center justify-center gap-2 py-4 px-6 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-lg border border-slate-200 dark:border-slate-700 transition-all duration-200 hover:-translate-y-0.5">
          <ArrowLeft class="w-5 h-5" />
          Kembali ke Login
        </a>
      </div>
    </div>

    <!-- Footer Text -->
    <p class="text-center mt-8 text-slate-600 dark:text-slate-400 font-medium">
      Sudah verifikasi?
      <a href="/login" class="text-primary-600 dark:text-primary-400 hover:text-primary-500 font-bold transition-colors">
        Masuk sekarang
      </a>
    </p>
  </div>
</div>

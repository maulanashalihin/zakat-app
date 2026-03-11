<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { CheckCircle, XCircle, Mail, ArrowLeft, Building2 } from 'lucide-svelte';
  import { theme } from '$lib/stores/theme.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  onMount(() => {
    theme.init();

    if (data.success && browser) {
      setTimeout(() => {
        goto('/login');
      }, 5000);
    }
  });
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

      {#if data.success}
        <!-- Success State -->
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/40 mb-6">
            <CheckCircle class="w-10 h-10 text-white" />
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
            {data.alreadyVerified ? 'Sudah Terverifikasi!' : 'Email Terverifikasi!'}
          </h1>
          <p class="text-slate-600 dark:text-slate-400 font-medium mb-6">{data.message}</p>

          {#if !data.alreadyVerified}
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Redirect ke halaman login dalam 5 detik...
            </p>
          {/if}

          <a href="/login" class="inline-flex items-center justify-center gap-2 py-4 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1">
            <ArrowLeft class="w-5 h-5" />
            Ke Login
          </a>
        </div>
      {:else}
        <!-- Error State -->
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/40 mb-6">
            <XCircle class="w-10 h-10 text-white" />
          </div>
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Verifikasi Gagal</h1>
          <p class="text-slate-600 dark:text-slate-400 font-medium mb-6">{data.message}</p>

          <div class="space-y-3">
            <a href="/login" class="inline-flex items-center justify-center gap-2 py-4 px-6 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-lg border border-slate-200 dark:border-slate-700 transition-all duration-200 hover:-translate-y-0.5">
              <ArrowLeft class="w-5 h-5" />
              Ke Login
            </a>

            <form method="POST" action="/auth/resend-verification" class="w-full">
              <input type="hidden" name="email" value={browser ? new URLSearchParams(window.location.search).get('email') : ''} />
              <button
                type="submit"
                class="w-full flex items-center justify-center gap-2 py-4 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1"
              >
                <Mail class="w-5 h-5" />
                Kirim Ulang Email Verifikasi
              </button>
            </form>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

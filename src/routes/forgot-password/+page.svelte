<script lang="ts">
  import { onMount } from 'svelte';
  import { Mail, ArrowLeft, Loader2, CheckCircle, Building2 } from 'lucide-svelte';
  import { theme } from '$lib/stores/theme.svelte';

  let email = $state('');
  let loading = $state(false);
  let errorMsg = $state('');
  let success = $state(false);

  onMount(() => {
    theme.init();
  });

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    loading = true;
    errorMsg = '';

    try {
      const res = await fetch('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json() as { message?: string };

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send reset link');
      }

      success = true;

    } catch (err: any) {
      errorMsg = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Lupa Password - ZakatApp</title>
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

      {#if success}
        <!-- Success State -->
        <div class="text-center py-4">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/40 mb-6">
            <CheckCircle class="w-10 h-10 text-white" />
          </div>
          <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Email Terkirim!</h3>
          <p class="text-slate-600 dark:text-slate-400 font-medium mb-6">Cek email Anda untuk link reset password.</p>
          <a href="/login" class="inline-flex items-center justify-center gap-2 py-4 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1">
            <ArrowLeft class="w-5 h-5" />
            Kembali ke Login
          </a>
        </div>
      {:else}
        <!-- Form -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Lupa Password</h1>
          <p class="text-slate-600 dark:text-slate-400 font-medium">Masukkan email untuk reset password</p>
        </div>

        <form onsubmit={handleSubmit} class="space-y-5">
          {#if errorMsg}
            <div class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p class="text-sm text-red-600 dark:text-red-400 font-medium">{errorMsg}</p>
            </div>
          {/if}

          <div>
            <label for="email" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Email
            </label>
            <div class="relative">
              <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                id="email"
                bind:value={email}
                required
                class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                placeholder="nama@email.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            class="w-full flex items-center justify-center gap-2 py-4 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {#if loading}
              <Loader2 class="w-5 h-5 animate-spin" />
              Mengirim...
            {:else}
              Kirim Link Reset
            {/if}
          </button>

          <div class="text-center">
            <a href="/login" class="text-sm inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              <ArrowLeft class="w-4 h-4" />
              Kembali ke login
            </a>
          </div>
        </form>
      {/if}
    </div>
  </div>
</div>

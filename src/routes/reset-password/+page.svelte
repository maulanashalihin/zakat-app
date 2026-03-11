<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { Lock, Eye, EyeOff, Loader2, CheckCircle, ArrowLeft, Building2, Check, X } from 'lucide-svelte';
  import { onMount } from 'svelte';
  import { theme } from '$lib/stores/theme.svelte';

  let token = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let showPassword = $state(false);
  let loading = $state(false);
  let errorMsg = $state('');
  let success = $state(false);

  onMount(() => {
    theme.init();

    const searchParams = page.url.searchParams;
    token = searchParams.get('token') || '';
    email = searchParams.get('email') || '';

    if (!token || !email) {
      errorMsg = 'Link reset tidak valid atau sudah kadaluarsa.';
    }
  });

  let passwordValid = $derived({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password)
  });

  let passwordsMatch = $derived(password === confirmPassword && password !== '');

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (!passwordsMatch) {
      errorMsg = 'Password tidak cocok';
      return;
    }

    if (!passwordValid.length || !passwordValid.uppercase || !passwordValid.number) {
      errorMsg = 'Password tidak memenuhi syarat';
      return;
    }

    loading = true;
    errorMsg = '';

    try {
      const res = await fetch('/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password })
      });

      const data = await res.json() as { message?: string };

      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      success = true;

      setTimeout(() => {
        goto('/login');
      }, 2000);

    } catch (err: any) {
      errorMsg = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Reset Password - ZakatApp</title>
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
          <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">Password Berhasil Diubah!</h3>
          <p class="text-slate-600 dark:text-slate-400 font-medium mb-6">Anda akan dialihkan ke halaman login.</p>
        </div>
      {:else}
        <!-- Form -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Reset Password</h1>
          <p class="text-slate-600 dark:text-slate-400 font-medium">Buat password baru Anda</p>
        </div>

        <form onsubmit={handleSubmit} class="space-y-5">
          {#if errorMsg}
            <div class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p class="text-sm text-red-600 dark:text-red-400 font-medium">{errorMsg}</p>
            </div>
          {/if}

          <!-- Email Display -->
          <div>
            <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              disabled
              class="w-full px-4 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password Baru</label>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                bind:value={password}
                required
                class="w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                placeholder="Minimal 8 karakter"
              />
              <button
                type="button"
                onclick={() => showPassword = !showPassword}
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {#if showPassword}
                  <EyeOff class="w-5 h-5" />
                {:else}
                  <Eye class="w-5 h-5" />
                {/if}
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Konfirmasi Password</label>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                bind:value={confirmPassword}
                required
                class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                placeholder="Ulangi password"
              />
            </div>
          </div>

          <!-- Password Requirements -->
          <div class="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Password harus memiliki:</p>
            <div class="space-y-2">
              <div class="flex items-center gap-2 text-sm transition-colors" class:text-primary-600={passwordValid.length} class:text-slate-400={!passwordValid.length}>
                {#if passwordValid.length}
                  <Check class="w-4 h-4" />
                {:else}
                  <X class="w-4 h-4" />
                {/if}
                Minimal 8 karakter
              </div>
              <div class="flex items-center gap-2 text-sm transition-colors" class:text-primary-600={passwordValid.uppercase} class:text-slate-400={!passwordValid.uppercase}>
                {#if passwordValid.uppercase}
                  <Check class="w-4 h-4" />
                {:else}
                  <X class="w-4 h-4" />
                {/if}
                Satu huruf kapital
              </div>
              <div class="flex items-center gap-2 text-sm transition-colors" class:text-primary-600={passwordValid.number} class:text-slate-400={!passwordValid.number}>
                {#if passwordValid.number}
                  <Check class="w-4 h-4" />
                {:else}
                  <X class="w-4 h-4" />
                {/if}
                Satu angka
              </div>
              <div class="flex items-center gap-2 text-sm transition-colors" class:text-primary-600={passwordsMatch} class:text-slate-400={!passwordsMatch}>
                {#if passwordsMatch}
                  <Check class="w-4 h-4" />
                {:else}
                  <X class="w-4 h-4" />
                {/if}
                Password cocok
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !passwordsMatch || !passwordValid.length || !passwordValid.uppercase || !passwordValid.number}
            class="w-full flex items-center justify-center gap-2 py-4 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {#if loading}
              <Loader2 class="w-5 h-5 animate-spin" />
              Memproses...
            {:else}
              Reset Password
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

<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { Chrome, Mail, Lock, User, Eye, EyeOff, Loader2, Check, X, Building2, ArrowRight } from 'lucide-svelte';
  import { theme } from '$lib/stores/theme.svelte';

  let name = $state('');
  let email = $state('');
  let password = $state('');
  let showPassword = $state(false);
  let loading = $state(false);
  let errorMsg = $state('');
  let errors: Record<string, string[]> = $state({});

  let passwordValid = $derived({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password)
  });

  onMount(() => {
    theme.init();
  });

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    loading = true;
    errorMsg = '';
    errors = {};

    try {
      const res = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json() as { 
        success?: boolean;
        message?: string;
        errors?: Record<string, string[]> 
      };

      if (!res.ok) {
        if (data.errors) {
          errors = data.errors;
        }
        throw new Error(data.message || 'Registration failed');
      }

      // Redirect to verify email page
      goto(`/verify-email-sent?email=${encodeURIComponent(email)}`);

    } catch (err: any) {
      errorMsg = err.message;
    } finally {
      loading = false;
    }
  }

  function registerWithGoogle() {
    window.location.href = '/auth/google';
  }
</script>

<svelte:head>
  <title>Daftar - ZakatApp</title>
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

      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Buat Akun</h1>
        <p class="text-slate-600 dark:text-slate-400 font-medium">Daftar gratis untuk memulai</p>
      </div>

      {#if errorMsg}
        <div class="mb-6 p-4 rounded-xl text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800">
          {errorMsg}
        </div>
      {/if}

      <!-- Google Button -->
      <button
        onclick={registerWithGoogle}
        disabled={loading}
        class="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-xl font-bold transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
      >
        <Chrome class="w-5 h-5" />
        Daftar dengan Google
      </button>

      <!-- Divider -->
      <div class="relative my-8">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-slate-200 dark:border-slate-700"></div>
        </div>
        <div class="relative flex justify-center text-xs">
          <span class="px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">atau</span>
        </div>
      </div>

      <!-- Form -->
      <form onsubmit={handleSubmit} class="space-y-5">
        <div>
          <label for="name" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Nama Lengkap
          </label>
          <div class="relative">
            <User class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="name"
              type="text"
              bind:value={name}
              required
              class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              placeholder="John Doe"
            />
          </div>
          {#if errors.name}
            <p class="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name[0]}</p>
          {/if}
        </div>

        <div>
          <label for="email" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Alamat Email
          </label>
          <div class="relative">
            <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              id="email"
              type="email"
              bind:value={email}
              required
              class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              placeholder="you@example.com"
            />
          </div>
          {#if errors.email}
            <p class="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email[0]}</p>
          {/if}
        </div>

        <div>
          <label for="password" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Password
          </label>
          <div class="relative">
            <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            {#if showPassword}
              <input
                id="password"
                type="text"
                bind:value={password}
                required
                class="w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                placeholder="••••••••"
              />
            {:else}
              <input
                id="password"
                type="password"
                bind:value={password}
                required
                class="w-full pl-12 pr-12 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                placeholder="••••••••"
              />
            {/if}
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

          <!-- Password Requirements -->
          <div class="mt-4 space-y-2">
            <p class="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Syarat Password</p>
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
            </div>
          </div>
          {#if errors.password}
            <p class="mt-2 text-sm text-red-600 dark:text-red-400">{errors.password[0]}</p>
          {/if}
        </div>

        <button
          type="submit"
          disabled={loading || !passwordValid.length || !passwordValid.uppercase || !passwordValid.number}
          class="w-full flex items-center justify-center gap-2 py-4 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {#if loading}
            <Loader2 class="w-5 h-5 animate-spin" />
            Membuat akun...
          {:else}
            Buat Akun
            <ArrowRight class="w-5 h-5" />
          {/if}
        </button>
      </form>
    </div>

    <p class="text-center mt-8 text-slate-600 dark:text-slate-400 font-medium">
      Sudah punya akun?
      <a href="/login" class="text-primary-600 dark:text-primary-400 hover:text-primary-500 font-bold transition-colors">
        Masuk
      </a>
    </p>
  </div>
</div>

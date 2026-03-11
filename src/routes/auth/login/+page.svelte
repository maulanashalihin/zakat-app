<script lang="ts">
  import { Hexagon, Loader2, Eye, EyeOff } from 'lucide-svelte';
  
  let { form } = $props();
  
  let showPassword = $state(false);
  let isLoading = $state(false);
  
  function handleSubmit() {
    isLoading = true;
  }
</script>

<svelte:head>
  <title>Masuk - ZakatApp</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
  <div class="w-full max-w-md space-y-8">
    <!-- Logo -->
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg mb-4">
        <Hexagon class="w-8 h-8 text-white" />
      </div>
      <h2 class="text-3xl font-bold text-slate-900 dark:text-white">Selamat Datang</h2>
      <p class="mt-2 text-slate-600 dark:text-slate-400">Masuk ke akun ZakatApp Anda</p>
    </div>

    <!-- Form -->
    <form method="POST" class="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800" onsubmit={handleSubmit}>
      {#if form?.error}
        <div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p class="text-sm text-red-600 dark:text-red-400">{form.error}</p>
        </div>
      {/if}

      <div>
        <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          class="input w-full"
          placeholder="nama@email.com"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Password
        </label>
        <div class="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            required
            class="input w-full pr-10"
            placeholder="••••••••"
          />
          <button
            type="button"
            onclick={() => showPassword = !showPassword}
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {#if showPassword}
              <EyeOff class="w-5 h-5" />
            {:else}
              <Eye class="w-5 h-5" />
            {/if}
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <label class="flex items-center">
          <input type="checkbox" name="remember" class="rounded border-slate-300 text-green-600 focus:ring-green-500" />
          <span class="ml-2 text-sm text-slate-600 dark:text-slate-400">Ingat saya</span>
        </label>
        <a href="/forgot-password" class="text-sm text-green-600 hover:text-green-700 dark:text-green-400">Lupa password?</a>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        class="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {#if isLoading}
          <Loader2 class="w-5 h-5 animate-spin mr-2" />
          Memuat...
        {:else}
          Masuk
        {/if}
      </button>
    </form>

    <p class="text-center text-sm text-slate-600 dark:text-slate-400">
      Belum punya akun? <a href="/register" class="text-green-600 hover:text-green-700 dark:text-green-400 font-medium">Daftar sekarang</a>
    </p>
  </div>
</div>

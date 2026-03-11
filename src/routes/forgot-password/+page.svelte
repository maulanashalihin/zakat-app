<script lang="ts">
  import { onMount } from 'svelte';
  import { Mail, ArrowLeft, Loader2, CheckCircle, Hexagon } from 'lucide-svelte';
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
  <title>Lupa Password | ZakatApp</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center py-12 px-4 grain" style="background-color: var(--bg-primary);">
  <div class="absolute inset-0 pointer-events-none">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-20" style="background-color: var(--accent-primary);"></div>
  </div>
  
  <div class="w-full max-w-md relative z-10">
    <!-- Logo -->
    <div class="text-center mb-8">
      <a href="/" class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg mb-4">
        <Hexagon class="w-8 h-8 text-white" />
      </a>
      <h1 class="text-3xl font-bold" style="color: var(--text-primary);">Lupa Password</h1>
      <p class="mt-2" style="color: var(--text-secondary);">Masukkan email untuk reset password</p>
    </div>

    <!-- Form -->
    <div class="rounded-2xl shadow-sm p-8" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
      {#if success}
        <div class="text-center py-4">
          <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle class="w-8 h-8 text-green-600" />
          </div>
          <h3 class="text-xl font-semibold mb-2" style="color: var(--text-primary);">Email Terkirim!</h3>
          <p class="text-sm mb-6" style="color: var(--text-secondary);">Cek email Anda untuk link reset password.</p>
          <a href="/login" class="btn-primary inline-flex items-center gap-2">
            <ArrowLeft class="w-4 h-4" />
            Kembali ke Login
          </a>
        </div>
      {:else}
        <form onsubmit={handleSubmit} class="space-y-6">
          {#if errorMsg}
            <div class="p-4 rounded-lg bg-red-50 border border-red-200">
              <p class="text-sm text-red-600">{errorMsg}</p>
            </div>
          {/if}

          <div>
            <label for="email" class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Email</label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style="color: var(--text-tertiary);" />
              <input
                type="email"
                id="email"
                bind:value={email}
                required
                class="input w-full pl-10"
                placeholder="nama@email.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            class="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {#if loading}
              <Loader2 class="w-5 h-5 animate-spin mr-2" />
              Mengirim...
            {:else}
              Kirim Link Reset
            {/if}
          </button>

          <div class="text-center">
            <a href="/login" class="text-sm inline-flex items-center gap-1" style="color: var(--accent-primary);">
              <ArrowLeft class="w-4 h-4" />
              Kembali ke login
            </a>
          </div>
        </form>
      {/if}
    </div>
  </div>
</div>

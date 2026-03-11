<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { Lock, Eye, EyeOff, Loader2, CheckCircle, ArrowLeft, Hexagon, Check, X } from 'lucide-svelte';
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
      errorMsg = 'Invalid or expired reset link. Please request a new one.';
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
      errorMsg = 'Passwords do not match';
      return;
    }
    
    if (!passwordValid.length || !passwordValid.uppercase || !passwordValid.number) {
      errorMsg = 'Password does not meet requirements';
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
  <title>Reset Password | ZakatApp</title>
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
      <h1 class="text-3xl font-bold" style="color: var(--text-primary);">Reset Password</h1>
      <p class="mt-2" style="color: var(--text-secondary);">Buat password baru Anda</p>
    </div>

    <!-- Form -->
    <div class="rounded-2xl shadow-sm p-8" style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);">
      {#if success}
        <div class="text-center py-4">
          <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle class="w-8 h-8 text-green-600" />
          </div>
          <h3 class="text-xl font-semibold mb-2" style="color: var(--text-primary);">Password Berhasil Diubah!</h3>
          <p class="text-sm mb-6" style="color: var(--text-secondary);">Anda akan dialihkan ke halaman login.</p>
        </div>
      {:else}
        <form onsubmit={handleSubmit} class="space-y-6">
          {#if errorMsg}
            <div class="p-4 rounded-lg bg-red-50 border border-red-200">
              <p class="text-sm text-red-600">{errorMsg}</p>
            </div>
          {/if}

          <!-- Email Display -->
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Email</label>
            <input
              type="email"
              value={email}
              disabled
              class="input w-full opacity-50"
            />
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Password Baru</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style="color: var(--text-tertiary);" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                bind:value={password}
                required
                class="input w-full pl-10 pr-10"
                placeholder="Minimal 8 karakter"
              />
              <button
                type="button"
                onclick={() => showPassword = !showPassword}
                class="absolute right-3 top-1/2 -translate-y-1/2"
                style="color: var(--text-tertiary);"
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
            <label for="confirmPassword" class="block text-sm font-medium mb-1" style="color: var(--text-secondary);">Konfirmasi Password</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style="color: var(--text-tertiary);" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                bind:value={confirmPassword}
                required
                class="input w-full pl-10"
                placeholder="Ulangi password"
              />
            </div>
          </div>

          <!-- Password Requirements -->
          <div class="space-y-2 text-sm">
            <p style="color: var(--text-secondary);">Password harus memiliki:</p>
            <div class="space-y-1">
              <div class="flex items-center gap-2" style="color: {passwordValid.length ? '#22c55e' : 'var(--text-tertiary)'};">
                {#if passwordValid.length}
                  <Check class="w-4 h-4" />
                {:else}
                  <X class="w-4 h-4" />
                {/if}
                <span>Minimal 8 karakter</span>
              </div>
              <div class="flex items-center gap-2" style="color: {passwordValid.uppercase ? '#22c55e' : 'var(--text-tertiary)'};">
                {#if passwordValid.uppercase}
                  <Check class="w-4 h-4" />
                {:else}
                  <X class="w-4 h-4" />
                {/if}
                <span>Satu huruf besar</span>
              </div>
              <div class="flex items-center gap-2" style="color: {passwordValid.number ? '#22c55e' : 'var(--text-tertiary)'};">
                {#if passwordValid.number}
                  <Check class="w-4 h-4" />
                {:else}
                  <X class="w-4 h-4" />
                {/if}
                <span>Satu angka</span>
              </div>
              <div class="flex items-center gap-2" style="color: {passwordsMatch ? '#22c55e' : 'var(--text-tertiary)'};">
                {#if passwordsMatch}
                  <Check class="w-4 h-4" />
                {:else}
                  <X class="w-4 h-4" />
                {/if}
                <span>Password cocok</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !passwordsMatch || !passwordValid.length || !passwordValid.uppercase || !passwordValid.number}
            class="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {#if loading}
              <Loader2 class="w-5 h-5 animate-spin mr-2" />
              Memproses...
            {:else}
              Reset Password
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

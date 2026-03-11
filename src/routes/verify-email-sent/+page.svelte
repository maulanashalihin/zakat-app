<script lang="ts">
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { Mail, ArrowLeft, RefreshCw, Hexagon } from 'lucide-svelte';
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
        resendMessage = 'Verification email sent! Please check your inbox.';
        isSuccess = true;
      } else {
        resendMessage = data.message || 'Failed to resend email. Please try again.';
        isSuccess = false;
      }
    } catch (err) {
      resendMessage = 'An error occurred. Please try again later.';
      isSuccess = false;
    } finally {
      resending = false;
    }
  }
</script>

<svelte:head>
  <title>Verifikasi Email | ZakatApp</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center px-4 grain" style="background-color: var(--bg-primary);">
  <div class="absolute inset-0 pointer-events-none">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl" style="background-color: var(--accent-bg); opacity: 0.5;"></div>
  </div>
  
  <div class="w-full max-w-md relative z-10">
    <div class="card-elevated p-8 text-center">
      <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
        <Mail class="w-10 h-10 text-blue-600" />
      </div>
      
      <h1 class="text-2xl font-bold mb-2" style="color: var(--text-primary);">Cek Email Anda</h1>
      <p class="mb-6" style="color: var(--text-secondary);">
        Kami telah mengirimkan link verifikasi ke <strong style="color: var(--text-primary);">{email || 'email Anda'}</strong>. Silakan cek inbox dan klik link untuk verifikasi.
      </p>
      
      <div class="bg-slate-50 rounded-lg p-4 mb-6 text-left">
        <p class="text-sm text-slate-600">
          <strong>Tip:</strong> Jika tidak menemukan email di inbox, cek folder spam atau junk.
        </p>
      </div>
      
      {#if resendMessage}
        <div class="p-4 rounded-lg mb-4 {isSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}">
          <p class="text-sm {isSuccess ? 'text-green-600' : 'text-red-600'}">{resendMessage}</p>
        </div>
      {/if}
      
      <div class="space-y-3">
        <button
          onclick={resendEmail}
          disabled={resending}
          class="w-full flex items-center justify-center gap-2 btn-primary disabled:opacity-50"
        >
          {#if resending}
            <RefreshCw class="w-4 h-4 animate-spin" />
            Mengirim...
          {:else}
            <RefreshCw class="w-4 h-4" />
            Kirim Ulang Email
          {/if}
        </button>
        
        <a href="/login" class="w-full flex items-center justify-center gap-2 btn-secondary">
          <ArrowLeft class="w-4 h-4" />
          Kembali ke Login
        </a>
      </div>
    </div>
  </div>
</div>

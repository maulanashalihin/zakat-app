<script>
  import { Sun, Moon } from 'lucide-svelte';
  import { theme } from '$lib/stores/theme.svelte';
  
  let { children, data } = $props();
  
  const steps = [
    { id: 1, label: 'Organisasi' },
    { id: 2, label: 'Zakat' },
    { id: 3, label: 'Sektor' },
    { id: 4, label: 'Tim' }
  ];
  
  const currentStep = data.currentStep;
  
  function toggleTheme() {
    theme.toggle();
  }
</script>

<svelte:head>
  <title>Setup - ZakatApp</title>
</svelte:head>

<div class="min-h-screen" style="background-color: var(--bg-primary);">
  <!-- Header with Theme Toggle -->
  <header class="fixed top-0 left-0 right-0 z-50 px-4 py-3" style="background-color: var(--bg-primary); border-bottom: 1px solid var(--border-primary);">
    <div class="max-w-2xl mx-auto flex items-center justify-between">
      <a href="/" class="flex items-center gap-2">
        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <span class="font-bold" style="color: var(--text-primary);">ZakatApp</span>
      </a>
      <button
        onclick={toggleTheme}
        class="p-2 rounded-lg transition-colors"
        style="color: var(--text-secondary); background-color: var(--bg-secondary);"
        aria-label="Toggle theme"
      >
        {#if theme.current === 'dark'}
          <Sun class="w-5 h-5" />
        {:else}
          <Moon class="w-5 h-5" />
        {/if}
      </button>
    </div>
  </header>

  <div class="max-w-2xl mx-auto px-4 py-8 pt-20">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg mb-4">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold" style="color: var(--text-primary);">Setup ZakatApp</h1>
      <p style="color: var(--text-secondary);" class="mt-1">Lengkapi informasi untuk memulai</p>
    </div>

    <!-- Progress Stepper -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        {#each steps as step, index}
          <div class="flex items-center {index < steps.length - 1 ? 'flex-1' : ''}">
            <!-- Step Circle -->
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors
                {step.id === currentStep 
                  ? 'bg-green-600 text-white' 
                  : step.id < currentStep 
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}">
                {#if step.id < currentStep}
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                {:else}
                  {step.id}
                {/if}
              </div>
              <span class="text-xs mt-2 font-medium transition-colors
                {step.id === currentStep 
                  ? 'text-green-600 dark:text-green-400' 
                  : step.id < currentStep 
                    ? 'text-green-700 dark:text-green-400' 
                    : 'text-slate-500 dark:text-slate-400'}">
                {step.label}
              </span>
            </div>
            
            <!-- Connector Line -->
            {#if index < steps.length - 1}
              <div class="flex-1 h-0.5 mx-2 transition-colors
                {step.id < currentStep 
                  ? 'bg-green-500' 
                  : 'bg-slate-200 dark:bg-slate-700'}">
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- Content -->
    {@render children()}
  </div>
</div>

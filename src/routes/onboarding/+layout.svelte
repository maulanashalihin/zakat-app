<script>
  import { Sun, Moon, Building2 } from 'lucide-svelte';
  import { theme } from '$lib/stores/theme.svelte';

  let { children, data } = $props();

  const steps = [
    { id: 1, label: 'Organisasi' },
    { id: 2, label: 'Zakat' },
    { id: 3, label: 'Sektor' },
    { id: 4, label: 'Konfirmasi' }
  ];

  const currentStep = data.currentStep;

  function toggleTheme() {
    theme.toggle();
  }
</script>

<svelte:head>
  <title>Setup - ZakatApp</title>
</svelte:head>

<div class="min-h-screen font-sans selection:bg-primary-500 selection:text-white relative overflow-hidden bg-slate-50 dark:bg-slate-950">
  <!-- Background Effects -->
  <div class="absolute inset-0 pointer-events-none -z-10">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-400/20 blur-[120px] rounded-full"></div>
    <div class="absolute top-40 -right-20 w-72 h-72 bg-emerald-300/30 rounded-full mix-blend-multiply filter blur-[80px] animate-blob"></div>
    <div class="absolute top-40 -left-20 w-72 h-72 bg-teal-300/30 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000"></div>
  </div>

  <!-- Header with Theme Toggle -->
  <header class="fixed top-6 left-0 right-0 z-50 px-4">
    <div class="max-w-2xl mx-auto">
      <div class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] rounded-full px-6 py-3 flex items-center justify-between">
        <a href="/" class="flex items-center gap-2 group">
          <div class="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-primary-500/40 transition-transform duration-300 group-hover:scale-105">
            <Building2 class="w-4 h-4" />
          </div>
          <span class="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">Zakat<span class="text-primary-600 dark:text-primary-400">App</span></span>
        </a>
        <button
          onclick={toggleTheme}
          class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400"
          aria-label="Toggle theme"
        >
          {#if theme.current === 'dark'}
            <Sun class="w-5 h-5" />
          {:else}
            <Moon class="w-5 h-5" />
          {/if}
        </button>
      </div>
    </div>
  </header>

  <div class="max-w-2xl mx-auto px-4 py-8 pt-32">
    <!-- Header -->
    <div class="text-center mb-10">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg shadow-primary-500/40 mb-4">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Setup ZakatApp</h1>
      <p class="text-slate-600 dark:text-slate-400 font-medium mt-2">Lengkapi informasi untuk memulai</p>
    </div>

    <!-- Progress Stepper -->
    <div class="mb-10">
      <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-6">
        <div class="flex items-center justify-between">
          {#each steps as step, index}
            <div class="flex items-center {index < steps.length - 1 ? 'flex-1' : ''}">
              <!-- Step Circle -->
              <div class="flex flex-col items-center">
                <div class="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  {step.id === currentStep
                    ? 'bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-lg shadow-primary-500/40 scale-110'
                    : step.id < currentStep
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}">
                  {#if step.id < currentStep}
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  {:else}
                    {step.id}
                  {/if}
                </div>
                <span class="text-xs mt-2 font-bold transition-colors
                  {step.id === currentStep
                    ? 'text-primary-600 dark:text-primary-400'
                    : step.id < currentStep
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-slate-400 dark:text-slate-500'}">
                  {step.label}
                </span>
              </div>

              <!-- Connector Line -->
              {#if index < steps.length - 1}
                <div class="flex-1 h-1 mx-3 rounded-full transition-all duration-500
                  {step.id < currentStep
                    ? 'bg-gradient-to-r from-primary-400 to-primary-600'
                    : 'bg-slate-200 dark:bg-slate-700'}">
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Content -->
    {@render children()}
  </div>
</div>

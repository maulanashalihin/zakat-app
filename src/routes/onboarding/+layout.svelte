<script>
  let { children, data } = $props();
  
  const steps = [
    { number: 1, title: 'Organisasi' },
    { number: 2, title: 'Zakat' },
    { number: 3, title: 'Sektor' },
    { number: 4, title: 'Tim' }
  ];
  
  const currentStep = data.currentStep;
  const completedSteps = JSON.parse(data.onboarding?.completed_steps || '[]');
</script>

<div class="min-h-screen bg-slate-50">
  <!-- Header -->
  <header class="bg-white border-b">
    <div class="max-w-3xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold text-slate-800">Setup Zakat App</h1>
        <span class="text-sm text-slate-500">Langkah {Math.min(currentStep, 4)} dari 4</span>
      </div>
    </div>
  </header>

  <!-- Progress Stepper -->
  <div class="bg-white border-b">
    <div class="max-w-3xl mx-auto px-4 py-6">
      <div class="flex items-center justify-between">
        {#each steps as step, i}
          <div class="flex items-center flex-1">
            <!-- Step Circle -->
            <div class={[
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
              completedSteps.includes(step.number) ? 'bg-green-500 text-white' : 
              currentStep === step.number ? 'bg-blue-600 text-white' : 
              'bg-slate-200 text-slate-500'
            ]}>
              {#if completedSteps.includes(step.number)}
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              {:else}
                {step.number}
              {/if}
            </div>
            
            <!-- Step Title -->
            <span class={[
              'ml-2 text-sm font-medium hidden sm:block',
              currentStep === step.number ? 'text-slate-900' : 'text-slate-500'
            ]}>
              {step.title}
            </span>
            
            <!-- Connector Line -->
            {#if i < steps.length - 1}
              <div class="flex-1 h-0.5 mx-4 bg-slate-200">
                <div 
                  class="h-full bg-green-500 transition-all"
                  style="width: {completedSteps.includes(step.number) ? '100%' : '0%'}"
                ></div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <main class="max-w-3xl mx-auto px-4 py-8">
    {@render children()}
  </main>
</div>

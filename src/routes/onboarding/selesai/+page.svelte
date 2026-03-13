<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { CheckCircle2, Sparkles, ArrowRight, Building2, Users, MapPin, Settings } from 'lucide-svelte';

  let { data } = $props();

  const organization = $derived(data.organization);

  onMount(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      goto(`/o/${organization?.slug}/dashboard`);
    }, 5000);

    return () => clearTimeout(timer);
  });
</script>

<svelte:head>
  <title>Setup Selesai - ZakatApp</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden font-sans selection:bg-primary-500 selection:text-white bg-slate-50 dark:bg-slate-950">
  <!-- Background Effects -->
  <div class="absolute inset-0 pointer-events-none -z-10">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-400/20 blur-[120px] rounded-full"></div>
    <div class="absolute top-40 -right-20 w-72 h-72 bg-emerald-300/30 rounded-full mix-blend-multiply filter blur-[80px] animate-blob"></div>
    <div class="absolute top-40 -left-20 w-72 h-72 bg-teal-300/30 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000"></div>
  </div>

  <div class="w-full max-w-2xl relative z-10">
    <!-- Success Card -->
    <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-emerald-500/5"></div>
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>

      <!-- Content -->
      <div class="relative z-10">
        <!-- Success Icon -->
        <div class="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-2xl shadow-primary-500/40 mb-6 animate-bounce">
          <CheckCircle2 class="w-12 h-12 text-white" strokeWidth={3} />
        </div>

        <!-- Sparkles -->
        <div class="absolute top-20 left-10 text-primary-400 animate-pulse">
          <Sparkles class="w-6 h-6" />
        </div>
        <div class="absolute top-16 right-16 text-emerald-400 animate-pulse animation-delay-500">
          <Sparkles class="w-5 h-5" />
        </div>
        <div class="absolute bottom-20 left-20 text-teal-400 animate-pulse animation-delay-1000">
          <Sparkles class="w-4 h-4" />
        </div>

        <!-- Heading -->
        <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Setup Selesai!
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-400 font-medium mb-8 max-w-md mx-auto">
          Organisasi Anda siap digunakan. Mulai kelola zakat dengan lebih modern dan transparan.
        </p>

        <!-- Organization Summary -->
        <div class="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-8">
          <div class="flex items-center justify-center gap-3 mb-4">
            <div class="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-sm">
              <Building2 class="w-6 h-6" />
            </div>
            <div class="text-left">
              <p class="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Organisasi Anda</p>
              <p class="text-xl font-extrabold text-slate-900 dark:text-white">{organization?.name}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <!-- Tim -->
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users class="w-4 h-4 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Tim</p>
                <p class="text-sm font-bold text-slate-900 dark:text-white">1 Admin</p>
                <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Tambah petugas di dashboard</p>
              </div>
            </div>
            <!-- Sektor -->
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Sektor</p>
                <p class="text-sm font-bold text-slate-900 dark:text-white">{organization?.sectorsCount || 0} Wilayah</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-4">
          <a
            href={`/o/${organization?.slug}/dashboard`}
            class="inline-flex items-center justify-center gap-2 py-4 px-8 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1"
          >
            Buka Dashboard
            <ArrowRight class="w-5 h-5" />
          </a>

          <div class="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <span>Redirect otomatis dalam <span class="text-primary-600 dark:text-primary-400">5</span> detik</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="mt-8 grid grid-cols-3 gap-4">
      <a href={`/o/${organization?.slug}/dashboard`} class="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-lg rounded-2xl p-4 text-center hover:bg-white dark:hover:bg-slate-900 hover:-translate-y-1 transition-all group">
        <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 mx-auto mb-2 group-hover:scale-110 transition-transform">
          <Building2 class="w-5 h-5" />
        </div>
        <p class="text-xs font-bold text-slate-700 dark:text-slate-300">Dashboard</p>
      </a>
      <a href={`/o/${organization?.slug}/muzaki`} class="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-lg rounded-2xl p-4 text-center hover:bg-white dark:hover:bg-slate-900 hover:-translate-y-1 transition-all group">
        <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform">
          <Users class="w-5 h-5" />
        </div>
        <p class="text-xs font-bold text-slate-700 dark:text-slate-300">Muzaki</p>
      </a>
      <a href={`/o/${organization?.slug}/settings`} class="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-lg rounded-2xl p-4 text-center hover:bg-white dark:hover:bg-slate-900 hover:-translate-y-1 transition-all group">
        <div class="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto mb-2 group-hover:scale-110 transition-transform">
          <Settings class="w-5 h-5" />
        </div>
        <p class="text-xs font-bold text-slate-700 dark:text-slate-300">Pengaturan</p>
      </a>
    </div>
  </div>
</div>

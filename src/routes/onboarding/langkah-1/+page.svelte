<script>
  import { Building2, MapPin, Phone, Mail, ArrowRight } from 'lucide-svelte';

  let { data, form } = $props();

  const savedData = $derived(data.savedData || {});
  const values = $derived(form?.values || savedData);
  const errors = $derived(form?.errors || {});
</script>

<svelte:head>
  <title>Setup Organisasi - ZakatApp</title>
</svelte:head>

<div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8 relative transform -rotate-1 hover:rotate-0 transition-transform duration-500">
  <div class="flex gap-2 mb-6 px-2">
    <div class="w-3 h-3 rounded-full bg-red-400"></div>
    <div class="w-3 h-3 rounded-full bg-amber-400"></div>
    <div class="w-3 h-3 rounded-full bg-green-400"></div>
  </div>

  <div class="mb-8">
    <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Buat Organisasi</h2>
    <p class="text-slate-600 dark:text-slate-400 font-medium mt-1">
      Masukkan informasi lembaga atau masjid Anda
    </p>
  </div>

  <form method="POST" class="space-y-5">
    <!-- Organization Name -->
    <div>
      <label for="name" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
        Nama Lembaga / Masjid <span class="text-red-500">*</span>
      </label>
      <div class="relative">
        <Building2 class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          id="name"
          name="name"
          value={values.name || ''}
          placeholder="Contoh: Masjid Al-Fatihah"
          class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          required
        />
      </div>
      {#if errors?.name}
        <p class="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{errors.name}</p>
      {/if}
    </div>

    <!-- Address -->
    <div>
      <label for="address" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
        Alamat Lengkap <span class="text-red-500">*</span>
      </label>
      <div class="relative">
        <MapPin class="absolute left-4 top-4 w-5 h-5 text-slate-400" />
        <textarea
          id="address"
          name="address"
          value={values.address || ''}
          placeholder="Contoh: Jl. Sudirman No. 123, Jakarta Selatan, DKI Jakarta"
          class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
          rows="3"
          required
        ></textarea>
      </div>
      {#if errors?.address}
        <p class="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{errors.address}</p>
      {/if}
    </div>

    <!-- Phone -->
    <div>
      <label for="phone" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
        Nomor Telepon
      </label>
      <div class="relative">
        <Phone class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="tel"
          id="phone"
          name="phone"
          value={values.phone || ''}
          placeholder="Contoh: 081234567890"
          class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
        />
      </div>
      {#if errors?.phone}
        <p class="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{errors.phone}</p>
      {/if}
    </div>

    <!-- Email -->
    <div>
      <label for="email" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
        Email Organisasi
      </label>
      <div class="relative">
        <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="email"
          id="email"
          name="email"
          value={values.email || ''}
          placeholder="Contoh: info@masjidalfatihah.org"
          class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
        />
      </div>
      {#if errors?.email}
        <p class="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{errors.email}</p>
      {/if}
    </div>

    <div class="pt-4">
      <button type="submit" class="w-full flex items-center justify-center gap-2 py-4 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1">
        Lanjutkan
        <ArrowRight class="w-5 h-5" />
      </button>
    </div>
  </form>
</div>

<script>
  import { ArrowLeft, Users, MapPin, Home, Calculator, Package, DollarSign, CheckCircle } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  let { data, form } = $props();

  const organization = data.organization;
  const sectors = data.sectors;
  const settings = data.settings;

  const errors = $derived(form?.errors || {});
  const values = $derived(form?.values || {});

  let jenisZakat = $state(values.jenisZakat || 'uang');
  let jumlahJiwa = $state(parseInt(values.jumlahJiwa) || 1);

  // Calculate default amounts
  let defaultBeras = $derived((settings?.default_beras_per_jiwa || 2.5) * jumlahJiwa);
  let defaultUang = $derived((settings?.default_uang_per_jiwa || 40000) * jumlahJiwa);
</script>

<svelte:head>
  <title>Tambah Muzaki - {organization.name} | ZakatApp</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 lg:p-8">
  <!-- Header -->
  <div class="max-w-3xl mx-auto mb-8">
    <button onclick={() => goto('/o/{organization.slug}/muzaki')} class="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-bold mb-4 transition-colors">
      <ArrowLeft class="w-5 h-5" />
      Kembali
    </button>
    <div class="flex items-center gap-4 mb-2">
      <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/40">
        <Users class="w-7 h-7 text-white" />
      </div>
      <div>
        <h1 class="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Tambah Muzaki</h1>
        <p class="text-slate-600 dark:text-slate-400 font-medium">Catat pembayar zakat fitrah</p>
      </div>
    </div>
  </div>

  <!-- Form -->
  <form method="POST" class="max-w-3xl mx-auto space-y-6">
    <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8">
      <!-- Name -->
      <div class="mb-6">
        <label for="name" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          Nama Lengkap <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <Users class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            id="name"
            name="name"
            value={values.name || ''}
            class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
            placeholder="Nama pembayar zakat"
            required
          />
        </div>
        {#if errors.name}
          <p class="text-sm mt-2 text-red-600 dark:text-red-400 font-medium">{errors.name}</p>
        {/if}
      </div>

      <!-- Address -->
      <div class="mb-6">
        <label for="address" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          Alamat
        </label>
        <div class="relative">
          <Home class="absolute left-4 top-4 w-5 h-5 text-slate-400" />
          <textarea
            id="address"
            name="address"
            rows="2"
            class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium resize-none"
            placeholder="Alamat lengkap"
          >{values.address || ''}</textarea>
        </div>
      </div>

      <!-- Sector & Jumlah Jiwa -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label for="sectorId" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Sektor <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <MapPin class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select id="sectorId" name="sectorId" class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium appearance-none cursor-pointer" required>
              <option value="">Pilih Sektor</option>
              {#each sectors as sector}
                <option value={sector.id} selected={values.sectorId === sector.id}>{sector.name}</option>
              {/each}
            </select>
          </div>
          {#if errors.sectorId}
            <p class="text-sm mt-2 text-red-600 dark:text-red-400 font-medium">{errors.sectorId}</p>
          {/if}
        </div>

        <div>
          <label for="jumlahJiwa" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Jumlah Jiwa <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <Users class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="number"
              id="jumlahJiwa"
              name="jumlahJiwa"
              bind:value={jumlahJiwa}
              min="1"
              class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
              required
            />
          </div>
          {#if errors.jumlahJiwa}
            <p class="text-sm mt-2 text-red-600 dark:text-red-400 font-medium">{errors.jumlahJiwa}</p>
          {/if}
        </div>
      </div>

      <!-- Jenis Zakat -->
      <div class="mb-6">
        <label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Jenis Zakat</label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label class="cursor-pointer">
            <input type="radio" name="jenisZakat" value="uang" bind:group={jenisZakat} class="sr-only peer" />
            <div class="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 dark:peer-checked:bg-emerald-900/20 transition-all hover:shadow-lg">
              <div class="flex items-center justify-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <DollarSign class="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <p class="text-center font-bold text-slate-900 dark:text-white">Uang</p>
            </div>
          </label>

          <label class="cursor-pointer">
            <input type="radio" name="jenisZakat" value="beras" bind:group={jenisZakat} class="sr-only peer" />
            <div class="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 peer-checked:border-amber-500 peer-checked:bg-amber-50 dark:peer-checked:bg-amber-900/20 transition-all hover:shadow-lg">
              <div class="flex items-center justify-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Package class="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <p class="text-center font-bold text-slate-900 dark:text-white">Beras</p>
            </div>
          </label>

          <label class="cursor-pointer">
            <input type="radio" name="jenisZakat" value="keduanya" bind:group={jenisZakat} class="sr-only peer" />
            <div class="p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 transition-all hover:shadow-lg">
              <div class="flex items-center justify-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <CheckCircle class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p class="text-center font-bold text-slate-900 dark:text-white">Keduanya</p>
            </div>
          </label>
        </div>
      </div>

      <!-- Jumlah Beras -->
      {#if jenisZakat === 'beras' || jenisZakat === 'keduanya'}
        <div class="mb-6 p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <label for="jumlahBeras" class="block text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">
            <Package class="w-4 h-4 inline mr-1" />
            Jumlah Beras (kg)
          </label>
          <input
            type="number"
            id="jumlahBeras"
            name="jumlahBeras"
            value={values.jumlahBeras ?? defaultBeras}
            step="0.1"
            min="0"
            class="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
          />
          <p class="text-xs mt-2 text-amber-700 dark:text-amber-400 font-medium">Default: {defaultBeras} kg ({settings?.default_beras_per_jiwa || 2.5} kg × {jumlahJiwa} jiwa)</p>
        </div>
      {/if}

      <!-- Jumlah Uang -->
      {#if jenisZakat === 'uang' || jenisZakat === 'keduanya'}
        <div class="mb-6 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
          <label for="jumlahUang" class="block text-sm font-bold text-emerald-800 dark:text-emerald-300 mb-2">
            <DollarSign class="w-4 h-4 inline mr-1" />
            Jumlah Uang (Rp)
          </label>
          <input
            type="number"
            id="jumlahUang"
            name="jumlahUang"
            value={values.jumlahUang ?? defaultUang}
            min="0"
            class="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
          />
          <p class="text-xs mt-2 text-emerald-700 dark:text-emerald-400 font-medium">Default: Rp {defaultUang.toLocaleString('id-ID')} (Rp {(settings?.default_uang_per_jiwa || 40000).toLocaleString('id-ID')} × {jumlahJiwa} jiwa)</p>
        </div>
      {/if}

      {#if form?.error}
        <div class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p class="text-sm text-red-600 dark:text-red-400 font-medium">{form.error}</p>
        </div>
      {/if}
    </div>

    <!-- Actions -->
    <div class="flex flex-col sm:flex-row gap-4">
      <button type="button" onclick={() => goto('/o/{organization.slug}/muzaki')} class="flex-1 py-4 px-6 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-lg border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all">
        Batal
      </button>
      <button type="submit" class="flex-1 py-4 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1">
        Simpan Data Muzaki
      </button>
    </div>
  </form>
</div>

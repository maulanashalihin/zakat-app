<script>
  import { ArrowLeft, HandHeart, MapPin, Home, Users, Tag, FileText } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  let { data, form } = $props();

  const organization = data.organization;
  const sectors = data.sectors;

  const errors = $derived(form?.errors || {});
  const values = $derived(form?.values || {});
</script>

<svelte:head>
  <title>Tambah Mustahik - {organization.name} | ZakatApp</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 lg:p-8">
  <!-- Header -->
  <div class="max-w-3xl mx-auto mb-8">
    <button onclick={() => goto('/o/{organization.slug}/mustahik')} class="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-bold mb-4 transition-colors">
      <ArrowLeft class="w-5 h-5" />
      Kembali
    </button>
    <div class="flex items-center gap-4 mb-2">
      <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/40">
        <HandHeart class="w-7 h-7 text-white" />
      </div>
      <div>
        <h1 class="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Tambah Mustahik</h1>
        <p class="text-slate-600 dark:text-slate-400 font-medium">Catat penerima zakat fitrah</p>
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
            class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium"
            placeholder="Nama penerima zakat"
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
            class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium resize-none"
            placeholder="Alamat lengkap"
          >{values.address || ''}</textarea>
        </div>
      </div>

      <!-- Sector & Kategori -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label for="sectorId" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Sektor <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <MapPin class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select id="sectorId" name="sectorId" class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium appearance-none cursor-pointer" required>
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
          <label for="kategori" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Kategori
          </label>
          <div class="relative">
            <Tag class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select id="kategori" name="kategori" class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium appearance-none cursor-pointer">
              <option value="">Pilih Kategori</option>
              <option value="fakir" selected={values.kategori === 'fakir'}>Fakir</option>
              <option value="miskin" selected={values.kategori === 'miskin'}>Miskin</option>
              <option value="amil" selected={values.kategori === 'amil'}>Amil</option>
              <option value="mualaf" selected={values.kategori === 'mualaf'}>Mualaf</option>
              <option value="riqab" selected={values.kategori === 'riqab'}>Riqab</option>
              <option value="gharim" selected={values.kategori === 'gharim'}>Gharim</option>
              <option value="fisabilillah" selected={values.kategori === 'fisabilillah'}>Fisabilillah</option>
              <option value="ibnu_sabil" selected={values.kategori === 'ibnu_sabil'}>Ibnu Sabil</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Jumlah Jiwa & Keterangan -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
              value={values.jumlahJiwa || '1'}
              min="1"
              class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium"
              required
            />
          </div>
        </div>

        <div>
          <label for="status" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Status
          </label>
          <select id="status" name="status" class="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium">
            <option value="aktif" selected={values.status !== 'nonaktif'}>Aktif</option>
            <option value="nonaktif" selected={values.status === 'nonaktif'}>Nonaktif</option>
          </select>
        </div>
      </div>

      <!-- Keterangan -->
      <div class="mb-6">
        <label for="keterangan" class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          Keterangan
        </label>
        <div class="relative">
          <FileText class="absolute left-4 top-4 w-5 h-5 text-slate-400" />
          <textarea
            id="keterangan"
            name="keterangan"
            rows="3"
            class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium resize-none"
            placeholder="Keterangan tambahan (opsional)"
          >{values.keterangan || ''}</textarea>
        </div>
      </div>

      {#if form?.error}
        <div class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p class="text-sm text-red-600 dark:text-red-400 font-medium">{form.error}</p>
        </div>
      {/if}
    </div>

    <!-- Actions -->
    <div class="flex flex-col sm:flex-row gap-4">
      <button type="button" onclick={() => goto('/o/{organization.slug}/mustahik')} class="flex-1 py-4 px-6 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-lg border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all">
        Batal
      </button>
      <button type="submit" class="flex-1 py-4 px-6 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_40px_-10px_rgba(34,197,94,0.5)] hover:shadow-[0_0_60px_-15px_rgba(34,197,94,0.7)] hover:-translate-y-1">
        Simpan Data Mustahik
      </button>
    </div>
  </form>
</div>

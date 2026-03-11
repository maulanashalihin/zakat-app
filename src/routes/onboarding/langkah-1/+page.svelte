<script>
  let { data, form } = $props();
  
  const savedData = data.savedData;
  const values = form?.values || savedData || {};
  const errors = form?.errors || {};
</script>

<div class="bg-white rounded-lg shadow-sm p-6">
  <div class="mb-6">
    <h2 class="text-2xl font-bold text-slate-900">Buat Organisasi</h2>
    <p class="text-slate-600 mt-1">
      Masukkan informasi lembaga atau masjid Anda
    </p>
  </div>

  <form method="POST" class="space-y-6">
    <!-- Organization Name -->
    <div>
      <label for="name" class="block text-sm font-medium text-slate-700 mb-1">
        Nama Lembaga / Masjid <span class="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={values.name || ''}
        placeholder="Contoh: Masjid Al-Hidayah"
        class="input w-full {errors.name ? 'border-red-500' : ''}"
        required
      />
      {#if errors.name}
        <p class="text-red-500 text-sm mt-1">{errors.name}</p>
      {/if}
    </div>

    <!-- Address -->
    <div>
      <label for="address" class="block text-sm font-medium text-slate-700 mb-1">
        Alamat <span class="text-red-500">*</span>
      </label>
      <textarea
        id="address"
        name="address"
        rows="3"
        placeholder="Jl. Raya No. 123, Kecamatan, Kota"
        class="input w-full {errors.address ? 'border-red-500' : ''}"
        required
      >{values.address || ''}</textarea>
      {#if errors.address}
        <p class="text-red-500 text-sm mt-1">{errors.address}</p>
      {:else}
        <p class="text-slate-500 text-sm mt-1">Alamat lengkap untuk identifikasi</p>
      {/if}
    </div>

    <!-- Phone -->
    <div>
      <label for="phone" class="block text-sm font-medium text-slate-700 mb-1">
        Nomor Telepon
      </label>
      <input
        type="tel"
        id="phone"
        name="phone"
        value={values.phone || ''}
        placeholder="08123456789"
        class="input w-full"
      />
    </div>

    <!-- Email -->
    <div>
      <label for="email" class="block text-sm font-medium text-slate-700 mb-1">
        Email Organisasi
      </label>
      <input
        type="email"
        id="email"
        name="email"
        value={values.email || ''}
        placeholder="info@masjid.example.com"
        class="input w-full {errors.email ? 'border-red-500' : ''}"
      />
      {#if errors.email}
        <p class="text-red-500 text-sm mt-1">{errors.email}</p>
      {/if}
    </div>

    <!-- Info Box -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-start">
        <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div class="text-sm text-blue-800">
          <p class="font-medium">Informasi Penting</p>
          <p class="mt-1">
            Anda akan menjadi <strong>Admin</strong> di organisasi ini. 
            Nanti Anda bisa menambahkan petugas untuk membantu mengelola data zakat.
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex justify-end pt-4 border-t">
      <button type="submit" class="btn-primary">
        Lanjut ke Langkah 2
        <svg class="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </form>
</div>

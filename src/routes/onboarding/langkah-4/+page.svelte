<script>
  let { data, form } = $props();
  
  const sectors = data.sectors;
  
  // Initialize members array
  let members = $state(form?.values?.members || []);
  
  const errors = form?.errors || {};
  
  function addMember() {
    members = [...members, { name: '', email: '', role: 'petugas', sectorId: '' }];
  }
  
  function removeMember(index) {
    members = members.filter((_, i) => i !== index);
  }
</script>

<div class="bg-white rounded-lg shadow-sm p-6">
  <div class="mb-6">
    <h2 class="text-2xl font-bold text-slate-900">Undang Tim (Opsional)</h2>
    <p class="text-slate-600 mt-1">
      Tambahkan petugas untuk membantu mengelola zakat
    </p>
  </div>

  <form method="POST" class="space-y-4" action="?/default">
    {#if errors['members']}
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-600 text-sm">{errors['members']}</p>
      </div>
    {/if}

    <!-- Members List -->
    {#if members.length > 0}
      <div class="space-y-4">
        {#each members as member, i (i)}
          <div class="p-4 bg-slate-50 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <!-- Name -->
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">Nama</label>
                <input
                  type="text"
                  name="members[{i}].name"
                  bind:value={members[i].name}
                  placeholder="Nama petugas"
                  class="input w-full"
                  required
                />
              </div>
              
              <!-- Email -->
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">Email</label>
                <input
                  type="email"
                  name="members[{i}].email"
                  bind:value={members[i].email}
                  placeholder="email@example.com"
                  class="input w-full {errors[`members[${i}].email`] ? 'border-red-500' : ''}"
                  required
                />
              </div>
              
              <!-- Role -->
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">Peran</label>
                <select
                  name="members[{i}].role"
                  bind:value={members[i].role}
                  class="input w-full"
                >
                  <option value="petugas">Petugas (Input Data)</option>
                  <option value="viewer">Viewer (Lihat Laporan)</option>
                </select>
              </div>
              
              <!-- Sector (for petugas) -->
              <div class="flex gap-2">
                {#if members[i].role === 'petugas'}
                  <div class="flex-1">
                    <label class="block text-xs font-medium text-slate-600 mb-1">Sektor</label>
                    <select
                      name="members[{i}].sectorId"
                      bind:value={members[i].sectorId}
                      class="input w-full"
                    >
                      <option value="">Semua Sektor</option>
                      {#each sectors as sector}
                        <option value={sector.id || sector.name}>{sector.name}</option>
                      {/each}
                    </select>
                  </div>
                {/if}
                
                <!-- Remove Button -->
                <div class="flex items-end">
                  <button
                    type="button"
                    onclick={() => removeMember(i)}
                    class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mb-0.5"
                    title="Hapus"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}

    <!-- Add Button -->
    <button
      type="button"
      onclick={addMember}
      class="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-slate-400 hover:text-slate-800 transition-colors flex items-center justify-center"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      Tambah Anggota Tim
    </button>

    <!-- Role Info -->
    <div class="bg-slate-50 rounded-lg p-4 text-sm">
      <h4 class="font-medium text-slate-900 mb-2">Perbedaan Peran:</h4>
      <ul class="space-y-2 text-slate-600">
        <li class="flex items-start">
          <span class="font-medium text-slate-800 w-20">Petugas:</span>
          <span>Bisa input data muzaki, mengelola distribusi di sektor tertentu</span>
        </li>
        <li class="flex items-start">
          <span class="font-medium text-slate-800 w-20">Viewer:</span>
          <span>Hanya bisa melihat dashboard dan laporan, tidak bisa input/edit data</span>
        </li>
      </ul>
    </div>

    <!-- Navigation -->
    <div class="flex justify-between pt-4 border-t">
      <a href="/onboarding/langkah-3" class="btn-secondary">
        <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </a>
      <div class="flex gap-3">
        <button type="submit" formaction="?/skip" class="btn-secondary">
          Lewati
        </button>
        <button type="submit" class="btn-primary">
          Selesai
          <svg class="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>
  </form>
</div>

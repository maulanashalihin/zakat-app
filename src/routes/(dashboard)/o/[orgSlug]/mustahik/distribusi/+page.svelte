<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft, Package, Coins, Users, Check, Camera, User, FileText, HandHeart } from 'lucide-svelte';

	let { data } = $props();

	let selectedMustahik = $state<string | null>(null);
	let selectedPetugas = $state<string>(data.currentUser.id);
	let berasDiberikan = $state<number>(0);
	let uangDiberikan = $state<number>(0);
	let catatan = $state('');
	let buktiFoto: File | null = $state(null);
	let buktiPreview = $state<string | null>(null);
	let saving = $state(false);

	const selectedData = $derived(
		data.mustahikList.find(m => m.id === selectedMustahik)
	);

	function selectMustahik(mustahikId: string) {
		selectedMustahik = mustahikId;
		const m = data.mustahikList.find(x => x.id === mustahikId);
		if (m) {
			berasDiberikan = m.alokasi_beras || 0;
			uangDiberikan = m.alokasi_uang_lokal || 0;
		}
	}

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			buktiFoto = input.files[0];
			buktiPreview = URL.createObjectURL(input.files[0]);
		}
	}

	function getAsnafLabel(asnaf: string | null) {
		const map: Record<string, string> = {
			fakir: 'Fakir', miskin: 'Miskin', amil: 'Amil', mualaf: 'Mualaf',
			riqab: 'Riqab', gharim: 'Gharim', fisabilillah: 'Fisabilillah', ibnu_sabil: 'Ibnu Sabil'
		};
		return map[asnaf || ''] || '-';
	}

	function getAsnafColor(asnaf: string | null) {
		const map: Record<string, string> = {
			fakir: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
			miskin: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
			amil: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
			mualaf: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
			riqab: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
			gharim: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
			fisabilillah: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
			ibnu_sabil: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
		};
		return map[asnaf || ''] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
	}

	function getPriorityBadge(priority: string | null) {
		switch (priority) {
			case 'tinggi': return { text: '🔴 Tinggi', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' };
			case 'sedang': return { text: '🟡 Sedang', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' };
			case 'rendah': return { text: '🟢 Rendah', class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' };
			default: return { text: '-', class: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' };
		}
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!selectedMustahik || !selectedPetugas) return;

		saving = true;
		// Let the form submit normally
		(e.target as HTMLFormElement).submit();
	}
</script>

<svelte:head>
	<title>Distribusi Zakat - Zakat App</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-3 sm:p-4 lg:p-8">
	<!-- Header -->
	<div class="max-w-6xl mx-auto mb-8">
		<button onclick={() => goto('.')} class="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-bold mb-4 transition-colors">
			<ArrowLeft class="w-5 h-5" />
			Kembali
		</button>
		<div class="flex items-center gap-4 mb-2">
			<div class="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/40">
				<HandHeart class="w-7 h-7 text-white" />
			</div>
			<div>
				<h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Distribusi Zakat</h1>
				<p class="text-slate-600 dark:text-slate-400 font-medium">Catat penyaluran zakat ke mustahik</p>
			</div>
		</div>
	</div>

	{#if data.mustahikList.length === 0}
		<div class="max-w-3xl mx-auto">
			<div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8 sm:p-12 text-center">
				<div class="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
					<Package class="w-10 h-10 text-amber-600 dark:text-amber-400" />
				</div>
				<h2 class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-2">Tidak ada mustahik siap disalurkan</h2>
				<p class="text-sm text-slate-600 dark:text-slate-400 mb-6">Semua mustahik sudah disalurkan atau belum dialokasikan.</p>
				<button class="py-3 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all" onclick={() => goto('./alokasi')}>
					Ke Halaman Alokasi
				</button>
			</div>
		</div>
	{:else}
		<div class="max-w-6xl mx-auto">
			<!-- Mobile: Show list or form based on selection -->
			<div class="block lg:hidden mb-4">
				{#if selectedMustahik}
					<button class="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors" onclick={() => selectedMustahik = null}>
						<ArrowLeft class="w-4 h-4" />
						Kembali ke Daftar
					</button>
				{/if}
			</div>

			<div class="grid lg:grid-cols-3 gap-6">
				<!-- Left: Mustahik List -->
				<div class="lg:col-span-1 {selectedMustahik ? 'hidden lg:block' : ''}">
					<div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] overflow-hidden">
						<div class="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
							<h2 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
								<Users class="w-5 h-5 text-primary-500" />
								Mustahik Siap Disalurkan
							</h2>
							<p class="text-sm text-slate-600 dark:text-slate-400 mt-1">{data.mustahikList.length} orang</p>
						</div>
						<div class="max-h-[500px] lg:max-h-[600px] overflow-y-auto">
							{#each data.mustahikList as m}
								{@const p = getPriorityBadge(m.kategori_prioritas)}
								<button
									class="w-full text-left p-4 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors {selectedMustahik === m.id ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-l-primary-500' : ''}"
									onclick={() => selectMustahik(m.id)}
								>
									<div class="flex items-start justify-between mb-2">
										<div class="font-semibold text-slate-900 dark:text-white text-sm sm:text-base truncate pr-2">{m.name}</div>
										<span class="badge badge-xs {p.class} shrink-0">{p.text}</span>
									</div>
									<div class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2">{m.sector_name || '-'}</div>
									<div class="flex items-center gap-2 flex-wrap">
										<span class="badge badge-xs {getAsnafColor(m.kategori_asnaf)}">
											{getAsnafLabel(m.kategori_asnaf)}
										</span>
										<span class="badge badge-xs badge-ghost">
											{m.jumlah_jiwa} jiwa
										</span>
									</div>
								</button>
							{/each}
						</div>
					</div>
				</div>

				<!-- Right: Distribution Form -->
				<div class="lg:col-span-2 {selectedMustahik ? '' : 'hidden lg:block'}">
					{#if !selectedMustahik}
						<div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] p-8 sm:p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
							<div class="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
								<Package class="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
							</div>
							<p class="text-slate-600 dark:text-slate-400 text-sm sm:text-base">Pilih mustahik dari daftar untuk mencatat distribusi</p>
						</div>
					{:else}
						<form method="POST" class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-[0_20px_50px_rgb(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgb(0,0,0,0.4)] rounded-[2rem] overflow-hidden" onsubmit={handleSubmit}>
							<div class="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
								<h2 class="font-bold text-slate-900 dark:text-white">Form Distribusi</h2>
							</div>

							<div class="p-4 sm:p-6 lg:p-8 space-y-6">
								<!-- Mustahik Info -->
								<div class="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700">
									<div class="flex items-start justify-between mb-3">
										<div class="flex-1 min-w-0 pr-2">
											<h3 class="font-bold text-lg sm:text-xl text-slate-900 dark:text-white truncate">{selectedData?.name}</h3>
											<p class="text-sm text-slate-600 dark:text-slate-400">{selectedData?.address || 'Alamat tidak tersedia'}</p>
										</div>
										<span class="badge badge-sm {getAsnafColor(selectedData?.kategori_asnaf || null)} shrink-0">
											{getAsnafLabel(selectedData?.kategori_asnaf || null)}
										</span>
									</div>
									<div class="flex flex-wrap gap-2">
										<span class="badge badge-sm badge-ghost">
											<Users class="w-3 h-3 mr-1" />
											{selectedData?.jumlah_jiwa} jiwa
										</span>
										<span class="badge badge-sm badge-ghost">{selectedData?.sector_name || '-'}</span>
									</div>
								</div>

								<!-- Alokasi Info -->
								<div class="grid grid-cols-2 gap-4">
									<div class="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 sm:p-6 border border-amber-200 dark:border-amber-800">
										<div class="text-sm text-amber-800 dark:text-amber-300 font-medium mb-1">Alokasi Beras</div>
										<div class="text-xl sm:text-2xl font-bold text-amber-700 dark:text-amber-400">{selectedData?.alokasi_beras || 0} <span class="text-sm">kg</span></div>
									</div>
									<div class="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 sm:p-6 border border-emerald-200 dark:border-emerald-800">
										<div class="text-sm text-emerald-800 dark:text-emerald-300 font-medium mb-1">Alokasi Uang</div>
										<div class="text-lg sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400 truncate">
											Rp {(selectedData?.alokasi_uang_lokal || 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
										</div>
									</div>
								</div>

								<!-- Input Fields -->
								<div class="space-y-6">
									<!-- Petugas -->
									<div>
										<label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
											<User class="w-4 h-4 inline mr-1" />
											Petugas Penyalur
										</label>
										<div class="relative">
											<User class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
											<select class="w-full pl-12 pr-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium appearance-none cursor-pointer" bind:value={selectedPetugas} required>
												{#each data.petugasList as p}
													<option value={p.id}>{p.name}</option>
												{/each}
											</select>
										</div>
									</div>
 
									<!-- Catatan -->
									<div>
										<label class="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
											<FileText class="w-4 h-4 inline mr-1" />
											Catatan (opsional)
										</label>
										<div class="relative">
											<FileText class="absolute left-4 top-4 w-5 h-5 text-slate-400" />
											<textarea
												class="w-full pl-12 pr-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium resize-none"
												rows="3"
												bind:value={catatan}
												placeholder="Contoh: Diterima oleh istri, dll"
											></textarea>
										</div>
									</div>
								</div>
							</div>

							<!-- Submit -->
							<div class="p-4 sm:p-6 lg:p-8 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-end gap-4">
								<button type="button" class="py-3 sm:py-4 px-6 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all" onclick={() => selectedMustahik = null}>
									Batal
								</button>
								<button type="submit" class="py-3 sm:py-4 px-6 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1" disabled={saving}>
									{#if saving}
										<span class="loading loading-spinner loading-sm mr-2"></span>
										Menyimpan...
									{:else}
										<Check class="w-4 h-4 inline mr-2" />
										Simpan Distribusi
									{/if}
								</button>
							</div>

							<input type="hidden" name="distribution" value={JSON.stringify({
								mustahikId: selectedMustahik,
								allocationId: selectedData?.allocation_id,
								petugasId: selectedPetugas,
								beras: berasDiberikan,
								uang: uangDiberikan,
								catatan
							})} />
						</form>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

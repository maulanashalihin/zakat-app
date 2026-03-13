<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeft, Package, Coins, Users, Save, Calculator, CheckSquare, Square } from 'lucide-svelte';

	let { data } = $props();

	interface AllocationData {
		mustahikId: string;
		beras: number;
		uang: number;
	}

	// Build allocations map from existing data
	const allocations = $state<Record<string, AllocationData>>(
		Object.fromEntries(
			data.mustahikList.map(m => {
				const jumlahJiwa = m.jumlah_jiwa || 1;
				return [m.id, {
					mustahikId: m.id,
					beras: m.alokasi_beras ?? (data.defaultBeras * jumlahJiwa),
					uang: m.alokasi_uang_lokal ?? (data.defaultUang * jumlahJiwa)
				}];
			})
		)
	);

	// Track selected mustahik
	const selected = $state<Record<string, boolean>>(
		Object.fromEntries(data.mustahikList.map(m => [m.id, false]))
	);

	const allSelected = $derived(
		data.mustahikList.length > 0 && data.mustahikList.every(m => selected[m.id])
	);

	function toggleAll() {
		const newValue = !allSelected;
		data.mustahikList.forEach(m => selected[m.id] = newValue);
	}

	function toggleOne(id: string) {
		selected[id] = !selected[id];
	}

	function applyAuto() {
		data.mustahikList.forEach(m => {
			if (selected[m.id]) {
				const jumlahJiwa = m.jumlah_jiwa || 1;
				allocations[m.id] = {
					mustahikId: m.id,
					beras: data.defaultBeras * jumlahJiwa,
					uang: data.defaultUang * jumlahJiwa
				};
			}
		});
	}

	const totalSelected = $derived(
		data.mustahikList.filter(m => selected[m.id]).length
	);

	const totals = $derived(
		data.mustahikList
			.filter(m => selected[m.id])
			.reduce((acc, m) => {
				acc.beras += allocations[m.id]?.beras || 0;
				acc.uang += allocations[m.id]?.uang || 0;
				return acc;
			}, { beras: 0, uang: 0, count: data.mustahikList.filter(m => selected[m.id]).length })
	);

	function getAsnafLabel(asnaf: string | null) {
		const map: Record<string, string> = {
			fakir: 'Fakir', miskin: 'Miskin', amil: 'Amil', mualaf: 'Mualaf',
			riqab: 'Riqab', gharim: 'Gharim', fisabilillah: 'Fisabilillah', ibnu_sabil: 'Ibnu Sabil'
		};
		return map[asnaf || ''] || '-';
	}

	function getAsnafColor(asnaf: string | null) {
		const map: Record<string, string> = {
			fakir: 'bg-rose-100 text-rose-700 border-rose-200',
			miskin: 'bg-orange-100 text-orange-700 border-orange-200',
			amil: 'bg-emerald-100 text-emerald-700 border-emerald-200',
			mualaf: 'bg-blue-100 text-blue-700 border-blue-200',
			riqab: 'bg-purple-100 text-purple-700 border-purple-200',
			gharim: 'bg-pink-100 text-pink-700 border-pink-200',
			fisabilillah: 'bg-indigo-100 text-indigo-700 border-indigo-200',
			ibnu_sabil: 'bg-teal-100 text-teal-700 border-teal-200'
		};
		return map[asnaf || ''] || 'bg-slate-100 text-slate-600 border-slate-200';
	}

	function getPriorityBadge(priority: string | null) {
		switch (priority) {
			case 'tinggi': return { text: 'Prio Tinggi', class: 'text-rose-600 bg-rose-50 border-rose-100' };
			case 'sedang': return { text: 'Prio Sedang', class: 'text-amber-600 bg-amber-50 border-amber-100' };
			case 'rendah': return { text: 'Prio Rendah', class: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
			default: return { text: '-', class: 'text-slate-500 bg-slate-50 border-slate-100' };
		}
	}

	let saving = $state(false);
</script>

<svelte:head>
	<title>Alokasi Mustahik - Zakat App</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
	<!-- Header -->
	<div class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<div class="flex items-center gap-4">
				<button class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" onclick={() => goto('.')}>
					<ArrowLeft class="w-5 h-5 text-slate-600" />
				</button>
				<div>
					<h1 class="text-xl font-bold text-slate-900 dark:text-white">Alokasi Mustahik</h1>
					<p class="text-sm text-slate-500">Tentukan jumlah beras dan uang untuk setiap mustahik</p>
				</div>
			</div>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
		{#if data.mustahikList.length === 0}
			<div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center">
				<div class="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
					<Package class="w-10 h-10 text-emerald-600" />
				</div>
				<h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">Semua mustahik sudah dialokasikan!</h2>
				<p class="text-slate-500 mb-6">Tidak ada mustahik yang perlu dialokasikan saat ini.</p>
				<button class="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium hover:opacity-90 transition-opacity" onclick={() => goto('.')}>
					Kembali ke Daftar Mustahik
				</button>
			</div>
		{:else}
			<!-- Toolbar -->
			<div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 mb-4">
				<div class="flex flex-wrap items-center justify-between gap-4">
					<button class="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium text-slate-700 dark:text-slate-300" onclick={toggleAll}>
						{#if allSelected}
							<CheckSquare class="w-4 h-4" />
						{:else}
							<Square class="w-4 h-4" />
						{/if}
						<span>Pilih Semua ({totalSelected})</span>
					</button>

					<button class="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed" onclick={applyAuto} disabled={totalSelected === 0}>
						<Calculator class="w-4 h-4" />
						<span>Auto ({data.defaultBeras}kg × {data.defaultUang.toLocaleString('id-ID')})</span>
					</button>
				</div>
			</div>

			<form method="POST" class="space-y-4">
				<!-- Cards Grid -->
				<div class="grid gap-3">
					{#each data.mustahikList as m}
						{@const p = getPriorityBadge(m.kategori_prioritas)}
						<div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border {selected[m.id] ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 dark:border-slate-800'} transition-all overflow-hidden">
							<div class="p-4">
								<div class="flex items-start gap-4">
									<!-- Checkbox -->
									<button type="button" class="mt-1 shrink-0" onclick={() => toggleOne(m.id)}>
										{#if selected[m.id]}
											<div class="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
												<svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
											</div>
										{:else}
											<div class="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded"></div>
										{/if}
									</button>

									<!-- Content -->
									<div class="flex-1 min-w-0">
										<!-- Header Row -->
										<div class="flex flex-wrap items-start gap-2 mb-2">
											<h3 class="font-semibold text-slate-900 dark:text-white truncate">{m.name}</h3>
											<span class="px-2 py-0.5 text-xs font-medium rounded-full border {getAsnafColor(m.kategori_asnaf)}">
												{getAsnafLabel(m.kategori_asnaf)}
											</span>
											<span class="px-2 py-0.5 text-xs font-medium rounded-full border {p.class}">
												{p.text}
											</span>
										</div>

										<!-- Info Row -->
										<div class="flex items-center gap-4 text-sm text-slate-500 mb-4">
											<span class="flex items-center gap-1.5">
												<Users class="w-4 h-4" />
												{m.jumlah_jiwa} jiwa
											</span>
											<span class="text-slate-300">|</span>
											<span>{m.sector_name || '-'}</span>
										</div>

										<!-- Inputs Row -->
										<div class="grid grid-cols-2 gap-3">
											<div class="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
												<label class="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-2">
													<Package class="w-3.5 h-3.5" />
													Beras (kg)
												</label>
												<input
													type="number"
													step="0.1"
													min="0"
													class="w-full bg-transparent text-lg font-semibold text-slate-900 dark:text-white focus:outline-none"
													bind:value={allocations[m.id].beras}
													onfocus={() => selected[m.id] = true}
												/>
											</div>
											<div class="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
												<label class="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-2">
													<Coins class="w-3.5 h-3.5" />
													Uang (Rp)
												</label>
												<input
													type="number"
													min="0"
													class="w-full bg-transparent text-lg font-semibold text-slate-900 dark:text-white focus:outline-none"
													bind:value={allocations[m.id].uang}
													onfocus={() => selected[m.id] = true}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<input type="hidden" name="allocations[]" value={JSON.stringify(allocations[m.id])} />
					{/each}
				</div>

				<!-- Floating Summary Bar -->
				{#if totalSelected > 0}
					<div class="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 shadow-lg z-20">
						<div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
							<div class="flex items-center gap-6">
								<div>
									<div class="text-xs text-slate-500">Dipilih</div>
									<div class="text-lg font-bold text-slate-900 dark:text-white">{totals.count}</div>
								</div>
								<div class="hidden sm:block">
									<div class="text-xs text-slate-500">Total Beras</div>
									<div class="text-lg font-bold text-amber-600">{totals.beras.toFixed(1)} kg</div>
								</div>
								<div class="hidden sm:block">
									<div class="text-xs text-slate-500">Total Uang</div>
									<div class="text-lg font-bold text-emerald-600">
										{#if totals.uang >= 1000000}
											Rp {(totals.uang / 1000000).toFixed(1)}jt
										{:else}
											Rp {(totals.uang / 1000).toFixed(0)}rb
										{/if}
									</div>
								</div>
							</div>
							<button type="submit" class="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50" disabled={saving}>
								{#if saving}
									<span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
									<span>Menyimpan...</span>
								{:else}
									<Save class="w-4 h-4" />
									<span>Simpan Alokasi</span>
								{/if}
							</button>
						</div>
					</div>
					<div class="h-20"></div><!-- Spacer for fixed bar -->
				{:else}
					<div class="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-8 text-center">
						<p class="text-slate-500">Pilih mustahik untuk dialokasikan</p>
					</div>
				{/if}
			</form>
		{/if}
	</div>
</div>

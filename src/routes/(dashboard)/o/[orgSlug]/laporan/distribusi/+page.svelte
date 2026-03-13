<script lang="ts">
	import { ArrowLeft, Search, Filter, Calendar, Package, Coins, Users, User, MapPin, FileText, Download } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();

	let searchQuery = $state('');
	let dateFrom = $state('');
	let dateTo = $state('');
	let selectedSector = $state('');
	let selectedAsnaf = $state('');

	function formatDate(timestamp: number | null) {
		if (!timestamp) return '-';
		return new Date(timestamp).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	}

	function formatDateTime(timestamp: number | null) {
		if (!timestamp) return '-';
		return new Date(timestamp).toLocaleString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
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

	function exportToCSV() {
		const headers = ['Tanggal', 'Nama Mustahik', 'Asnaf', 'Sektor', 'Jiwa', 'Beras (kg)', 'Uang (Rp)', 'Petugas', 'Catatan'];
		const rows = data.distributions.map(d => [
			formatDate(d.tanggal_distribusi),
			d.mustahik_name,
			getAsnafLabel(d.kategori_asnaf),
			d.sector_name || '-',
			d.jumlah_jiwa,
			d.jumlah_beras,
			d.jumlah_uang,
			d.petugas_name || '-',
			d.catatan || '-'
		]);
		
		const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `laporan-distribusi-${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
	}
</script>

<svelte:head>
	<title>Laporan Distribusi - {data.organization.name}</title>
</svelte:head>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
	<!-- Header -->
	<div class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
			<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div class="flex items-center gap-4">
					<button class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" onclick={() => goto('/o/' + data.organization.slug + '/mustahik')}>
						<ArrowLeft class="w-5 h-5 text-slate-600" />
					</button>
					<div>
						<h1 class="text-xl font-bold text-slate-900 dark:text-white">Laporan Distribusi Zakat</h1>
						<p class="text-sm text-slate-500">Data penyaluran zakat yang telah tercatat</p>
					</div>
				</div>
				<button onclick={exportToCSV} class="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
					<Download class="w-4 h-4" />
					<span>Export CSV</span>
				</button>
			</div>
		</div>
	</div>

	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
		<!-- Summary Cards -->
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
			<div class="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
						<Users class="w-5 h-5 text-blue-600" />
					</div>
					<div>
						<p class="text-xs text-slate-500">Total Mustahik</p>
						<p class="text-xl font-bold text-slate-900 dark:text-white">{data.summary.totalMustahik}</p>
					</div>
				</div>
			</div>
			<div class="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
						<Package class="w-5 h-5 text-amber-600" />
					</div>
					<div>
						<p class="text-xs text-slate-500">Total Beras</p>
						<p class="text-xl font-bold text-slate-900 dark:text-white">{data.summary.totalBeras.toFixed(1)} <span class="text-sm">kg</span></p>
					</div>
				</div>
			</div>
			<div class="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
						<Coins class="w-5 h-5 text-emerald-600" />
					</div>
					<div>
						<p class="text-xs text-slate-500">Total Uang</p>
						<p class="text-xl font-bold text-slate-900 dark:text-white">Rp {(data.summary.totalUang / 1000000).toFixed(1)}<span class="text-sm">jt</span></p>
					</div>
				</div>
			</div>
			<div class="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
						<FileText class="w-5 h-5 text-purple-600" />
					</div>
					<div>
						<p class="text-xs text-slate-500">Rata-rata/Mustahik</p>
						<p class="text-xl font-bold text-slate-900 dark:text-white">
							{data.summary.totalMustahik > 0 ? (data.summary.totalBeras / data.summary.totalMustahik).toFixed(1) : 0} <span class="text-sm">kg</span>
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Breakdown by Asnaf -->
		{#if Object.keys(data.summary.byAsnaf).length > 0}
			<div class="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
				<h3 class="text-sm font-semibold text-slate-900 dark:text-white mb-3">Distribusi per Asnaf</h3>
				<div class="flex flex-wrap gap-2">
					{#each Object.entries(data.summary.byAsnaf) as [asnaf, stats]}
						<div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
							<span class="text-xs font-medium {getAsnafColor(asnaf)}">{getAsnafLabel(asnaf)}</span>
							<span class="text-xs text-slate-500">{stats.count} orang</span>
							<span class="text-xs text-amber-600">{stats.beras.toFixed(1)}kg</span>
							<span class="text-xs text-emerald-600">Rp {(stats.uang / 1000).toFixed(0)}k</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Filters -->
		<div class="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
			<form method="GET" class="flex flex-col lg:flex-row gap-3">
				<div class="flex-1 relative">
					<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
					<input
						type="text"
						name="search"
						placeholder="Cari nama mustahik..."
						class="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
						bind:value={searchQuery}
					/>
				</div>
				<select name="sector" class="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" bind:value={selectedSector}>
					<option value="">Semua Sektor</option>
					{#each data.sectors as sector}
						<option value={sector.id}>{sector.name}</option>
					{/each}
				</select>
				<select name="asnaf" class="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm" bind:value={selectedAsnaf}>
					<option value="">Semua Asnaf</option>
					<option value="fakir">Fakir</option>
					<option value="miskin">Miskin</option>
					<option value="amil">Amil</option>
					<option value="mualaf">Mualaf</option>
					<option value="riqab">Riqab</option>
					<option value="gharim">Gharim</option>
					<option value="fisabilillah">Fisabilillah</option>
					<option value="ibnu_sabil">Ibnu Sabil</option>
				</select>
				<div class="flex gap-2">
					<input
						type="date"
						name="dateFrom"
						placeholder="Dari"
						class="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
						bind:value={dateFrom}
					/>
					<input
						type="date"
						name="dateTo"
						placeholder="Sampai"
						class="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
						bind:value={dateTo}
					/>
				</div>
				<button type="submit" class="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
					Filter
				</button>
			</form>
		</div>

		<!-- Distribution List -->
		{#if data.distributions.length === 0}
			<div class="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800">
				<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
					<FileText class="w-8 h-8 text-slate-400" />
				</div>
				<h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">Belum ada data distribusi</h3>
				<p class="text-sm text-slate-500">Data penyaluran zakat akan muncul di sini setelah distribusi tercatat.</p>
			</div>
		{:else}
			<div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
								<th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Tanggal</th>
								<th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Mustahik</th>
								<th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Asnaf</th>
								<th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Sektor</th>
								<th class="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Beras</th>
								<th class="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Uang</th>
								<th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Petugas</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-200 dark:divide-slate-700">
							{#each data.distributions as d}
								<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
									<td class="px-4 py-3 whitespace-nowrap">
										<div class="text-sm text-slate-900 dark:text-white">{formatDate(d.tanggal_distribusi)}</div>
										<div class="text-xs text-slate-500">{formatDateTime(d.created_at)}</div>
									</td>
									<td class="px-4 py-3">
										<div class="font-medium text-slate-900 dark:text-white">{d.mustahik_name}</div>
										<div class="text-xs text-slate-500">{d.jumlah_jiwa} jiwa</div>
									</td>
									<td class="px-4 py-3">
										<span class="px-2 py-1 text-xs font-medium rounded-full border {getAsnafColor(d.kategori_asnaf)}">
											{getAsnafLabel(d.kategori_asnaf)}
										</span>
									</td>
									<td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{d.sector_name || '-'}</td>
									<td class="px-4 py-3 text-right">
										<span class="text-sm font-medium text-amber-600">{d.jumlah_beras?.toFixed(1) || 0} kg</span>
									</td>
									<td class="px-4 py-3 text-right">
										<span class="text-sm font-medium text-emerald-600">Rp {(d.jumlah_uang || 0).toLocaleString('id-ID')}</span>
									</td>
									<td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
										<div class="flex items-center gap-1">
											<User class="w-3 h-3" />
											{d.petugas_name || '-'}
										</div>
										{#if d.catatan}
											<div class="text-xs text-slate-400 mt-1">{d.catatan}</div>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	</div>
</div>

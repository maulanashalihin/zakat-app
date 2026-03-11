<script lang="ts">
  import { Building2, Shield, Zap, Users, Database, CheckCircle, Smartphone, Globe, Lock, Menu, X, Play, TrendingUp, Baby, Building, BookOpen, Calculator, Layers, UsersRound, HandHeart, FileUp, Flag, ChevronDown, Landmark } from 'lucide-svelte';

  // Mobile menu state
  let isMenuOpen = $state(false);

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function closeMenu() {
    isMenuOpen = false;
  }
</script>

<svelte:head>
  <title>ZakatApp - Platform Manajemen Zakat Modern</title>
  <meta name="description" content="Kelola zakat fitrah dengan mudah dan cepat. Platform modern untuk masjid dan lembaga amil zakat.">
</svelte:head>
<div class="font-sans text-slate-800 bg-slate-50 selection:bg-primary-500 selection:text-white overflow-x-hidden">

    <div class="fixed w-full z-50 top-6 px-4 flex flex-col items-center pointer-events-none animate-fade-in-down">
        <nav class="pointer-events-auto relative bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-full px-6 py-3 flex items-center justify-between w-full max-w-5xl transition-all duration-300 z-50">
            <div class="flex items-center gap-2 cursor-pointer">
                <div class="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm shadow-lg shadow-primary-500/40">
                    <Building2 class="w-4 h-4" />
                </div>
                <span class="font-extrabold text-xl tracking-tight text-slate-900">Zakat<span class="text-primary-600">App</span></span>
            </div>

            <div class="hidden md:flex items-center space-x-8">
                <a href="#keunggulan" class="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">Keunggulan</a>
                <a href="#fitur" class="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">Fitur</a>
                <a href="#cara-kerja" class="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">Cara Kerja</a>
            </div>

            <div class="hidden md:flex items-center gap-4">
                <a href="/login" class="text-sm font-bold text-slate-900 hover:text-primary-600 transition-colors">Login</a>
                <a href="/register" class="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5">Daftar Gratis</a>
            </div>

            <button onclick={toggleMenu} class="md:hidden text-slate-800 focus:outline-none p-1" aria-label="Toggle menu">
                {#if isMenuOpen}
                    <X class="w-6 h-6" />
                {:else}
                    <Menu class="w-6 h-6" />
                {/if}
            </button>
        </nav>

        {#if isMenuOpen}
            <div class="pointer-events-auto absolute top-16 w-[calc(100%-2rem)] max-w-md bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl p-4 flex flex-col gap-4 origin-top transition-all duration-300 z-40">
                <a href="#keunggulan" onclick={closeMenu} class="text-base font-bold text-slate-700 p-2 hover:bg-primary-50 rounded-lg">Keunggulan</a>
                <a href="#fitur" onclick={closeMenu} class="text-base font-bold text-slate-700 p-2 hover:bg-primary-50 rounded-lg">Fitur</a>
                <a href="#cara-kerja" onclick={closeMenu} class="text-base font-bold text-slate-700 p-2 hover:bg-primary-50 rounded-lg">Cara Kerja</a>
                <div class="h-[1px] w-full bg-slate-100 my-1"></div>
                <a href="/login" onclick={closeMenu} class="text-center text-base font-bold text-slate-900 p-2">Login</a>
                <a href="/register" onclick={closeMenu} class="text-center bg-primary-600 text-white px-5 py-3 rounded-xl text-base font-bold shadow-md">Daftar Gratis Sekarang</a>
            </div>
        {/if}
    </div>

    <section class="relative pt-40 pb-20 lg:pt-52 lg:pb-32 overflow-hidden flex flex-col items-center">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-400/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div class="absolute top-40 -right-20 w-72 h-72 bg-emerald-300/30 rounded-full mix-blend-multiply filter blur-[80px] animate-blob -z-10"></div>
        <div class="absolute top-40 -left-20 w-72 h-72 bg-teal-300/30 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000 -z-10"></div>

        <div class="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <div class="reveal">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-slate-200/60 shadow-sm text-slate-700 font-bold text-xs uppercase tracking-wider mb-8">
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                    </span>
                    100% Gratis untuk DKM & Lembaga
                </div>

                <h1 class="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tighter leading-[1.1] mb-6">
                    Zakat Rapi, <br class="hidden md:block" />
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-400">Transparan & Terpusat.</span>
                </h1>
                
                <p class="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                    Tinggalkan pembukuan manual dan kalkulator. Platform modern untuk mengelola ribuan Muzaki dan Mustahik secara real-time dari satu <em>dashboard</em>.
                </p>
            </div>

            <div class="reveal delay-100 flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                <a href="/register" class="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold text-lg transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1">
                    Mulai Setup Masjid
                </a>
                <a href="#cara-kerja" class="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-2xl font-bold text-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-2 shadow-sm">
                    <Play class="w-5 h-5 text-primary-600 fill-current" /> Lihat Demo
                </a>
            </div>
        </div>


        <div class="w-full max-w-6xl mx-auto px-4 relative z-20 reveal delay-200">
            <div class="relative rounded-[2rem] bg-white p-2 md:p-4 shadow-[0_20px_50px_rgb(0,0,0,0.1)] border border-slate-100/50 backdrop-blur-sm transform -rotate-1 hover:rotate-0 transition-transform duration-700">
                <div class="flex gap-2 mb-4 px-4 pt-2">
                    <div class="w-3 h-3 rounded-full bg-red-400"></div>
                    <div class="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div class="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <img src="/images/dashboard-preview.png" alt="Dashboard ZakatApp" class="rounded-2xl w-full h-auto border border-slate-100 object-cover shadow-inner bg-slate-100 aspect-video">
                
                <div class="absolute -right-4 md:-right-12 bottom-12 md:bottom-24 bg-white/80 backdrop-blur-xl border border-white/50 p-4 md:p-6 rounded-3xl shadow-2xl animate-float max-w-xs">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                            <TrendingUp class="w-6 h-6" />
                        </div>
                        <div>
                            <p class="text-sm text-slate-500 font-bold uppercase tracking-wider">Tersalurkan</p>
                            <p class="text-2xl font-extrabold text-slate-900">85%</p>
                        </div>
                    </div>
                    <div class="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-emerald-400 to-primary-600 w-[85%] rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
<div class="w-full border-y border-slate-200 bg-white/50 backdrop-blur-sm py-10 reveal">
        <div class="max-w-5xl mx-auto px-4">
            <p class="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Siap mendukung ekosistem zakat di seluruh Indonesia</p>
            <div class="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                <div class="flex items-center gap-2 font-extrabold text-xl text-slate-800"><Building2 class="w-5 h-5" /> DKM Raya</div>
                <div class="flex items-center gap-2 font-extrabold text-xl text-slate-800"><Baby class="w-5 h-5" /> Yayasan Peduli</div>
                <div class="flex items-center gap-2 font-extrabold text-xl text-slate-800"><Landmark class="w-5 h-5" /> Baitul Mal</div>
                <div class="flex items-center gap-2 font-extrabold text-xl text-slate-800"><BookOpen class="w-5 h-5" /> Majelis Taklim</div>
            </div>
        </div>
    </div>

    <section id="keunggulan" class="py-24 bg-white relative">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-2xl mx-auto mb-16 reveal">
                <h2 class="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">Mendesain Ulang Cara<br/>Masjid Mengelola Zakat.</h2>
                <p class="text-lg text-slate-600 font-medium">Sistem kelas <em>Enterprise</em> yang disederhanakan agar mudah digunakan oleh pengurus DKM dari layar HP mereka.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
                
                <div class="md:col-span-2 reveal bg-slate-50 border border-slate-100 rounded-[2rem] p-8 md:p-10 relative overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div class="relative z-10 w-full h-full flex flex-col justify-between">
                        <div>
                            <div class="w-14 h-14 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center text-primary-600 mb-6">
                                <Shield class="w-7 h-7" />
                            </div>
                            <h3 class="text-2xl font-extrabold text-slate-900 mb-4">Multi-Organisasi, 100% Terisolasi</h3>
                            <p class="text-slate-600 text-lg font-medium leading-relaxed max-w-md">Tidak peduli seberapa banyak masjid atau lembaga yang mendaftar, data jamaah Anda dikunci dengan aman di <em>workspace</em> masing-masing.</p>
                        </div>
                        <div class="mt-8 flex gap-3 opacity-80">
                            <div class="px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 text-sm font-bold flex items-center gap-2"><Lock class="w-4 h-4 text-slate-400" /> Masjid Raya A</div>
                            <div class="px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 text-sm font-bold flex items-center gap-2"><Lock class="w-4 h-4 text-slate-400" /> Yayasan B</div>
                        </div>
                    </div>
                </div>

                <div class="reveal delay-100 bg-gradient-to-br from-primary-600 to-primary-800 rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
                    <div class="absolute -right-10 -top-10 text-9xl text-white/10 group-hover:scale-110 transition-transform duration-500">
                        <Zap class="w-32 h-32" />
                    </div>
                    <div class="relative z-10">
                        <div class="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6">
                            <Calculator class="w-7 h-7" />
                        </div>
                        <h3 class="text-2xl font-extrabold mb-4">Kalkulasi Cerdas</h3>
                        <p class="text-primary-100 text-lg font-medium leading-relaxed mb-6">Selisih beras, konversi uang, dan pembagian ke mustahik dihitung otomatis tanpa kalkulator.</p>
                        <div class="bg-black/20 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                            <div class="text-xs text-primary-200 mb-1">Total Zakat Beras</div>
                            <div class="text-xl font-bold">1,250 <span class="text-sm font-normal">Kg</span></div>
                        </div>
                    </div>
                </div>

                <div class="md:col-span-3 reveal delay-200 bg-slate-900 rounded-[2rem] p-8 md:p-12 overflow-hidden relative flex flex-col md:flex-row items-center justify-between group">
                    <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div class="relative z-10 md:w-1/2 mb-8 md:mb-0">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold mb-4">
                            <Users class="w-4 h-4 text-primary-400" /> Kolaborasi
                        </div>
                        <h3 class="text-3xl font-extrabold text-white mb-4">Kerja Tim Sektor per Wilayah.</h3>
                        <p class="text-slate-400 text-lg font-medium">Undang amil/petugas lain dan tugaskan mereka khusus di sektor tertentu (RT/RW). Input data serentak langsung dari <em>smartphone</em> masing-masing di lapangan.</p>
                    </div>
                    <div class="relative z-10 md:w-5/12 w-full">
                        <div class="bg-slate-800/80 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-xl flex flex-col gap-3 transform group-hover:-translate-y-2 transition-transform duration-500">
                            <div class="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl">
                                <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white text-sm">A</div>
                                <div><p class="text-white text-sm font-bold">Ahmad (Petugas)</p><p class="text-slate-400 text-xs">Menambah Muzaki di Sektor RT 01</p></div>
                                <div class="ml-auto text-xs text-primary-400">Baru saja</div>
                            </div>
                            <div class="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl">
                                <div class="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-white text-sm">B</div>
                                <div><p class="text-white text-sm font-bold">Budi (Admin)</p><p class="text-slate-400 text-xs">Mencairkan Distribusi ke Mustahik</p></div>
                                <div class="ml-auto text-xs text-slate-500">5m lalu</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <script>
        document.addEventListener("DOMContentLoaded", function() {
            // FAQ accordion toggle
            document.querySelectorAll('.faq-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const content = this.nextElementSibling;
                    const icon = this.querySelector('svg');
                    
                    // Toggle current item
                    content.classList.toggle('hidden');
                    icon?.classList.toggle('rotate-180');
                    
                    // Close other items
                    document.querySelectorAll('.faq-btn').forEach(otherBtn => {
                        if (otherBtn !== this) {
                            otherBtn.nextElementSibling?.classList.add('hidden');
                            otherBtn.querySelector('svg')?.classList.remove('rotate-180');
                        }
                    });
                });
            });

            // Scroll reveal animation
            const reveals = document.querySelectorAll(".reveal");

            function revealOnScroll() {
                const windowHeight = window.innerHeight;
                const elementVisible = 100;

                reveals.forEach((reveal) => {
                    const elementTop = reveal.getBoundingClientRect().top;
                    if (elementTop < windowHeight - elementVisible) {
                        reveal.classList.add("active");
                    }
                });
            }

            window.addEventListener("scroll", revealOnScroll);
            revealOnScroll(); // Trigger once on load untuk element paling atas (Hero)
        });
    </script>

    <section id="fitur" class="py-24 bg-slate-950 relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary-600/10 blur-[150px] rounded-full pointer-events-none"></div>
        <div class="absolute top-0 right-0 w-96 h-96 bg-teal-900/30 blur-[120px] rounded-full pointer-events-none"></div>

        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 reveal">
            <div class="text-center max-w-3xl mx-auto mb-20">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-900/50 border border-primary-500/30 text-primary-400 text-xs font-bold uppercase tracking-widest mb-6">
                    <Layers class="w-4 h-4" /> Fitur Super
                </div>
                <h2 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">Semua yang Anda butuhkan,<br/>tanpa kerumitan.</h2>
                <p class="text-lg text-slate-400 font-medium">Dari pencatatan Muzaki hingga distribusi ke Mustahik, semua terpusat dalam satu alur kerja yang intuitif.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="glow-card bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8 relative group hover:-translate-y-1 transition-transform duration-300 cursor-default">
                    <div class="w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-primary-400 mb-6 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 shadow-[0_0_0_0_rgba(16,185,129,0)] group-hover:shadow-[0_0_20px_0_rgba(16,185,129,0.4)]">
                        <UsersRound class="w-6 h-6" />
                    </div>
                    <h4 class="text-xl font-bold text-white mb-3">Manajemen Muzaki</h4>
                    <p class="text-slate-400 text-sm leading-relaxed mb-6">Catat pembayaran zakat beras, uang, atau infaq dengan cepat. Sistem mendeteksi otomatis jika ada nama/alamat duplikat.</p>
                    <div class="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-500">Filter Sektor & Petugas</span>
                        <CheckCircle class="w-4 h-4 text-primary-500" />
                    </div>
                </div>

                <div class="glow-card bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8 relative group hover:-translate-y-1 transition-transform duration-300 cursor-default">
                    <div class="w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-primary-400 mb-6 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 shadow-[0_0_0_0_rgba(16,185,129,0)] group-hover:shadow-[0_0_20px_0_rgba(16,185,129,0.4)]">
                        <HandHeart class="w-6 h-6" />
                    </div>
                    <h4 class="text-xl font-bold text-white mb-3">Distribusi Mustahik</h4>
                    <p class="text-slate-400 text-sm leading-relaxed mb-6">Kelompokkan penerima berdasarkan prioritas. Alokasikan beras, uang lokal, hingga bantuan pusat dengan status distribusi <em>real-time</em>.</p>
                    <div class="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-500">Tanda Terima Digital</span>
                        <CheckCircle class="w-4 h-4 text-primary-500" />
                    </div>
                </div>

                <div class="glow-card bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-3xl p-8 relative group hover:-translate-y-1 transition-transform duration-300 cursor-default">
                    <div class="w-12 h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-primary-400 mb-6 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 shadow-[0_0_0_0_rgba(16,185,129,0)] group-hover:shadow-[0_0_20px_0_rgba(16,185,129,0.4)]">
                        <FileUp class="w-6 h-6" />
                    </div>
                    <h4 class="text-xl font-bold text-white mb-3">Laporan & Ekspor</h4>
                    <p class="text-slate-400 text-sm leading-relaxed mb-6">Hasilkan laporan komprehensif per sektor atau global. Unduh dalam format CSV, Excel, atau PDF siap cetak untuk jamaah.</p>
                    <div class="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-500">Auto-Generate PDF</span>
                        <CheckCircle class="w-4 h-4 text-primary-500" />
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="cara-kerja" class="py-24 bg-slate-50 relative">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 reveal">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-extrabold text-slate-900 mb-4">Mulai dalam 4 Langkah Mudah.</h2>
                <p class="text-lg text-slate-600 font-medium">Onboarding yang didesain agar masjid Anda siap beroperasi kurang dari 5 menit.</p>
            </div>

            <div class="relative wrap overflow-hidden p-4 md:p-10 h-full">
                <div class="absolute border-opacity-20 border-slate-400 h-full border-l-2 left-8 md:left-1/2 transform md:-translate-x-1/2"></div>
                
                <div class="mb-12 flex justify-between items-center w-full md:flex-row flex-col group reveal">
                    <div class="order-1 md:w-5/12 hidden md:block text-right">
                        <img src="https://images.unsplash.com/photo-1771493003867-1aa55f96df5d?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" class="rounded-2xl shadow-lg border border-slate-200 inline-block w-4/5 transform group-hover:-translate-y-2 transition-transform duration-500" alt="Buat Organisasi">
                    </div>
                    <div class="z-20 flex items-center order-1 bg-primary-600 shadow-[0_0_0_8px_rgba(16,185,129,0.2)] w-12 h-12 rounded-full absolute left-2 md:left-1/2 transform md:-translate-x-1/2 justify-center transition-all duration-300 group-hover:scale-110">
                        <h1 class="mx-auto font-bold text-white text-lg">1</h1>
                    </div>
                    <div class="order-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:w-5/12 w-full ml-16 md:ml-0 hover:shadow-xl transition-shadow duration-300">
                        <h3 class="font-bold text-slate-900 text-xl mb-2">Buat Organisasi</h3>
                        <p class="text-sm leading-snug tracking-wide text-slate-600 font-medium">Daftar dengan email dan isi nama Masjid/Lembaga Anda. Sistem akan membuatkan <em>workspace</em> eksklusif seketika.</p>
                    </div>
                </div>

                <div class="mb-12 flex justify-between items-center w-full md:flex-row-reverse flex-col group reveal">
                    <div class="order-1 md:w-5/12 hidden md:block text-left">
                        <div class="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6 inline-block w-4/5 transform group-hover:-translate-y-2 transition-transform duration-500">
                            <div class="text-xs text-slate-400 mb-2">Beras per jiwa (Kg)</div>
                            <div class="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-2">2.5 <span class="text-sm text-primary-400">Kg</span></div>
                            <div class="text-xs text-slate-400 mb-2">Uang per jiwa (Rp)</div>
                            <div class="text-2xl font-bold text-white">50,000</div>
                        </div>
                    </div>
                    <div class="z-20 flex items-center order-1 bg-primary-600 shadow-[0_0_0_8px_rgba(16,185,129,0.2)] w-12 h-12 rounded-full absolute left-2 md:left-1/2 transform md:-translate-x-1/2 justify-center transition-all duration-300 group-hover:scale-110">
                        <h1 class="mx-auto text-white font-bold text-lg">2</h1>
                    </div>
                    <div class="order-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:w-5/12 w-full ml-16 md:ml-0 text-left md:text-right hover:shadow-xl transition-shadow duration-300">
                        <h3 class="font-bold text-slate-900 text-xl mb-2">Atur Standar Zakat</h3>
                        <p class="text-sm leading-snug tracking-wide text-slate-600 font-medium">Tentukan besaran beras (kg) dan konversi uang (Rp) per jiwa untuk tahun Hijriyah berjalan. Nilai ini akan jadi kalkulator otomatis.</p>
                    </div>
                </div>

                <div class="flex justify-between items-center w-full md:flex-row flex-col group reveal">
                    <div class="order-1 md:w-5/12 hidden md:block text-right">
                        <div class="flex flex-wrap gap-2 justify-end w-4/5 ml-auto">
                            <span class="px-4 py-2 bg-blue-100 text-blue-700 font-bold text-sm rounded-xl">RT 01 / RW 05</span>
                            <span class="px-4 py-2 bg-emerald-100 text-emerald-700 font-bold text-sm rounded-xl">RT 02 / RW 05</span>
                            <span class="px-4 py-2 bg-amber-100 text-amber-700 font-bold text-sm rounded-xl">Komplek A</span>
                        </div>
                    </div>
                    <div class="z-20 flex items-center order-1 bg-primary-600 shadow-[0_0_0_8px_rgba(16,185,129,0.2)] w-12 h-12 rounded-full absolute left-2 md:left-1/2 transform md:-translate-x-1/2 justify-center transition-all duration-300 group-hover:scale-110">
                        <Flag class="w-5 h-5 text-white" />
                    </div>
                    <div class="order-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:w-5/12 w-full ml-16 md:ml-0 hover:shadow-xl transition-shadow duration-300">
                        <h3 class="font-bold text-slate-900 text-xl mb-2">Buat Sektor & Undang Tim</h3>
                        <p class="text-sm leading-snug tracking-wide text-slate-600 font-medium">Petakan wilayah jangkauan Anda, undang panitia lainnya melalui email, lalu tugaskan mereka sesuai sektor masing-masing. Siap!</p>
                    </div>
                </div>
            </div>
        </div>
    </section><section class="py-24 bg-white relative reveal">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Pertanyaan yang Sering Diajukan</h2>
                <p class="text-lg text-slate-600 font-medium">Temukan jawaban atas keraguan Anda sebelum mendaftar.</p>
            </div>
            
            <div class="space-y-4">
                <div class="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 transition-colors hover:bg-white">
                    <button class="faq-btn w-full text-left px-6 py-5 font-bold text-slate-900 flex justify-between items-center focus:outline-none">
                        <span class="text-lg">Apakah aplikasi ini benar-benar gratis selamanya?</span>
                        <ChevronDown class="w-5 h-5 transition-all duration-300 text-slate-400" />
                    </button>
                    <div class="faq-content hidden px-6 pb-6 text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-4">
                        Ya, 100% gratis. ZakatApp dibangun sebagai inisiatif non-profit (<em>SaaS For Good</em>) untuk membantu digitalisasi masjid dan lembaga amil zakat di Indonesia. Tidak ada biaya langganan maupun potongan donasi.
                    </div>
                </div>

                <div class="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 transition-colors hover:bg-white">
                    <button class="faq-btn w-full text-left px-6 py-5 font-bold text-slate-900 flex justify-between items-center focus:outline-none">
                        <span class="text-lg">Apakah data jamaah masjid saya aman dan tidak bocor?</span>
                        <ChevronDown class="w-5 h-5 transition-all duration-300 text-slate-400" />
                    </button>
                    <div class="faq-content hidden px-6 pb-6 text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-4">
                        Sangat aman. Kami menggunakan arsitektur <em>Multi-Tenant</em> dengan isolasi data tingkat baris (Row-Level Security). Artinya, data Muzaki dan Mustahik di masjid Anda dikunci eksklusif dan mustahil bisa dilihat oleh masjid atau lembaga lain.
                    </div>
                </div>

                <div class="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 transition-colors hover:bg-white">
                    <button class="faq-btn w-full text-left px-6 py-5 font-bold text-slate-900 flex justify-between items-center focus:outline-none">
                        <span class="text-lg">Bagaimana jika panitia lapangan saya kurang paham teknologi?</span>
                        <ChevronDown class="w-5 h-5 transition-all duration-300 text-slate-400" />
                    </button>
                    <div class="faq-content hidden px-6 pb-6 text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-4">
                        ZakatApp didesain dengan prinsip <em>Mobile-First</em>. Antarmukanya dibuat sesederhana mungkin seperti mengisi Google Form, sehingga amil atau petugas lapangan dari berbagai kalangan usia dapat menggunakannya langsung dari HP mereka tanpa perlu pelatihan khusus.
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="relative pt-24 pb-12 bg-white reveal">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div class="bg-slate-900 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden shadow-2xl mb-24">
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary-600/30 to-transparent opacity-50 pointer-events-none"></div>
                <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-500 rounded-full blur-[100px] opacity-40"></div>
                
                <div class="relative z-10">
                    <h2 class="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                        Tinggalkan cara lama.<br/>
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-teal-300">Beralih ke Digital Sekarang.</span>
                    </h2>
                    <p class="text-lg text-slate-400 max-w-2xl mx-auto mb-10 font-medium">Aplikasi kelas <em>enterprise</em> ini 100% gratis untuk mendukung ekosistem zakat yang lebih profesional, akurat, dan transparan.</p>
                    
                    <a href="/register" class="inline-block px-10 py-5 bg-primary-500 hover:bg-primary-400 text-white rounded-full font-extrabold text-xl transition-all shadow-[0_0_40px_-10px_rgba(16,185,129,0.8)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,1)] hover:-translate-y-1 transform scale-100 hover:scale-105">
                        Daftarkan Masjid Anda — Gratis
                    </a>
                    <p class="mt-6 text-sm text-slate-500 font-medium flex items-center justify-center gap-1"><Lock class="w-4 h-4 text-primary-500" /> Data dienkripsi & aman. Tidak ada biaya tersembunyi.</p>
                </div>
            </div>

            <footer class="border-t border-slate-200 pt-12 pb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white">
                        <Building2 class="w-4 h-4" />
                    </div>
                    <span class="font-extrabold text-xl text-slate-900 tracking-tight">Zakat<span class="text-primary-600">App</span></span>
                </div>
                
                <div class="flex flex-wrap justify-center gap-8 text-sm font-semibold text-slate-500">
                    <a href="/panduan" class="hover:text-primary-600 transition-colors">Panduan Penggunaan</a>
                    <a href="/kebijakan-privasi" class="hover:text-primary-600 transition-colors">Kebijakan Privasi</a>
                    <a href="/syarat-ketentuan" class="hover:text-primary-600 transition-colors">Syarat & Ketentuan</a>
                </div>

                <div class="text-sm text-slate-400 font-medium">
                    &copy; 2026 ZakatApp. All rights reserved.
                </div>
            </footer>
        </div>
    </div> 
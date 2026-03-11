<script>
  import { Users, Heart, TrendingUp, Shield, ArrowRight, Moon } from 'lucide-svelte';
  
  const features = [
    {
      icon: Users,
      title: 'Multi Organisasi',
      description: 'Satu platform untuk banyak masjid/lembaga zakat. Setiap organisasi memiliki data terpisah.'
    },
    {
      icon: Heart,
      title: 'Kelola Muzaki & Mustahik',
      description: 'Catat data pembayar dan penerima zakat dengan mudah. Lengkap dengan distribusi per sektor.'
    },
    {
      icon: TrendingUp,
      title: 'Dashboard & Laporan',
      description: 'Pantau perkembangan zakat real-time. Rekap otomatis per sektor dengan grafik yang informatif.'
    },
    {
      icon: Shield,
      title: 'Aman & Terpercaya',
      description: 'Data terenkripsi dan tersimpan aman di cloud. Sistem role-based untuk kontrol akses.'
    }
  ];
</script>

<div class="min-h-screen flex flex-col bg-slate-50">
  <!-- Navigation -->
  <nav class="bg-white border-b">
    <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
          <Moon class="w-6 h-6 text-white" />
        </div>
        <span class="text-xl font-bold text-slate-900">ZakatApp</span>
      </div>
      <div class="flex items-center gap-4">
        <a href="/login" class="text-slate-600 hover:text-slate-900 font-medium">Masuk</a>
        <a href="/register" class="btn-primary">Daftar Gratis</a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="flex-1 flex items-center justify-center py-20 px-4">
    <div class="max-w-4xl mx-auto text-center">
      <!-- Badge -->
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6">
        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        Gratis untuk Masjid & Lembaga Zakat
      </div>
      
      <!-- Headline -->
      <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
        Kelola Zakat Fitrah
        <span class="text-green-600">Lebih Mudah</span>
      </h1>
      
      <!-- Subheadline -->
      <p class="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
        Platform modern untuk pengelolaan zakat fitrah dan distribusi mustahik. 
        Multi organisasi, real-time dashboard, dan laporan lengkap.
      </p>
      
      <!-- CTAs -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        <a href="/register" class="btn-primary text-lg px-8 py-4">
          Mulai Sekarang
          <ArrowRight class="w-5 h-5" />
        </a>
        <a href="/login" class="btn-secondary text-lg px-8 py-4">
          Sudah Punya Akun?
        </a>
      </div>
      
      <!-- Stats -->
      <div class="flex flex-wrap items-center justify-center gap-8 text-slate-600">
        <div class="text-center">
          <p class="text-2xl font-bold text-slate-900">100%</p>
          <p class="text-sm">Gratis</p>
        </div>
        <span class="text-slate-300">|</span>
        <div class="text-center">
          <p class="text-2xl font-bold text-slate-900">Multi</p>
          <p class="text-sm">Organisasi</p>
        </div>
        <span class="text-slate-300">|</span>
        <div class="text-center">
          <p class="text-2xl font-bold text-slate-900">Real-time</p>
          <p class="text-sm">Dashboard</p>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Features Section -->
  <section class="py-20 bg-white">
    <div class="max-w-6xl mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-slate-900 mb-4">
          Fitur Lengkap untuk Pengelolaan Zakat
        </h2>
        <p class="text-slate-600 max-w-2xl mx-auto">
          Semua yang Anda butuhkan untuk mengelola zakat fitrah dengan lebih baik
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each features as feature, i}
          {@const Icon = feature.icon}
          <div class="group p-6 bg-slate-50 rounded-xl hover:bg-green-50 transition-colors border border-slate-100 hover:border-green-200">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon class="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 class="font-semibold text-lg text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p class="text-slate-600">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
  
  <!-- CTA Section -->
  <section class="py-20 bg-green-600">
    <div class="max-w-4xl mx-auto px-4 text-center">
      <h2 class="text-3xl font-bold text-white mb-4">
        Siap Mengelola Zakat Lebih Baik?
      </h2>
      <p class="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
        Daftar gratis sekarang dan mulai kelola zakat fitrah dengan sistem yang modern dan mudah digunakan.
      </p>
      <a href="/register" class="inline-flex items-center gap-2 bg-white text-green-600 font-semibold px-8 py-4 rounded-xl hover:bg-green-50 transition-colors">
        Daftar Gratis Sekarang
        <ArrowRight class="w-5 h-5" />
      </a>
    </div>
  </section>
  
  <!-- Footer -->
  <footer class="bg-slate-900 text-slate-400 py-8">
    <div class="max-w-6xl mx-auto px-4 text-center">
      <p>&copy; 2025 ZakatApp. Platform pengelolaan zakat fitrah modern.</p>
    </div>
  </footer>
</div>

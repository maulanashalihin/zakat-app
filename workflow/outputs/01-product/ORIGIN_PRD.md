Title: readme-pengelolaan-zakat-fitrah-mahaliah

URL Source: https://slugpost.com/readme-pengelolaan-zakat-fitrah-mahaliah

Markdown Content:
---
description: Buatkan aplikasi web lengkap untuk pengelolaan zakat fitrah dan distribusi mustahik berbasis data wilayah/sektor, mengikuti alur kerja seperti sistem spreadshee
title: readme-pengelolaan-zakat-fitrah-mahaliah
 

Buatkan aplikasi web lengkap untuk pengelolaan zakat fitrah dan distribusi mustahik berbasis data wilayah/sektor, mengikuti alur kerja seperti sistem spreadsheet yang sudah saya jelaskan.

# \==================================== KONTEKS UTAMA APLIKASI

Aplikasi ini digunakan panitia zakat untuk:

1. Mencatat data muzaki (pembayar zakat)
2. Mencatat data mustahik (penerima zakat)
3. Mencatat alokasi zakat maal / bantuan pusat untuk mustahik tertentu
4. Membagi pengelolaan berdasarkan 4 sektor wilayah
5. Menghitung rekap penerimaan zakat fitrah dalam bentuk beras, uang, dan infaq
6. Menghitung kebutuhan distribusi mustahik per sektor
7. Menampilkan surplus / defisit per sektor
8. Menampilkan dashboard rekap akhir, statistik, grafik, dan status distribusi
9. Mempermudah panitia dalam proses input, validasi, audit, dan distribusi zakat

Aplikasi harus dirancang bukan sekadar form input, tetapi sebagai sistem operasional panitia zakat yang rapi, jelas, mudah digunakan, dan minim kesalahan hitung.

# \==================================== TUJUAN APLIKASI

Tujuan utama aplikasi:

* Menggantikan spreadsheet manual menjadi aplikasi terstruktur
* Mengurangi human error pada rekap zakat
* Memudahkan pemantauan per sektor
* Memudahkan distribusi mustahik
* Memisahkan dengan jelas antara:  
   * zakat fitrah beras  
   * zakat fitrah uang  
   * infaq  
   * zakat maal / bantuan pusat
* Menyediakan dashboard final yang mudah dibaca oleh panitia inti
* Menyediakan data siap cetak / ekspor

# \==================================== KONSEP BISNIS / LOGIKA DATA

Sistem pengelolaan zakat mengikuti alur berikut:

A. MUZAKI Muzaki adalah pembayar zakat. Data yang dicatat:

* nama
* alamat
* sektor / wilayah
* jumlah jiwa
* zakat dibayar dalam bentuk:  
   * beras  
   * uang  
   * bisa salah satu
* infaq tambahan
* petugas / amil penerima
* tanggal input

B. MUSTAHIK Mustahik adalah penerima zakat. Data yang dicatat:

* nama / kepala keluarga
* alamat
* sektor / wilayah
* pekerjaan
* tanggungan
* jumlah jiwa
* kategori kebutuhan / status ekonomi
* alokasi zakat fitrah lokal (mahaliyah):  
   * beras  
   * uang
* alokasi zakat maal / bantuan pusat
* total yang diterima
* status distribusi

C. ZAKAT PUSAT / ZAKAT MAAL Selain zakat lokal, ada bantuan dari pusat untuk mustahik tertentu. Nilainya tidak harus sama untuk semua orang. Contoh nominal:

* 225000
* 250000
* 300000
* atau kosong / tidak menerima Dana ini harus dipisahkan secara pencatatan dari zakat fitrah lokal.

D. 4 SEKTOR WILAYAH Aplikasi harus mendukung pembagian wilayah minimal menjadi:

* Banjaran
* Cangkuang
* Pangalengan
* Arjasari

Tetapi desain data harus fleksibel, sehingga sektor bisa ditambah / diedit dari admin panel jika nanti dibutuhkan.

E. REKAP LOGIKA Aplikasi harus bisa menghitung:

1. Total muzaki per sektor
2. Total jiwa muzaki per sektor
3. Total beras zakat masuk per sektor
4. Total uang zakat masuk per sektor
5. Total infaq masuk per sektor
6. Total mustahik per sektor
7. Total jiwa mustahik per sektor
8. Total kebutuhan distribusi beras per sektor
9. Total kebutuhan distribusi uang lokal per sektor
10. Total bantuan pusat per sektor
11. Selisih per sektor:
* surplus / defisit beras
* surplus / defisit uang lokal
* total bantuan pusat
1. Rekap sisa keseluruhan
2. Status apakah sektor:
* aman
* kurang beras
* kurang uang
* surplus

# \==================================== FITUR UTAMA YANG HARUS DIBUAT

1. AUTH & ROLE Buat sistem login sederhana dengan role:
* Super Admin
* Admin Panitia
* Petugas / Amil
* Viewer / Pimpinan

Hak akses:

* Super Admin: full access
* Admin Panitia: kelola data, distribusi, dashboard, ekspor
* Petugas: input muzaki, lihat rekap sektornya sendiri
* Viewer: hanya lihat dashboard dan laporan
1. MASTER DATA Buat master data untuk:
* Sektor / Wilayah
* Petugas / Amil
* Periode zakat / tahun hijriyah / tahun masehi
* Setting nominal zakat per jiwa
* Setting default alokasi mustahik bila dibutuhkan
* Kategori mustahik
* Kategori pekerjaan
* Setting warna/status dashboard
1. MODUL MUZAKI Halaman input muzaki harus memiliki:
* nama
* alamat
* sektor
* jumlah jiwa
* jenis pembayaran:  
   * beras  
   * uang  
   * kombinasi jika perlu
* jumlah beras
* jumlah uang zakat
* jumlah infaq
* petugas penerima
* catatan
* tanggal bayar

Fitur tambahan:

* validasi angka
* auto hitung total uang
* auto tandai jika input aneh / kosong
* pencarian cepat
* filter per sektor
* filter per petugas
* filter per tanggal
* import CSV / Excel
* edit & hapus dengan audit log
* duplicate detection sederhana berdasarkan nama + alamat + tanggal
1. MODUL MUSTAHIK Halaman mustahik harus mencakup:
* nama / kepala keluarga
* alamat
* sektor
* pekerjaan
* deskripsi kondisi ekonomi
* tanggungan
* jumlah jiwa
* kategori prioritas
* alokasi beras zakat mahaliyah
* alokasi uang zakat mahaliyah
* alokasi uang zakat pusat
* total bantuan
* status distribusi:  
   * belum disalurkan  
   * siap disalurkan  
   * sudah disalurkan
* tanggal distribusi
* petugas penyalur
* catatan distribusi

Fitur tambahan:

* filter per sektor
* filter status distribusi
* filter kategori prioritas
* pencarian cepat
* import data
* edit / hapus
* riwayat perubahan
1. MODUL BANTUAN PUSAT / ZAKAT MAAL Buat modul khusus untuk bantuan pusat agar tidak tercampur dengan zakat lokal:
* sumber dana
* periode
* nama mustahik
* sektor
* nominal bantuan
* tanggal alokasi
* status pencairan / distribusi
* catatan

Fitur:

* bisa assign bantuan pusat ke mustahik yang sudah ada
* atau buat mustahik baru bila belum terdaftar
* rekap total bantuan pusat per sektor
* rekap total bantuan pusat keseluruhan
1. MODUL DISTRIBUSI Buat modul distribusi untuk membantu panitia membagikan zakat. Fitur:
* daftar mustahik per sektor
* kebutuhan distribusi per mustahik
* status stok sektor
* rekomendasi distribusi berdasarkan stok
* checklist penyaluran
* tanda terima / bukti distribusi
* upload bukti foto opsional
* catatan petugas
* tanda sudah dibagikan

Harus ada tampilan:

* distribusi per sektor
* distribusi seluruh wilayah
* distribusi yang belum selesai
* distribusi yang sudah selesai
1. DASHBOARD UTAMA Dashboard harus menjadi bagian penting aplikasi, bukan sekadar tambahan. Buat dashboard modern, rapi, informatif, dan sangat mudah dibaca.

Widget utama:

* total muzaki
* total mustahik
* total jiwa muzaki
* total jiwa mustahik
* total beras diterima
* total uang zakat diterima
* total infaq diterima
* total bantuan pusat
* total distribusi
* total sisa beras
* total sisa uang
* jumlah sektor surplus
* jumlah sektor defisit
* jumlah mustahik sudah tersalurkan
* jumlah mustahik belum tersalurkan
1. DASHBOARD REKAP PER SEKTOR Harus ada halaman rekap sektor dengan tabel yang sangat jelas. Kolom penting:
* nama sektor
* total muzaki
* total jiwa muzaki
* total beras masuk
* total uang zakat masuk
* total infaq
* total mustahik
* total jiwa mustahik
* total kebutuhan beras
* total kebutuhan uang lokal
* total bantuan pusat
* total distribusi
* selisih beras
* selisih uang
* status sektor

Status sektor:

* Surplus Aman
* Kurang Beras
* Kurang Uang
* Kurang Beras & Uang
* Sudah Tersalurkan
* Belum Tuntas

Gunakan warna badge yang jelas.

1. GRAFIK / VISUALISASI Tambahkan grafik yang relevan dan benar-benar berguna:
* bar chart total zakat masuk per sektor
* stacked bar chart: beras vs uang vs infaq per sektor
* bar chart kebutuhan mustahik per sektor
* bar chart bantuan pusat per sektor
* pie / donut chart proporsi muzaki per sektor
* pie / donut chart proporsi mustahik per sektor
* progress chart distribusi tersalurkan vs belum
* line chart tren input muzaki per hari selama periode Ramadhan
* line chart tren distribusi per hari
* summary cards untuk stok dan kekurangan

Jangan gunakan grafik hanya untuk hiasan. Semua grafik harus relevan terhadap pengambilan keputusan panitia.

1. HALAMAN LAPORAN Buat modul laporan lengkap:
* laporan muzaki
* laporan mustahik
* laporan distribusi
* laporan bantuan pusat
* laporan per sektor
* laporan global
* laporan per petugas
* laporan periode harian / mingguan / keseluruhan

Fitur:

* filter tanggal
* filter sektor
* filter petugas
* filter status distribusi
* export PDF
* export Excel / CSV
* print view rapi
1. AUDIT LOG Karena ini aplikasi keuangan / distribusi sosial, wajib ada audit log:
* siapa membuat data
* siapa mengubah data
* kapan diubah
* data lama vs data baru
* siapa menghapus
* alasan perubahan opsional
1. NOTIFIKASI / ALERT Tambahkan alert penting:
* ada data muzaki duplikat
* sektor defisit beras
* sektor defisit uang
* distribusi belum selesai
* mustahik belum menerima padahal dana tersedia
* input tidak lengkap
* ada selisih yang janggal

# \==================================== PERHITUNGAN / LOGIKA FORMULA

Aplikasi harus mendukung formula berikut:

1. REKAP MUZAKI total\_uang\_muzaki = uang\_zakat + infaq
2. REKAP PER SEKTOR Per sektor hitung:
* total\_muzaki
* total\_jiwa\_muzaki
* total\_beras\_masuk
* total\_uang\_zakat\_masuk
* total\_infaq\_masuk
* total\_uang\_masuk
1. TOTAL MUSTAHIK PER SEKTOR
* total\_mustahik
* total\_jiwa\_mustahik
* total\_kebutuhan\_beras
* total\_kebutuhan\_uang\_lokal
* total\_bantuan\_pusat
* total\_distribusi
1. SELISIH PER SEKTOR selisih\_beras = total\_beras\_masuk - total\_kebutuhan\_beras selisih\_uang\_lokal = total\_uang\_zakat\_masuk - total\_kebutuhan\_uang\_lokal selisih\_total\_uang\_dengan\_pusat = (total\_uang\_zakat\_masuk + total\_bantuan\_pusat) - total\_distribusi\_uang
2. STATUS SEKTOR Jika selisih\_beras < 0 => kurang beras Jika selisih\_uang\_lokal < 0 => kurang uang Jika dua-duanya negatif => kurang beras & uang Jika dua-duanya positif => surplus Jika distribusi belum selesai => beri badge progres
3. TOTAL GLOBAL
* total semua sektor
* sisa beras global
* sisa uang global
* total distribusi selesai
* total distribusi belum selesai

Catatan penting: Logika formula harus dibangun modular dan mudah disesuaikan, karena aturan pembagian zakat bisa berubah tergantung keputusan panitia.

# \==================================== REKOMENDASI UX / UI TERBAIK

Desain aplikasi harus:

* modern
* clean
* ringan
* fokus pada keterbacaan data
* mobile-friendly
* desktop-first untuk dashboard
* form input cepat dipakai panitia lapangan

Rekomendasi layout:

* Sidebar kiri
* Header atas
* Dashboard cards
* Tabel data dengan filter sticky
* Modal / drawer untuk create/edit
* Warna status yang konsisten
* Search cepat di banyak modul
* Empty state yang jelas
* Loading state yang rapi

Menu sidebar:

1. Dashboard
2. Muzaki
3. Mustahik
4. Bantuan Pusat
5. Distribusi
6. Rekap Sektor
7. Laporan
8. Master Data
9. Audit Log
10. Pengaturan

# \==================================== REKOMENDASI HALAMAN DETAIL

1. Dashboard
* KPI cards
* grafik utama
* tabel ringkas sektor
* alert penting
* aktivitas terbaru
1. Halaman Muzaki
* tabel lengkap
* tombol tambah data
* filter dan export
* rekap cepat di atas tabel
1. Halaman Mustahik
* tabel lengkap
* status distribusi
* prioritas
* alokasi bantuan
1. Halaman Distribusi
* filter per sektor
* checklist penerima
* status distribusi
* aksi tandai selesai
* opsi cetak daftar distribusi
1. Halaman Rekap Sektor
* tabel ringkasan komprehensif
* selisih per sektor
* warna status
* tombol lihat detail sektor
1. Halaman Detail Sektor Menampilkan:
* daftar muzaki sektor itu
* daftar mustahik sektor itu
* total pemasukan
* total kebutuhan
* grafik mini
* status surplus/defisit
* progres distribusi
1. Halaman Laporan
* filter
* export
* print-friendly view

# \==================================== REKOMENDASI DATABASE

Rancang database yang terstruktur dan scalable.

Minimal tabel yang dibutuhkan:

* users
* roles
* sectors
* periods
* officers
* muzakki
* muzakki\_payments
* mustahik
* mustahik\_allocations
* central\_aid
* distributions
* attachments
* audit\_logs
* app\_settings

Penjelasan relasi:

* satu sector punya banyak muzakki
* satu sector punya banyak mustahik
* satu officer bisa input banyak muzakki / distribusi
* satu mustahik bisa punya beberapa allocation record
* central aid harus bisa dilacak terpisah
* distribution harus bisa merekam status dan tanggal salur

Gunakan naming yang jelas dan konsisten.

# \==================================== REKOMENDASI TEKNIS

Bangun aplikasi dengan arsitektur yang rapi:

* frontend modular
* backend modular
* query rekap terpisah dari CRUD biasa
* gunakan service layer untuk kalkulasi
* jangan letakkan semua logika hitung di controller
* gunakan validation schema
* gunakan reusable table & filter component
* gunakan chart library yang stabil
* siapkan endpoint khusus dashboard analytics
* siapkan export service

Penting: Semua perhitungan rekap harus akurat dan bisa dites. Buat helper / service khusus untuk:

* perhitungan rekap sektor
* perhitungan dashboard global
* status distribusi
* status surplus/defisit
* aggregasi per periode

# \==================================== FITUR TAMBAHAN YANG DIREKOMENDASIKAN

Tambahkan fitur-fitur ini bila memungkinkan:

1. Import dari spreadsheet lama
* mapping kolom
* preview import
* validasi sebelum simpan
1. Duplicate checker
* deteksi nama + alamat yang mirip
* deteksi input ganda
1. Receipt / tanda terima
* cetak bukti untuk distribusi
1. Riwayat periode
* bisa buka data 1445 H, 1446 H, dst
* semua dashboard bisa difilter per periode
1. Quick summary panel
* sisa beras
* sisa uang
* mustahik belum salur
* sektor paling defisit
* sektor paling surplus
1. Mode panitia lapangan
* tampilan ringkas untuk mobile
* checklist distribusi cepat
1. Approval mode
* perubahan data sensitif perlu approval admin
1. Backup / restore
* ekspor database / snapshot data

# \==================================== YANG HARUS DIHINDARI

Jangan membuat aplikasi yang:

* hanya CRUD biasa tanpa rekap cerdas
* dashboard terlalu ramai tapi tidak berguna
* formula tersebar acak di banyak tempat
* data bantuan pusat tercampur dengan zakat lokal tanpa pemisahan
* sulit difilter per sektor
* sulit dilacak perubahan datanya
* tidak punya audit log
* tidak punya ringkasan distribusi per sektor

# \==================================== OUTPUT YANG SAYA INGINKAN DARI KAMU

Tolong buatkan implementasi aplikasi ini secara lengkap, termasuk:

1. Struktur folder proyek
2. Rekomendasi arsitektur
3. Skema database lengkap
4. Model / schema data
5. Halaman-halaman utama
6. Komponen UI yang diperlukan
7. API endpoints / controllers / services
8. Logika perhitungan rekap
9. Dashboard analytics
10. Grafik yang dipakai
11. Audit log system
12. Export report system
13. Dummy seed data
14. Alur user journey tiap role
15. Validasi penting
16. Rekomendasi security basic
17. TODO implementasi bertahap berdasarkan prioritas

# \==================================== PRIORITAS IMPLEMENTASI

Urutan prioritas: PHASE 1

* auth & role
* master sektor
* master petugas
* input muzaki
* input mustahik
* dashboard summary dasar
* rekap per sektor

PHASE 2

* bantuan pusat
* distribusi
* laporan
* export
* grafik dashboard

PHASE 3

* audit log
* import spreadsheet
* duplicate checker
* approval flow
* mobile field mode

# \==================================== CATATAN PENTING

Aplikasi ini harus terasa seperti sistem operasional zakat yang dipakai sungguhan oleh panitia, bukan demo biasa.

Fokus utama:

* akurasi hitung
* kemudahan operasional
* kejelasan dashboard
* keterlacakan data
* kemudahan distribusi
* mudah dipakai oleh panitia non-teknis

Tolong buatkan dengan pendekatan terbaikmu, lengkap, rapi, dan siap dikembangkan.

Last updated: March 11, 2026 

[ Create your own post ](/) 
# Product Requirements Document (PRD) - Zakat App

## 1. Overview

### 1.1 Product Vision
Aplikasi pengelolaan zakat fitrah **multi-organisasi** yang memungkinkan banyak lembaga zakat/masjid mengelola data zakat mereka secara terpisah dalam satu platform.

### 1.2 Target Users
- **Super Admin** - Tim pengembang/teknis yang mengelola platform
- **Admin Panitia** - Ketua/pengurus masjid yang mengelola organisasi
- **Petugas/Amil** - Petugas lapangan yang input data
- **Viewer** - Pimpinan/penyelia yang hanya melihat laporan

### 1.3 Key Value Propositions
- ✅ Multi-organisasi - satu platform untuk banyak masjid
- ✅ Onboarding mudah - setup organisasi dalam 4 langkah
- ✅ Data terisolasi - antar organisasi tidak tercampur
- ✅ Role-based access - permission sesuai peran
- ✅ Dashboard komprehensif - rekap zakat real-time

---

## 2. User Flow

### 2.1 First-Time User Flow (with Onboarding)

```
Landing Page
    ↓
Register Account
    ↓
[Auto-detect: First time?]
    ↓ YES
Onboarding Wizard
├── Step 1: Buat Organisasi (Nama, Alamat, Kontak)
├── Step 2: Setting Zakat (Beras & Uang per jiwa)
├── Step 3: Buat Sektor/Wilayah (minimal 1)
└── Step 4: Undang Tim (optional)
    ↓
Dashboard Organisasi
    ↓
Mulai Input Data Muzaki/Mustahik
```

### 2.2 Existing User Flow

```
Login
    ↓
Organization Selector (jika punya banyak org)
    ↓
Dashboard Organisasi
    ↓
Akses fitur sesuai role
```

### 2.3 Multi-Organization Context

```
┌─────────────────────────────────────────────────────────┐
│                    ZAKAT APP PLATFORM                    │
├─────────────────────────────────────────────────────────┤
│  Super Admin                                            │
│  └── Kelola semua organisasi                            │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Masjid A    │  │ Masjid B    │  │ Yayasan C   │     │
│  │ ─────────── │  │ ─────────── │  │ ─────────── │     │
│  │ • Admin     │  │ • Admin     │  │ • Admin     │     │
│  │ • Petugas   │  │ • Petugas   │  │ • Petugas   │     │
│  │ • Data      │  │ • Data      │  │ • Data      │     │
│  │   (terisolasi) │ (terisolasi) │   (terisolasi) │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Feature Requirements

### 3.1 Authentication & Authorization

#### 3.1.1 User Roles
| Role | Scope | Permissions |
|------|-------|-------------|
| Super Admin | Global | Full access semua organisasi, kelola platform |
| Admin | Organization | Kelola data org, users, master data, semua fitur |
| Petugas | Sector | Input muzaki, distribusi di sektor tertentu |
| Viewer | Organization | View only dashboard & laporan |

#### 3.1.2 Auth Features
- [ ] Register dengan email/password
- [ ] Login
- [ ] Forgot password
- [ ] Remember me
- [ ] Session management

---

### 3.2 Onboarding Wizard

#### 3.2.1 Step 1: Create Organization
**Fields:**
- Nama Lembaga/Masjid (required, unique slug auto-generate)
- Alamat (required)
- Nomor Telepon (optional)
- Email (optional)
- Logo (optional, image upload)

**Validations:**
- Nama minimal 3 karakter
- Slug URL-friendly (auto from nama)
- Alamat minimal 10 karakter

#### 3.2.2 Step 2: Zakat Settings
**Fields:**
- Beras per jiwa (kg) - default 2.5
- Uang per jiwa (Rp) - default 40000
- Tahun Hijriyah - default tahun sekarang
- Tahun Masehi - default tahun sekarang
- Nama Periode - default "Ramadhan [Hijriyah] H"

**UX:**
- Tooltip penjelasan nilai default
- Helper text contoh perhitungan

#### 3.2.3 Step 3: Create Sectors
**Fields:**
- Minimal 1 sektor wajib
- Nama Sektor (required, unique dalam org)
- Warna (optional, color picker)
- Deskripsi (optional)

**UX:**
- Dynamic add/remove sektor
- Suggested colors
- Contoh: "Banjaran", "Cangkuang", "Pangalengan", "Arjasari"

#### 3.2.4 Step 4: Invite Team (Optional)
**Fields:**
- Nama (required if adding)
- Email (required, valid format)
- Role: Petugas / Viewer
- Sektor (if Petugas)

**UX:**
- "Lewati untuk sekarang" button
- Dynamic add/remove members
- Email invitation sent

#### 3.2.5 Completion
- Summary page
- Review semua data
- Button "Mulai Kelola Zakat" → Dashboard

---

### 3.3 Organization Management

#### 3.3.1 Organization Profile
- Edit nama, alamat, kontak, logo
- Ubah slug (with warning: URL akan berubah)
- Deactivate/activate organization

#### 3.3.2 Organization Settings
- Zakat rates (beras & uang per jiwa)
- Active period
- Email notifications on/off
- Approval flow on/off

#### 3.3.3 Super Admin: Manage Organizations
- List semua organisasi
- Create new organization
- Edit organization
- View stats per org (muzaki count, user count, etc)
- Suspend/activate organization

---

### 3.4 Master Data

#### 3.4.1 Sectors (Wilayah)
- CRUD sektor
- Assign warna
- Non-aktifkan sektor (tidak hapus data lama)

#### 3.4.2 Periods (Periode Zakat)
- CRUD periode
- Set active period
- Auto-archive periode lama

#### 3.4.3 Officers (Petugas)
- List users dalam organisasi
- Invite new user by email
- Assign role (Petugas/Viewer)
- Assign sector (untuk Petugas)
- Deactivate user

---

### 3.5 Muzaki Management

#### 3.5.1 Muzaki Fields
- Nama (required)
- Alamat (required)
- Sektor (required, dropdown)
- Jumlah Jiwa (default 1)
- Jenis Zakat: Beras / Uang / Keduanya
- Jumlah Beras (kg, if applicable)
- Jumlah Uang (Rp, if applicable)
- Infaq (optional)
- Catatan (optional)
- Petugas Penerima (auto: current user)
- Tanggal Input (auto)

#### 3.5.2 Muzaki Features
- [ ] List dengan filter (sektor, petugas, tanggal, search)
- [ ] Add new muzaki
- [ ] Edit muzaki
- [ ] Delete with confirmation
- [ ] Duplicate detection (nama + alamat mirip)
- [ ] Import from CSV/Excel
- [ ] Export to CSV/PDF

#### 3.5.3 Permission
- Admin: CRUD semua muzaki dalam org
- Petugas: CRUD hanya di sektor yang di-assign
- Viewer: View only

---

### 3.6 Mustahik Management

#### 3.6.1 Mustahik Fields
- Nama Kepala Keluarga (required)
- Alamat (required)
- Sektor (required)
- Pekerjaan (optional)
- Deskripsi Kondisi Ekonomi (optional)
- Tanggungan (jumlah, default 0)
- Jumlah Jiwa (default 1)
- Kategori Prioritas: Tinggi / Sedang / Rendah
- Status Distribusi: Belum / Siap / Sudah
- Alokasi Beras (kg)
- Alokasi Uang Lokal (Rp)
- Bantuan Pusat (Rp, optional)
- Catatan Distribusi

#### 3.6.2 Mustahik Features
- [ ] List dengan filter (sektor, status, prioritas, search)
- [ ] Add new mustahik
- [ ] Edit mustahik
- [ ] Delete with confirmation
- [ ] Update distribusi status
- [ ] Import from CSV/Excel
- [ ] Export to CSV/PDF

#### 3.6.3 Permission
- Admin: Full CRUD
- Petugas: View only, update distribusi status
- Viewer: View only

---

### 3.7 Central Aid (Bantuan Pusat)

#### 3.7.1 Fields
- Sumber Dana (required)
- Keterangan Sumber (optional)
- Mustahik Penerima (link)
- Nominal (required)
- Status: Pending / Cair / Batal
- Tanggal Cair (if applicable)
- Catatan

#### 3.7.2 Features
- [ ] CRUD bantuan pusat
- [ ] Link/unlink ke mustahik
- [ ] Track status pencairan
- [ ] Rekap per mustahik

---

### 3.8 Distribusi Module

#### 3.8.1 Distribusi Process
- [ ] List mustahik per sektor dengan status
- [ ] Checklist penerimaan
- [ ] Input tanggal distribusi
- [ ] Input jumlah beras & uang diterima
- [ ] Upload bukti foto (optional)
- [ ] Tanda tangan digital (optional)
- [ ] Cetak tanda terima

#### 3.8.2 Distribusi Views
- By Sector
- By Status (belum/sudah)
- Progress overview

---

### 3.9 Dashboard & Rekap

#### 3.9.1 Dashboard Widgets
- **Stat Cards:**
  - Total Muzaki
  - Total Mustahik
  - Total Jiwa Muzaki
  - Total Jiwa Mustahik
  - Total Beras Masuk (kg)
  - Total Uang Zakat (Rp)
  - Total Infaq (Rp)
  - Sisa Beras (kg)
  - Sisa Uang (Rp)
  
- **Progress:**
  - Persentase distribusi tersalurkan
  
- **Alerts:**
  - Sektor defisit beras
  - Sektor defisit uang
  - Mustahik belum tersalurkan

#### 3.9.2 Rekap Per Sektor
Table dengan kolom:
- Nama Sektor
- Total Muzaki
- Total Jiwa Muzaki
- Total Beras Masuk
- Total Uang Zakat
- Total Infaq
- Total Mustahik
- Total Jiwa Mustahik
- Kebutuhan Beras
- Kebutuhan Uang
- Bantuan Pusat
- Selisih Beras
- Selisih Uang
- Status (badge: Surplus/Kurang/etc)

#### 3.9.3 Grafik/Charts (Phase 2)
- Bar chart: Zakat masuk per sektor
- Pie chart: Proporsi muzaki per sektor
- Progress chart: Distribusi status
- Line chart: Tren input per hari

---

### 3.10 Laporan & Export

#### 3.10.1 Laporan Types
- Laporan Muzaki
- Laporan Mustahik
- Laporan Distribusi
- Laporan Rekap Per Sektor
- Laporan Global

#### 3.10.2 Filters
- Periode
- Sektor
- Tanggal range
- Status
- Petugas

#### 3.10.3 Export
- Export CSV
- Export Excel
- Print-friendly view
- PDF generation

---

### 3.11 Audit Log

#### 3.11.1 Tracked Actions
- Create data
- Update data (with old vs new)
- Delete data
- Login/Logout
- Export actions

#### 3.11.2 Log Fields
- User
- Action type
- Table/Entity
- Record ID
- Old data (JSON)
- New data (JSON)
- Timestamp
- IP Address

---

## 4. Data Model Summary

### 4.1 Core Entities

```
organizations (Multi-tenancy root)
├── users (with role, organization_id, sector_id)
├── sectors
├── periods
├── app_settings
├── muzaki
├── mustahik
├── mustahik_allocations
├── central_aid
├── distributions
├── attachments
└── audit_logs
```

### 4.2 Data Isolation
- **Rule:** Every query MUST filter by `organization_id`
- **Enforcement:** Row-level security via application layer
- **Exception:** Super Admin can access all (for management)

---

## 5. UX/UI Requirements

### 5.1 Design Principles
- **Clean & Modern** - Minimalist, fokus pada data
- **Mobile-Responsive** - Bisa digunakan di lapangan
- **Desktop-First Dashboard** - Optimal untuk monitoring
- **Color-Coded Status** - Badge warna untuk status cepat
- **Progressive Disclosure** - Info kompleks di-expand

### 5.2 Layout
- **Sidebar** - Navigation menu
- **Header** - Org branding, user menu
- **Main Content** - Data tables, forms, dashboard
- **Modals** - Create/edit forms

### 5.3 Key Interactions
- **Quick Search** - Di setiap tabel
- **Filter Sticky** - Filter selalu terlihat
- **Bulk Actions** - Select multiple items
- **Auto-Save Draft** - Form tidak hilang
- **Confirmation Dialogs** - Untuk delete/import

---

## 6. Non-Functional Requirements

### 6.1 Performance
- Page load < 2s
- Dashboard query < 500ms
- Support 1000+ records per table with pagination

### 6.2 Security
- Password hashing (PBKDF2)
- Session-based auth
- CSRF protection
- SQL injection prevention (parameterized queries)
- XSS protection (auto-escape)

### 6.3 Availability
- 99.9% uptime target
- Daily backup
- Graceful error handling

---

## 7. Phase Implementation

### Phase 0: Foundation (Week 1-2)
- [ ] Multi-organization architecture
- [ ] Onboarding wizard
- [ ] Auth & role system
- [ ] Organization management

### Phase 1: Core (Week 3-5)
- [ ] Master data (sectors, periods)
- [ ] Muzaki management
- [ ] Mustahik management
- [ ] Dashboard & rekap
- [ ] Calculation engine

### Phase 2: Operations (Week 6-7)
- [ ] Distribusi module
- [ ] Bantuan pusat
- [ ] Laporan & export
- [ ] Charts & visualizations

### Phase 3: Advanced (Week 8)
- [ ] Audit log
- [ ] Import spreadsheet
- [ ] Duplicate checker
- [ ] App settings

---

## 8. Success Metrics

### 8.1 User Metrics
- Number of registered organizations
- Number of active users per org
- User retention (returning users)

### 8.2 Data Metrics
- Total muzaki recorded
- Total mustahik recorded
- Distribution completion rate

### 8.3 System Metrics
- Page load time
- Error rate
- User satisfaction (NPS)

---

## 9. Future Enhancements (Post-MVP)

- [ ] Mobile app (PWA/Native)
- [ ] WhatsApp integration (notifikasi)
- [ ] QR code for quick input
- [ ] Integration with bank (auto-confirm zakat uang)
- [ ] Multi-period comparison
- [ ] Advanced analytics
- [ ] API for third-party integration

---

## 10. Appendix

### 10.1 Terminology
| Term | Definition |
|------|------------|
| Organization | Lembaga/masjid yang mengelola zakat |
| Sector | Wilayah/pembagian area dalam organisasi |
| Muzaki | Pembayar zakat |
| Mustahik | Penerima zakat |
| Onboarding | Proses setup awal organisasi |
| Mahaliyah | Zakat lokal (non-pusat) |

### 10.2 Default Values
| Setting | Default |
|---------|---------|
| Beras per jiwa | 2.5 kg |
| Uang per jiwa | Rp 40.000 |
| Zakat type | Uang |

---

**Document Version:** 2.0  
**Last Updated:** 2026-03-11  
**Status:** Ready for Development

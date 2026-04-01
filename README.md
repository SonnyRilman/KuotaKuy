# KuotaKuy - Platform E-Commerce Paket Data

Platform penjualan paket data internet berbasis **React.js + TypeScript** yang mengutamakan kecepatan akses, kemudahan navigasi, dan desain antarmuka yang modern (Fresh & Youthful).

---

## Informasi Pengerjaan

| Kategori | Detail |
| :--- | :--- |
| **Tanggal Mulai** | 31 Maret 2026 |
| **Tanggal Selesai** | 1 April 2026 |

---

## Fitur Utama

### Sisi Customer (Public)
* **KuyBot AI (Chatbot):** Asisten virtual pintar yang membantu merekomendasikan paket data terbaik dan memberikan bantuan instan 24/7.
* **Progressive Web App (PWA):** Mendukung instalasi aplikasi di perangkat HP dan Desktop dengan akses yang lebih cepat dan dukungan offline.
* **Landing Page:** Implementasi hero section dengan integrasi paket data unggulan.
* **Katalog Paket:** Browsing paket data secara real-time tanpa perlu login.
* **Sistem Autentikasi:** Manajemen sesi menggunakan Context API untuk register dan login.
* **Dashboard Transaksi:** Monitoring riwayat pembelian dan total pengeluaran pribadi.
* **Alur Checkout:** Validasi login sebelum melakukan transaksi pembelian paket.

### Sisi Admin (Private)
* **Akses Terbatas:** Login khusus administrator melalui jalur URL terenkripsi secara logika.
* **Statistik Visual:** Dashboard ringkasan pendapatan, total user, dan transaksi sukses.
* **CRUD Customer:** Pengelolaan data pelanggan secara komprehensif.
* **CRUD Katalog:** Manajemen stok paket data, harga, dan masa aktif.
* **Manajemen Order:** Kontrol penuh terhadap status transaksi (Sukses/Pending/Gagal).

---

## Spesifikasi Teknis (Tech Stack)

* **Frontend:** React.js v18/v19 (Vite)
* **PWA Engine:** vite-plugin-pwa (Service Worker & Manifest)
* **Bahasa:** TypeScript (Type-Safe Environment)
* **Styling & UI:** Material UI (MUI) v7 + Custom Theme
* **Routing:** React Router DOM v7
* **Data Fetching:** Axios
* **Database Mock:** json-server (Mock REST API)
* **State Management:** React Context API

---

## Panduan Instalasi dan Penggunaan

### 1. Persiapan Lingkungan
* Pastikan Node.js (v18 ke atas) sudah terinstall di sistem Anda.
* Gunakan NPM sebagai package manager utama.

### 2. Instalasi Dependensi
Masuk ke direktori proyek dan jalankan perintah install:
```bash
npm install
```

### 3. Menjalankan Mock Backend (Terminal 1)
Proyek ini menggunakan `json-server` untuk mensimulasikan database RESTful:
```bash
npx json-server --watch db.json --port 3001
```

### 4. Menjalankan Aplikasi (Terminal 2)
Jalankan server pengembangan Vite:
```bash
npm run dev
```
Akses di `http://localhost:5173`. Fitur PWA memungkinkan aplikasi diinstal melalui ikon browser.

---

## Kredensial Akses Pengujian

### Akun Customer
| Atribut | Keterangan |
| :--- | :--- |
| **URL Login** | http://localhost:5173/login |
| **Username** | albertus |
| **Password** | albertus |

### Akun Admin
| Atribut | Keterangan |
| :--- | :--- |
| **URL Login** | http://localhost:5173/admin/login |
| **Username** | admin |
| **Password** | admin123 |

---

## Struktur Folder Proyek

```text
src/
├── components/          # Komponen UI Reusable (Layout, Navbar, Sidebar, ChatWidget)
├── context/             # Manajemen State Global (AuthContext)
├── pages/
│   ├── customer/        # Halaman Sisi Pelanggan
│   └── admin/           # Halaman Dashboard Administrasi
├── services/            # Modul Komunikasi API (Axios Instance)
├── utils/               # Helper Utility (Formatting, Helpers)
├── theme.ts             # Konfigurasi Tema Kustom MUI
└── App.tsx              # Konfigurasi Utama Routing
```

---

## Asumsi dan Keputusan Desain

1. **Keamanan Sesi:** Menggunakan logic `LocalStorage` yang diintegrasikan dengan `Context API` untuk mempertahankan sesi login tanpa memerlukan server backend yang kompleks.
2. **Mobilitas UI:** Penggunaan `Grid v2` dari Material UI memastikan aplikasi memiliki layout yang responsif di berbagai ukuran perangkat.
3. **Format Mata Uang:** Penyeragaman tampilan harga menggunakan fungsi `formatRupiah` untuk meningkatkan user experience lokal (Indonesia).
4. **Clean Code:** Implementasi TypeScript di seluruh modul untuk meminimalisir bug run-time dan mempermudah pemeliharaan kode.

---

## Informasi Developer

**Sonny Rilman**
Frontend Developer Candidate
**Email:** rilmasonny@gmail.com
**Tanggal Pengerjaan:** 31 Maret 2026 - 1 April 2026

---

**Catatan:** Proyek ini dikembangkan secara mandiri sebagai bagian dari Technical Test seleksi Frontend Developer dengan tambahan fitur PWA dan dukungan Chatbot AI.

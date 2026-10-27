# FastShop Admin — E-Commerce Dashboard

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite 8](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![i18n](https://img.shields.io/badge/i18n-ID_%7C_EN-FF5722?logo=google-translate&logoColor=white)](https://react.i18next.com/)

**FastShop Admin** adalah template panel admin modern, responsif, dan siap produksi untuk pengelolaan operasional toko online (*e-commerce*). Dibangun menggunakan ekosistem terbaru **React 19**, **Tailwind CSS v4**, dan **Vite 8** dengan arsitektur berbasis fitur (*Feature-Driven Architecture*).

---

## 🚀 Fitur Utama

### 🛍️ Manajemen Kategori Produk (Full CRUD)
* **Tabel Terstruktur**: Tampilan data kategori dengan *sticky header* dan *internal vertical scroll* yang memaksimalkan area kerja layar.
* **Traditional Search (Enter to Submit)**: Input pencarian dengan tombol Enter untuk mengeksekusi request, dilengkapi tombol *Clear* (**X**) dan tombol *Escape* untuk reset seketika.
* **Modal Tambah & Ubah Kategori**: Form interaktif dengan validasi input, generator *slug* otomatis, dan dukungan URL ikon gambar.
* **Modal Konfirmasi Hapus**: Dialog konfirmasi penghapusan aman yang otomatis mendeteksi dan memperingatkan jumlah produk yang terasosiasi dengan kategori.
* **Skeleton Loading**: Tampilan pemuatan data yang bersih dan konsisten tanpa kedipan layar atau pergeseran tata letak (*layout shift*).

### 📊 Dashboard & Analitik Penjualan
* **Kartu Metrik Kunci**: Informasi langsung mengenai Total Penjualan, Pendapatan (*Revenue*), Pelanggan, dan Pesanan.
* **Visualisasi Grafik**: Grafik status pesanan (*Order Status Chart*) dan grafik performa penjualan ditenagai oleh ApexCharts.
* **Pesanan Terbaru (*Recent Orders*)**: Tabel transaksi terkini lengkap dengan badge status pesanan dan format tanggal lokal.

### 🔐 Autentikasi & Keamanan
* **JWT Authentication**: Penyimpanan token aman dengan Axios Request Interceptor otomatis (`Authorization: Bearer <token>`).
* **Auto-Redirect 401**: Deteksi sesi kedaluwarsa secara otomatis dan mengarahkan pengguna kembali ke halaman masuk.
* **Route Guards**:
  * `ProtectedRoute`: Melindungi halaman admin agar hanya dapat diakses pengguna yang terotentikasi.
  * `PublicRoute`: Mengarahkan pengguna yang sudah login menjauhi halaman `/signin` dan `/signup`.

### 🌐 Internasionalisasi (Multi-Bahasa)
* Mendukung penuh **Bahasa Indonesia (`id`)** dan **English (`en`)** menggunakan `react-i18next`.
* Tombol alih bahasa cepat di header aplikasi dengan persistensi di `localStorage`.

### 🌓 Mode Gelap & Terang (Dark / Light Mode)
* Dukungan Dark Mode menyeluruh berbasis *class* (`.dark`) terintegrasi langsung dengan token tema Tailwind CSS v4.

### 📱 Desain Responsif & Mobile-First
* Tata letak fleksibel untuk Desktop, Tablet, hingga Layar Ponsel (*Smartphones*).
* Tombol aksi adaptif (misal: tombol Tambah Kategori otomatis menjadi ikon kotak ringkas di ponsel dan melebar di layar desktop).

---

## 🛠️ Tech Stack

| Kategori | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Framework & Core** | React 19, TypeScript ~5.7 | Library UI deklaratif dengan pengetikan ketat |
| **Build Tool** | Vite 8 | Build tool berkecepatan tinggi dengan HMR instan |
| **Styling** | Tailwind CSS v4 | Utility-first CSS via `@theme` token di `src/index.css` |
| **Routing** | React Router v7 | Navigasi halaman client-side dengan route guards |
| **HTTP Client** | Axios | Request HTTP terkonfigurasi dengan interceptor |
| **Internationalization** | react-i18next, i18next | Manajemen translasi multi-bahasa dinamis |
| **Visualisasi Data** | ApexCharts, react-apexcharts | Grafik interaktif performa toko |
| **Ikon** | SVGR (`@/icons`) | Ikon SVG diimpor langsung sebagai komponen React |

---

## 📂 Struktur Direktori Proyek

Proyek ini menerapkan **Feature-Driven Architecture** untuk memastikan kode tetap terorganisir, terisolasi, dan mudah diperluas:

```text
src/
├── app/                       # Shell aplikasi, router, dan route guards
│   ├── App.tsx                # Root App component
│   └── router/                # Definisi rute (AppRouter) & Guards (ProtectedRoute, PublicRoute)
├── components/                # Komponen UI global (non-domain specific)
│   ├── ui/                    # Primitives (button, modal, alert, badge, table, dropdown)
│   ├── form/                  # Shared form controls (Input, Select, Label, Switch)
│   ├── common/                # Widgets (PageBreadCrumb, PageMeta, ThemeToggle)
│   └── header/                # Header dropdowns (UserDropdown, NotificationDropdown)
├── features/                  # Domain Slices (Feature-Driven Architecture)
│   ├── auth/                  # Halaman & komponen autentikasi (SignIn, SignUp)
│   ├── dashboard/             # Metrik ecommerce, recent orders, order charts
│   ├── categories/            # CRUD Kategori (api, components, pages, types)
│   ├── calendar/              # Pengelolaan event kalender
│   └── user-profile/          # Pengaturan & profil pengguna
├── services/                  # Konfigurasi API Client (Axios) & token storage
├── layout/                    # Layout shell: AppLayout, AppSidebar, AppHeader
├── context/                   # Context providers (ThemeContext, SidebarContext, LanguageContext)
├── hooks/                     # Custom hooks (useModal, useClickOutside, useGoBack)
├── locales/                   # Berkas kamus terjemahan (id/common.json, en/common.json)
├── icons/                     # Berkas .svg + barrel export index.ts
└── utils/                     # Utility helpers (formatRupiah, formatDate, cn)
```

---

## 🏁 Memulai (Getting Started)

### Prasyarat
* **Node.js**: Versi `20.19.0+` atau `22.12.0+` (syarat minimum Vite 8)
* **npm** atau **yarn**

### 1. Klon Repositori
```bash
git clone <repository-url>
cd ecommerce-frontend
```

### 2. Konfigurasi Environment Variables
Buat berkas `.env` di root direktori proyek:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser dan akses alamat lokal yang ditampilkan (biasanya `http://localhost:5173`).

---

## 📜 Perintah yang Tersedia (Scripts)

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan Vite development server dengan HMR |
| `npm run build` | Menjalankan kompilasi TypeScript (`tsc -b`) dan membuat build produksi |
| `npm run preview` | Menjalankan server lokal untuk menguji hasil build produksi |
| `npm run lint` | Menjalankan ESLint untuk memeriksa kualitas kode dan aturan React 19 |

---

## 📐 Konvensi & Standar Kode

* **Tailwind CSS v4**: Konfigurasi tema sepenuhnya berada di [`src/index.css`](file:///Users/mmm/Documents/project/FE/ecommerce-frontend/src/index.css) di bawah blok `@theme`. **Jangan membuat file `tailwind.config.js/ts`**.
* **CSS Logical Properties**: Selalu gunakan properti arah logis (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`) alih-alih properti fisik (`ml`, `mr`, `pl`, `pr`, `left`, `right`) demi kepatuhan tampilan internasional.
* **Aturan Interpolasi i18n**: Konfigurasi i18next menggunakan kurung tunggal. Gunakan format `{variable}` (contoh: `{name}`, `{count}`), **bukan** format kurung ganda `{{variable}}`.
* **Penggunaan Ikon**: Selalu impor ikon dari barrel `@/icons` (contoh: `import { SearchIcon, PlusIcon } from "@/icons"`). Hindari menaruh markup SVG mentah langsung di dalam komponen JSX.
* **SEO Page Meta**: Setiap halaman rute wajib menyertakan komponen `<PageMeta title="..." description="..." />` sebagai elemen pertamanya.

---

## 📄 Lisensi

Proyek ini dikembangkan untuk kebutuhan internal **FastShop Admin**. Hak cipta dilindungi undang-undang.

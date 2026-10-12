# Sistem Manajemen Laporan Lapangan (Field Reports Management)

Aplikasi web fullstack untuk mengelola dan memverifikasi laporan lapangan, terdiri dari **REST API backend** dan **dashboard interaktif frontend**. Proyek ini dibuat untuk memenuhi studi kasus **Fullstack Developer - MAPID**.

---

## Ringkasan Teknologi (Tech Stack)

### **Backend**

- **Runtime & Framework**: [Node.js](https://nodejs.org/) v22+, [Express.js](https://expressjs.com/) (TypeScript)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Lokal)
- **ORM**: [Prisma ORM](https://www.prisma.io/)
- **Validasi Data**: [Zod](https://zod.dev/)
- **Dokumentasi API**: [Swagger UI / OpenAPI 3.0](https://swagger.io/) (`/api-docs`)
- **API Client Collection**: [Bruno](https://www.usebruno.com/) (Folder `backend/bruno/`)
- **File Skema Database**: File SQL DDL mentah disertakan di [`backend/schema.sql`](./backend/schema.sql)

### **Frontend**

- **Framework**: [React 18](https://react.dev/) dengan [Vite](https://vitejs.dev/) & TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) untuk seluruh tampilan layout, tabel, cards, badges, navbar, dan tipografi
- **Komponen Pop-up**: [Ant Design (antd)](https://ant.design/) _khusus untuk pop-up saja_ (Modal Form Tambah Laporan, Modal Review Approve/Reject, Modal Detail Laporan, Popconfirm Hapus, serta Message Toasts)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Struktur Direktori

```text
mapid/
├── .husky/                           # Git Hooks otomatis
│   ├── commit-msg                    # Validasi commit message (commitlint)
│   ├── pre-commit                    # Validasi lint & typecheck staged files (lint-staged)
│   └── pre-push                      # Validasi build backend & frontend sebelum push
├── backend/
│   ├── bruno/                        # Koleksi Bruno API Client
│   │   ├── bruno.json                # Konfigurasi koleksi Bruno
│   │   ├── environments/
│   │   │   └── Local.bru             # Environment URL (http://localhost:5000)
│   │   ├── Get All Reports.bru       # Request daftar laporan
│   │   ├── Get Report Stats.bru      # Request statistik status
│   │   ├── Get Report by ID.bru      # Request detail laporan
│   │   ├── Create Report.bru         # Request buat laporan baru
│   │   ├── Approve Report.bru        # Request ubah status ke approved
│   │   └── Reject Report.bru         # Request ubah status ke rejected
│   ├── prisma/
│   │   ├── schema.prisma             # Skema data model Prisma
│   │   └── seed/
│   │       └── seed.ts               # Seeder data awal database
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.ts             # Inisialisasi Prisma Client
│   │   ├── controllers/
│   │   │   ├── report/               # 1 file per fungsi controller
│   │   │   │   ├── createReport.controller.ts       # Handler buat laporan baru
│   │   │   │   ├── getReports.controller.ts         # Handler list laporan (filter, search, sort)
│   │   │   │   ├── getReportById.controller.ts      # Handler detail laporan by ID
│   │   │   │   ├── updateReportStatus.controller.ts # Handler update status & catatan
│   │   │   │   ├── deleteReport.controller.ts       # Handler hapus laporan by ID
│   │   │   │   ├── getReportStats.controller.ts     # Handler ringkasan statistik status
│   │   │   │   └── index.ts                         # Barrel export modul controller
│   │   │   └── report.controller.ts                 # Facade & backward compatibility export
│   │   ├── middlewares/
│   │   │   └── errorHandler.ts       # Error handler & 404 handler
│   │   ├── routes/
│   │   │   └── report.routes.ts      # Routing REST API
│   │   ├── schemas/
│   │   │   └── report.schema.ts      # Skema validasi Zod
│   │   ├── swagger/
│   │   │   └── swaggerDoc.ts         # Spesifikasi OpenAPI 3.0 Swagger
│   │   ├── app.ts                    # Inisialisasi Express & middlewares
│   │   └── index.ts                  # Server listener entry point
│   ├── schema.sql                    # Skema database PostgreSQL murni (DDL)
│   ├── .commitlintrc.json            # Konfigurasi commitlint backend
│   ├── .lintstagedrc.cjs             # Konfigurasi lint-staged backend
│   ├── .env                          # Konfigurasi environment backend
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx            # Header & tombol aksi cepat
│   │   │   ├── StatsOverview.tsx     # Kartu statistik ringkasan status
│   │   │   ├── ReportFilter.tsx      # Tab status & sort Terbaru / Terlama
│   │   │   ├── ReportTable.tsx       # Tabel laporan dengan Tailwind & Antd Popconfirm
│   │   │   ├── CreateReportModal.tsx # Ant Design Modal pop-up tambah laporan
│   │   │   ├── StatusChangeModal.tsx # Ant Design Modal pop-up Approve / Reject
│   │   │   └── ReportDetailModal.tsx # Ant Design Modal pop-up detail laporan
│   │   ├── services/
│   │   │   └── api.ts                # Service integrasi fetch API
│   │   ├── types/
│   │   │   └── report.ts             # Definisi TypeScript interfaces
│   │   ├── App.tsx                   # Main Dashboard component
│   │   ├── main.tsx
│   │   └── index.css                 # Tailwind CSS directives
│   ├── .commitlintrc.json            # Konfigurasi commitlint frontend
│   ├── .lintstagedrc.js              # Konfigurasi lint-staged frontend
│   ├── .env                          # Konfigurasi environment frontend
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.ts
└── README.md                         # Panduan instalasi dan penggunaan
```

---

## Skema Database Model

Skema tabel database didefinisikan secara deklaratif menggunakan **Prisma ORM** (`backend/prisma/schema.prisma`) dan dapat langsung disinkronkan ke PostgreSQL dengan `npx prisma db push`. File DDL murni juga tetap disediakan di [`backend/schema.sql`](./backend/schema.sql) sebagai referensi DDL mentah.

Struktur tabel database sesuai kriteria studi kasus:

- `nama`: Nama laporan (VARCHAR 255, NOT NULL)
- `deskripsi`: Penjelasan detail permasalahan (TEXT, NOT NULL)
- `lokasi`: Lokasi kejadian di lapangan (VARCHAR 255, NULLABLE)
- `pelapor`: Nama petugas / pelapor (VARCHAR 255, NULLABLE)
- `status`: Enum (`pending`, `approved`, `rejected`) dengan nilai default `'pending'`
- `catatan`: Catatan verifikasi saat disetujui / ditolak (TEXT, NULLABLE)
- `createdAt` & `updatedAt`: Timestamp otomatis

---

## Panduan Menjalankan Proyek (Setup & Run)

### 1. Prasyarat

- **Node.js** (v18 ke atas disarankan v20/v22)
- **PostgreSQL lokal** yang sedang berjalan di port `5432`

---

### 2. Setup Database PostgreSQL

1. Buat database kosong di PostgreSQL lokal:

```sql
CREATE DATABASE field_reports_db;
```

2. Pastikan file `backend/.env` telah terisi kredensial PostgreSQL Anda:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:root@localhost:5432/field_reports_db?schema=public"
FRONTEND_URL="http://localhost:5173"
```

_(Sesuaikan `postgres:root` dengan username dan password PostgreSQL lokal Anda)_.

> **Tips Penting**: Anda **tidak perlu** mengimpor atau mengeksekusi file SQL manual. Tabel dan enum database akan otomatis dibuat dan disinkronkan langsung dari Prisma ORM menggunakan perintah `npx prisma db push`.

---

### 3. Setup & Jalankan Backend

Buka terminal dan masuk ke folder `backend`:

```bash
cd backend

# 1. Install dependensi
npm install

# 2. Sinkronisasi skema langsung dari ORM ke PostgreSQL (otomatis membuat tabel & enum)
npx prisma db push

# 3. (Opsional) Isi database dengan data contoh realistis
npm run prisma:seed

# 4. Jalankan backend development server
npm run dev
```

Server backend akan berjalan di:

- **API URL**: `http://localhost:5000/api/reports`
- **Swagger Documentation**: `http://localhost:5000/api-docs`

---

### 4. Setup & Jalankan Frontend

Buka terminal baru dan masuk ke folder `frontend`:

```bash
cd frontend

# 1. Install dependensi
npm install

# 2. Jalankan frontend development server
npm run dev
```

Dashboard frontend akan aktif di:

- **Web Dashboard**: `http://localhost:5173`

---

## Dokumentasi Endpoint REST API

| Method   | Endpoint                  | Deskripsi                                                                              |
| -------- | ------------------------- | -------------------------------------------------------------------------------------- |
| `GET`    | `/api/reports`            | Mengambil seluruh daftar laporan (mendukung query `status`, `search`, `page`, `limit`) |
| `GET`    | `/api/reports/stats`      | Mengambil ringkasan jumlah status (total, pending, approved, rejected)                 |
| `GET`    | `/api/reports/:id`        | Mengambil detail laporan tunggal berdasarkan ID                                        |
| `POST`   | `/api/reports`            | Membuat laporan baru (status otomatis default `pending`)                               |
| `PATCH`  | `/api/reports/:id/status` | Mengubah status laporan menjadi `approved` atau `rejected` (beserta catatan)           |
| `DELETE` | `/api/reports/:id`        | Menghapus laporan berdasarkan ID                                                       |

### Contoh Request & Response

#### 1. Buat Laporan Baru (`POST /api/reports`)

**Body (JSON):**

```json
{
  "nama": "Pohon Tumbang di Simpang Lima",
  "deskripsi": "Batang pohon besar roboh menutupi badan jalan pasca hujan lebat.",
  "lokasi": "Simpang Lima, Kota Semarang",
  "pelapor": "Bambang Wijaya"
}
```

#### 2. Ubah Status Laporan (`PATCH /api/reports/:id/status`)

**Body (JSON):**

```json
{
  "status": "approved",
  "catatan": "Laporan telah diverifikasi oleh tim lapangan dan disetujui untuk perbaikan segera."
}
```

---

## Cara Menggunakan Swagger & Bruno

### 1. Swagger UI

Buka browser dan akses alamat:

```
http://localhost:5000/api-docs
```

Anda dapat langsung mencoba semua endpoint (Try it out) secara interaktif dari antarmuka Swagger.

### 2. Bruno API Client

1. Buka aplikasi **Bruno** (bisa diunduh gratis dari [usebruno.com](https://www.usebruno.com/)).
2. Pilih menu **"Open Collection"**.
3. Arahkan dan pilih folder `backend/bruno/`.
4. Pilih environment **Local** (`baseUrl: http://localhost:5000`).
5. Jalankan permintaan API yang sudah siap pakai:
   - `Get All Reports`
   - `Get Report Stats`
   - `Create Report`
   - `Approve Report`
   - `Reject Report`
   - `Get Report by ID`

---

## Kriteria Penilaian yang Dipenuhi

1. **Backend**:
   - Dibuat dengan Express.js & TypeScript.
   - Database PostgreSQL lokal dengan Prisma ORM.
   - File skema database PostgreSQL disertakan di `backend/schema.sql`.
   - Data laporan memiliki `nama`, `deskripsi`, `status` (`pending`/`approved`/`rejected`), `lokasi`, `pelapor`, dan `catatan`.
   - Endpoints lengkap: buat laporan, tampilkan laporan, dan ubah status menjadi `approved` atau `rejected`.
2. **Frontend**:
   - Dibuat dengan React (Vite) & TypeScript.
   - Menampilkan daftar laporan dalam tabel lengkap dengan status badge.
   - Form tambah laporan tersedia dengan validasi input.
   - Tombol **Approve** dan **Reject** tersedia pada setiap baris laporan dengan konfirmasi pop-up.
3. **Ketentuan Tambahan**:
   - Menggunakan **Bruno** collection (`backend/bruno/`).
   - Menggunakan **Swagger UI** (`/api-docs`).
   - Menggunakan **Tailwind CSS** untuk seluruh styling layout & komponen.
   - Menggunakan **Ant Design (antd)** _hanya untuk pop up saja_ (Modal form, Modal status confirm, Popconfirm delete, Message alerts).
   - Menjalankan secara langsung di lokal (tanpa Docker).

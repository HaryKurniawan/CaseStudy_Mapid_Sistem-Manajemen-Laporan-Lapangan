# Sistem Manajemen Laporan Lapangan (Field Reports Management)

Aplikasi web fullstack untuk mengelola dan memverifikasi laporan lapangan, terdiri dari **REST API backend** dan **dashboard interaktif frontend**. Proyek ini dibuat untuk memenuhi studi kasus **Fullstack Developer - MAPID**.

Aplikasi ini telah mengimplementasikan sistem **Multi-Role RBAC (Admin, Approver, Pelapor)**, **Audit Trail Riwayat Persetujuan**, **Pengelolaan Akun Terpusat oleh Admin**, serta **Kontrol Hak Akses Laporan Khusus Pelapor**.

---

## 🔑 Akun Demo (Untuk Evaluasi Cepat)

Untuk memudahkan tim penilai/evaluator langsung mencoba seluruh fitur aplikasi tanpa registrasi manual, telah disediakan akun demo untuk masing-masing peran (role). Anda juga dapat menggunakan fitur **1-Klik Masuk** di halaman login:

| Peran (Role) | Email | Password | Nama Pengguna | Hak Akses & Deskripsi |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@mapid.io` | `password123` | Super Admin | Akses penuh: mengelola akun pengguna (buat & hapus user), memantau seluruh laporan, mengedit laporan, menyetujui/menolak, dan menghapus laporan. |
| **Approver** | `approver@mapid.io` | `password123` | Bambang Verifikator | Memantau seluruh laporan, melakukan verifikasi persetujuan (**Approve** / **Reject**), mengubah keputusan (dari reject ke approve dan sebaliknya), serta mencatat riwayat keputusan. |
| **Pelapor 1** | `pelapor1@mapid.io` | `password123` | Budi Santoso | Membuat laporan baru, hanya melihat & memantau laporannya sendiri (Budi), serta mengedit laporan selama statusnya masih `pending`. |
| **Pelapor 2** | `pelapor2@mapid.io` | `password123` | Siti Rahma | Membuat laporan baru, hanya melihat & memantau laporannya sendiri (Siti). Digunakan untuk menguji isolasi data antar-pelapor. |

---

## ✨ Fitur & Aturan Bisnis (Studi Kasus)

1. **Role Pengguna**:
   - **Admin**: Mengelola pengguna baru dan memiliki kontrol penuh atas seluruh laporan.
   - **Approver**: Melakukan verifikasi dan keputusan status laporan lapangan.
   - **Pelapor**: Mengirimkan dan memantau status laporan lapangan.
2. **Pengelolaan Akun Terpusat**:
   - Akun pengguna dibuat langsung oleh **Admin** melalui menu *Kelola Akun*, bukan melalui halaman registrasi publik/mandiri.
3. **Akses Laporan Terisolasi**:
   - **Pelapor hanya dapat melihat laporan yang dibuatnya sendiri** baik pada daftar tabel, pencarian, filter, maupun ringkasan statistik.
   - Admin dan Approver dapat melihat seluruh laporan dari semua pelapor.
4. **Riwayat Persetujuan (Audit Trail)**:
   - Setiap keputusan verifikasi (**Approve** atau **Reject**) otomatis mencatat identitas verifikator (nama & role), catatan verifikasi, serta waktu keputusan (timestamp).
   - Riwayat dapat dilihat secara transparan melalui Modal Detail Laporan.
5. **Aturan Edit & Perubahan Status Laporan**:
   - **Pelapor** masih diperbolehkan mengedit isi laporan (nama, deskripsi, lokasi) **selama statusnya masih `pending`**. Laporan yang sudah disetujui atau ditolak terkunci dari perubahan oleh pelapor.
   - **Approver** memiliki fleksibilitas untuk mengubah keputusan status dari `reject` ke `approve` dan sebaliknya kapan saja.

---

## 🛠️ Ringkasan Teknologi (Tech Stack)

### **Backend**
- **Runtime & Framework**: [Node.js](https://nodejs.org/) v22+, [Express.js](https://expressjs.com/) (TypeScript)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Lokal)
- **ORM**: [Prisma ORM](https://www.prisma.io/)
- **Autentikasi & Keamanan**: JWT (JSON Web Token), `bcryptjs`
- **Validasi Data**: [Zod](https://zod.dev/)
- **Dokumentasi API**: [Swagger UI / OpenAPI 3.0](https://swagger.io/) (`/api-docs`)
- **API Client Collection**: [Bruno](https://www.usebruno.com/) (Folder `backend/bruno/`)
- **File Skema Database**: File SQL DDL mentah di [`backend/schema.sql`](./backend/schema.sql)

### **Frontend**
- **Framework**: [React 18](https://react.dev/) dengan [Vite](https://vitejs.dev/) & TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) untuk layout, dashboard, kartu statistik, dan antarmuka login responsif
- **Komponen Pop-up**: [Ant Design (antd)](https://ant.design/) *khusus untuk pop-up saja* (Modal Tambah Laporan, Modal Edit Laporan, Modal Review Status, Modal Detail & Riwayat Persetujuan, Popconfirm Hapus, Message Toasts)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📁 Struktur Direktori

```text
mapid/
├── .husky/                           # Git Hooks otomatis
│   ├── commit-msg                    # Validasi commit message (commitlint)
│   ├── pre-commit                    # Validasi lint & typecheck staged files (lint-staged)
│   └── pre-push                      # Validasi build backend & frontend sebelum push
├── backend/
│   ├── bruno/                        # Koleksi Bruno API Client (Auto JWT Token)
│   │   ├── Login Admin.bru
│   │   ├── Login Approver.bru
│   │   ├── Login Pelapor.bru
│   │   ├── Get Current User Profile.bru
│   │   ├── Admin - Create User.bru
│   │   ├── Admin - Get All Users.bru
│   │   ├── Get All Reports.bru
│   │   ├── Get Report Stats.bru
│   │   ├── Create Report.bru
│   │   ├── Update Report (Pending).bru
│   │   ├── Approve Report.bru
│   │   └── Reject Report.bru
│   ├── prisma/
│   │   ├── schema.prisma             # Skema data model Prisma
│   │   └── seed/
│   │       └── seed.ts               # Seeder 4 akun demo, laporan awal, & riwayat persetujuan
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.ts             # Prisma Client instance
│   │   ├── controllers/
│   │   │   ├── auth/                 # Controller login & get profile (me)
│   │   │   ├── user/                 # Controller manajemen user oleh Admin
│   │   │   └── report/               # Controller laporan & persetujuan
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts    # JWT verification & Role-Based Authorization
│   │   │   └── errorHandler.ts       # Global error & 404 handler
│   │   ├── routes/
│   │   │   ├── auth.routes.ts        # Rute /api/auth
│   │   │   ├── user.routes.ts        # Rute /api/users
│   │   │   └── report.routes.ts      # Rute /api/reports
│   │   ├── schemas/                  # Zod validation schemas
│   │   ├── swagger/
│   │   │   └── swaggerDoc.ts         # Spesifikasi OpenAPI 3.0 Swagger
│   │   ├── app.ts                    # Inisialisasi Express & middlewares
│   │   └── index.ts                  # Server listener entry point
│   ├── schema.sql                    # Skema database PostgreSQL mentah (DDL)
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginScreen.tsx       # Halaman login & kartu 1-klik akun demo
│   │   │   ├── Navbar.tsx            # Header, tab menu Admin, profil, & logout
│   │   │   ├── UserManagementView.tsx# Menu Admin untuk mengelola & membuat akun pengguna
│   │   │   ├── StatsOverview.tsx     # Kartu statistik ringkasan status
│   │   │   ├── ReportFilter.tsx      # Tab status & filter sort
│   │   │   ├── ReportTable.tsx       # Tabel laporan dengan kontrol hak akses
│   │   │   ├── CreateReportModal.tsx # Antd Modal pop-up tambah laporan
│   │   │   ├── EditReportModal.tsx   # Antd Modal pop-up edit laporan pending
│   │   │   ├── StatusChangeModal.tsx # Antd Modal pop-up Approve / Reject
│   │   │   └── ReportDetailModal.tsx # Antd Modal detail & timeline riwayat persetujuan
│   │   ├── services/
│   │   │   └── api.ts                # Service API client dengan Bearer Token
│   │   ├── types/
│   │   │   └── report.ts             # Definisi TypeScript interfaces
│   │   ├── App.tsx                   # State management utama & router dashboard
│   │   └── index.css                 # Tailwind CSS directives
│   ├── .env.example
│   └── package.json
└── README.md                         # Panduan instalasi dan penggunaan
```

---

## 🗄️ Skema Database PostgreSQL

Skema database didefinisikan secara deklaratif di [`backend/prisma/schema.prisma`](./backend/prisma/schema.prisma) dan skema DDL murni disertakan di [`backend/schema.sql`](./backend/schema.sql).

### 1. Tabel `users`
- `id`: INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY
- `name`: VARCHAR(255) NOT NULL
- `email`: VARCHAR(255) UNIQUE NOT NULL
- `password`: VARCHAR(255) NOT NULL (bcrypt hash)
- `role`: ENUM ('admin', 'pelapor', 'approver') NOT NULL DEFAULT 'pelapor'
- `createdAt` & `updatedAt`: TIMESTAMP

### 2. Tabel `reports`
- `id`: INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY
- `nama`: VARCHAR(255) NOT NULL
- `deskripsi`: TEXT NOT NULL
- `lokasi`: VARCHAR(255) NULLABLE
- `pelapor`: VARCHAR(255) NULLABLE (Nama pelapor)
- `pelaporId`: INTEGER REFERENCES users(id) ON DELETE SET NULL
- `status`: ENUM ('pending', 'approved', 'rejected') DEFAULT 'pending'
- `catatan`: TEXT NULLABLE (Catatan verifikasi terakhir)
- `createdAt` & `updatedAt`: TIMESTAMP

### 3. Tabel `approval_histories` (Audit Trail)
- `id`: INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY
- `reportId`: INTEGER REFERENCES reports(id) ON DELETE CASCADE
- `approverId`: INTEGER REFERENCES users(id) ON DELETE CASCADE
- `status`: ENUM ('pending', 'approved', 'rejected') NOT NULL
- `catatan`: TEXT NULLABLE
- `createdAt`: TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

---

## 🚀 Panduan Menjalankan Proyek (Setup & Run)

### 1. Prasyarat
- **Node.js** v20+ atau v22+
- **PostgreSQL** lokal yang sedang berjalan di port `5432`

---

### 2. Setup Database PostgreSQL

1. Buat database di PostgreSQL lokal:
```sql
CREATE DATABASE field_reports_db;
```

2. Pastikan file `backend/.env` telah terisi kredensial PostgreSQL Anda:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:root@localhost:5432/field_reports_db?schema=public"
FRONTEND_URL="http://localhost:5173"
JWT_SECRET="mapid-field-reports-secret-key-2025"
```
*(Sesuaikan user dan password database Anda)*.

---

### 3. Setup & Jalankan Backend

Buka terminal dan masuk ke folder `backend`:

```bash
cd backend

# 1. Install dependensi
npm install

# 2. Sinkronisasi skema ke database PostgreSQL
npx prisma db push

# 3. Jalankan Seeder (Membuat 4 Akun Demo, Laporan Contoh, & Riwayat Persetujuan)
npm run prisma:seed

# 4. Jalankan backend development server
npm run dev
```

Backend akan aktif di:
- **API URL**: `http://localhost:5000/api`
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

Buka browser Anda dan akses:
- **Web Dashboard**: `http://localhost:5173`

---

## 📖 Dokumentasi Endpoint REST API

### Autentikasi (`/api/auth`)
| Method | Endpoint | Hak Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Publik | Login dengan email & password, mengembalikan JWT token |
| `GET` | `/api/auth/me` | Authenticated | Mengambil profil user yang sedang login |

### Manajemen Pengguna (`/api/users`)
| Method | Endpoint | Hak Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Admin Only | Mengambil seluruh daftar pengguna terdaftar |
| `POST` | `/api/users` | Admin Only | Membuat akun pengguna baru (Admin, Pelapor, Approver) |
| `DELETE` | `/api/users/:id` | Admin Only | Menghapus akun pengguna |

### Laporan Lapangan (`/api/reports`)
| Method | Endpoint | Hak Akses | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reports` | All Roles | Daftar laporan (Pelapor hanya melihat miliknya; Admin & Approver melihat semua) |
| `GET` | `/api/reports/stats` | All Roles | Statistik ringkasan (terisolasi untuk Pelapor) |
| `GET` | `/api/reports/:id` | All Roles | Detail laporan beserta riwayat persetujuan |
| `POST` | `/api/reports` | Pelapor, Admin | Membuat laporan baru (status otomatis `pending`) |
| `PUT` | `/api/reports/:id` | Pelapor, Admin | Mengedit laporan (**Pelapor hanya boleh jika status `pending`**) |
| `PATCH` | `/api/reports/:id/status`| Approver, Admin | Menyetujui/menolak laporan & mencatat riwayat persetujuan |
| `DELETE` | `/api/reports/:id` | Pelapor, Admin | Menghapus laporan (Pelapor hanya jika status `pending` miliknya) |

---

## 🧪 Menguji dengan Bruno API Client

Folder `backend/bruno/` telah disediakan dan siap pakai:
1. Buka aplikasi **Bruno**.
2. Pilih **"Open Collection"** dan buka folder `backend/bruno/`.
3. Pilih environment **Local**.
4. Jalankan request `Login Admin`, `Login Approver`, atau `Login Pelapor`. Skrip otomatis akan menyimpan token ke variabel environment `{{token}}`.
5. Anda dapat langsung menjalankan seluruh request laporan, audit approval, dan manajemen user.

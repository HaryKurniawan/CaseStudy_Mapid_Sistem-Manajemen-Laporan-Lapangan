-- ========================================================
-- Schema DDL: Sistem Manajemen Laporan Lapangan (MAPID)
-- Database: PostgreSQL 14+
-- ========================================================

-- Buat ENUM Types
CREATE TYPE "ReportStatus" AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE "Role" AS ENUM ('admin', 'pelapor', 'approver');

-- 1. Tabel Users (Admin, Pelapor, Approver)
CREATE TABLE IF NOT EXISTS "users" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'pelapor',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Reports (Laporan Lapangan)
CREATE TABLE IF NOT EXISTS "reports" (
    "id" SERIAL PRIMARY KEY,
    "nama" VARCHAR(255) NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "lokasi" VARCHAR(255),
    "pelapor" VARCHAR(255),
    "pelaporId" INTEGER REFERENCES "users"("id") ON DELETE SET NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'pending',
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Approval Histories (Audit Trail Riwayat Persetujuan)
CREATE TABLE IF NOT EXISTS "approval_histories" (
    "id" SERIAL PRIMARY KEY,
    "reportId" INTEGER NOT NULL REFERENCES "reports"("id") ON DELETE CASCADE,
    "approverId" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "status" "ReportStatus" NOT NULL,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa query
CREATE INDEX IF NOT EXISTS "idx_reports_pelaporId" ON "reports"("pelaporId");
CREATE INDEX IF NOT EXISTS "idx_reports_status" ON "reports"("status");
CREATE INDEX IF NOT EXISTS "idx_approval_histories_reportId" ON "approval_histories"("reportId");

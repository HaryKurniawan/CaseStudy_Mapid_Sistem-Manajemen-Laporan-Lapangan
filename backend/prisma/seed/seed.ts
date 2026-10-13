import process from 'node:process';
import { PrismaClient, ReportStatus, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Menjalankan seeder data pengguna dan laporan lapangan...');

  // 1. Bersihkan data lama jika ada
  await prisma.approvalHistory.deleteMany();
  await prisma.report.deleteMany();
  await prisma.user.deleteMany();

  // 2. Hash default password untuk akun demo
  const defaultPassword = await bcrypt.hash('password123', 10);

  // 3. Buat Akun Demo
  // Role: Admin, Approver, Pelapor
  const adminUser = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@mapid.io',
      password: defaultPassword,
      role: Role.admin,
    },
  });

  const approverUser = await prisma.user.create({
    data: {
      name: 'Bambang Verifikator',
      email: 'approver@mapid.io',
      password: defaultPassword,
      role: Role.approver,
    },
  });

  const pelaporBudi = await prisma.user.create({
    data: {
      name: 'Budi Santoso',
      email: 'pelapor1@mapid.io',
      password: defaultPassword,
      role: Role.pelapor,
    },
  });

  const pelaporSiti = await prisma.user.create({
    data: {
      name: 'Siti Rahma',
      email: 'pelapor2@mapid.io',
      password: defaultPassword,
      role: Role.pelapor,
    },
  });

  console.log('✅ Akun demo berhasil dibuat:');
  console.log('   👑 Admin: admin@mapid.io / password123');
  console.log('   🔍 Approver: approver@mapid.io / password123');
  console.log('   📝 Pelapor 1: pelapor1@mapid.io / password123 (Budi Santoso)');
  console.log('   📝 Pelapor 2: pelapor2@mapid.io / password123 (Siti Rahma)');

  // 4. Buat contoh data laporan lapangan
  // Laporan Budi Santoso (pelapor1)
  const report1 = await prisma.report.create({
    data: {
      nama: 'Kerusakan Pipa Distribusi Air PDAM',
      deskripsi:
        'Terjadi kebocoran pipa bertekanan tinggi di simpang jalan utama. Air meluap ke aspal dan mengganggu arus lalu lintas.',
      lokasi: 'Jl. Sudirman No. 45, Jakarta Pusat',
      pelapor: pelaporBudi.name,
      pelaporId: pelaporBudi.id,
      status: ReportStatus.pending,
      catatan: null,
    },
  });

  const report2 = await prisma.report.create({
    data: {
      nama: 'Perbaikan Lampu Penerangan Jalan Umum (PJU)',
      deskripsi:
        'Penggantian 6 unit lampu PJU LED tenaga surya yang rusak di sepanjang jalur lingkar timur telah rampung.',
      lokasi: 'Jl. Pemuda No. 12, Semarang',
      pelapor: pelaporBudi.name,
      pelaporId: pelaporBudi.id,
      status: ReportStatus.approved,
      catatan: 'Pekerjaan telah diverifikasi dan berfungsi optimal pada malam hari.',
    },
  });

  // Catat riwayat persetujuan untuk report2 (Approved oleh Bambang)
  await prisma.approvalHistory.create({
    data: {
      reportId: report2.id,
      approverId: approverUser.id,
      status: ReportStatus.approved,
      catatan: 'Pekerjaan telah diverifikasi dan berfungsi optimal pada malam hari.',
      createdAt: new Date(Date.now() - 3600000 * 2), // 2 jam yang lalu
    },
  });

  // Laporan Siti Rahma (pelapor2)
  const report3 = await prisma.report.create({
    data: {
      nama: 'Pohon Tumbang Menimpa Kabel Utilitas',
      deskripsi:
        'Pohon akasia tumbang pasca hujan deras semalam. Ranting menimpa kabel telekomunikasi dan menutup sebagian badan jalan.',
      lokasi: 'Jl. Gatot Subroto Km 7, Bandung',
      pelapor: pelaporSiti.name,
      pelaporId: pelaporSiti.id,
      status: ReportStatus.pending,
      catatan: null,
    },
  });

  const report4 = await prisma.report.create({
    data: {
      nama: 'Retak Struktur Tanggul Saluran Irigasi',
      deskripsi:
        'Terdapat keretakan selebar 3 cm pada dinding penahan saluran irigasi sekunder akibat penurunan tanah.',
      lokasi: 'Desa Sukamaju RT 03/RW 02, Sleman',
      pelapor: pelaporSiti.name,
      pelaporId: pelaporSiti.id,
      status: ReportStatus.rejected,
      catatan:
        'Lokasi berada di bawah kewenangan pengelola swasta kawasan industri, bukan dinas teknis pemerintah daerah.',
    },
  });

  // Catat riwayat persetujuan untuk report4 (Rejected oleh Bambang)
  await prisma.approvalHistory.create({
    data: {
      reportId: report4.id,
      approverId: approverUser.id,
      status: ReportStatus.rejected,
      catatan:
        'Lokasi berada di bawah kewenangan pengelola swasta kawasan industri, bukan dinas teknis pemerintah daerah.',
      createdAt: new Date(Date.now() - 3600000 * 5), // 5 jam yang lalu
    },
  });

  const report5 = await prisma.report.create({
    data: {
      nama: 'Lubang Aspal Sedalam 15 cm di Jalur Cepat',
      deskripsi:
        'Kerusakan permukaan jalan aspal berlubang parah setelah musim hujan, membahayakan pengendara roda dua.',
      lokasi: 'Jl. Raya Daan Mogot Km 13, Jakarta Barat',
      pelapor: pelaporBudi.name,
      pelaporId: pelaporBudi.id,
      status: ReportStatus.pending,
      catatan: null,
    },
  });

  console.log(`✅ Berhasil menambahkan 5 contoh data laporan beserta riwayat persetujuan!`);
}

main()
  .catch((e) => {
    console.error('❌ Gagal menjalankan seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

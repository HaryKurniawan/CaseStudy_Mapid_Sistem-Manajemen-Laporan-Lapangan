import process from 'node:process';
import { PrismaClient, ReportStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Menjalankan seeder data laporan lapangan...');

  const sampleReports = [
    {
      nama: 'Kerusakan Pipa Distribusi Air PDAM',
      deskripsi:
        'Terjadi kebocoran pipa bertekanan tinggi di simpang jalan utama. Air meluap ke aspal dan mengganggu arus lalu lintas.',
      lokasi: 'Jl. Sudirman No. 45, Jakarta Pusat',
      pelapor: 'Budi Santoso (Petugas Lapangan Wilayah 1)',
      status: ReportStatus.pending,
      catatan: null,
    },
    {
      nama: 'Pohon Tumbang Menimpa Kabel Utilitas',
      deskripsi:
        'Pohon akasia tumbang pasca hujan deras semalam. Ranting menimpa kabel telekomunikasi dan menutup sebagian badan jalan.',
      lokasi: 'Jl. Gatot Subroto Km 7, Bandung',
      pelapor: 'Siti Rahma (Satgas Siaga Bencana)',
      status: ReportStatus.pending,
      catatan: null,
    },
    {
      nama: 'Perbaikan Lampu Penerangan Jalan Umum (PJU)',
      deskripsi:
        'Penggantian 6 unit lampu PJU LED tenaga surya yang rusak di sepanjang jalur lingkar timur telah rampung.',
      lokasi: 'Jl. Pemuda No. 12, Semarang',
      pelapor: 'Agus Setiawan (Dinas Bina Marga)',
      status: ReportStatus.approved,
      catatan: 'Pekerjaan telah diverifikasi dan berfungsi optimal pada malam hari.',
    },
    {
      nama: 'Retak Struktur Tanggul Saluran Irigasi',
      deskripsi:
        'Terdapat keretakan selebar 3 cm pada dinding penahan saluran irigasi sekunder akibat penurunan tanah.',
      lokasi: 'Desa Sukamaju RT 03/RW 02, Sleman',
      pelapor: 'Hendra Kusuma (Penyuluh Pertanian)',
      status: ReportStatus.rejected,
      catatan:
        'Lokasi berada di bawah kewenangan pengelola swasta kawasan industri, bukan dinas teknis pemerintah daerah.',
    },
    {
      nama: 'Lubang Aspal Sedalam 15 cm di Jalur Cepat',
      deskripsi:
        'Kerusakan permukaan jalan aspal berlubang parah setelah musim hujan, membahayakan pengendara roda dua.',
      lokasi: 'Jl. Raya Daan Mogot Km 13, Jakarta Barat',
      pelapor: 'Rian Pratama (Warga Pelapor)',
      status: ReportStatus.pending,
      catatan: null,
    },
  ];

  for (const item of sampleReports) {
    await prisma.report.create({
      data: item,
    });
  }

  console.log(`✅ Berhasil menambahkan ${sampleReports.length} contoh data laporan!`);
}

main()
  .catch((e) => {
    console.error('❌ Gagal menjalankan seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

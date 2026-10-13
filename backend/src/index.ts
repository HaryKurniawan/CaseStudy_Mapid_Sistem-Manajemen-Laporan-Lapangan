import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app.js';
import { prisma } from './config/prisma.js';

const PORT = process.env.PORT || 5000;
const app = createApp();

// Jalankan server HTTP lokal jika bukan di environment Vercel serverless
if (!process.env.VERCEL) {
  const server = app.listen(PORT, async () => {
    try {
      // Verifikasi koneksi database
      await prisma.$connect();
      console.log(`===============================================`);
      console.log(`Server berjalan di http://localhost:${PORT}`);
      console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
      console.log(`API Endpoint: http://localhost:${PORT}/api/reports`);
      console.log(`===============================================`);
    } catch (error) {
      console.error('Gagal terhubung ke database:', error);
    }
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log('\nMematikan server...');
    server.close(async () => {
      await prisma.$disconnect();
      console.log('Server & koneksi Prisma berhasil ditutup.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

export default app;

// Kompatibilitas untuk Vercel Serverless Functions (CommonJS)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = app;
  (module.exports as any).default = app;
}

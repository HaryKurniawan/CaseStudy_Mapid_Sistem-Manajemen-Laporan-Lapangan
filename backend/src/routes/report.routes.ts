import { Router } from 'express';
import {
  getReportStats,
  getReports,
  getReportById,
  createReport,
  updateReport,
  updateReportStatus,
  deleteReport,
} from '../controllers/report/index.js';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware.js';
import { Role } from '@prisma/client';

const router = Router();

// Seluruh rute laporan memerlukan autentikasi
router.use(authenticateToken);

// Urutan penting: stats didefinisikan sebelum :id agar tidak tertangkap sebagai param :id
router.get('/stats', getReportStats);
router.get('/', getReports);
router.get('/:id', getReportById);

// Buat laporan: Dapat diakses oleh Pelapor dan Admin
router.post('/', requireRole([Role.pelapor, Role.admin]), createReport);

// Edit laporan: Pelapor dapat mengedit selama status masih pending; Admin dapat mengedit
router.put('/:id', requireRole([Role.pelapor, Role.admin]), updateReport);

// Update status: Hanya Approver dan Admin yang berhak menyetujui / menolak
router.patch('/:id/status', requireRole([Role.approver, Role.admin]), updateReportStatus);

// Hapus laporan: Pelapor (hanya jika pending miliknya) atau Admin
router.delete('/:id', requireRole([Role.pelapor, Role.admin]), deleteReport);

export default router;

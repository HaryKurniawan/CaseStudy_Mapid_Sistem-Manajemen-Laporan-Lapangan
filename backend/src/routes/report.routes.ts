import { Router } from 'express';
import {
  getReportStats,
  getReports,
  getReportById,
  createReport,
  updateReportStatus,
  deleteReport,
} from '../controllers/report/index.js';

const router = Router();

// Urutan penting: stats didefinisikan sebelum :id agar tidak tertangkap sebagai param :id
router.get('/stats', getReportStats);
router.get('/', getReports);
router.get('/:id', getReportById);
router.post('/', createReport);
router.patch('/:id/status', updateReportStatus);
router.delete('/:id', deleteReport);

export default router;

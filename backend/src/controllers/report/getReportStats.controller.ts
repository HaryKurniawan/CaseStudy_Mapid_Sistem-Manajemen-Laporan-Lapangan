import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';

/**
 * Mendapatkan statistik status laporan (total, pending, approved, rejected)
 * GET /api/reports/stats
 */
export const getReportStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      prisma.report.count(),
      prisma.report.count({ where: { status: 'pending' } }),
      prisma.report.count({ where: { status: 'approved' } }),
      prisma.report.count({ where: { status: 'rejected' } }),
    ]);

    res.status(200).json({
      success: true,
      message: 'Statistik laporan berhasil diambil',
      data: {
        total,
        pending,
        approved,
        rejected,
      },
    });
  } catch (error) {
    next(error);
  }
};

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import { Role, Prisma } from '@prisma/client';

/**
 * Mendapatkan statistik status laporan (total, pending, approved, rejected)
 * Pelapor hanya mendapatkan statistik laporan miliknya sendiri.
 * GET /api/reports/stats
 */
export const getReportStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const baseWhere: Prisma.ReportWhereInput = {};

    if (req.user && req.user.role === Role.pelapor) {
      baseWhere.pelaporId = req.user.id;
    }

    const [total, pending, approved, rejected] = await Promise.all([
      prisma.report.count({ where: baseWhere }),
      prisma.report.count({ where: { ...baseWhere, status: 'pending' } }),
      prisma.report.count({ where: { ...baseWhere, status: 'approved' } }),
      prisma.report.count({ where: { ...baseWhere, status: 'rejected' } }),
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

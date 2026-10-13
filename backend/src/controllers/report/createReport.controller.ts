import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import { createReportSchema } from '../../schemas/report.schema.js';
import { ReportStatus } from '@prisma/client';

/**
 * Membuat laporan baru (status otomatis 'pending')
 * Terhubung langsung dengan akun pengguna yang sedang login
 * POST /api/reports
 */
export const createReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createReportSchema.parse(req.body);

    const pelaporName = req.user ? req.user.name : validatedData.pelapor || null;
    const pelaporId = req.user ? req.user.id : null;

    const newReport = await prisma.report.create({
      data: {
        nama: validatedData.nama,
        deskripsi: validatedData.deskripsi,
        lokasi: validatedData.lokasi || null,
        pelapor: pelaporName,
        pelaporId,
        status: ReportStatus.pending,
      },
      include: {
        approvalHistories: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Laporan baru berhasil dibuat',
      data: newReport,
    });
  } catch (error) {
    next(error);
  }
};

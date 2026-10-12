import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import { createReportSchema } from '../../schemas/report.schema.js';
import { ReportStatus } from '@prisma/client';

/**
 * Membuat laporan baru (status otomatis 'pending')
 * POST /api/reports
 */
export const createReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createReportSchema.parse(req.body);

    const newReport = await prisma.report.create({
      data: {
        nama: validatedData.nama,
        deskripsi: validatedData.deskripsi,
        lokasi: validatedData.lokasi || null,
        pelapor: validatedData.pelapor || null,
        status: ReportStatus.pending,
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

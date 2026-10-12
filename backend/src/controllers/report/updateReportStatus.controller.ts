import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import { updateReportStatusSchema } from '../../schemas/report.schema.js';
import { ReportStatus } from '@prisma/client';

/**
 * Mengubah status laporan menjadi approved atau rejected
 * PATCH /api/reports/:id/status
 */
export const updateReportStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(String(idParam), 10);
    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'ID laporan tidak valid (harus berupa angka)',
      });
      return;
    }

    const validatedData = updateReportStatusSchema.parse(req.body);

    const existingReport = await prisma.report.findUnique({
      where: { id },
    });

    if (!existingReport) {
      res.status(404).json({
        success: false,
        message: `Laporan dengan ID ${id} tidak ditemukan`,
      });
      return;
    }

    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        status: validatedData.status as ReportStatus,
        catatan: validatedData.catatan !== undefined ? validatedData.catatan : existingReport.catatan,
      },
    });

    res.status(200).json({
      success: true,
      message: `Status laporan berhasil diubah menjadi '${validatedData.status}'`,
      data: updatedReport,
    });
  } catch (error) {
    next(error);
  }
};

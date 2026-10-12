import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';

/**
 * Mendapatkan detail laporan berdasarkan ID
 * GET /api/reports/:id
 */
export const getReportById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const report = await prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      res.status(404).json({
        success: false,
        message: `Laporan dengan ID ${id} tidak ditemukan`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Detail laporan berhasil diambil',
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

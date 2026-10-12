import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';

/**
 * Menghapus laporan berdasarkan ID
 * DELETE /api/reports/:id
 */
export const deleteReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    await prisma.report.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: `Laporan #${id} berhasil dihapus`,
    });
  } catch (error) {
    next(error);
  }
};

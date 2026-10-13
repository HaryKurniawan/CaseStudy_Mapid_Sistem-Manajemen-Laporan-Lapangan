import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import { Role, ReportStatus } from '@prisma/client';

/**
 * Menghapus laporan berdasarkan ID
 * Pelapor hanya dapat menghapus laporannya sendiri yang masih berstatus pending. Admin dapat menghapus laporan apa saja.
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

    if (req.user) {
      if (req.user.role === Role.pelapor) {
        if (existingReport.pelaporId !== req.user.id) {
          res.status(403).json({
            success: false,
            message: 'Akses ditolak: Anda tidak memiliki izin untuk menghapus laporan milik pengguna lain',
          });
          return;
        }

        if (existingReport.status !== ReportStatus.pending) {
          res.status(400).json({
            success: false,
            message: 'Laporan yang telah diproses (approved/rejected) tidak dapat dihapus',
          });
          return;
        }
      } else if (req.user.role === Role.approver) {
        res.status(403).json({
          success: false,
          message: 'Akses ditolak: Peran Approver tidak memiliki izin menghapus laporan',
        });
        return;
      }
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

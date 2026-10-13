import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import { Role } from '@prisma/client';

/**
 * Mendapatkan detail laporan berdasarkan ID beserta riwayat persetujuannya
 * Pelapor hanya dapat mengakses laporannya sendiri
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
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
        approvalHistories: {
          include: {
            approver: {
              select: { id: true, name: true, role: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!report) {
      res.status(404).json({
        success: false,
        message: `Laporan dengan ID ${id} tidak ditemukan`,
      });
      return;
    }

    // Otorisasi: Pelapor hanya dapat mengakses laporannya sendiri
    if (req.user && req.user.role === Role.pelapor && report.pelaporId !== req.user.id) {
      res.status(403).json({
        success: false,
        message: 'Akses ditolak: Anda hanya dapat melihat detail laporan yang Anda buat sendiri',
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

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import { updateReportSchema } from '../../schemas/report.schema.js';
import { ReportStatus, Role } from '@prisma/client';

/**
 * Mengubah data laporan (nama, deskripsi, lokasi)
 * Aturan: Pelapor masih diperbolehkan mengedit laporan selama statusnya masih pending.
 * PUT /api/reports/:id
 */
export const updateReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const validatedData = updateReportSchema.parse(req.body);

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

    // Validasi otorisasi & status:
    if (req.user) {
      if (req.user.role === Role.pelapor) {
        // Pelapor hanya boleh edit miliknya sendiri
        if (existingReport.pelaporId !== req.user.id) {
          res.status(403).json({
            success: false,
            message: 'Akses ditolak: Anda tidak memiliki izin untuk mengedit laporan milik pengguna lain',
          });
          return;
        }

        // Pelapor HANYA diperbolehkan mengedit selama status masih pending
        if (existingReport.status !== ReportStatus.pending) {
          res.status(400).json({
            success: false,
            message: `Laporan tidak dapat diedit karena sudah berstatus '${existingReport.status}'. Hanya laporan dengan status 'pending' yang dapat diedit.`,
          });
          return;
        }
      } else if (req.user.role === Role.approver) {
        res.status(403).json({
          success: false,
          message: 'Akses ditolak: Peran Approver tidak memiliki izin mengedit isi laporan',
        });
        return;
      }
    }

    const updatedReport = await prisma.report.update({
      where: { id },
      data: {
        nama: validatedData.nama !== undefined ? validatedData.nama : existingReport.nama,
        deskripsi: validatedData.deskripsi !== undefined ? validatedData.deskripsi : existingReport.deskripsi,
        lokasi: validatedData.lokasi !== undefined ? validatedData.lokasi : existingReport.lokasi,
      },
      include: {
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

    res.status(200).json({
      success: true,
      message: 'Laporan berhasil diperbarui',
      data: updatedReport,
    });
  } catch (error) {
    next(error);
  }
};

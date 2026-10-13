import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import { updateReportStatusSchema } from '../../schemas/report.schema.js';
import { ReportStatus, Role } from '@prisma/client';

/**
 * Mengubah status laporan menjadi approved atau rejected
 * Serta mencatat riwayat persetujuan (siapa yang memutuskan dan waktu keputusan).
 * Approver dapat mengubah status dari rejected ke approved dan sebaliknya.
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

    // Hanya Approver dan Admin yang berhak menyetujui / menolak laporan
    if (req.user && req.user.role !== Role.approver && req.user.role !== Role.admin) {
      res.status(403).json({
        success: false,
        message: 'Akses ditolak: Hanya peran Approver atau Admin yang dapat menyetujui/menolak laporan',
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

    const approverId = req.user ? req.user.id : null;

    // Gunakan transaction untuk memastikan report status terupdate dan riwayat persetujuan tercatat
    const [updatedReport] = await prisma.$transaction([
      prisma.report.update({
        where: { id },
        data: {
          status: validatedData.status as ReportStatus,
          catatan: validatedData.catatan !== undefined ? validatedData.catatan : existingReport.catatan,
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
      }),
      // Catat ke ApprovalHistory jika ada approver terautentikasi
      ...(approverId
        ? [
            prisma.approvalHistory.create({
              data: {
                reportId: id,
                approverId,
                status: validatedData.status as ReportStatus,
                catatan: validatedData.catatan || null,
              },
            }),
          ]
        : []),
    ]);

    // Ambil ulang dengan approvalHistories terbaru lengkap
    const finalReport = await prisma.report.findUnique({
      where: { id },
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
      message: `Status laporan berhasil diubah menjadi '${validatedData.status}'`,
      data: finalReport || updatedReport,
    });
  } catch (error) {
    next(error);
  }
};

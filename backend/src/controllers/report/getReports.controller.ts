import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';
import { queryReportSchema } from '../../schemas/report.schema.js';
import { ReportStatus, Prisma, Role } from '@prisma/client';

/**
 * Mendapatkan daftar laporan dengan filter status, pencarian, dan paginasi
 * Pelapor hanya dapat melihat laporan yang dibuatnya sendiri.
 * GET /api/reports
 */
export const getReports = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const parsedQuery = queryReportSchema.parse(req.query);
    const { status, search, sort = 'newest', page = 1, limit = 10 } = parsedQuery;

    const where: Prisma.ReportWhereInput = {};

    // Kontrol Akses: Pelapor hanya dapat melihat laporannya sendiri
    if (req.user && req.user.role === Role.pelapor) {
      where.pelaporId = req.user.id;
    }

    if (status && status !== 'all') {
      where.status = status as ReportStatus;
    }

    if (search && search.trim() !== '') {
      const queryTerm = search.trim();
      where.OR = [
        { nama: { contains: queryTerm, mode: 'insensitive' } },
        { deskripsi: { contains: queryTerm, mode: 'insensitive' } },
        { lokasi: { contains: queryTerm, mode: 'insensitive' } },
        { pelapor: { contains: queryTerm, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;
    const sortOrder: Prisma.SortOrder = sort === 'oldest' || sort === 'asc' ? 'asc' : 'desc';

    const [total, reports] = await Promise.all([
      prisma.report.count({ where }),
      prisma.report.findMany({
        where,
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
        orderBy: { createdAt: sortOrder },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: 'Daftar laporan berhasil diambil',
      data: reports,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

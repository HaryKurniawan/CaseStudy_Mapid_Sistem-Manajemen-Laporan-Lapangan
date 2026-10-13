import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';

export const getUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            reports: true,
            approvalHistories: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      message: 'Daftar pengguna berhasil diambil',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Pengguna belum terautentikasi',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Data pengguna tidak ditemukan',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Profil pengguna berhasil diambil',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

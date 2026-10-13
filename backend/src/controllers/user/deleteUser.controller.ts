import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/prisma.js';

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const idParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(String(idParam), 10);

    if (isNaN(id)) {
      res.status(400).json({
        success: false,
        message: 'ID pengguna tidak valid (harus berupa angka)',
      });
      return;
    }

    if (req.user && req.user.id === id) {
      res.status(400).json({
        success: false,
        message: 'Anda tidak dapat menghapus akun Anda sendiri',
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      res.status(404).json({
        success: false,
        message: `Pengguna dengan ID ${id} tidak ditemukan`,
      });
      return;
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: `Pengguna '${existingUser.name}' berhasil dihapus`,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

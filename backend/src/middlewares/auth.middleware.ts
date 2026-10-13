import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { AuthenticatedUser } from '../types/express.js';

const JWT_SECRET = process.env.JWT_SECRET || 'mapid-field-reports-secret-key-2025';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Akses tidak diizinkan: Token autentikasi tidak ditemukan. Silakan login terlebih dahulu.',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token autentikasi tidak valid atau sudah kedaluwarsa. Silakan login kembali.',
    });
  }
};

/**
 * Middleware untuk membatasi akses berdasarkan role pengguna
 */
export const requireRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Akses tidak diizinkan: Pengguna belum diautentikasi.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Akses ditolak: Fitur ini hanya dapat diakses oleh role ${allowedRoles.join(', ')}.`,
      });
      return;
    }

    next();
  };
};

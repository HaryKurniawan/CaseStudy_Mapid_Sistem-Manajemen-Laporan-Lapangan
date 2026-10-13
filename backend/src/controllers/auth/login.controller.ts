import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma.js';
import { loginSchema } from '../../schemas/auth.schema.js';

const JWT_SECRET = process.env.JWT_SECRET || 'mapid-field-reports-secret-key-2025';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Email atau password salah',
      });
      return;
    }

    const isMatch = await bcrypt.compare(validatedData.password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Email atau password salah',
      });
      return;
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      success: true,
      message: `Login berhasil sebagai ${user.role}`,
      data: {
        token,
        user: payload,
      },
    });
  } catch (error) {
    next(error);
  }
};

import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma.js';
import { createUserSchema } from '../../schemas/user.schema.js';
import { Role } from '@prisma/client';

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validatedData = createUserSchema.parse(req.body);

    // Cek apakah email sudah terdaftar
    const existing = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (existing) {
      res.status(409).json({
        success: false,
        message: `Email '${validatedData.email}' sudah terdaftar`,
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        password: hashedPassword,
        role: validatedData.role as Role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      message: `Pengguna '${newUser.name}' dengan role '${newUser.role}' berhasil dibuat`,
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

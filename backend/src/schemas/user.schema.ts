import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Nama pengguna minimal 2 karakter').max(255),
  email: z.string().email('Format email tidak valid').max(255),
  password: z.string().min(6, 'Password minimal 6 karakter').max(255),
  role: z.enum(['admin', 'pelapor', 'approver'], {
    message: 'Role harus salah satu dari: admin, pelapor, atau approver',
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

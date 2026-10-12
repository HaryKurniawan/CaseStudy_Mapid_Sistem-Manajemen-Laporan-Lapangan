import { z } from 'zod';

export const createReportSchema = z.object({
  nama: z
    .string()
    .min(3, 'Nama laporan minimal 3 karakter')
    .max(255, 'Nama laporan maksimal 255 karakter'),
  deskripsi: z
    .string()
    .min(5, 'Deskripsi laporan minimal 5 karakter'),
  lokasi: z.string().max(255).optional().nullable(),
  pelapor: z.string().max(255).optional().nullable(),
});

export const updateReportStatusSchema = z.object({
  status: z.enum(['approved', 'rejected'] as const),
  catatan: z.string().optional().nullable(),
});

export const queryReportSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected', 'all'] as const).optional(),
  search: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'desc', 'asc'] as const).optional().default('newest'),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type UpdateReportStatusInput = z.infer<typeof updateReportStatusSchema>;
export type QueryReportInput = z.infer<typeof queryReportSchema>;

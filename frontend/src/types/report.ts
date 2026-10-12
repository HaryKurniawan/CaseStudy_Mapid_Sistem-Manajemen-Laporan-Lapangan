export type ReportStatus = 'pending' | 'approved' | 'rejected';

export interface Report {
  id: number;
  nama: string;
  deskripsi: string;
  lokasi?: string | null;
  pelapor?: string | null;
  status: ReportStatus;
  catatan?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportPayload {
  nama: string;
  deskripsi: string;
  lokasi?: string;
  pelapor?: string;
}

export interface UpdateReportStatusPayload {
  status: 'approved' | 'rejected';
  catatan?: string;
}

export interface ReportStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  errors?: Array<{ field: string; message: string }>;
}

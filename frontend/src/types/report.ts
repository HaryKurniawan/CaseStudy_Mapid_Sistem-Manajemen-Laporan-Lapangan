export type ReportStatus = 'pending' | 'approved' | 'rejected';
export type Role = 'admin' | 'pelapor' | 'approver';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  _count?: {
    reports: number;
    approvalHistories: number;
  };
}

export interface ApprovalHistory {
  id: number;
  reportId: number;
  approverId: number;
  status: 'approved' | 'rejected';
  catatan?: string | null;
  createdAt: string;
  approver?: {
    id: number;
    name: string;
    role: string;
  };
}

export interface Report {
  id: number;
  nama: string;
  deskripsi: string;
  lokasi?: string | null;
  pelapor?: string | null;
  pelaporId?: number | null;
  status: ReportStatus;
  catatan?: string | null;
  createdAt: string;
  updatedAt: string;
  approvalHistories?: ApprovalHistory[];
}

export interface CreateReportPayload {
  nama: string;
  deskripsi: string;
  lokasi?: string;
  pelapor?: string;
}

export interface UpdateReportPayload {
  nama?: string;
  deskripsi?: string;
  lokasi?: string;
}

export interface UpdateReportStatusPayload {
  status: 'approved' | 'rejected';
  catatan?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface LoginPayload {
  email: string;
  password: string;
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

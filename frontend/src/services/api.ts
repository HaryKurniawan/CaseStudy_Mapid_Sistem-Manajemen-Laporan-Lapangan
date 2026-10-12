import {
  ApiResponse,
  CreateReportPayload,
  Report,
  ReportStats,
  UpdateReportStatusPayload,
} from '../types/report';
const API_BASE_URL = import.meta.env.VITE_API_URL;

async function handleResponse<T>(res: Response): Promise<ApiResponse<T>> {
  const json = await res.json();
  if (!res.ok) {
    const errorMsg = json.message || (json.errors ? json.errors.map((e: any) => e.message).join(', ') : 'Terjadi kesalahan pada server');
    throw new Error(errorMsg);
  }
  return json;
}

export const api = {
  /**
   * Mengambil daftar laporan dengan opsi filter status, pencarian, dan paginasi
   */
  async getReports(
    status: string = 'all',
    search: string = '',
    sort: 'newest' | 'oldest' = 'newest',
    page: number = 1,
    limit: number = 50
  ): Promise<ApiResponse<Report[]>> {
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    if (search && search.trim() !== '') params.append('search', search.trim());
    if (sort) params.append('sort', sort);
    params.append('page', String(page));
    params.append('limit', String(limit));

    const res = await fetch(`${API_BASE_URL}/reports?${params.toString()}`, {
      cache: 'no-store',
    });
    return handleResponse<Report[]>(res);
  },

  /**
   * Mengambil detail laporan tunggal berdasarkan ID
   */
  async getReportById(id: number): Promise<ApiResponse<Report>> {
    const res = await fetch(`${API_BASE_URL}/reports/${id}`, {
      cache: 'no-store',
    });
    return handleResponse<Report>(res);
  },

  /**
   * Mengambil ringkasan statistik (total, pending, approved, rejected)
   */
  async getStats(): Promise<ApiResponse<ReportStats>> {
    const res = await fetch(`${API_BASE_URL}/reports/stats`, {
      cache: 'no-store',
    });
    return handleResponse<ReportStats>(res);
  },

  /**
   * Membuat laporan baru
   */
  async createReport(payload: CreateReportPayload): Promise<ApiResponse<Report>> {
    const res = await fetch(`${API_BASE_URL}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<Report>(res);
  },

  /**
   * Mengubah status laporan menjadi approved atau rejected
   */
  async updateReportStatus(
    id: number,
    payload: UpdateReportStatusPayload
  ): Promise<ApiResponse<Report>> {
    const res = await fetch(`${API_BASE_URL}/reports/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<Report>(res);
  },

  /**
   * Menghapus laporan
   */
  async deleteReport(id: number): Promise<ApiResponse<null>> {
    const res = await fetch(`${API_BASE_URL}/reports/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<null>(res);
  },
};

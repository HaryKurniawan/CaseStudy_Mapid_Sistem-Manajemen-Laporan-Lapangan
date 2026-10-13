import {
  ApiResponse,
  CreateReportPayload,
  CreateUserPayload,
  Report,
  ReportStats,
  UpdateReportPayload,
  UpdateReportStatusPayload,
  User,
} from '../types/report';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'mapid_auth_token';

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },
};

function getAuthHeaders(): HeadersInit {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<ApiResponse<T>> {
  const json = await res.json();
  if (!res.ok) {
    const errorMsg =
      json.message ||
      (json.errors ? json.errors.map((e: any) => e.message).join(', ') : 'Terjadi kesalahan pada server');
    throw new Error(errorMsg);
  }
  return json;
}

export const api = {
  // =================== AUTH ===================
  async login(payload: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<{ token: string; user: User }>(res);
  },

  async getMe(): Promise<ApiResponse<User>> {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<User>(res);
  },

  // =================== USERS (Admin Only) ===================
  async getUsers(): Promise<ApiResponse<User[]>> {
    const res = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<User[]>(res);
  },

  async createUser(payload: { name: string; email: string; password: string; role: string }): Promise<ApiResponse<User>> {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<User>(res);
  },

  async deleteUser(id: number): Promise<ApiResponse<null>> {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<null>(res);
  },

  // =================== REPORTS ===================
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
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<Report[]>(res);
  },

  /**
   * Mengambil detail laporan tunggal berdasarkan ID
   */
  async getReportById(id: number): Promise<ApiResponse<Report>> {
    const res = await fetch(`${API_BASE_URL}/reports/${id}`, {
      headers: getAuthHeaders(),
      cache: 'no-store',
    });
    return handleResponse<Report>(res);
  },

  /**
   * Mengambil ringkasan statistik (total, pending, approved, rejected)
   */
  async getStats(): Promise<ApiResponse<ReportStats>> {
    const res = await fetch(`${API_BASE_URL}/reports/stats`, {
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<Report>(res);
  },

  /**
   * Mengedit data laporan (Pelapor saat pending, atau Admin)
   */
  async updateReport(id: number, payload: UpdateReportPayload): Promise<ApiResponse<Report>> {
    const res = await fetch(`${API_BASE_URL}/reports/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse<Report>(res);
  },

  /**
   * Mengubah status laporan menjadi approved atau rejected (Approver / Admin)
   */
  async updateReportStatus(
    id: number,
    payload: UpdateReportStatusPayload
  ): Promise<ApiResponse<Report>> {
    const res = await fetch(`${API_BASE_URL}/reports/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
    });
    return handleResponse<null>(res);
  },
};

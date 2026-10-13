import React, { useState, useEffect, useCallback } from 'react';
import { App as AntdApp, message } from 'antd';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { ReportFilter } from './components/ReportFilter';
import { ReportTable } from './components/ReportTable';
import { CreateReportModal } from './components/CreateReportModal';
import { EditReportModal } from './components/EditReportModal';
import { StatusChangeModal } from './components/StatusChangeModal';
import { ReportDetailModal } from './components/ReportDetailModal';
import { LoginScreen } from './components/LoginScreen';
import { UserManagementView } from './components/UserManagementView';
import { api, authStorage } from './services/api';
import { CreateReportPayload, Report, ReportStats, UpdateReportPayload, User } from './types/report';
import { Info } from 'lucide-react';

const DashboardContent: React.FC = () => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Tab State for Admin
  const [activeTab, setActiveTab] = useState<'reports' | 'users'>('reports');

  // Reports & Stats State
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<ReportStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [loading, setLoading] = useState<boolean>(true);
  const [, setIsRefreshing] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Pop-up modals state
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);

  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const [statusModalOpen, setStatusModalOpen] = useState<boolean>(false);
  const [statusReport, setStatusReport] = useState<Report | null>(null);
  const [targetStatus, setTargetStatus] = useState<'approved' | 'rejected' | null>(null);

  // Cek token tersimpan saat awal mount
  useEffect(() => {
    const initAuth = async () => {
      const token = authStorage.getToken();
      if (!token) {
        setAuthLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        if (res.success && res.data) {
          setCurrentUser(res.data);
        } else {
          authStorage.clearToken();
        }
      } catch {
        authStorage.clearToken();
      } finally {
        setAuthLoading(false);
      }
    };

    initAuth();
  }, []);

  // Ambil data laporan
  const fetchReportsData = useCallback(
    async (
      showRefreshingSpinner = false,
      overrideStatus?: string,
      overrideSearch?: string,
      overrideSort?: 'newest' | 'oldest'
    ) => {
      if (!currentUser) return;
      if (showRefreshingSpinner) setIsRefreshing(true);
      const queryStatus = overrideStatus !== undefined ? overrideStatus : activeStatus;
      const querySearch = overrideSearch !== undefined ? overrideSearch : searchQuery;
      const querySort = overrideSort !== undefined ? overrideSort : sortOrder;

      try {
        const [reportsRes, statsRes] = await Promise.all([
          api.getReports(queryStatus, querySearch, querySort),
          api.getStats(),
        ]);

        if (reportsRes.success) {
          setReports(reportsRes.data);
        }
        if (statsRes.success) {
          setStats(statsRes.data);
        }
      } catch (err: any) {
        message.error(err.message || 'Gagal memuat data dari server');
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [currentUser, activeStatus, searchQuery, sortOrder]
  );

  useEffect(() => {
    if (currentUser) {
      fetchReportsData();
    }
  }, [currentUser, fetchReportsData]);

  // Handler Logout
  const handleLogout = () => {
    authStorage.clearToken();
    setCurrentUser(null);
    setReports([]);
    message.info('Anda telah keluar dari aplikasi');
  };

  // Handler Ganti Urutan (Terbaru <-> Terlama)
  const handleToggleSort = () => {
    setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'));
  };

  // Handler Buat Laporan Baru
  const handleCreateReport = async (payload: CreateReportPayload) => {
    setActionLoading(true);
    try {
      const res = await api.createReport(payload);
      if (res.success && res.data) {
        message.success('Laporan lapangan berhasil dibuat!');
        setActiveStatus('all');
        setSearchQuery('');
        setSortOrder('newest');
        setReports((prev) => [res.data, ...prev.filter((r) => r.id !== res.data.id)]);
        await fetchReportsData(false, 'all', '', 'newest');
      }
    } catch (err: any) {
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // Handler Buka Modal Edit Laporan (Hanya jika status pending)
  const handleOpenEditModal = (report: Report) => {
    if (report.status !== 'pending' && currentUser?.role === 'pelapor') {
      message.warning('Laporan dengan status approved atau rejected tidak dapat diedit');
      return;
    }
    setEditingReport(report);
    setEditModalOpen(true);
  };

  // Handler Simpan Edit Laporan
  const handleUpdateReport = async (id: number, payload: UpdateReportPayload) => {
    setActionLoading(true);
    try {
      const res = await api.updateReport(id, payload);
      if (res.success && res.data) {
        message.success(`Laporan #${id} berhasil diperbarui!`);
        setReports((prev) => prev.map((r) => (r.id === id ? res.data : r)));
        await fetchReportsData();
      }
    } catch (err: any) {
      message.error(err.message || 'Gagal memperbarui laporan');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // Handler Buka Modal Ganti Status (Approve / Reject)
  const handleOpenStatusModal = (report: Report, status: 'approved' | 'rejected') => {
    setStatusReport(report);
    setTargetStatus(status);
    setStatusModalOpen(true);
  };

  // Handler Konfirmasi Ganti Status
  const handleConfirmStatusChange = async (
    reportId: number,
    status: 'approved' | 'rejected',
    catatan?: string
  ) => {
    setActionLoading(true);
    try {
      const res = await api.updateReportStatus(reportId, { status, catatan });
      if (res.success && res.data) {
        message.success(
          `Laporan #${reportId} berhasil diubah menjadi '${status.toUpperCase()}'!`
        );
        setStatusModalOpen(false);
        setStatusReport(null);
        setTargetStatus(null);

        // Update laporan di state dan jika modal detail terbuka, perbarui selectedReport
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? res.data : r))
        );
        if (selectedReport && selectedReport.id === reportId) {
          setSelectedReport(res.data);
        }

        await fetchReportsData();
      }
    } catch (err: any) {
      message.error(err.message || 'Gagal memperbarui status');
    } finally {
      setActionLoading(false);
    }
  };

  // Handler Hapus Laporan
  const handleDeleteReport = async (id: number) => {
    try {
      const res = await api.deleteReport(id);
      if (res.success) {
        message.success(`Laporan #${id} berhasil dihapus!`);
        setReports((prev) => prev.filter((r) => r.id !== id));
        await fetchReportsData();
      }
    } catch (err: any) {
      message.error(err.message || 'Gagal menghapus laporan');
    }
  };

  // Handler Buka Detail Laporan (fetch detail fresh untuk include approvalHistories)
  const handleViewDetail = async (report: Report) => {
    try {
      const res = await api.getReportById(report.id);
      if (res.success && res.data) {
        setSelectedReport(res.data);
      } else {
        setSelectedReport(report);
      }
    } catch {
      setSelectedReport(report);
    }
    setDetailModalOpen(true);
  };

  // Loading Screen saat cek token awal
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-300 font-medium">Memverifikasi sesi pengguna...</p>
        </div>
      </div>
    );
  }

  // Jika belum login, tampilkan LoginScreen
  if (!currentUser) {
    return <LoginScreen onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenCreateModal={() => setCreateModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Switch: Laporan vs Kelola Akun */}
        {activeTab === 'users' && currentUser.role === 'admin' ? (
          <UserManagementView currentUser={currentUser} />
        ) : (
          <>
            {/* Ringkasan Statistik */}
            <StatsOverview
              stats={stats}
              activeStatus={activeStatus}
              onSelectStatus={(status) => setActiveStatus(status)}
              loading={loading}
            />

            {/* Filter dan Pencarian */}
            <ReportFilter
              activeStatus={activeStatus}
              onStatusChange={(status) => setActiveStatus(status)}
              searchQuery={searchQuery}
              onSearchChange={(q) => setSearchQuery(q)}
              sortOrder={sortOrder}
              onToggleSort={handleToggleSort}
            />

            {/* Banner Khusus Pelapor */}
            {currentUser.role === 'pelapor' && (
              <div className="mb-4 px-3.5 py-2.5 bg-blue-50/70 border border-blue-200/60 rounded-lg flex items-center gap-2 text-xs text-blue-800">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Menampilkan laporan yang dibuat oleh Anda ({currentUser.name}). Laporan pengguna lain tidak ditampilkan sesuai hak akses.
                </span>
              </div>
            )}

            {/* Tabel Laporan */}
            <ReportTable
              reports={reports}
              loading={loading}
              currentUser={currentUser}
              onViewDetail={handleViewDetail}
              onEditReport={handleOpenEditModal}
              onOpenStatusModal={handleOpenStatusModal}
              onDeleteReport={handleDeleteReport}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Field Reports Management. Fullstack Developer Case Study MAPID.</p>
        </div>
      </footer>

      {/* Ant Design Pop-up Modals */}
      <CreateReportModal
        open={createModalOpen}
        currentUser={currentUser}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateReport}
        loading={actionLoading}
      />

      <EditReportModal
        open={editModalOpen}
        report={editingReport}
        onClose={() => {
          setEditModalOpen(false);
          setEditingReport(null);
        }}
        onSubmit={handleUpdateReport}
        loading={actionLoading}
      />

      <StatusChangeModal
        open={statusModalOpen}
        report={statusReport}
        targetStatus={targetStatus}
        onClose={() => {
          setStatusModalOpen(false);
          setStatusReport(null);
          setTargetStatus(null);
        }}
        onConfirm={handleConfirmStatusChange}
        loading={actionLoading}
      />

      <ReportDetailModal
        open={detailModalOpen}
        report={selectedReport}
        currentUser={currentUser}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedReport(null);
        }}
        onOpenStatusModal={handleOpenStatusModal}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AntdApp>
      <DashboardContent />
    </AntdApp>
  );
};

export default App;

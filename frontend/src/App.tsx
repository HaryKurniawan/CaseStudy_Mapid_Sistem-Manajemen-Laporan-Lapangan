import React, { useState, useEffect, useCallback } from 'react';
import { App as AntdApp, message } from 'antd';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { ReportFilter } from './components/ReportFilter';
import { ReportTable } from './components/ReportTable';
import { CreateReportModal } from './components/CreateReportModal';
import { StatusChangeModal } from './components/StatusChangeModal';
import { ReportDetailModal } from './components/ReportDetailModal';
import { api } from './services/api';
import { CreateReportPayload, Report, ReportStats } from './types/report';

const DashboardContent: React.FC = () => {
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
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Pop-up modals state
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const [statusModalOpen, setStatusModalOpen] = useState<boolean>(false);
  const [statusReport, setStatusReport] = useState<Report | null>(null);
  const [targetStatus, setTargetStatus] = useState<'approved' | 'rejected' | null>(null);

  // Ambil data laporan
  const fetchReportsData = useCallback(
    async (
      showRefreshingSpinner = false,
      overrideStatus?: string,
      overrideSearch?: string,
      overrideSort?: 'newest' | 'oldest'
    ) => {
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
    [activeStatus, searchQuery, sortOrder]
  );

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

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
        // 1. Reset filter ke 'all', kosongkan pencarian, dan set urutan ke terbaru
        setActiveStatus('all');
        setSearchQuery('');
        setSortOrder('newest');

        // 2. Instant update langsung ke state tampilan
        setReports((prev) => [res.data, ...prev.filter((r) => r.id !== res.data.id)]);

        // 3. Sinkronkan dengan server dan perbarui ringkasan statistik
        await fetchReportsData(false, 'all', '', 'newest');
      }
    } catch (err: any) {
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

        // Instant update status pada item laporan yang sedang aktif
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? res.data : r))
        );

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
        // Instant remove dari tabel
        setReports((prev) => prev.filter((r) => r.id !== id));
        await fetchReportsData();
      }
    } catch (err: any) {
      message.error(err.message || 'Gagal menghapus laporan');
    }
  };

  // Handler Buka Detail Laporan
  const handleViewDetail = (report: Report) => {
    setSelectedReport(report);
    setDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <Navbar onOpenCreateModal={() => setCreateModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard Laporan Lapangan
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pantau seluruh laporan masuk dari lapangan, lakukan verifikasi, serta setujui atau tolak laporan secara real-time.
          </p>
        </div>

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

        {/* Tabel Laporan */}
        <ReportTable
          reports={reports}
          loading={loading}
          onViewDetail={handleViewDetail}
          onOpenStatusModal={handleOpenStatusModal}
          onDeleteReport={handleDeleteReport}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Field Reports Management. Fullstack Developer Case Study MAPID.</p>
          <p className="mt-1 text-slate-400">
            Express.js + TypeScript + PostgreSQL + Prisma ORM + React (Vite) + Tailwind CSS + Ant Design Popups
          </p>
        </div>
      </footer>

      {/* Ant Design Pop-up Modals */}
      <CreateReportModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateReport}
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

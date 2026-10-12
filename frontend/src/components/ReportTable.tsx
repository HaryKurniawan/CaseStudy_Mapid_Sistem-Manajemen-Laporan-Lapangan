import React from 'react';
import { Popconfirm } from 'antd';
import {
  Check,
  X,
  Eye,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  User,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Report } from '../types/report';

interface ReportTableProps {
  reports: Report[];
  loading: boolean;
  onViewDetail: (report: Report) => void;
  onOpenStatusModal: (report: Report, status: 'approved' | 'rejected') => void;
  onDeleteReport: (id: number) => void;
}

export const ReportTable: React.FC<ReportTableProps> = ({
  reports,
  loading,
  onViewDetail,
  onOpenStatusModal,
  onDeleteReport,
}) => {
  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Approved</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Rejected</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Pending</span>
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return dateString;
    }
  };

  if (loading && reports.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-600">Memuat data laporan...</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">Tidak ada laporan ditemukan</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Tidak ada data laporan yang cocok dengan filter atau kata kunci pencarian Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-16">ID</th>
              <th className="py-3.5 px-4 min-w-[240px]">Laporan</th>
              <th className="py-3.5 px-4 min-w-[180px]">Lokasi & Pelapor</th>
              <th className="py-3.5 px-4 w-32">Status</th>
              <th className="py-3.5 px-4 w-40">Tanggal</th>
              <th className="py-3.5 px-4 text-right min-w-[200px]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {reports.map((report) => (
              <tr
                key={report.id}
                className="hover:bg-slate-50/70 transition-colors group"
              >
                {/* ID */}
                <td className="py-4 px-4 font-mono text-xs font-semibold text-slate-500">
                  #{report.id}
                </td>

                {/* Nama & Deskripsi */}
                <td className="py-4 px-4">
                  <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {report.nama}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 max-w-md">
                    {report.deskripsi}
                  </p>
                  {report.catatan && (
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      <span className="font-medium text-slate-600">Catatan:</span> {report.catatan}
                    </div>
                  )}
                </td>

                {/* Lokasi & Pelapor */}
                <td className="py-4 px-4 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[180px]">{report.lokasi || '-'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate max-w-[180px]">{report.pelapor || 'Anonim'}</span>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="py-4 px-4 whitespace-nowrap">
                  {getStatusBadge(report.status)}
                </td>

                {/* Tanggal */}
                <td className="py-4 px-4 text-xs text-slate-500 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(report.createdAt)}</span>
                  </div>
                </td>

                {/* Aksi: Approve, Reject, Detail, Hapus */}
                <td className="py-4 px-4 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5">
                    {/* Tombol Detail */}
                    <button
                      type="button"
                      onClick={() => onViewDetail(report)}
                      title="Lihat Detail"
                      className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Tombol Approve (Buka Modal / Pop-up Approval) */}
                    <button
                      type="button"
                      onClick={() => onOpenStatusModal(report, 'approved')}
                      disabled={report.status === 'approved'}
                      title="Setujui Laporan (Approve)"
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        report.status === 'approved'
                          ? 'opacity-40 bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Approve</span>
                    </button>

                    {/* Tombol Reject (Buka Modal / Pop-up Rejection) */}
                    <button
                      type="button"
                      onClick={() => onOpenStatusModal(report, 'rejected')}
                      disabled={report.status === 'rejected'}
                      title="Tolak Laporan (Reject)"
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        report.status === 'rejected'
                          ? 'opacity-40 bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-200'
                      }`}
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Reject</span>
                    </button>

                    {/* Tombol Hapus dengan Ant Design Popconfirm (Pop-up) */}
                    <Popconfirm
                      title="Hapus Laporan Lapangan"
                      description="Apakah Anda yakin ingin menghapus laporan ini secara permanen?"
                      onConfirm={() => onDeleteReport(report.id)}
                      okText="Ya, Hapus"
                      cancelText="Batal"
                      okButtonProps={{ danger: true }}
                    >
                      <button
                        type="button"
                        title="Hapus Laporan"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer ml-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Popconfirm>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

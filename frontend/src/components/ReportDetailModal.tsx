import React from 'react';
import { Modal } from 'antd';
import { Report } from '../types/report';
import {
  FileText,
  MapPin,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from 'lucide-react';

interface ReportDetailModalProps {
  open: boolean;
  report: Report | null;
  onClose: () => void;
  onOpenStatusModal: (report: Report, status: 'approved' | 'rejected') => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  open,
  report,
  onClose,
  onOpenStatusModal,
}) => {
  if (!report) return null;

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(d);
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Disetujui (Approved)</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Ditolak (Rejected)</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>Menunggu Review (Pending)</span>
          </span>
        );
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
      width={600}
    >
      <div className="pt-2 text-left">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-semibold text-slate-500">#{report.id}</span>
              {getStatusBadge(report.status)}
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">{report.nama}</h3>
          </div>
        </div>

        {/* Content Details */}
        <div className="mt-4 space-y-4">
          {/* Deskripsi */}
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Deskripsi Laporan
            </span>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
              {report.deskripsi}
            </div>
          </div>

          {/* Grid Informasi Tambahan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Lokasi Lapangan
              </span>
              <p className="font-medium text-slate-800">{report.lokasi || '-'}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> Pelapor / Petugas
              </span>
              <p className="font-medium text-slate-800">{report.pelapor || 'Anonim'}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Waktu Dibuat
              </span>
              <p className="font-medium text-slate-800">{formatDate(report.createdAt)}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-500 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Terakhir Diperbarui
              </span>
              <p className="font-medium text-slate-800">{formatDate(report.updatedAt)}</p>
            </div>
          </div>

          {/* Catatan Verifikasi jika ada */}
          {report.catatan && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg">
              <span className="font-semibold text-xs text-amber-800 flex items-center gap-1.5 mb-1">
                <MessageSquare className="w-3.5 h-3.5 text-amber-600" /> Catatan Petugas Verifikasi
              </span>
              <p className="text-xs text-amber-900 leading-relaxed">{report.catatan}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenStatusModal(report, 'rejected');
              }}
              disabled={report.status === 'rejected'}
              className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenStatusModal(report, 'approved');
              }}
              disabled={report.status === 'approved'}
              className="px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

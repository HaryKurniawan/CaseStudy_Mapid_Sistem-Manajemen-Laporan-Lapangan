import React from 'react';
import { Modal } from 'antd';
import { Report, User as UserType } from '../types/report';
import {
  MapPin,
  User,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  History,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';

interface ReportDetailModalProps {
  open: boolean;
  report: Report | null;
  currentUser: UserType | null;
  onClose: () => void;
  onOpenStatusModal: (report: Report, status: 'approved' | 'rejected') => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  open,
  report,
  currentUser,
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

  const isApproverOrAdmin = currentUser?.role === 'approver' || currentUser?.role === 'admin';

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
      width={640}
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
        <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
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

          {/* Riwayat Persetujuan (Audit Trail) */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Riwayat Keputusan Persetujuan (Audit Trail)
              </h4>
            </div>

            {report.approvalHistories && report.approvalHistories.length > 0 ? (
              <div className="space-y-2.5">
                {report.approvalHistories.map((hist, idx) => {
                  const isHistApproved = hist.status === 'approved';
                  return (
                    <div
                      key={hist.id || idx}
                      className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                              isHistApproved
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {isHistApproved ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <XCircle className="w-3 h-3 text-rose-600" />
                            )}
                            {hist.status}
                          </span>
                          <span className="text-slate-700 font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                            {hist.approver?.name || 'Petugas Verifikator'}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {formatDate(hist.createdAt)}
                        </span>
                      </div>

                      {hist.catatan && (
                        <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                          <span className="font-semibold text-slate-700">Catatan:</span> {hist.catatan}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                Belum ada catatan riwayat persetujuan. Laporan masih menunggu keputusan verifikator.
              </div>
            )}
          </div>
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

          {/* Tombol aksi khusus Approver / Admin */}
          {isApproverOrAdmin && (
            <div className="flex items-center gap-2">
              {/* Approver can toggle from approved to rejected or pending to rejected */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenStatusModal(report, 'rejected');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  report.status === 'rejected'
                    ? 'text-rose-400 bg-rose-50/50 border border-rose-100'
                    : 'text-white bg-rose-600 hover:bg-rose-700 shadow-sm shadow-rose-200'
                }`}
              >
                <X className="w-3.5 h-3.5" />
                <span>{report.status === 'rejected' ? 'Ditolak (Ubah Catatan)' : 'Tolak (Reject)'}</span>
              </button>

              {/* Approver can toggle from rejected to approved or pending to approved */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenStatusModal(report, 'approved');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  report.status === 'approved'
                    ? 'text-emerald-400 bg-emerald-50/50 border border-emerald-100'
                    : 'text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-200'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{report.status === 'approved' ? 'Disetujui (Ubah Catatan)' : 'Setujui (Approve)'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

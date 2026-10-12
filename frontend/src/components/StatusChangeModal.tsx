import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Report } from '../types/report';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface StatusChangeModalProps {
  open: boolean;
  report: Report | null;
  targetStatus: 'approved' | 'rejected' | null;
  onClose: () => void;
  onConfirm: (reportId: number, status: 'approved' | 'rejected', catatan?: string) => Promise<void>;
  loading: boolean;
}

export const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  open,
  report,
  targetStatus,
  onClose,
  onConfirm,
  loading,
}) => {
  const [catatan, setCatatan] = useState('');

  useEffect(() => {
    if (open) {
      setCatatan('');
    }
  }, [open]);

  if (!report || !targetStatus) return null;

  const isApproved = targetStatus === 'approved';

  const handleConfirm = async () => {
    await onConfirm(report.id, targetStatus, catatan.trim() || undefined);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
      width={480}
    >
      <div className="pt-2 text-left">
        {/* Header Icon & Title */}
        <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isApproved ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}
          >
            {isApproved ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isApproved ? 'Setujui Laporan (Approve)' : 'Tolak Laporan (Reject)'}
            </h3>
            <p className="text-xs text-slate-500">
              Konfirmasi perubahan status laporan lapangan <span className="font-semibold text-slate-800">#{report.id}</span>
            </p>
          </div>
        </div>

        {/* Report Summary Card */}
        <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="font-semibold text-sm text-slate-900">{report.nama}</div>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{report.deskripsi}</p>
          {report.lokasi && (
            <div className="text-[11px] text-slate-500 mt-1">
              <span className="font-medium text-slate-600">Lokasi:</span> {report.lokasi}
            </div>
          )}
        </div>

        {/* Catatan / Alasan Input */}
        <div className="mt-4">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Catatan Verifikasi / Alasan {isApproved ? 'Persetujuan' : 'Penolakan'} (Opsional)
          </label>
          <textarea
            rows={3}
            placeholder={
              isApproved
                ? 'Contoh: Pekerjaan telah diverifikasi dan disetujui untuk dieksekusi tim lapangan...'
                : 'Contoh: Lokasi tidak ditemukan atau informasi laporan tidak valid...'
            }
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50 ${
              isApproved
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
            }`}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>Konfirmasi {isApproved ? 'Approve' : 'Reject'}</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

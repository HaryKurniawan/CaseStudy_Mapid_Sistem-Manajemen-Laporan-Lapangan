import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Report, UpdateReportPayload } from '../types/report';
import { Edit3, AlertCircle } from 'lucide-react';

interface EditReportModalProps {
  open: boolean;
  report: Report | null;
  onClose: () => void;
  onSubmit: (id: number, payload: UpdateReportPayload) => Promise<void>;
  loading: boolean;
}

export const EditReportModal: React.FC<EditReportModalProps> = ({
  open,
  report,
  onClose,
  onSubmit,
  loading,
}) => {
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (open && report) {
      setNama(report.nama || '');
      setDeskripsi(report.deskripsi || '');
      setLokasi(report.lokasi || '');
      setErrorMsg('');
    }
  }, [open, report]);

  if (!report) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || nama.trim().length < 3) {
      setErrorMsg('Nama laporan minimal 3 karakter');
      return;
    }
    if (!deskripsi.trim() || deskripsi.trim().length < 5) {
      setErrorMsg('Deskripsi laporan minimal 5 karakter');
      return;
    }

    try {
      await onSubmit(report.id, {
        nama: nama.trim(),
        deskripsi: deskripsi.trim(),
        lokasi: lokasi.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memperbarui laporan');
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      centered
      width={540}
    >
      <div className="pt-2 text-left">
        {/* Header */}
        <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Edit Laporan Lapangan #{report.id}
            </h3>
            <p className="text-xs text-slate-500">
              Perubahan hanya diperbolehkan selama status laporan masih <span className="font-semibold text-amber-700">Pending</span>.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nama / Judul Laporan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Kerusakan Pipa Air"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Lokasi Kejadian
            </label>
            <input
              type="text"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              placeholder="Contoh: Jl. Sudirman No. 45"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Deskripsi Kejadian <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan detail permasalahan di lapangan..."
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

import React, { useState } from 'react';
import { Modal } from 'antd';
import { CreateReportPayload } from '../types/report';
import { PlusCircle, MapPin, User, FileText, AlignLeft } from 'lucide-react';

interface CreateReportModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateReportPayload) => Promise<void>;
  loading: boolean;
}

export const CreateReportModal: React.FC<CreateReportModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading,
}) => {
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [pelapor, setPelapor] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resetForm = () => {
    setNama('');
    setDeskripsi('');
    setLokasi('');
    setPelapor('');
    setErrorMsg(null);
  };

  const handleCancel = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || nama.trim().length < 3) {
      setErrorMsg('Nama laporan minimal 3 karakter.');
      return;
    }
    if (!deskripsi.trim() || deskripsi.trim().length < 5) {
      setErrorMsg('Deskripsi laporan minimal 5 karakter.');
      return;
    }

    setErrorMsg(null);
    try {
      await onSubmit({
        nama: nama.trim(),
        deskripsi: deskripsi.trim(),
        lokasi: lokasi.trim() || undefined,
        pelapor: pelapor.trim() || undefined,
      });
      resetForm();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal membuat laporan.');
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      destroyOnHidden
      centered
      width={560}
      className="custom-antd-modal"
    >
      <div className="pt-2">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Buat Laporan Lapangan Baru</h3>
            <p className="text-xs text-slate-500">
              Isi data detail laporan. Status otomatis berstatus <span className="font-semibold text-amber-600">Pending</span>.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-left">
          {/* Nama Laporan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Laporan <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Contoh: Kerusakan Pipa Air di Simpang Lima"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Deskripsi Laporan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deskripsi Detail Laporan <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <textarea
                required
                rows={3}
                placeholder="Jelaskan kondisi permasalahan di lapangan secara detail..."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Lokasi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lokasi Lapangan
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Contoh: Jl. Sudirman No. 12"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Nama Pelapor */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Pelapor / Petugas
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={pelapor}
                  onChange={(e) => setPelapor(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Simpan Laporan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

import React, { useState, useEffect } from 'react';
import { User, Role } from '../types/report';
import { api } from '../services/api';
import { message, Popconfirm, Modal } from 'antd';
import { UserPlus, Trash2, Shield, CheckCircle2, User as UserIcon, Calendar, Mail, Lock } from 'lucide-react';

interface UserManagementViewProps {
  currentUser: User;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('pelapor');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (err: any) {
      message.error(err.message || 'Gagal mengambil daftar pengguna');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      message.warning('Lengkapi seluruh field yang wajib');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createUser({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role,
      });

      if (res.success) {
        message.success(`Akun '${res.data.name}' (${res.data.role.toUpperCase()}) berhasil dibuat!`);
        setModalOpen(false);
        setName('');
        setEmail('');
        setPassword('');
        setRole('pelapor');
        await fetchUsers();
      }
    } catch (err: any) {
      message.error(err.message || 'Gagal membuat pengguna');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      const res = await api.deleteUser(id);
      if (res.success) {
        message.success('Pengguna berhasil dihapus');
        setUsers((prev) => prev.filter((u) => u.id !== id));
      }
    } catch (err: any) {
      message.error(err.message || 'Gagal menghapus pengguna');
    }
  };

  const getRoleBadge = (userRole: Role) => {
    switch (userRole) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full bg-purple-50 text-purple-700 border border-purple-200 uppercase">
            <Shield className="w-3 h-3 text-purple-600" />
            <span>Admin</span>
          </span>
        );
      case 'approver':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Approver</span>
          </span>
        );
      case 'pelapor':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase">
            <UserIcon className="w-3 h-3 text-amber-600" />
            <span>Pelapor</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Manajemen Pengguna</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              Admin Only
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Sesuai kriteria sistem, seluruh akun pengguna (Admin, Approver, dan Pelapor) dibuat dan dikelola oleh Admin, bukan melalui registrasi publik.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 transition-all cursor-pointer shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-16">ID</th>
                <th className="py-3.5 px-4">Nama Lengkap</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4 w-32">Role</th>
                <th className="py-3.5 px-4 w-36">Laporan Dibuat</th>
                <th className="py-3.5 px-4 w-40">Terdaftar</th>
                <th className="py-3.5 px-4 text-right w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2" />
                    <div>Memuat daftar pengguna...</div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 text-xs">
                    Tidak ada akun ditemukan.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs font-semibold text-slate-500">#{u.id}</td>
                    <td className="py-4 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{u.name}</span>
                        {u.id === currentUser.id && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            (Anda)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs font-mono text-slate-600">{u.email}</td>
                    <td className="py-4 px-4">{getRoleBadge(u.role)}</td>
                    <td className="py-4 px-4 text-xs font-medium text-slate-700">
                      {u._count?.reports ?? 0} laporan
                    </td>
                    <td className="py-4 px-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {new Intl.DateTimeFormat('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }).format(new Date(u.createdAt))}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {u.id !== currentUser.id ? (
                        <Popconfirm
                          title="Hapus Pengguna"
                          description={`Yakin ingin menghapus pengguna '${u.name}'?`}
                          onConfirm={() => handleDeleteUser(u.id)}
                          okText="Hapus"
                          cancelText="Batal"
                          okButtonProps={{ danger: true }}
                        >
                          <button
                            type="button"
                            title="Hapus Akun"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </Popconfirm>
                      ) : (
                        <span className="text-xs text-slate-400 italic">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Pengguna */}
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnHidden
        centered
        width={480}
      >
        <div className="pt-2 text-left">
          <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Buat Akun Pengguna Baru</h3>
              <p className="text-xs text-slate-500">
                Pilih peran (Role) yang sesuai untuk pengguna baru.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateUser} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Rian Pratama"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Alamat Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rian@mapid.io"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Kata Sandi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Peran Pengguna (Role) <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'pelapor', label: 'Pelapor', desc: 'Buat & pantau laporan sendiri' },
                  { value: 'approver', label: 'Approver', desc: 'Verifikasi status laporan' },
                  { value: 'admin', label: 'Admin', desc: 'Akses penuh & kelola akun' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setRole(item.value as Role)}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      role === item.value
                        ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 capitalize">{item.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={submitting}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {submitting && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                <span>Buat Akun</span>
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

import React, { useState } from 'react';
import { ArrowRight, Lock, Mail, MapPin } from 'lucide-react';
import { message } from 'antd';
import { api, authStorage } from '../services/api';
import { User as UserType } from '../types/report';

interface LoginScreenProps {
  onLoginSuccess: (user: UserType) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string>('');

  const demoAccounts = [
    {
      role: 'admin',
      title: 'Super Admin',
      email: 'admin@mapid.io',
      password: 'password123',
    },
    {
      role: 'approver',
      title: 'Approver (Verifikator)',
      email: 'approver@mapid.io',
      password: 'password123',
    },
    {
      role: 'pelapor',
      title: 'Pelapor 1 - Budi Santoso',
      email: 'pelapor1@mapid.io',
      password: 'password123',
    },
    {
      role: 'pelapor',
      title: 'Pelapor 2 - Siti Rahma',
      email: 'pelapor2@mapid.io',
      password: 'password123',
    },
  ];

  const performLogin = async (loginEmail: string, loginPass: string) => {
    setLoading(true);
    try {
      const res = await api.login({ email: loginEmail, password: loginPass });
      if (res.success && res.data) {
        authStorage.setToken(res.data.token);
        message.success(`Selamat datang, ${res.data.user.name}! Masuk sebagai ${res.data.user.role.toUpperCase()}`);
        onLoginSuccess(res.data.user);
      }
    } catch (err: any) {
      message.error(err.message || 'Login gagal. Periksa kembali email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      message.warning('Harap masukkan email dan kata sandi');
      return;
    }
    await performLogin(email.trim(), password.trim());
  };

  const handleSelectDemo = (demoEmail: string) => {
    setSelectedDemo(demoEmail);
    const found = demoAccounts.find((d) => d.email === demoEmail);
    if (found) {
      setEmail(found.email);
      setPassword(found.password);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Top Header - Icon on the Left of Header Text */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <MapPin className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="text-left">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
              Field Reports Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Sistem Manajemen Laporan Lapangan • MAPID
            </p>
          </div>
        </div>
      </div>

      {/* Login Card (Pure White #fff, Clean, Sharp Borders) */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-xs border border-slate-200/80 rounded-2xl">
          {/* Form Login Standar */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="nama@mapid.io"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSelectedDemo('');
                  }}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-sm shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk ke Akun</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                </>
              )}
            </button>
          </form>

          {/* Dropdown Akun Demo */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Pilih Akun Demo (Evaluasi)</span>
              {selectedDemo && (
                <span className="text-[10px] text-indigo-600 font-semibold normal-case">
                  Kredensial terisi
                </span>
              )}
            </label>

            <select
              value={selectedDemo}
              onChange={(e) => handleSelectDemo(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
            >
              <option value="">-- Pilih Akun Demo untuk Masuk Cepat --</option>
              {demoAccounts.map((account) => (
                <option key={account.email} value={account.email}>
                  {account.title} ({account.email})
                </option>
              ))}
            </select>

            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              Memilih akun demo di atas akan otomatis mengisi email & kata sandi untuk pengujian evaluator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

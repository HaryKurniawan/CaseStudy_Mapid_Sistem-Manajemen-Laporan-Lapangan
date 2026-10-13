import React from 'react';
import { Plus, MapPin, LogOut, Users, FileText } from 'lucide-react';
import { User, Role } from '../types/report';

interface NavbarProps {
  currentUser: User;
  activeTab: 'reports' | 'users';
  onChangeTab: (tab: 'reports' | 'users') => void;
  onOpenCreateModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  onChangeTab,
  onOpenCreateModal,
  onLogout,
}) => {
  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/80 uppercase">
            Admin
          </span>
        );
      case 'approver':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 uppercase">
            Approver
          </span>
        );
      case 'pelapor':
      default:
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/80 uppercase">
            Pelapor
          </span>
        );
    }
  };

  const canCreateReport = currentUser.role === 'pelapor' || currentUser.role === 'admin';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Sisi Kiri: Logo & Navigasi */}
          <div className="flex items-center gap-5 min-w-0">
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <MapPin className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 tracking-tight">MAPID</span>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-medium text-slate-500">Field Reports</span>
              </div>
            </div>

            {/* Menu Tab khusus Admin */}
            {currentUser.role === 'admin' && (
              <nav className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-lg border border-slate-200/70">
                <button
                  type="button"
                  onClick={() => onChangeTab('reports')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    activeTab === 'reports'
                      ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/60 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Laporan</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChangeTab('users')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                    activeTab === 'users'
                      ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/60 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Kelola Akun</span>
                </button>
              </nav>
            )}
          </div>

          {/* Sisi Kanan: Tombol Buat Laporan & Profil Pengguna */}
          <div className="flex items-center gap-3 shrink-0">
            {canCreateReport && (
              <button
                type="button"
                onClick={onOpenCreateModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Buat Laporan</span>
              </button>
            )}

            <div className="h-4 w-px bg-slate-200 mx-0.5" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-800">{currentUser.name}</span>
              {getRoleBadge(currentUser.role)}

              <button
                type="button"
                onClick={onLogout}
                title="Keluar"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

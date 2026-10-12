import React from 'react';
import { FileText, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { ReportStats } from '../types/report';

interface StatsOverviewProps {
  stats: ReportStats;
  activeStatus: string;
  onSelectStatus: (status: string) => void;
  loading: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  stats,
  activeStatus,
  onSelectStatus,
  loading,
}) => {
  const cards = [
    {
      id: 'all',
      title: 'Total Laporan',
      count: stats.total,
      icon: FileText,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
      ringColor: 'ring-indigo-500',
      description: 'Semua laporan tercatat',
    },
    {
      id: 'pending',
      title: 'Menunggu Review',
      count: stats.pending,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      ringColor: 'ring-amber-500',
      description: 'Perlu verifikasi & tindakan',
    },
    {
      id: 'approved',
      title: 'Disetujui (Approved)',
      count: stats.approved,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      ringColor: 'ring-emerald-500',
      description: 'Tervalidasi untuk ditindaklanjuti',
    },
    {
      id: 'rejected',
      title: 'Ditolak (Rejected)',
      count: stats.rejected,
      icon: XCircle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100',
      ringColor: 'ring-rose-500',
      description: 'Tidak valid / ditolak petugas',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeStatus === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectStatus(card.id)}
            className={`text-left p-4 rounded-xl bg-white border transition-all duration-200 cursor-pointer ${
              isSelected
                ? `ring-2 ${card.ringColor} border-transparent shadow-md`
                : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg ${card.bgColor} ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {loading ? (
                  <span className="inline-block w-8 h-6 bg-slate-200 animate-pulse rounded" />
                ) : (
                  card.count
                )}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">{card.description}</p>
          </button>
        );
      })}
    </div>
  );
};

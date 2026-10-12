import React from 'react';
import { Search, X, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';

interface ReportFilterProps {
  activeStatus: string;
  onStatusChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOrder: 'newest' | 'oldest';
  onToggleSort: () => void;
}

export const ReportFilter: React.FC<ReportFilterProps> = ({
  activeStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  sortOrder,
  onToggleSort,
}) => {
  const tabs = [
    { id: 'all', label: 'Semua Status' },
    { id: 'pending', label: 'Pending' },
    { id: 'approved', label: 'Approved' },
    { id: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
      {/* Status Segmented Tabs */}
      <div className="flex p-1 bg-slate-200/70 rounded-xl overflow-x-auto max-w-full scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeStatus === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onStatusChange(tab.id)}
              className={`px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search Input & Sort Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari laporan, lokasi, pelapor..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tombol Filter Urutan Terbaru / Terlama */}
        <button
          type="button"
          onClick={onToggleSort}
          title={`Urutan: ${sortOrder === 'newest' ? 'Terbaru (Klik untuk Terlama)' : 'Terlama (Klik untuk Terbaru)'}`}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-all cursor-pointer whitespace-nowrap active:scale-95 shrink-0"
        >
          {sortOrder === 'newest' ? (
            <>
              <ArrowDownWideNarrow className="w-4 h-4 text-indigo-600" />
              <span>Terbaru</span>
            </>
          ) : (
            <>
              <ArrowUpNarrowWide className="w-4 h-4 text-indigo-600" />
              <span>Terlama</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

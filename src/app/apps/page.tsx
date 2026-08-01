'use client';

import React, { useState, useMemo } from 'react';
import { MOCK_APPS } from '@/data/mockApps';
import { AppCard } from '@/components/AppCard';
import { AppDetailModal } from '@/components/AppDetailModal';
import { AppItem, AppCategory } from '@/types/app';
import { useLanguage } from '@/context/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Search, Sparkles, Filter, SlidersHorizontal } from 'lucide-react';

const CATEGORIES: AppCategory[] = [
  '전체',
  'AI 생산성',
  '디자인 & 미디어',
  '개발 & 툴',
  '자동화',
  '유틸리티',
];

export default function AppsCatalogPage() {
  const [appList, setAppList] = useState<AppItem[]>(MOCK_APPS);
  const [selectedCategory, setSelectedCategory] = useState<AppCategory>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const { t } = useLanguage();

  React.useEffect(() => {
    const handleAppCreated = (e: any) => {
      if (e.detail) setAppList((prev) => [e.detail, ...prev]);
    };
    const handleAppUpdated = (e: any) => {
      if (e.detail) setAppList((prev) => prev.map((a) => (a.id === e.detail.id ? e.detail : a)));
    };
    const handleAppDeleted = (e: any) => {
      if (e.detail) setAppList((prev) => prev.filter((a) => a.id !== e.detail));
    };

    window.addEventListener('app-created', handleAppCreated);
    window.addEventListener('app-updated', handleAppUpdated);
    window.addEventListener('app-deleted', handleAppDeleted);
    return () => {
      window.removeEventListener('app-created', handleAppCreated);
      window.removeEventListener('app-updated', handleAppUpdated);
      window.removeEventListener('app-deleted', handleAppDeleted);
    };
  }, []);

  const filteredApps = useMemo(() => {
    return appList.filter((app) => {
      const matchCategory =
        selectedCategory === '전체' || app.category === selectedCategory;
      const matchSearch =
        app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [appList, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100 selection:bg-rose-500 selection:text-white">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 w-full">
      
      {/* Header Banner */}
      <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-800/80 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t.brandTitle}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {t.navApps}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t.heroDesc}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-2xl bg-slate-900 border border-slate-800 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <SlidersHorizontal className="h-4 w-4 text-slate-500 shrink-0 mr-1" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat === '전체' ? t.categoryAll : cat}
          </button>
        ))}
      </div>

      {/* Grid of Apps */}
      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              onSelectDetail={(selected) => setSelectedApp(selected)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl border border-slate-800/80 bg-slate-900/40">
          <Filter className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No apps found</h3>
          <button
            onClick={() => {
              setSelectedCategory('전체');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-semibold text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/20 mt-2"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* App Detail Modal */}
      {selectedApp && (
        <AppDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
      </main>
    </div>
  );
}

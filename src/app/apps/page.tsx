'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_APPS } from '@/data/mockApps';
import { AppCard } from '@/components/AppCard';
import { AppDetailModal } from '@/components/AppDetailModal';
import { AppItem, AppCategory } from '@/types/app';
import { useLanguage } from '@/context/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Search, Sparkles, Filter, SlidersHorizontal } from 'lucide-react';
import { autoTranslateApp } from '@/utils/autoTranslateApp';
import { sortAppsByNewest } from '@/utils/sortApps';

const CATEGORIES: AppCategory[] = [
  '전체',
  '모바일 앱',
  'AI 생산성',
  '디자인 & 미디어',
  '개발 & 툴',
  '자동화',
  '유틸리티',
  '게임',
];

export default function AppsCatalogPage() {
  const [appList, setAppList] = useState<AppItem[]>(() => sortAppsByNewest(MOCK_APPS.map(autoTranslateApp)));
  const [selectedCategory, setSelectedCategory] = useState<AppCategory>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const { t } = useLanguage();

  // Load apps from global server API route so all browsers worldwide display 100% identical real-time data
  const fetchGlobalApps = async () => {
    try {
      const res = await fetch('/api/apps');
      if (res.ok) {
        const data = await res.json();
        if (data.apps && data.apps.length > 0) {
          setAppList(sortAppsByNewest(data.apps.map(autoTranslateApp)));
        }
      }
    } catch (err) {
      console.warn('Failed to load apps from global server API, fallback to default', err);
    }
  };

  useEffect(() => {
    fetchGlobalApps();
  }, []);

  useEffect(() => {
    const handleAppCreated = () => fetchGlobalApps();
    const handleAppUpdated = () => fetchGlobalApps();
    const handleAppDeleted = () => fetchGlobalApps();

    window.addEventListener('app-created', handleAppCreated);
    window.addEventListener('app-updated', handleAppUpdated);
    window.addEventListener('app-deleted', handleAppDeleted);
    return () => {
      window.removeEventListener('app-created', handleAppCreated);
      window.removeEventListener('app-updated', handleAppUpdated);
      window.removeEventListener('app-deleted', handleAppDeleted);
    };
  }, []);

  const getCategoryTranslation = (cat: AppCategory) => {
    switch (cat) {
      case '전체': return t.categoryAll;
      case '모바일 앱': return t.categoryMobile;
      case 'AI 생산성': return t.categoryAi;
      case '디자인 & 미디어': return t.categoryDesign;
      case '개발 & 툴': return t.categoryDev;
      case '자동화': return t.categoryAuto;
      case '유틸리티': return t.categoryUtil;
      case '게임': return t.categoryGame;
      default: return cat;
    }
  };

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
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-300 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t.catalogBadge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {t.catalogTitle}
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            {t.catalogSubtitle}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="h-4 w-4 text-slate-500 shrink-0 mr-1" />
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === category
                ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            {getCategoryTranslation(category)}
          </button>
        ))}
      </div>

      {/* Apps Grid Catalog */}
      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              onSelectDetail={(selected) => setSelectedApp(selected)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center rounded-3xl border border-slate-800 bg-slate-900/40">
          <SlidersHorizontal className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <h3 className="text-base font-bold text-white mb-1">검색된 어플리케이션이 없습니다</h3>
          <p className="text-xs text-slate-400">다른 검색어나 카테고리를 선택해 보세요.</p>
        </div>
      )}

      {/* App Detail Modal */}
      {selectedApp && (
        <AppDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onAppUpdated={() => fetchGlobalApps()}
          onAppDeleted={(appId) => {
            fetch('/api/apps?id=' + appId, { method: 'DELETE' }).then(() => fetchGlobalApps());
          }}
        />
      )}
      </main>
    </div>
  );
}

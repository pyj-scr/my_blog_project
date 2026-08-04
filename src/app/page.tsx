'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MOCK_APPS } from '@/data/mockApps';
import { AppCard } from '@/components/AppCard';
import { AppDetailModal } from '@/components/AppDetailModal';
import { Navbar } from '@/components/Navbar';
import { AppItem } from '@/types/app';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, Sparkles, Zap, ShieldCheck, Gift, Layers } from 'lucide-react';
import { autoTranslateApp } from '@/utils/autoTranslateApp';
import { sortAppsByNewest } from '@/utils/sortApps';

export default function Home() {
  const [appList, setAppList] = useState<AppItem[]>(() => sortAppsByNewest(MOCK_APPS.map(autoTranslateApp)));
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const { t } = useLanguage();

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
      console.warn('Failed to load apps from global server API in Home', err);
    }
  };

  useEffect(() => {
    fetchGlobalApps();
  }, []);

  const featuredApps = appList.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100 selection:bg-rose-500 selection:text-white">
      <Navbar />
      <main className="flex-1 w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[650px] rounded-full bg-gradient-to-tr from-rose-600/20 via-purple-600/20 to-indigo-600/20 blur-3xl opacity-70" />
        <div className="pointer-events-none absolute top-10 right-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-bold text-rose-300 backdrop-blur-md mb-6 shadow-lg shadow-rose-500/10">
            <Sparkles className="h-3.5 w-3.5 fill-rose-400 text-rose-400" />
            <span>{t.heroTag}</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight mb-6">
            {t.heroTitle1} <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
              {t.heroTitleHighlight}
            </span>
          </h1>

          {/* Subtitle Description */}
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed mb-8">
            {t.heroDesc}
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/apps"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 px-8 py-4 text-base font-extrabold text-white shadow-xl shadow-rose-600/25 hover:shadow-rose-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>{t.btnExplore}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Trust Features Grid */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80 pt-8">
            <div className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
              <Gift className="h-5 w-5 text-amber-400 shrink-0" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">{t.trustBadge1Title}</h4>
                <p className="text-[10px] text-slate-400">{t.trustBadge1Sub}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
              <Zap className="h-5 w-5 text-rose-400 shrink-0" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">{t.trustBadge2Title}</h4>
                <p className="text-[10px] text-slate-400">{t.trustBadge2Sub}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">{t.trustBadge3Title}</h4>
                <p className="text-[10px] text-slate-400">{t.trustBadge3Sub}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
              <Layers className="h-5 w-5 text-purple-400 shrink-0" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">{t.trustBadge4Title}</h4>
                <p className="text-[10px] text-slate-400">{t.trustBadge4Sub}</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Apps Catalog Section */}
      <section className="py-10 bg-slate-950 border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {t.popularCatalogTitle}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {t.popularCatalogSub}
              </p>
            </div>

            <Link
              href="/apps"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
            >
              <span>{t.viewAllApps}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onSelectDetail={(selected) => setSelectedApp(selected)}
              />
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/apps"
              className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-rose-400 border border-slate-800"
            >
              <span>{t.viewAllApps}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* Detail Modal */}
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

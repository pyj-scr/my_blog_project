'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { AppCard } from '@/components/AppCard';
import { AppDetailModal } from '@/components/AppDetailModal';
import { UploadAppModal } from '@/components/UploadAppModal';
import { MOCK_APPS } from '@/data/mockApps';
import { AppItem } from '@/types/app';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, ShieldCheck, Zap, Layers, Gift, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [appList, setAppList] = useState<AppItem[]>(MOCK_APPS);
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { t } = useLanguage();

  const handleAppCreated = (newApp: AppItem) => {
    setAppList([newApp, ...appList]);
  };

  const handleAppUpdated = (updatedApp: AppItem) => {
    setAppList(appList.map((a) => (a.id === updatedApp.id ? updatedApp : a)));
  };

  const handleAppDeleted = (appId: string) => {
    setAppList(appList.filter((a) => a.id !== appId));
  };

  React.useEffect(() => {
    const onUpdated = (e: any) => {
      if (e.detail) handleAppUpdated(e.detail);
    };
    const onDeleted = (e: any) => {
      if (e.detail) handleAppDeleted(e.detail);
    };
    window.addEventListener('app-updated', onUpdated);
    window.addEventListener('app-deleted', onDeleted);
    return () => {
      window.removeEventListener('app-updated', onUpdated);
      window.removeEventListener('app-deleted', onDeleted);
    };
  }, [appList]);

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100 selection:bg-rose-500 selection:text-white">
      
      {/* Dynamic Navbar with Upload Trigger */}
      <Navbar onOpenUploadModal={() => setIsUploadModalOpen(true)} />

      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="absolute top-1/4 left-1/2 -z-10 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-rose-600/30 via-purple-600/20 to-amber-500/30 blur-[130px]" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs sm:text-sm font-extrabold text-rose-300 backdrop-blur-md mb-6">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>{t.heroTag}</span>
            </div>

            {/* Main Title */}
            <h1 className="mx-auto max-w-4xl text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight mb-5">
              {t.heroTitle1}{' '}
              <span className="bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 bg-clip-text text-transparent">
                {t.heroTitleHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-base sm:text-xl font-medium text-slate-300 leading-relaxed mb-8">
              {t.heroDesc}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/apps"
                className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 px-7 py-3.5 text-sm sm:text-base font-extrabold text-white shadow-lg shadow-rose-600/30 hover:scale-105 hover:opacity-95 transition-all"
              >
                <span>{t.btnExplore}</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </div>

            {/* Trust Features Grid */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80 pt-8">
              <div className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <Gift className="h-5 w-5 text-amber-400 shrink-0" />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white">단돈 100엔 / $1</h4>
                  <p className="text-[10px] text-slate-400">부담 없는 초저가 정찰제</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <Zap className="h-5 w-5 text-rose-400 shrink-0" />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white">원클릭 즉시 사용</h4>
                  <p className="text-[10px] text-slate-400">무설치 브라우저 앱 지원</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white">평생 무료 업데이트</h4>
                  <p className="text-[10px] text-slate-400">한 번 구매로 영구 소장</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                <Layers className="h-5 w-5 text-purple-400 shrink-0" />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white">실행 파일 포함</h4>
                  <p className="text-[10px] text-slate-400">Python 데스크톱 프로그램</p>
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
                  🔥 인기 100엔 어플 라인업
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  지금 바로 100엔으로 즉시 이용 가능한 고성능 유틸리티들입니다.
                </p>
              </div>

              <Link
                href="/apps"
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
              >
                <span>전체 어플 보기</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appList.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  onSelectDetail={(selected) => setSelectedApp(selected)}
                />
              ))}
            </div>

          </div>
        </section>

      </main>

      {/* App Detail Modal */}
      {selectedApp && (
        <AppDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onAppUpdated={handleAppUpdated}
          onAppDeleted={handleAppDeleted}
        />
      )}

      {/* New App Upload Modal */}
      {isUploadModalOpen && (
        <UploadAppModal
          onClose={() => setIsUploadModalOpen(false)}
          onAppCreated={handleAppCreated}
        />
      )}

    </div>
  );
}

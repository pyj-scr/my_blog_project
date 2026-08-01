'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { AppCard } from '@/components/AppCard';
import { AppDetailModal } from '@/components/AppDetailModal';
import { PaymentModal } from '@/components/PaymentModal';
import { LoginModal } from '@/components/LoginModal';
import { Footer } from '@/components/Footer';
import { MOCK_APPS } from '@/data/mockApps';
import { AppItem } from '@/types/app';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, ShieldCheck, Zap, Layers, Gift, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 selection:bg-rose-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="absolute top-1/4 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-rose-600/30 via-purple-600/20 to-amber-500/30 blur-[140px]" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-5 py-2 text-sm font-extrabold text-rose-300 backdrop-blur-md mb-6">
              <Sparkles className="h-4.5 w-4.5 text-amber-400" />
              <span>{t.heroTag}</span>
            </div>

            {/* Main Title */}
            <h1 className="mx-auto max-w-5xl text-5xl sm:text-7xl font-black tracking-tight text-white leading-tight mb-6">
              {t.heroTitle1}{' '}
              <span className="bg-gradient-to-r from-amber-400 via-rose-500 to-purple-500 bg-clip-text text-transparent">
                {t.heroTitleHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-3xl text-lg sm:text-2xl font-medium text-slate-300 leading-relaxed mb-10">
              {t.heroDesc}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/apps"
                className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 px-8 py-4 text-base sm:text-lg font-extrabold text-white shadow-xl shadow-rose-600/30 hover:scale-105 hover:opacity-95 transition-all"
              >
                <span>{t.btnExplore}</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Trust Features Grid */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto border-t border-slate-800/80 pt-10">
              <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-slate-900/40 border border-slate-800">
                <Gift className="h-6 w-6 text-amber-400 shrink-0" />
                <div className="text-left">
                  <h4 className="text-sm font-bold text-white">단돈 100엔 / $1</h4>
                  <p className="text-xs text-slate-400">부담 없는 초저가 정찰제</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-slate-900/40 border border-slate-800">
                <Zap className="h-6 w-6 text-rose-400 shrink-0" />
                <div className="text-left">
                  <h4 className="text-sm font-bold text-white">원클릭 즉시 사용</h4>
                  <p className="text-xs text-slate-400">무설치 브라우저 앱 지원</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-slate-900/40 border border-slate-800">
                <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
                <div className="text-left">
                  <h4 className="text-sm font-bold text-white">평생 무료 업데이트</h4>
                  <p className="text-xs text-slate-400">한 번 구매로 영구 소장</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-slate-900/40 border border-slate-800">
                <Layers className="h-6 w-6 text-purple-400 shrink-0" />
                <div className="text-left">
                  <h4 className="text-sm font-bold text-white">실행 파일 포함</h4>
                  <p className="text-xs text-slate-400">Python 데스크톱 프로그램</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Featured Apps Catalog Section */}
        <section className="py-12 bg-slate-950 border-t border-slate-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-white">
                  🔥 인기 100엔 어플 라인업
                </h2>
                <p className="text-base text-slate-400 mt-2">
                  지금 바로 100엔으로 즉시 이용 가능한 고성능 유틸리티들입니다.
                </p>
              </div>

              <Link
                href="/apps"
                className="hidden sm:flex items-center gap-2 text-sm font-bold text-rose-400 hover:text-rose-300 transition-colors"
              >
                <span>전체 어플 보기</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MOCK_APPS.map((app) => (
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

      {/* Modals */}
      {selectedApp && (
        <AppDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
      <PaymentModal />
      <LoginModal />

      <Footer />
    </div>
  );
}

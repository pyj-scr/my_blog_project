'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePurchase } from '@/context/PurchaseContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { MOCK_APPS } from '@/data/mockApps';
import { AppItem } from '@/types/app';
import { Navbar } from '@/components/Navbar';
import { Download, Key, Calendar, ShoppingBag, ArrowRight, User as UserIcon } from 'lucide-react';

export default function MyPage() {
  const { purchases, processPayment } = usePurchase();
  const { user, openLoginModal } = useAuth();
  const { language, t } = useLanguage();
  const [appList, setAppList] = useState<AppItem[]>(MOCK_APPS);

  useEffect(() => {
    fetch('/api/apps')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.apps?.length > 0) setAppList(data.apps);
      })
      .catch((err) => console.warn('Failed to load apps from global server API in MyPage', err));
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isSuccess = params.get('success');
      const appId = params.get('appId');

      if (isSuccess === 'true' && appId) {
        const targetApp = appList.find((a) => a.id === appId);
        if (targetApp && !purchases.some((p) => p.appId === appId)) {
          processPayment(targetApp, user?.name || t.userDefaultName);
        }
      }
    }
  }, [user, purchases, processPayment, t.userDefaultName, appList]);

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 border border-slate-800 text-rose-400">
          <UserIcon className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">{t.login} Required</h2>
        <p className="text-xs text-slate-400 max-w-sm mb-6">
          Please login to view your purchased apps and license keys.
        </p>
        <button
          onClick={openLoginModal}
          className="rounded-2xl bg-rose-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition-all"
        >
          {t.login}
        </button>
      </div>
    );
  }

  const userNameDisplay = user.name || user.email || t.userDefaultName;

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100 selection:bg-rose-500 selection:text-white">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full space-y-8">
      
      {/* User Header */}
      <div className="mb-10 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatarUrl}
            alt={userNameDisplay}
            className="h-16 w-16 rounded-full bg-slate-800 ring-4 ring-rose-500/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{userNameDisplay}</h1>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                {t.proMember}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-800 pt-4 sm:pt-0 sm:pl-6 text-center">
          <button
            onClick={() => {
              if (confirm('구매 내역을 초기화하시겠습니까?')) {
                const key = user?.email ? `app100yen_purchases_${user.email.toLowerCase().trim()}` : 'app100yen_purchases_guest';
                localStorage.removeItem(key);
                window.location.reload();
              }
            }}
            className="px-3.5 py-2 text-xs font-bold text-slate-400 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all"
          >
            {t.resetTestPurchases}
          </button>
          <div>
            <span className="text-[10px] text-slate-500 block">{t.purchasedAppsTotal}</span>
            <span className="text-xl font-extrabold text-white">{purchases.length}</span>
          </div>
        </div>
      </div>

      {/* Purchased Apps Section */}
      <div className="mb-8">
        <h2 className="text-xl font-black text-white flex items-center gap-2 mb-4">
          <ShoppingBag className="h-5 w-5 text-rose-400" />
          <span>{t.navMyPage}</span>
        </h2>

        {purchases.length > 0 ? (
          <div className="space-y-4">
            {purchases.map((item) => {
              const targetApp = appList.find((a) => a.id === item.appId);
              const title =
                targetApp && language === 'ja' && targetApp.titleJa
                  ? targetApp.titleJa
                  : targetApp && language === 'en' && targetApp.titleEn
                  ? targetApp.titleEn
                  : item.appTitle;

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md hover:border-slate-700 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                        Lifetime License
                      </span>
                      <h3 className="text-base font-bold text-white">{title}</h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        {item.purchasedAt}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-amber-300 font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        <Key className="h-3.5 w-3.5 text-amber-400" />
                        {t.licenseKey}: {item.licenseKey}
                      </span>
                    </div>
                  </div>

                  <a
                    href={targetApp?.downloadUrl || '#'}
                    download
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 transition-all shrink-0"
                  >
                    <Download className="h-4 w-4" />
                    <span>{t.downloadFile}</span>
                  </a>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center rounded-3xl border border-slate-800 bg-slate-900/40">
            <ShoppingBag className="mx-auto h-12 w-12 text-slate-600 mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No purchased apps yet</h3>
            <p className="text-xs text-slate-400 mb-6">
              Check out our catalog and get AI apps starting from 100 JPY / $1 USD!
            </p>
            <Link
              href="/apps"
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-rose-500 transition-all"
            >
              <span>{t.btnExplore}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      </main>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Globe, User, Download, Sparkles, PlusCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePurchase } from '@/context/PurchaseContext';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/types/app';

interface NavbarProps {
  onOpenUploadModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenUploadModal }) => {
  const { user, openLoginModal, logout } = useAuth();
  const { purchases } = usePurchase();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-600 to-indigo-600 shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform">
            <ShoppingBag className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-rose-400 transition-colors">
                {t.brandTitle}
              </span>
              <span className="rounded-full bg-rose-500/20 border border-rose-500/30 px-2.5 py-0.5 text-xs font-black text-rose-300">
                100円
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {t.brandTagline}
            </p>
          </div>
        </Link>

        {/* Right Menu */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Language Selector */}
          <div className="relative flex items-center rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-sm text-slate-200">
            <Globe className="h-4 w-4 mr-2 text-rose-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-sm font-bold text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="ja" className="bg-slate-900 text-white">🇯🇵 日本語 (100円)</option>
              <option value="ko" className="bg-slate-900 text-white">🇰🇷 한국어 (₩1,000)</option>
              <option value="en" className="bg-slate-900 text-white">🇺🇸 English ($1.00)</option>
            </select>
          </div>

          <Link
            href="/apps"
            className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-slate-300 hover:text-white transition-colors px-2 py-1"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>{t.navApps}</span>
          </Link>

          {/* New App Upload Button */}
          {onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-sm font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all"
            >
              <PlusCircle className="h-4.5 w-4.5" />
              <span>{language === 'ja' ? 'アプリ登録' : language === 'en' ? 'Upload App' : '어플 등록'}</span>
            </button>
          )}

          <Link
            href="/mypage"
            className="relative flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm font-bold text-slate-200 hover:bg-slate-800 transition-all"
          >
            <Download className="h-4.5 w-4.5 text-emerald-400" />
            <span className="hidden sm:inline">{t.navMyPage}</span>
            {purchases.length > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-black text-white">
                {purchases.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-sm font-bold text-slate-300">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="rounded-xl border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              >
                {t.logout}
              </button>
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-rose-600/20 hover:opacity-90 transition-all"
            >
              <User className="h-4.5 w-4.5" />
              <span>{t.login}</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};

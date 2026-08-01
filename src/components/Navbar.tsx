'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Globe, User, Download, Sparkles, PlusCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePurchase } from '@/context/PurchaseContext';
import { useLanguage } from '@/context/LanguageContext';
import { Language, AppItem } from '@/types/app';
import { UploadAppModal } from '@/components/UploadAppModal';

interface NavbarProps {
  onOpenUploadModal?: () => void;
  onAppCreated?: (newApp: AppItem) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenUploadModal, onAppCreated }) => {
  const { user, openLoginModal, logout } = useAuth();
  const { purchases } = usePurchase();
  const { language, setLanguage, t } = useLanguage();
  const [isInternalModalOpen, setIsInternalModalOpen] = useState(false);

  const handleOpenModal = () => {
    if (onOpenUploadModal) {
      onOpenUploadModal();
    } else {
      setIsInternalModalOpen(true);
    }
  };

  const handleAppCreatedInternal = (newApp: AppItem) => {
    if (onAppCreated) {
      onAppCreated(newApp);
    } else {
      // Dispatch custom event so pages can update app list
      const event = new CustomEvent('app-created', { detail: newApp });
      window.dispatchEvent(event);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-rose-600 to-indigo-600 shadow-md shadow-rose-600/30 group-hover:scale-105 transition-transform">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-rose-400 transition-colors">
                  {t.brandTitle}
                </span>
                <span className="rounded-full bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 text-[10px] font-black text-rose-300">
                  100円
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                {t.brandTagline}
              </p>
            </div>
          </Link>

          {/* Right Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Selector */}
            <div className="relative flex items-center rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 shrink-0">
              <Globe className="h-3.5 w-3.5 mr-1.5 text-rose-400 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="ja" className="bg-slate-900 text-white">JP 日本語 (100円)</option>
                <option value="ko" className="bg-slate-900 text-white">KR 한국어 (₩1,000)</option>
                <option value="en" className="bg-slate-900 text-white">US English ($1.00)</option>
              </select>
            </div>

            <Link
              href="/apps"
              className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-white transition-colors px-2 py-1 whitespace-nowrap"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>{t.navApps}</span>
            </Link>

            {/* Always Visible App Upload Button */}
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-1 rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-2.5 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition-all whitespace-nowrap shrink-0 shadow-sm shadow-emerald-500/20"
            >
              <PlusCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>{language === 'ja' ? 'アプリ登録' : language === 'en' ? 'Upload App' : '어플 등록'}</span>
            </button>

            <Link
              href="/mypage"
              className="relative flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-all whitespace-nowrap shrink-0"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{t.navMyPage}</span>
              {purchases.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white">
                  {purchases.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden lg:inline text-xs font-bold text-slate-300 whitespace-nowrap">
                  {user.name === '구글 사용자' || user.name === 'Google User' || user.name === 'グーグルユーザー' ? t.userDefaultName : user.name}
                </span>
                <button
                  onClick={logout}
                  className="rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1.5 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all whitespace-nowrap"
                >
                  {t.logout}
                </button>
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-rose-600/20 hover:opacity-90 transition-all whitespace-nowrap shrink-0"
              >
                <User className="h-3.5 w-3.5" />
                <span>{t.login}</span>
              </button>
            )}

          </div>

        </div>
      </header>

      {/* Internal Self-contained App Upload Modal */}
      {isInternalModalOpen && (
        <UploadAppModal
          onClose={() => setIsInternalModalOpen(false)}
          onAppCreated={handleAppCreatedInternal}
        />
      )}
    </>
  );
};

'use client';

import React from 'react';
import { AppItem } from '@/types/app';
import { X, Star, Check, Download, Monitor, Apple, Globe, Sparkles, ShieldCheck } from 'lucide-react';
import { usePurchase } from '@/context/PurchaseContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface AppDetailModalProps {
  app: AppItem;
  onClose: () => void;
}

export const AppDetailModal: React.FC<AppDetailModalProps> = ({ app, onClose }) => {
  const { isPurchased, openPaymentModal } = usePurchase();
  const { user, openLoginModal } = useAuth();
  const { language, formatPrice, t } = useLanguage();

  const purchased = isPurchased(app.id);

  const title = language === 'ja' && app.titleJa ? app.titleJa : language === 'en' && app.titleEn ? app.titleEn : app.title;
  const description = language === 'ja' && app.fullDescriptionJa ? app.fullDescriptionJa : language === 'en' && app.fullDescriptionEn ? app.fullDescriptionEn : app.fullDescription;

  const handleBuyClick = () => {
    if (!user) {
      openLoginModal();
      return;
    }
    if (purchased) {
      window.location.href = '/mypage';
    } else {
      openPaymentModal(app);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-950 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header Image */}
        <div className="relative h-64 w-full bg-slate-950">
          <img
            src={app.thumbnailUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-block rounded-full bg-rose-500/20 border border-rose-500/30 px-3 py-1 text-xs font-bold text-rose-400 mb-2">
                {app.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{title}</h2>
            </div>
            
            <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 px-4 py-2 text-lg font-black text-white shadow-xl">
              <Sparkles className="h-5 w-5" />
              <span>{formatPrice(app)}</span>
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-6 text-slate-200">
          
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-950 p-4 border border-slate-800 text-sm">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Star className="h-4.5 w-4.5 fill-amber-400" />
              <span>{app.rating}</span>
              <span className="text-slate-400 font-normal">({app.reviewsCount} 평점)</span>
            </div>
            <div className="text-slate-400">
              다운로드: <span className="font-bold text-white">{app.downloads.toLocaleString()}회</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              {app.os.includes('Windows') && <Monitor className="h-4 w-4" />}
              {app.os.includes('Mac') && <Apple className="h-4 w-4" />}
              {app.os.includes('Web') && <Globe className="h-4 w-4" />}
              <span>{app.os.join(', ')} ({app.size})</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-bold text-white mb-2">어플리케이션 소개</h3>
            <p className="text-base text-slate-300 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* Features List */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">주요 핵심 기능</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {app.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5 rounded-xl bg-slate-950/60 p-3 border border-slate-800 text-sm font-medium">
                  <Check className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Guarantee Pill */}
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-300 text-sm">
            <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold">100% 무제한 영구 라이선스 보장</p>
              <p className="text-xs text-emerald-400/80">단 한 번 {formatPrice(app)} 결제로 평생 소장 및 평생 무료 업데이트를 제공합니다.</p>
            </div>
          </div>

        </div>

        {/* Modal Footer Action Bar */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-slate-800 text-sm font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            닫기
          </button>

          <button
            onClick={handleBuyClick}
            className={`flex items-center gap-2.5 px-8 py-3.5 text-base font-extrabold rounded-2xl shadow-xl transition-all ${
              purchased
                ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-950/40'
                : 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white hover:opacity-90 shadow-rose-600/30'
            }`}
          >
            <Download className="h-5 w-5" />
            <span>{purchased ? t.purchased : `${formatPrice(app)} ${t.buyBtn}`}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

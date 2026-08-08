'use client';

import React from 'react';
import { AppItem } from '@/types/app';
import { useLanguage } from '@/context/LanguageContext';
import { usePurchase } from '@/context/PurchaseContext';
import { translateToJa, translateToEn, translateToKo } from '@/utils/autoTranslateApp';
import { Sparkles, Star, Monitor, Apple, Globe, CheckCircle } from 'lucide-react';

interface AppCardProps {
  app: AppItem;
  onSelectDetail?: (app: AppItem) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onSelectDetail }) => {
  const { language, formatPrice, t } = useLanguage();
  const { isPurchased, openPaymentModal } = usePurchase();

  const purchased = isPurchased(app.id);

  const getValidText = (val?: string, fallback?: string) => {
    if (val && val.trim().length > 1) return val.trim();
    return fallback && fallback.trim().length > 0 ? fallback.trim() : '';
  };

  let title =
    language === 'ko'
      ? getValidText(app.titleKo, app.title)
      : language === 'ja'
      ? getValidText(app.titleJa, app.title)
      : getValidText(app.titleEn, app.title);

  let shortDesc =
    language === 'ko'
      ? getValidText(app.shortDescriptionKo, app.shortDescription)
      : language === 'ja'
      ? getValidText(app.shortDescriptionJa, app.shortDescription)
      : getValidText(app.shortDescriptionEn, app.shortDescription);

  const getCategoryTranslation = (cat: string) => {
    switch (cat) {
      case '모바일 앱': return t.categoryMobile;
      case 'AI 생산성': return t.categoryAi;
      case '디자인 & 미디어': return t.categoryDesign;
      case '개발 & 툴': return t.categoryDev;
      case '자동화': return t.categoryAuto;
      case '유틸리티': return t.categoryUtil;
      default: return cat;
    }
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (purchased) {
      window.location.href = '/mypage';
    } else {
      openPaymentModal(app);
    }
  };

  return (
    <div
      onClick={() => onSelectDetail && onSelectDetail(app)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-rose-950/20 cursor-pointer"
    >
      <div>
        {/* Thumbnail Image Container with object-contain to show full image without cropping */}
        <div className="relative mb-5 h-52 w-full overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center p-2 border border-slate-800/80">
          <img
            src={app.thumbnailUrl}
            alt={title}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-rose-600 px-3 py-1 text-xs font-black text-white shadow-md z-10">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{formatPrice(app)}</span>
          </div>

          {app.isPopular && (
            <div className="absolute top-3 right-3 rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-300 z-10">
              TOP
            </div>
          )}

          {app.isNew && (
            <div className="absolute top-3 right-16 rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-0.5 text-xs font-bold text-indigo-300 z-10">
              NEW
            </div>
          )}

          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-slate-950/90 backdrop-blur-md px-2.5 py-1 text-xs text-slate-200 z-10 border border-slate-800">
            {app.os.includes('Android') && <span className="text-emerald-400 font-bold">🤖</span>}
            {app.os.includes('iOS') && <span className="text-rose-400 font-bold">🍎</span>}
            {app.os.includes('Windows') && <Monitor className="h-4 w-4" />}
            {app.os.includes('Mac') && <Apple className="h-4 w-4" />}
            {app.os.includes('Web') && <Globe className="h-4 w-4" />}
            {app.os.includes('Chrome Extension') && <Globe className="h-4 w-4 text-amber-400" />}
            <span className="text-xs text-slate-300 font-mono font-semibold">{app.size}</span>
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
            {getCategoryTranslation(app.category)}
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>{app.rating}</span>
            <span className="text-slate-500 font-normal">({app.reviewsCount})</span>
          </div>
        </div>

        <h3 className="text-xl font-extrabold text-white group-hover:text-rose-300 transition-colors line-clamp-1 mb-2">
          {title}
        </h3>

        <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed mb-5">
          {shortDesc}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400">{t.downloadCountLabel}</span>
          <span className="text-sm font-bold text-slate-200">{app.downloads.toLocaleString()}{t.downloadCountSuffix}</span>
        </div>

        <button
          onClick={handleDownloadClick}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all shadow-md ${
            purchased
              ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-950/40'
              : 'bg-rose-600 text-white hover:bg-rose-500 hover:shadow-rose-600/30'
          }`}
        >
          {purchased ? (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>{t.purchasedLabel}</span>
            </>
          ) : (
            <>
              <span>{formatPrice(app)}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

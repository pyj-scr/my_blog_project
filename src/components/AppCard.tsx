'use client';

import React from 'react';
import { AppItem } from '@/types/app';
import { Download, Star, CheckCircle, Monitor, Apple, Globe, Sparkles } from 'lucide-react';
import { usePurchase } from '@/context/PurchaseContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface AppCardProps {
  app: AppItem;
  onSelectDetail?: (app: AppItem) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onSelectDetail }) => {
  const { isPurchased, openPaymentModal } = usePurchase();
  const { user, openLoginModal } = useAuth();
  const { language, formatPrice, t } = useLanguage();

  const purchased = isPurchased(app.id);

  const title = language === 'ja' && app.titleJa ? app.titleJa : language === 'en' && app.titleEn ? app.titleEn : app.title;
  const shortDesc = language === 'ja' && app.shortDescriptionJa ? app.shortDescriptionJa : language === 'en' && app.shortDescriptionEn ? app.shortDescriptionEn : app.shortDescription;

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <div
      onClick={() => onSelectDetail && onSelectDetail(app)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-rose-950/20 cursor-pointer"
    >
      <div>
        <div className="relative mb-5 h-52 w-full overflow-hidden rounded-xl bg-slate-950">
          <img
            src={app.thumbnailUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Dynamic Price Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 px-3.5 py-1.5 text-sm font-black text-white shadow-lg shadow-rose-600/30">
            <Sparkles className="h-4 w-4 fill-white" />
            <span>{formatPrice(app)}</span>
          </div>

          <div className="absolute top-3 right-3 flex gap-1.5">
            {app.isPopular && (
              <span className="rounded-full bg-rose-500/90 px-3 py-1 text-xs font-bold text-white shadow">
                TOP
              </span>
            )}
            {app.isNew && (
              <span className="rounded-full bg-indigo-500/90 px-3 py-1 text-xs font-bold text-white shadow">
                NEW
              </span>
            )}
          </div>

          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-xs text-slate-200">
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
            {app.category}
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
          <span className="text-xs text-slate-400">다운로드</span>
          <span className="text-sm font-bold text-slate-200">{app.downloads.toLocaleString()}회</span>
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
              <span>{t.purchased}</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>{formatPrice(app)}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

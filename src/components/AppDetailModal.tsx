'use client';

import React, { useState } from 'react';
import { X, Download, Star, ShieldCheck, Sparkles, Check, Monitor, Apple, Globe, Lock, Edit3, Trash2, BookOpen } from 'lucide-react';
import { AppItem } from '@/types/app';
import { usePurchase } from '@/context/PurchaseContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { UploadAppModal } from '@/components/UploadAppModal';

interface AppDetailModalProps {
  app: AppItem;
  onClose: () => void;
  onAppUpdated?: (updatedApp: AppItem) => void;
  onAppDeleted?: (appId: string) => void;
}

export const AppDetailModal: React.FC<AppDetailModalProps> = ({
  app,
  onClose,
  onAppUpdated,
  onAppDeleted,
}) => {
  const { isPurchased, openPaymentModal } = usePurchase();
  const { user, openLoginModal } = useAuth();
  const { language, formatPrice, t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);

  const purchased = isPurchased(app.id);

  const title = language === 'ja' && app.titleJa ? app.titleJa : language === 'en' && app.titleEn ? app.titleEn : app.title;
  const fullDesc = language === 'ja' && app.fullDescriptionJa ? app.fullDescriptionJa : language === 'en' && app.fullDescriptionEn ? app.fullDescriptionEn : app.fullDescription;
  const usageGuide = language === 'ja' && app.usageGuideJa ? app.usageGuideJa : language === 'en' && app.usageGuideEn ? app.usageGuideEn : app.usageGuide;

  const handleBuyOrDownload = () => {
    if (!user) {
      openLoginModal();
      return;
    }
    if (purchased) {
      window.location.href = '/mypage';
    } else {
      onClose();
      openPaymentModal(app);
    }
  };

  const handleDelete = () => {
    if (confirm(`'${title}'`)) {
      if (onAppDeleted) {
        onAppDeleted(app.id);
      } else {
        const event = new CustomEvent('app-deleted', { detail: app.id });
        window.dispatchEvent(event);
      }
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
        <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
          
          {/* Header Banner Image */}
          <div className="relative h-48 sm:h-60 w-full overflow-hidden bg-slate-950">
            <img
              src={app.thumbnailUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/70 text-slate-300 backdrop-blur-md hover:bg-slate-950 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Category & Title */}
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
              <div>
                <span className="inline-block rounded-full bg-rose-500/20 border border-rose-500/30 px-3 py-1 text-xs font-bold text-rose-300 mb-2">
                  {app.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{title}</h2>
              </div>
              
              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xl sm:text-2xl font-black text-amber-400 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-xl border border-amber-500/20">
                  <Sparkles className="h-4 w-4" />
                  {formatPrice(app)}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            
            {/* Meta Info Pill */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-950 p-4 border border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-white">{app.rating}</span>
                <span className="text-slate-500">({app.reviewsCount} {t.ratingLabel})</span>
              </div>

              <div>
                <span>{t.downloadCountLabel}: </span>
                <strong className="text-white">{app.downloads.toLocaleString()}{t.downloadCountSuffix}</strong>
              </div>

              <div className="flex items-center gap-2">
                {app.os.includes('Android') && <span className="text-emerald-400 font-bold">🤖 Android</span>}
                {app.os.includes('iOS') && <span className="text-rose-400 font-bold">🍎 iOS</span>}
                {app.os.includes('Windows') && <span className="flex items-center gap-1"><Monitor className="h-3.5 w-3.5" /> Windows</span>}
                {app.os.includes('Mac') && <span className="flex items-center gap-1"><Apple className="h-3.5 w-3.5" /> Mac</span>}
                <span className="font-mono text-slate-400">({app.size})</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold text-white mb-2">{t.appIntroTitle}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-4 rounded-2xl border border-slate-800/60">
                {fullDesc}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-sm font-bold text-white mb-3">{t.keyFeaturesTitle}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {app.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-xl bg-slate-950 p-3 border border-slate-800 text-xs text-slate-200"
                  >
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Use / Usage Guide Manual */}
            {usageGuide && (
              <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 space-y-2">
                <h3 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-amber-400" />
                  <span>{t.usageGuideTitle}</span>
                </h3>
                <p className="text-xs text-amber-100/90 whitespace-pre-wrap leading-relaxed">
                  {usageGuide}
                </p>
              </div>
            )}

            {/* Guarantee Badge */}
            <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-300 text-xs">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold">{t.guaranteeTitle}</p>
                <p className="text-[10px] text-emerald-300/80">{t.guaranteeDesc}</p>
              </div>
            </div>

          </div>

          {/* Footer Action Bar */}
          <div className="flex items-center justify-between border-t border-slate-800 p-4 bg-slate-950/80 gap-3">
            
            {/* Left Action Buttons: Close, Edit, Delete */}
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
              >
                {t.closeBtn}
              </button>

              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>{t.editBtn}</span>
              </button>

              <button
                onClick={handleDelete}
                className="flex items-center gap-1 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{t.deleteBtn}</span>
              </button>
            </div>

            {/* Right Action Button: Buy or Download */}
            <button
              onClick={handleBuyOrDownload}
              className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg transition-all ${
                purchased
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : 'bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:opacity-90 shadow-rose-600/30'
              }`}
            >
              {purchased ? (
                <>
                  <Download className="h-4 w-4" />
                  <span>{t.downloadNowBtn}</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>{formatPrice(app)} {t.buyBtn}</span>
                </>
              )}
            </button>

          </div>

        </div>
      </div>

      {/* Edit App Modal */}
      {isEditing && (
        <UploadAppModal
          editApp={app}
          onClose={() => setIsEditing(false)}
          onAppUpdated={(updated) => {
            if (onAppUpdated) {
              onAppUpdated(updated);
            } else {
              const event = new CustomEvent('app-updated', { detail: updated });
              window.dispatchEvent(event);
            }
            setIsEditing(false);
            onClose();
          }}
        />
      )}
    </>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, CheckCircle, Sparkles, Plus, Edit3, BookOpen, Image as ImageIcon, Trash2, RefreshCw } from 'lucide-react';
import { AppItem, AppCategory, OSType } from '@/types/app';
import { useLanguage } from '@/context/LanguageContext';
import { autoTranslateApp, asyncTranslateApp } from '@/utils/autoTranslateApp';

interface UploadAppModalProps {
  onClose: () => void;
  onAppCreated?: (newApp: AppItem) => void;
  onAppUpdated?: (updatedApp: AppItem) => void;
  editApp?: AppItem | null;
}

// Category fallback automatic high quality images
const DEFAULT_CATEGORY_IMAGES: Record<AppCategory, string> = {
  '모바일 앱': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80',
  'AI 생산성': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80',
  '디자인 & 미디어': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
  '개발 & 툴': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
  '자동화': 'https://images.unsplash.com/photo-1544396821-4dd40b938ad3?w=600&auto=format&fit=crop&q=80',
  '유틸리티': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
  '전체': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80',
};

export const UploadAppModal: React.FC<UploadAppModalProps> = ({
  onClose,
  onAppCreated,
  onAppUpdated,
  editApp,
}) => {
  const { t } = useLanguage();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AppCategory>('유틸리티');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [usageGuide, setUsageGuide] = useState('');
  const [selectedOS, setSelectedOS] = useState<string[]>(['Android', 'iOS']);
  const [fileName, setFileName] = useState<string | null>(null);
  
  // Thumbnail State
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (editApp) {
      setTitle(editApp.title);
      setCategory(editApp.category);
      setShortDesc(editApp.shortDescription);
      setFullDesc(editApp.fullDescription);
      setUsageGuide(editApp.usageGuide || '');
      setSelectedOS(editApp.os as string[]);
      if (editApp.thumbnailUrl) {
        setCustomImage(editApp.thumbnailUrl);
      }
    }
  }, [editApp]);

  const toggleOS = (os: string) => {
    if (selectedOS.includes(os)) {
      setSelectedOS(selectedOS.filter((o) => o !== os));
    } else {
      setSelectedOS([...selectedOS, os]);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setCustomImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  // Get final thumbnail URL (Custom or Category Default)
  const finalThumbnail = customImage || DEFAULT_CATEGORY_IMAGES[category] || DEFAULT_CATEGORY_IMAGES['유틸리티'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDesc) return;

    setIsTranslating(true);

    if (editApp && onAppUpdated) {
      const rawUpdated: AppItem = {
        ...editApp,
        title: title,
        shortDescription: shortDesc,
        fullDescription: fullDesc || shortDesc,
        usageGuide: usageGuide,
        category: category,
        os: (selectedOS.length > 0 ? selectedOS : ['Android', 'iOS']) as OSType[],
        thumbnailUrl: finalThumbnail,
      };

      const translated = await asyncTranslateApp(rawUpdated);
      setIsTranslating(false);
      onAppUpdated(translated);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } else if (onAppCreated) {
      const rawNewApp: AppItem = {
        id: `app-custom-${Date.now()}`,
        title: title,
        shortDescription: shortDesc,
        fullDescription: fullDesc || shortDesc,
        usageGuide: usageGuide,
        priceJpy: 100,
        priceKrw: 1000,
        priceUsd: 1.0,
        category: category,
        version: 'v1.0.0',
        size: fileName ? '15.2 MB' : '10.0 MB',
        os: (selectedOS.length > 0 ? selectedOS : ['Android', 'iOS']) as OSType[],
        rating: 5.0,
        reviewsCount: 1,
        downloads: 1,
        thumbnailUrl: finalThumbnail,
        features: [
          '모바일 & 스마트폰 어플 원클릭 실행',
          '독점 100엔 정찰제 다운로드',
          '안전 검증 무설치 / 직속 패키지',
        ],
        downloadUrl: '#download-custom',
        isNew: true,
        updatedAt: new Date().toISOString().split('T')[0],
      };

      const translated = await asyncTranslateApp(rawNewApp);
      setIsTranslating(false);
      onAppCreated(translated);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-600/30">
              {editApp ? <Edit3 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {editApp ? t.uploadModalEditTitle : t.uploadModalTitle}
              </h2>
              <p className="text-xs text-slate-400">
                {editApp ? t.uploadModalEditSub : t.uploadModalSub}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success Banner */}
        {isSuccess ? (
          <div className="p-12 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-extrabold text-white">
              {editApp ? '어플 정보가 수정되었습니다!' : '어플 등록이 완료되었습니다!'}
            </h3>
            <p className="text-sm text-slate-300">상점 카탈로그 및 상세페이지에 반영되었습니다.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* Custom App Thumbnail Cover Upload Section (Before Title) */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <ImageIcon className="h-4 w-4" />
                  <span>{t.thumbnailLabel}</span>
                </label>
                {customImage && (
                  <button
                    type="button"
                    onClick={() => setCustomImage(null)}
                    className="flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>초기화 (자동 이미지)</span>
                  </button>
                )}
              </div>

              {/* Image Preview & Upload Input */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative h-28 w-full sm:w-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                  <img
                    src={finalThumbnail}
                    alt="App Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 left-2 rounded-full bg-slate-950/80 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                    {customImage ? '커스텀 이미지' : '자동 추천 이미지'}
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <div className="relative border-2 border-dashed border-slate-800 hover:border-amber-500/80 rounded-xl bg-slate-900/50 p-4 text-center cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center space-y-1 pointer-events-none">
                      <Upload className="h-4 w-4 text-amber-400" />
                      <span className="text-xs text-slate-200 font-bold">
                        {customImage ? '다른 이미지로 변경' : t.thumbnailDropText}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">
                    {t.thumbnailAutoNotice}
                  </p>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.appNameLabel} <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={t.appNamePlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Category & Price & Revenue Policy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">{t.categoryLabel}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AppCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="모바일 앱">📱 {t.categoryMobile}</option>
                  <option value="AI 생산성">🤖 {t.categoryAi}</option>
                  <option value="디자인 & 미디어">🎨 {t.categoryDesign}</option>
                  <option value="자동화">⚡ {t.categoryAuto}</option>
                  <option value="유틸리티">🛠️ {t.categoryUtil}</option>
                  <option value="개발 & 툴">💻 {t.categoryDev}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-400 mb-1.5">
                  {t.priceAndRevenueLabel}
                </label>
                <div className="flex flex-col justify-center bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white space-y-1">
                  <div className="flex items-center justify-between font-extrabold text-amber-400">
                    <span>100円 / ₩1,000 / $1.00 USD</span>
                    <span className="text-[10px] text-emerald-400">90%</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {t.revenueShareText}
                  </p>
                </div>
              </div>
            </div>

            {/* Supported OS */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">{t.supportedOSLabel}</label>
              <div className="flex flex-wrap gap-2">
                {['Android', 'iOS', 'Windows', 'Mac', 'Web'].map((os) => {
                  const active = selectedOS.includes(os);
                  return (
                    <button
                      type="button"
                      key={os}
                      onClick={() => toggleOS(os)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        active
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {os === 'Android' && '🤖 Android'}
                      {os === 'iOS' && '🍎 iOS'}
                      {os === 'Windows' && '💻 Windows'}
                      {os === 'Mac' && '🍏 Mac'}
                      {os === 'Web' && '🌐 Web'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.shortDescLabel} <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={t.shortDescPlaceholder}
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.fullDescLabel}
              </label>
              <textarea
                rows={3}
                placeholder={t.fullDescPlaceholder}
                value={fullDesc}
                onChange={(e) => setFullDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Usage Guide / Manual */}
            <div>
              <label className="block text-xs font-bold text-amber-400 mb-1.5 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <span>{t.usageGuideLabel}</span>
              </label>
              <textarea
                rows={3}
                placeholder={t.usageGuidePlaceholder}
                value={usageGuide}
                onChange={(e) => setUsageGuide(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* App File Upload Box */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.fileUploadLabel}
              </label>
              <div className="relative border-2 border-dashed border-slate-800 hover:border-emerald-500 rounded-2xl bg-slate-950 p-4 text-center cursor-pointer transition-colors">
                <input
                  type="file"
                  onChange={handleFileDrop}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
                  <Upload className="h-5 w-5 text-emerald-400" />
                  <span className="text-xs text-slate-300 font-bold">
                    {fileName ? `선택된 파일: ${fileName}` : t.fileUploadDropText}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-bold text-slate-400 hover:text-white"
              >
                {t.cancelBtn}
              </button>
              <button
                type="submit"
                disabled={isTranslating}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isTranslating ? (
                  <Sparkles className="h-4 w-4 animate-spin text-amber-300" />
                ) : editApp ? (
                  <Edit3 className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span>
                  {isTranslating
                    ? 'AI 실시간 다국어 번역 중...'
                    : editApp
                    ? t.submitSaveBtn
                    : t.submitUploadBtn}
                </span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

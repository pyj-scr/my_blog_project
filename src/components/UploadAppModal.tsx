'use client';

import React, { useState, useEffect } from 'react';
import { X, Upload, CheckCircle, Sparkles, Plus, Edit3, BookOpen, Image as ImageIcon, Trash2, Globe, AlertCircle } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AppItem, AppCategory, OSType } from '@/types/app';
import { useLanguage } from '@/context/LanguageContext';
import { autoTranslateApp, asyncTranslateApp } from '@/utils/autoTranslateApp';
import { storage } from '@/lib/firebaseClient';

const formatFileSize = (bytes: number): string => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
};

interface UploadAppModalProps {
  onClose: () => void;
  onAppCreated?: (newApp: AppItem) => void;
  onAppUpdated?: (updatedApp: AppItem) => void;
  editApp?: AppItem | null;
}

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
  const [titleJa, setTitleJa] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleKo, setTitleKo] = useState('');

  const [category, setCategory] = useState<AppCategory>('유틸리티');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [usageGuide, setUsageGuide] = useState('');
  const [selectedOS, setSelectedOS] = useState<string[]>(['Android', 'iOS']);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [showAdvancedTitleEdit, setShowAdvancedTitleEdit] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (editApp) {
      setTitle(editApp.title);
      setCategory(editApp.category);
      setShortDesc(editApp.shortDescription);
      setFullDesc(editApp.fullDescription || '');
      setUsageGuide(editApp.usageGuide || '');
      setSelectedOS(editApp.os || ['Android', 'iOS']);
      setCustomImage(editApp.thumbnailUrl || null);

      const isValid = (s?: string) => s && s.trim().length > 1;
      setTitleKo(isValid(editApp.titleKo) ? editApp.titleKo! : '');
      setTitleJa(isValid(editApp.titleJa) ? editApp.titleJa! : '');
      setTitleEn(isValid(editApp.titleEn) ? editApp.titleEn! : '');
    }
  }, [editApp]);

  const toggleOS = (os: string) => {
    if (selectedOS.includes(os)) {
      setSelectedOS(selectedOS.filter((item) => item !== os));
    } else {
      setSelectedOS([...selectedOS, os]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
      setFileError(null);
    }
  };

  const finalThumbnail = customImage || DEFAULT_CATEGORY_IMAGES[category] || DEFAULT_CATEGORY_IMAGES['유틸리티'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDesc) return;

    // An app listing is worthless without something to actually launch/download,
    // so require either a freshly attached file or a previously uploaded one.
    const existingDownloadUrl =
      editApp?.downloadUrl && !editApp.downloadUrl.startsWith('#') ? editApp.downloadUrl : undefined;

    if (!selectedFile && !existingDownloadUrl) {
      setFileError(t.fileUploadRequiredMessage);
      return;
    }
    setFileError(null);

    const appId = editApp ? editApp.id : `app-custom-${Date.now()}`;
    let downloadUrl = existingDownloadUrl;
    let fileSizeLabel = editApp?.size;

    if (selectedFile) {
      setIsUploadingFile(true);
      try {
        const storageRef = ref(storage, `app_files/${appId}/${Date.now()}_${selectedFile.name}`);
        await uploadBytes(storageRef, selectedFile);
        downloadUrl = await getDownloadURL(storageRef);
        fileSizeLabel = formatFileSize(selectedFile.size);
      } catch (err) {
        console.error('App file upload failed:', err);
        setIsUploadingFile(false);
        setFileError(t.fileUploadFailedMessage);
        return;
      }
      setIsUploadingFile(false);
    }

    setIsTranslating(true);
    const isValid = (s?: string) => s && s.trim().length > 1;

    const baseApp: AppItem = {
      id: appId,
      title: title.trim(),
      titleKo: showAdvancedTitleEdit && isValid(titleKo) ? titleKo.trim() : undefined,
      titleJa: showAdvancedTitleEdit && isValid(titleJa) ? titleJa.trim() : undefined,
      titleEn: showAdvancedTitleEdit && isValid(titleEn) ? titleEn.trim() : undefined,
      shortDescription: shortDesc.trim(),
      fullDescription: (fullDesc || shortDesc).trim(),
      usageGuide: usageGuide.trim(),
      priceJpy: 100,
      priceKrw: 1000,
      priceUsd: 1.0,
      category: category,
      version: 'v1.0.0',
      size: fileSizeLabel || '10.0 MB',
      os: (selectedOS.length > 0 ? selectedOS : ['Android', 'iOS']) as OSType[],
      rating: editApp ? editApp.rating : 5.0,
      reviewsCount: editApp ? editApp.reviewsCount : 1,
      downloads: editApp ? editApp.downloads : 1,
      thumbnailUrl: finalThumbnail,
      features: [
        '모바일 & 스마트폰 어플 원클릭 실행',
        '독점 100엔 정찰제 다운로드',
        '안전 검증 무설치 / 직속 패키지',
      ],
      featuresKo: [
        '모바일 & 스마트폰 어플 원클릭 실행',
        '독점 100엔 정찰제 다운로드',
        '안전 검증 무설치 / 직속 패키지',
      ],
      featuresJa: [
        'モバイル＆スマホアプリ ワンタッチ即時起動',
        '独占100円一律定額ダウンロード',
        '安全検証済み インストール不要パッケージ',
      ],
      featuresEn: [
        '1-Touch instant Mobile & Smartphone execution',
        'Exclusive flat $1 download',
        'Verified secure no-install package',
      ],
      downloadUrl: downloadUrl || '',
      isNew: editApp ? editApp.isNew : true,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    // Enrich with dynamic translation
    const translated = await asyncTranslateApp(baseApp);

    if (showAdvancedTitleEdit) {
      if (isValid(titleJa)) translated.titleJa = titleJa.trim();
      if (isValid(titleEn)) translated.titleEn = titleEn.trim();
      if (isValid(titleKo)) translated.titleKo = titleKo.trim();
    }

    // Send to Global Server API Database Route (Real-Time Worldwide Sync)
    try {
      const endpoint = '/api/apps';
      const method = editApp ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(translated),
      });

      if (res.ok) {
        const data = await res.json();
        const finalApp = data.app || translated;

        if (editApp && onAppUpdated) {
          onAppUpdated(finalApp);
        } else if (onAppCreated) {
          onAppCreated(finalApp);
        }

        const eventName = editApp ? 'app-updated' : 'app-created';
        const customEvent = new CustomEvent(eventName, { detail: finalApp });
        window.dispatchEvent(customEvent);

        setIsSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        const fallbackApp = autoTranslateApp(translated);
        if (editApp && onAppUpdated) {
          onAppUpdated(fallbackApp);
        } else if (onAppCreated) {
          onAppCreated(fallbackApp);
        }
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error('App submit API failed:', err);
      const fallbackApp = autoTranslateApp(translated);
      if (editApp && onAppUpdated) {
        onAppUpdated(fallbackApp);
      } else if (onAppCreated) {
        onAppCreated(fallbackApp);
      }
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/95 shadow-2xl overflow-hidden">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-6 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-indigo-600 shadow-md">
              {editApp ? <Edit3 className="h-5 w-5 text-white" /> : <Upload className="h-5 w-5 text-white" />}
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
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Success Screen */}
        {isSuccess ? (
          <div className="p-12 text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-emerald-400 animate-bounce" />
            </div>
            <h3 className="text-xl font-black text-white">
              {editApp ? t.appUpdatedSuccessTitle : t.appCreatedSuccessTitle}
            </h3>
            <p className="text-sm text-slate-300">
              {editApp ? t.appUpdatedSuccessDesc : t.appCreatedSuccessDesc}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">

            {/* Thumbnail Preview & Upload Box */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                <img
                  src={finalThumbnail}
                  alt="App Preview"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="space-y-2 text-center sm:text-left flex-1">
                <p className="text-xs font-bold text-slate-200">{t.thumbnailTitle}</p>
                <p className="text-[11px] text-slate-400">
                  {t.thumbnailDesc}
                </p>
                <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 hover:bg-slate-800 cursor-pointer transition-all">
                    <ImageIcon className="h-3.5 w-3.5 text-rose-400" />
                    <span>{t.uploadImageBtn}</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {customImage && (
                    <button
                      type="button"
                      onClick={() => setCustomImage(null)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>{t.resetDefaultImageBtn}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Main App Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300">
                  {t.appNameLabel} <span className="text-rose-400">*</span>
                </label>

                {/* Advanced Language Edit Toggle */}
                <button
                  type="button"
                  onClick={() => setShowAdvancedTitleEdit(!showAdvancedTitleEdit)}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Globe className="h-3 w-3" />
                  <span>{showAdvancedTitleEdit ? '언어별 수동 직접 입력 닫기' : '🌐 언어별 어플 이름 직접 입력/수정'}</span>
                </button>
              </div>

              <input
                type="text"
                required
                placeholder={t.appNamePlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />

              {/* Language Direct Manual Edit Section */}
              {showAdvancedTitleEdit && (
                <div className="mt-3 rounded-2xl bg-slate-950 border border-indigo-500/30 p-3.5 space-y-3 animate-fadeIn">
                  <p className="text-[11px] font-bold text-indigo-300">
                    ※ 원하시는 일본어/영어/한국어 표기법을 직접 수정하시면 AI 자동 번역보다 최우선하여 전 세계 적용됩니다.
                  </p>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">🇯🇵 日本語 アプリ名 (일본어 표기 직접 수정)</label>
                    <input
                      type="text"
                      placeholder="예: Prayer List (グループ用 お祈りリスト)"
                      value={titleJa}
                      onChange={(e) => setTitleJa(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">🇺🇸 English App Title (영어 표기 직접 수정)</label>
                    <input
                      type="text"
                      placeholder="e.g. Prayer List (Group Edition)"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">🇰🇷 한국어 어플 이름 (한국어 표기 직접 수정)</label>
                    <input
                      type="text"
                      placeholder="예: Prayer List (그룹용 기도 리스트)"
                      value={titleKo}
                      onChange={(e) => setTitleKo(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
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
              <div
                className={`relative border-2 border-dashed rounded-2xl bg-slate-950 p-4 text-center cursor-pointer transition-colors ${
                  fileError ? 'border-rose-500' : 'border-slate-800 hover:border-emerald-500'
                }`}
              >
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
              {fileError && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-rose-400">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{fileError}</span>
                </p>
              )}
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
                disabled={isTranslating || isUploadingFile}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                {isUploadingFile || isTranslating ? (
                  <Sparkles className="h-4 w-4 animate-spin text-amber-300" />
                ) : editApp ? (
                  <Edit3 className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span>
                  {isUploadingFile
                    ? t.fileUploadingText
                    : isTranslating
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

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, AppItem } from '@/types/app';

export interface TranslationSet {
  brandTitle: string;
  brandTagline: string;
  navApps: string;
  navMyPage: string;
  login: string;
  logout: string;
  userDefaultName: string;
  heroTag: string;
  heroTitle1: string;
  heroTitleHighlight: string;
  heroDesc: string;
  btnExplore: string;
  trustBadge1Title: string;
  trustBadge1Sub: string;
  trustBadge2Title: string;
  trustBadge2Sub: string;
  trustBadge3Title: string;
  trustBadge3Sub: string;
  trustBadge4Title: string;
  trustBadge4Sub: string;
  popularCatalogTitle: string;
  popularCatalogSub: string;
  viewAllApps: string;
  catalogTitle: string;
  catalogSubtitle: string;
  searchPlaceholder: string;
  buyBtn: string;
  purchasedLabel: string;
  downloadFile: string;
  licenseKey: string;
  ratingLabel: string;
  downloadCountLabel: string;
  downloadCountSuffix: string;
  categoryMobile: string;
  categoryAi: string;
  categoryDesign: string;
  categoryDev: string;
  categoryAuto: string;
  categoryUtil: string;
}

const translations: Record<Language, TranslationSet> = {
  ja: {
    brandTitle: 'アプリ 100円ショップ',
    brandTagline: 'AI Apps at Just 100 Yen',
    navApps: 'アプリ一覧',
    navMyPage: 'マイダウンロード',
    login: 'ログイン',
    logout: 'ログアウト',
    userDefaultName: 'グーグルユーザー',
    heroTag: 'AIアプリ全品 100円均一ショップ',
    heroTitle1: '一人で使うには勿体ない！',
    heroTitleHighlight: 'アプリ 100円ショップ',
    heroDesc: '背景除去ツールからPDF AI要約機、自動化ツールまで！必要なアプリを100円で永久ダウンロード。',
    btnExplore: 'アプリを探してダウンロード',
    trustBadge1Title: 'たった100円 / $1',
    trustBadge1Sub: '手軽な一律価格',
    trustBadge2Title: 'ワンクリック即時利用',
    trustBadge2Sub: 'インストール不要ウェブアプリ',
    trustBadge3Title: '生涯無料アップデート',
    trustBadge3Sub: '一度の購入で永久所有',
    trustBadge4Title: '実行ファイル同梱',
    trustBadge4Sub: 'Pythonデスクトッププログラム',
    popularCatalogTitle: '🔥 人気100円アプリラインナップ',
    popularCatalogSub: '100円ですぐに利用できる高性能ユーティリティです。',
    viewAllApps: 'すべてのアプリを見る',
    catalogTitle: '100円アプリ カタログ',
    catalogSubtitle: '100円ですぐにダウンロード可能な高品質ユーティリティラインナップです。',
    searchPlaceholder: 'アプリ名または機能を検索...',
    buyBtn: '100円で購入',
    purchasedLabel: '購入済み',
    downloadFile: 'インストールファイルのダウンロード',
    licenseKey: 'ライセンスキー',
    ratingLabel: '評価',
    downloadCountLabel: 'ダウンロード',
    downloadCountSuffix: '回',
    categoryMobile: 'モバイルアプリ',
    categoryAi: 'AI生産性',
    categoryDesign: 'デザイン＆メディア',
    categoryDev: '開発＆ツール',
    categoryAuto: '自動化',
    categoryUtil: 'ユーティリティ',
  },
  ko: {
    brandTitle: '어플 100엔 샾',
    brandTagline: 'AI Apps at Just 100 Yen',
    navApps: '어플 다운로드',
    navMyPage: '마이 다운로드',
    login: '로그인',
    logout: '로그아웃',
    userDefaultName: '구글 사용자',
    heroTag: 'AI 어플 전품목 100엔 균일가 샾',
    heroTitle1: '혼자 쓰기 아까워 공개하는',
    heroTitleHighlight: '어플 100엔 샾',
    heroDesc: '배경 제거 툴부터 PDF AI 요약기, 자동화 툴까지! 필요한 어플을 단돈 100엔에 평생 영구 소장하세요.',
    btnExplore: '어플 찾고 바로 다운로드',
    trustBadge1Title: '단돈 100엔 / $1',
    trustBadge1Sub: '부담 없는 초저가 정찰제',
    trustBadge2Title: '원클릭 즉시 사용',
    trustBadge2Sub: '무설치 브라우저 앱 지원',
    trustBadge3Title: '평생 무료 업데이트',
    trustBadge3Sub: '한 번 구매로 영구 소장',
    trustBadge4Title: '실행 파일 포함',
    trustBadge4Sub: 'Python 데스크톱 프로그램',
    popularCatalogTitle: '🔥 인기 100엔 어플 라인업',
    popularCatalogSub: '지금 바로 100엔으로 즉시 이용 가능한 고성능 유틸리티들입니다.',
    viewAllApps: '전체 어플 보기',
    catalogTitle: '100엔 어플 카탈로그',
    catalogSubtitle: '100엔으로 즉시 다운로드 가능한 고품질 유틸리티 어플 라인업입니다.',
    searchPlaceholder: '어플 이름 또는 기능 검색...',
    buyBtn: '1000원에 구매',
    purchasedLabel: '구매 완료',
    downloadFile: '설치 파일 다운로드',
    licenseKey: '라이선스 키',
    ratingLabel: '평점',
    downloadCountLabel: '다운로드',
    downloadCountSuffix: '회',
    categoryMobile: '모바일 앱',
    categoryAi: 'AI 생산성',
    categoryDesign: '디자인 & 미디어',
    categoryDev: '개발 & 툴',
    categoryAuto: '자동화',
    categoryUtil: '유틸리티',
  },
  en: {
    brandTitle: 'App $1 Shop',
    brandTagline: 'AI Apps at Just $1 USD',
    navApps: 'Catalog',
    navMyPage: 'My Downloads',
    login: 'Login',
    logout: 'Logout',
    userDefaultName: 'Google User',
    heroTag: 'All AI Apps Flat $1.00 USD',
    heroTitle1: 'Too Good To Keep To Myself!',
    heroTitleHighlight: 'App $1 Dollar Shop',
    heroDesc: 'From background removers to PDF AI summarizers and automation utilities! Get lifetime apps for just $1.',
    btnExplore: 'Explore & Download Apps',
    trustBadge1Title: 'Flat $1.00 USD / 100 JPY',
    trustBadge1Sub: 'Affordable Flat Price',
    trustBadge2Title: '1-Click Instant Run',
    trustBadge2Sub: 'No-Install Web Apps',
    trustBadge3Title: 'Lifetime Free Updates',
    trustBadge3Sub: 'Own Forever with 1 Payment',
    trustBadge4Title: 'Executables Included',
    trustBadge4Sub: 'Python Desktop Utilities',
    popularCatalogTitle: '🔥 Popular $1 Apps Lineup',
    popularCatalogSub: 'High performance utilities ready to use for just $1.',
    viewAllApps: 'View All Apps',
    catalogTitle: '$1 App Catalog',
    catalogSubtitle: 'High quality utility apps available for download at flat $1.',
    searchPlaceholder: 'Search app title or features...',
    buyBtn: 'Buy for $1',
    purchasedLabel: 'Purchased',
    downloadFile: 'Download Installer File',
    licenseKey: 'License Key',
    ratingLabel: 'Rating',
    downloadCountLabel: 'Downloads',
    downloadCountSuffix: ' downloads',
    categoryMobile: 'Mobile App',
    categoryAi: 'AI Productivity',
    categoryDesign: 'Design & Media',
    categoryDev: 'Dev & Tools',
    categoryAuto: 'Automation',
    categoryUtil: 'Utilities',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSet;
  formatPrice: (app: AppItem) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ja'); // Default Japanese for JP residence

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('app100yen_language') as Language;
      if (savedLang && ['ja', 'ko', 'en'].includes(savedLang)) {
        setLanguage(savedLang);
      }
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app100yen_language', lang);
    }
  };

  const formatPrice = (app: AppItem): string => {
    switch (language) {
      case 'ja':
        return `${app.priceJpy}円`;
      case 'ko':
        return `₩${app.priceKrw.toLocaleString()}`;
      case 'en':
        return `$${app.priceUsd.toFixed(2)}`;
      default:
        return `${app.priceJpy}円`;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: changeLanguage,
        t: translations[language],
        formatPrice,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

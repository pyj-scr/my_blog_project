'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Currency, AppItem } from '@/types/app';

interface TranslationSet {
  brandTitle: string;
  brandTagline: string;
  navHome: string;
  navApps: string;
  navMyPage: string;
  login: string;
  logout: string;
  heroTag: string;
  heroTitle1: string;
  heroTitleHighlight: string;
  heroDesc: string;
  btnExplore: string;
  btnAbout: string;
  popularTitle: string;
  popularSub: string;
  viewAll: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  faqTitle: string;
  faqDesc: string;
  getAppBtn: string;
  searchPlaceholder: string;
  categoryAll: string;
  purchased: string;
  buyBtn: string;
  payModalTitle: string;
  payModalSub: string;
  paySuccessTitle: string;
  paySuccessSub: string;
  myDownloadsTitle: string;
  licenseKey: string;
  downloadFile: string;
  priceTag: string;
}

const TRANSLATIONS: Record<Language, TranslationSet> = {
  ja: {
    brandTitle: 'アプリ 100円ショップ',
    brandTagline: 'AI Apps at Just 100 Yen',
    navHome: 'ホーム',
    navApps: 'アプリダウンロード',
    navMyPage: 'マイダウンロード',
    login: 'ログイン',
    logout: 'ログアウト',
    heroTag: 'AIアプリ全品 100円均一ショップ',
    heroTitle1: '一人で使うには勿体ない！',
    heroTitleHighlight: 'アプリ 100円ショップ',
    heroDesc: '背景除去ツールからPDF AI要約機、自動化ツールまで！必要なアプリを100円で永久ダウンロード。',
    btnExplore: 'アプリを探してダウンロード',
    btnAbout: '100円ショップとは？',
    popularTitle: '人気アプリ 100円キュレーション',
    popularSub: 'MUST HAVE APPS',
    viewAll: 'すべてのアプリを見る',
    feature1Title: '100円 均一価格',
    feature1Desc: 'サブスクなし！すべてのアプリが100円の単品価格です。',
    feature2Title: 'AI生産性アップ',
    feature2Desc: 'AI技術を融合した検証済みのデスクトップ＆ウェブツール。',
    feature3Title: '永久所蔵＆安全決済',
    feature3Desc: '一度購入すればライセンスキー発行＆いつでも再ダウンロード可能。',
    faqTitle: 'Q. 100円決済後のダウンロード方法は？',
    faqDesc: '決済完了後、すぐにインストールファイルとライセンスキーがマイページに生成されます！',
    getAppBtn: '今すぐ100円でダウンロード',
    searchPlaceholder: 'アプリ名または機能を検索...',
    categoryAll: 'すべて',
    purchased: '購入済み',
    buyBtn: '100円で購入',
    payModalTitle: '100円 簡単決済',
    payModalSub: '安全ワンクリック決済で即時ダウンロード',
    paySuccessTitle: '決済完了！',
    paySuccessSub: 'アプリの購入が正常に完了しました。',
    myDownloadsTitle: 'マイ アプリダウンロード一覧',
    licenseKey: 'ライセンスキー',
    downloadFile: 'インストールファイルのダウンロード',
    priceTag: '100円',
  },
  ko: {
    brandTitle: '어플 100엔 샾',
    brandTagline: 'AI Apps at Just 100 Yen (₩1,000)',
    navHome: '홈',
    navApps: '어플 다운로드',
    navMyPage: '내 다운로드',
    login: '로그인',
    logout: '로그아웃',
    heroTag: 'AI 어플 전 상품 100엔(₩1,000) 숍',
    heroTitle1: '나 혼자 쓰기 아까워서 다 풀었다!',
    heroTitleHighlight: '어플 100엔 샾',
    heroDesc: '배경 제거 툴부터 PDF AI 요약기, 자동화 스크립트까지! 필요한 어플을 100엔(약 ₩1,000)에 다운로드하세요.',
    btnExplore: '어플 둘러보고 다운로드',
    btnAbout: '어플 100엔 샾이란?',
    popularTitle: '인기 어플 100엔 숍 큐레이션',
    popularSub: 'MUST HAVE APPS',
    viewAll: '전체 어플 둘러보기',
    feature1Title: '100엔(₩1,000) 균일가',
    feature1Desc: '구독료 없이 딱 100엔 단일 가격으로 모든 어플을 제공합니다.',
    feature2Title: 'AI 기반 높은 생산성',
    feature2Desc: 'AI 기술을 결합하여 제작한 검증된 경량 유틸리티 프로그램.',
    feature3Title: '평생 소장 & 안전 결제',
    feature3Desc: '한 번 결제하면 전용 라이선스 키 발급 및 마이페이지 재다운로드.',
    faqTitle: 'Q. 100엔 결제 후 어떻게 다운로드 받나요?',
    faqDesc: '결제 완료 즉시 설치 파일 다운로드 링크와 전용 라이선스 키가 마이페이지에 생성됩니다!',
    getAppBtn: '지금 100엔으로 어플 다운받기',
    searchPlaceholder: '어플 이름 또는 기능 검색...',
    categoryAll: '전체',
    purchased: '구매 완료',
    buyBtn: '100엔 받기',
    payModalTitle: '100엔 간편 결제',
    payModalSub: '안전하고 원클릭으로 결제 후 즉시 다운로드',
    paySuccessTitle: '결제 및 구매 완료!',
    paySuccessSub: '어플리케이션 결제가 성공적으로 완료되었습니다.',
    myDownloadsTitle: '내 어플 다운로드 목록',
    licenseKey: '라이선스 키',
    downloadFile: '설치/실행 파일 다운로드',
    priceTag: '100엔 (₩1,000)',
  },
  en: {
    brandTitle: 'App $1 Dollar Shop',
    brandTagline: 'AI Apps at Just $1 Dollar',
    navHome: 'Home',
    navApps: 'Apps Download',
    navMyPage: 'My Downloads',
    login: 'Login',
    logout: 'Logout',
    heroTag: 'AI Apps at Flat $1 Dollar',
    heroTitle1: 'Too Good to Keep to Myself!',
    heroTitleHighlight: 'App $1 Dollar Shop',
    heroDesc: 'From AI Background Removers to PDF Summarizers & Automation tools! Get lifetime access for just $1.',
    btnExplore: 'Explore & Download Apps',
    btnAbout: 'What is $1 Shop?',
    popularTitle: 'Popular $1 Apps Curation',
    popularSub: 'MUST HAVE APPS',
    viewAll: 'View All Apps',
    feature1Title: '$1 Flat Price',
    feature1Desc: 'No subscriptions! All utility apps available at just $1.00.',
    feature2Title: 'Boost AI Productivity',
    feature2Desc: 'Tested lightweight desktop & web tools powered by AI.',
    feature3Title: 'Lifetime License & Safe Pay',
    feature3Desc: 'Pay once, get your unique license key, and re-download anytime.',
    faqTitle: 'Q. How do I download after $1 payment?',
    faqDesc: 'Right after payment, your download link and unique license key are generated in My Downloads!',
    getAppBtn: 'Download Now for $1',
    searchPlaceholder: 'Search app name or features...',
    categoryAll: 'All',
    purchased: 'Purchased',
    buyBtn: 'Get for $1',
    payModalTitle: '$1 Easy Checkout',
    payModalSub: 'Secure 1-click payment and instant download',
    paySuccessTitle: 'Payment Successful!',
    paySuccessSub: 'Your app purchase has been completed.',
    myDownloadsTitle: 'My Downloaded Apps',
    licenseKey: 'License Key',
    downloadFile: 'Download Installer / App',
    priceTag: '$1.00 USD',
  },
};

interface LanguageContextType {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  t: TranslationSet;
  formatPrice: (app: AppItem) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ja'); // 기본 일본어 100엔
  const [currency, setCurrency] = useState<Currency>('JPY');

  useEffect(() => {
    const savedLang = localStorage.getItem('app100yen_lang') as Language;
    if (savedLang && ['ja', 'ko', 'en'].includes(savedLang)) {
      setLanguageState(savedLang);
      if (savedLang === 'ja') setCurrency('JPY');
      if (savedLang === 'ko') setCurrency('KRW');
      if (savedLang === 'en') setCurrency('USD');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app100yen_lang', lang);
    if (lang === 'ja') setCurrency('JPY');
    if (lang === 'ko') setCurrency('KRW');
    if (lang === 'en') setCurrency('USD');
  };

  const formatPrice = (app: AppItem): string => {
    if (currency === 'JPY') return `${app.priceJpy}円`;
    if (currency === 'KRW') return `₩${app.priceKrw.toLocaleString()}`;
    return `$${app.priceUsd.toFixed(2)}`;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        currency,
        setLanguage,
        t: TRANSLATIONS[language],
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
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

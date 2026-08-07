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
  catalogBadge: string;
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
  categoryAll: string;
  categoryMobile: string;
  categoryAi: string;
  categoryDesign: string;
  categoryDev: string;
  categoryAuto: string;
  categoryUtil: string;
  
  // MyPage
  resetTestPurchases: string;
  purchasedAppsTotal: string;
  proMember: string;

  // Upload App Modal
  uploadModalTitle: string;
  uploadModalSub: string;
  uploadModalEditTitle: string;
  uploadModalEditSub: string;
  thumbnailLabel: string;
  thumbnailDropText: string;
  thumbnailAutoNotice: string;
  appNameLabel: string;
  appNamePlaceholder: string;
  categoryLabel: string;
  priceAndRevenueLabel: string;
  revenueShareText: string;
  supportedOSLabel: string;
  shortDescLabel: string;
  shortDescPlaceholder: string;
  fullDescLabel: string;
  fullDescPlaceholder: string;
  usageGuideLabel: string;
  usageGuidePlaceholder: string;
  fileUploadLabel: string;
  fileUploadDropText: string;
  cancelBtn: string;
  submitUploadBtn: string;
  submitSaveBtn: string;

  // App Detail Modal
  appIntroTitle: string;
  keyFeaturesTitle: string;
  usageGuideTitle: string;
  guaranteeTitle: string;
  guaranteeDesc: string;
  closeBtn: string;
  editBtn: string;
  deleteBtn: string;
  downloadNowBtn: string;

  // Footer
  footerDesc: string;
  footerTrustHeader: string;
  footerTrust1: string;
  footerTrust2: string;
  footerCategoryHeader: string;
  footerCategory1: string;
  footerCategory2: string;
  footerCategory3: string;
  footerCopyright: string;
}

const translations: Record<Language, TranslationSet> = {
  ja: {
    brandTitle: 'アプリ 100円ショップ',
    brandTagline: 'AI Apps at Just 100 Yen',
    navApps: 'アプリ一覧',
    navMyPage: 'マイダウンロード',
    login: 'ログイン',
    logout: 'ログアウト',
    userDefaultName: '会員',
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
    catalogBadge: '100円一律デジタルアプリストア',
    catalogTitle: 'アプリ一覧',
    catalogSubtitle: '100円ですぐにダウンロード可能な高品質ユーティリティラインナップです。',
    searchPlaceholder: 'アプリ名または機能を検索...',
    buyBtn: '100円で購入',
    purchasedLabel: '購入済み',
    downloadFile: 'インストールファイルのダウンロード',
    licenseKey: 'ライセンスキー',
    ratingLabel: '評価',
    downloadCountLabel: 'ダウンロード',
    downloadCountSuffix: '回',
    categoryAll: 'すべて',
    categoryMobile: 'モバイルアプリ',
    categoryAi: 'AI生産性',
    categoryDesign: 'デザイン＆メディア',
    categoryDev: '開発＆ツール',
    categoryAuto: '自動化',
    categoryUtil: 'ユーティリティ',
    
    // MyPage
    resetTestPurchases: '🔄 履歴リセット',
    purchasedAppsTotal: '保有アプリ数',
    proMember: 'PROメンバー',

    // Upload App Modal
    uploadModalTitle: '新規スマホ/PCアプリ登録',
    uploadModalSub: '100円ショップに新しいアプリを登録して公開します',
    uploadModalEditTitle: 'アプリ情報の編集',
    uploadModalEditSub: '登録済みアプリの情報と説明書を編集します',
    thumbnailLabel: 'アプリの代表サムネイル画像 (任意)',
    thumbnailDropText: 'クリックまたはドラッグして画像を選択 (.PNG, .JPG, .WebP)',
    thumbnailAutoNotice: '※画像をアップロードしない場合、カテゴリに合った画像が自動設定されます。',
    appNameLabel: 'アプリ名',
    appNamePlaceholder: '例: One Month\'s Todo / スマホカレンダー Pro',
    categoryLabel: 'カテゴリ',
    priceAndRevenueLabel: '販売価格＆収益配分 (手数料10%)',
    revenueShareText: '売上の90%を開発者に還元 / プラットフォーム手数料10%',
    supportedOSLabel: '対応OS・端末選択',
    shortDescLabel: 'アプリの一行紹介',
    shortDescPlaceholder: 'アプリのコア機能や特徴を一行で説明...',
    fullDescLabel: 'アプリの詳細紹介',
    fullDescPlaceholder: 'アプリの詳細な特徴や紹介文を入力してください...',
    usageGuideLabel: 'アプリの使い方・ガイド (使用説明)',
    usageGuidePlaceholder: 'ユーザーがアプリを起動して使用する手順やガイドを入力してください...',
    fileUploadLabel: 'アプリ実行/インストールファイルのアップロード (.APK, .IPA, .ZIP)',
    fileUploadDropText: 'APK、IPA、ZIPファイルをアップロードまたはクリックしてください',
    cancelBtn: 'キャンセル',
    submitUploadBtn: '100円アプリとして登録',
    submitSaveBtn: 'アプリ情報を保存',

    // App Detail Modal
    appIntroTitle: 'アプリケーション紹介',
    keyFeaturesTitle: '主なコア機能',
    usageGuideTitle: 'アプリの使い方・ガイド (How to Use)',
    guaranteeTitle: '100%無制限永久ライセンス保証',
    guaranteeDesc: 'たった一度の100円購入で永久所有および生涯無料アップデートを提供します。',
    closeBtn: '閉じる',
    editBtn: '編集',
    deleteBtn: '削除',
    downloadNowBtn: 'ダウンロードする',

    // Footer
    footerDesc: 'AI技術で丁寧に開発された高品質ユーティリティ＆生産性アプリを、誰でも気軽に100円でお得に入手できるマーケットプレイスです。',
    footerTrustHeader: '安心決済＆サービス',
    footerTrust1: '100円一律定額制 (追加料金なし)',
    footerTrust2: '即時ダウンロード＆無制限アップデート',
    footerCategoryHeader: 'カテゴリ',
    footerCategory1: 'AI生産性ツール',
    footerCategory2: 'デザイン＆メディア',
    footerCategory3: '自動化ユーティリティ',
    footerCopyright: '© 2026 アプリ 100円ショップ (100-Yen App Shop). All rights reserved.',
  },
  ko: {
    brandTitle: '어플 100엔 샾',
    brandTagline: 'AI Apps at Just 100 Yen',
    navApps: '어플 다운로드',
    navMyPage: '마이 다운로드',
    login: '로그인',
    logout: '로그아웃',
    userDefaultName: '일반 회원',
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
    catalogBadge: '100엔 정찰제 디지털 앱 스토어',
    catalogTitle: '어플 카탈로그',
    catalogSubtitle: '100엔으로 즉시 다운로드 가능한 고품질 유틸리티 어플 라인업입니다.',
    searchPlaceholder: '어플 이름 또는 기능 검색...',
    buyBtn: '1000원에 구매',
    purchasedLabel: '구매 완료',
    downloadFile: '설치 파일 다운로드',
    licenseKey: '라이선스 키',
    ratingLabel: '평점',
    downloadCountLabel: '다운로드',
    downloadCountSuffix: '회',
    categoryAll: '전체',
    categoryMobile: '모바일 앱',
    categoryAi: 'AI 생산성',
    categoryDesign: '디자인 & 미디어',
    categoryDev: '개발 & 툴',
    categoryAuto: '자동화',
    categoryUtil: '유틸리티',
    
    // MyPage
    resetTestPurchases: '🔄 구매 내역 리셋',
    purchasedAppsTotal: '보유 어플 수',
    proMember: 'PRO 멤버',

    // Upload App Modal
    uploadModalTitle: '신규 핸드폰 / PC 어플 등록',
    uploadModalSub: '100엔 마켓에 새로운 어플을 등록하여 출시합니다',
    uploadModalEditTitle: '어플 정보 수정',
    uploadModalEditSub: '등록된 어플의 정보와 설명서를 수정합니다',
    thumbnailLabel: '어플 대표 썸네일 이미지 (선택)',
    thumbnailDropText: '클릭 또는 드래그하여 이미지 선택 (.PNG, .JPG, .WebP)',
    thumbnailAutoNotice: '※ 이미지를 첨부하지 않으면 카테고리에 어울리는 고급 이미지가 자동 지정됩니다.',
    appNameLabel: '어플 이름',
    appNamePlaceholder: '예: One Month\'s Todo / 스마트 캘린더 Pro',
    categoryLabel: '카테고리',
    priceAndRevenueLabel: '판매 가격 & 수익 배분 (수수료 10%)',
    revenueShareText: '판매 금액의 90% 개발자 정산 / 플랫폼 수수료 10%',
    supportedOSLabel: '지원 기기 / OS 선택',
    shortDescLabel: '어플 한 줄 소개',
    shortDescPlaceholder: '어플의 핵심 기능 및 특징 한 줄 설명...',
    fullDescLabel: '어플 상세 소개 (어플리케이션 소개)',
    fullDescPlaceholder: '어플리케이션에 대한 자세한 소개 및 특징을 입력하세요...',
    usageGuideLabel: '어플 사용 방법 및 안내 가이드 (사용 설명)',
    usageGuidePlaceholder: '사용자가 어플을 실행하고 사용하는 자세한 순서나 가이드를 입력하세요...',
    fileUploadLabel: '어플 실행/설치 파일 업로드 (.APK, .IPA, .ZIP)',
    fileUploadDropText: 'APK, IPA, ZIP 파일 업로드 또는 클릭하세요',
    cancelBtn: '취소',
    submitUploadBtn: '100엔 어플 등록하기',
    submitSaveBtn: '어플 정보 저장하기',

    // App Detail Modal
    appIntroTitle: '어플리케이션 소개',
    keyFeaturesTitle: '주요 핵심 기능',
    usageGuideTitle: '어플 사용 방법 및 안내 (How to Use)',
    guaranteeTitle: '100% 무제한 영구 라이선스 보장',
    guaranteeDesc: '단 한 번 100엔 결제로 평생 소장 및 평생 무료 업데이트를 제공합니다.',
    closeBtn: '닫기',
    editBtn: '수정',
    deleteBtn: '삭제',
    downloadNowBtn: '다운로드 하기',

    // Footer
    footerDesc: 'AI 기술로 정성껏 개발된 고품질 유틸리티 & 생산성 어플리케이션을 누구나 부담 없이 100엔(₩1,000)에 득템할 수 있는 마켓플레이스입니다.',
    footerTrustHeader: '안심 결제 & 서비스',
    footerTrust1: '100엔 단일 정가제 (추가금 X)',
    footerTrust2: '즉시 다운로드 & 무제한 업데이트',
    footerCategoryHeader: '카테고리',
    footerCategory1: 'AI 생산성 도구',
    footerCategory2: '디자인 & 미디어',
    footerCategory3: '자동화 유틸리티',
    footerCopyright: '© 2026 어플 100엔 샾 (100-Yen App Shop). All rights reserved.',
  },
  en: {
    brandTitle: 'App $1 Shop',
    brandTagline: 'AI Apps at Just $1 USD',
    navApps: 'Catalog',
    navMyPage: 'My Downloads',
    login: 'Login',
    logout: 'Logout',
    userDefaultName: 'Member',
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
    catalogBadge: 'Flat $1.00 Digital App Store',
    catalogTitle: 'App Catalog',
    catalogSubtitle: 'High quality utility apps available for download at flat $1.',
    searchPlaceholder: 'Search app title or features...',
    buyBtn: 'Buy for $1',
    purchasedLabel: 'Purchased',
    downloadFile: 'Download Installer File',
    licenseKey: 'License Key',
    ratingLabel: 'Rating',
    downloadCountLabel: 'Downloads',
    downloadCountSuffix: ' downloads',
    categoryAll: 'All',
    categoryMobile: 'Mobile App',
    categoryAi: 'AI Productivity',
    categoryDesign: 'Design & Media',
    categoryDev: 'Dev & Tools',
    categoryAuto: 'Automation',
    categoryUtil: 'Utilities',

    // MyPage
    resetTestPurchases: '🔄 Reset Purchases',
    purchasedAppsTotal: 'Owned Apps',
    proMember: 'PRO Member',

    // Upload App Modal
    uploadModalTitle: 'Register New Mobile/PC App',
    uploadModalSub: 'Publish your new application on $1 App Shop',
    uploadModalEditTitle: 'Edit App Details',
    uploadModalEditSub: 'Update app details and manual instructions',
    thumbnailLabel: 'App Thumbnail Cover Image (Optional)',
    thumbnailDropText: 'Click or drag image file (.PNG, .JPG, .WebP)',
    thumbnailAutoNotice: '※ If no image is provided, a matching category image is assigned automatically.',
    appNameLabel: 'App Name',
    appNamePlaceholder: 'e.g. One Month\'s Todo / Smart Calendar Pro',
    categoryLabel: 'Category',
    priceAndRevenueLabel: 'Price & Revenue Share (10% Fee)',
    revenueShareText: '90% revenue payout to creator / 10% platform fee',
    supportedOSLabel: 'Supported Devices / OS',
    shortDescLabel: 'Short Summary',
    shortDescPlaceholder: 'One-line core feature summary...',
    fullDescLabel: 'Full Description',
    fullDescPlaceholder: 'Provide detailed features and overview of your app...',
    usageGuideLabel: 'Usage Manual & Instructions (How to Use)',
    usageGuidePlaceholder: 'Provide step-by-step instructions for users to run your app...',
    fileUploadLabel: 'Upload Executable / Installer (.APK, .IPA, .ZIP)',
    fileUploadDropText: 'Drop or click to upload APK, IPA, or ZIP files',
    cancelBtn: 'Cancel',
    submitUploadBtn: 'Publish for $1 App',
    submitSaveBtn: 'Save App Info',

    // App Detail Modal
    appIntroTitle: 'Application Overview',
    keyFeaturesTitle: 'Key Features',
    usageGuideTitle: 'Usage Guide & Instructions (How to Use)',
    guaranteeTitle: '100% Lifetime License Guarantee',
    guaranteeDesc: 'Get lifetime access and free updates with a single $1.00 USD purchase.',
    closeBtn: 'Close',
    editBtn: 'Edit',
    deleteBtn: 'Delete',
    downloadNowBtn: 'Download Now',

    // Footer
    footerDesc: 'A marketplace where anyone can get high-quality AI utility & productivity apps for flat 100 Yen ($1.00 USD).',
    footerTrustHeader: 'Secure Payment & Service',
    footerTrust1: 'Flat 100 Yen Price (No hidden fees)',
    footerTrust2: 'Instant Download & Unlimited Updates',
    footerCategoryHeader: 'Categories',
    footerCategory1: 'AI Productivity Tools',
    footerCategory2: 'Design & Media',
    footerCategory3: 'Automation Utilities',
    footerCopyright: '© 2026 App $1 Shop (100-Yen App Shop). All rights reserved.',
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
  const [language, setLanguage] = useState<Language>('ja');

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

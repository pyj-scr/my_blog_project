'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppItem } from '@/types/app';

export type Language = 'ja' | 'ko' | 'en';

export interface TranslationSet {
  // Navigation & Header
  brandTitle: string;
  brandTagline: string;
  navApps: string;
  navMyPage: string;
  login: string;
  logout: string;
  userDefaultName: string;

  // Hero & Catalog
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

  // Apps Catalog Page
  catalogBadge: string;
  catalogTitle: string;
  catalogSubtitle: string;
  searchPlaceholder: string;

  // App Cards & Buttons
  buyBtn: string;
  purchasedLabel: string;
  downloadFile: string;
  licenseKey: string;
  ratingLabel: string;
  downloadCountLabel: string;
  downloadCountSuffix: string;

  // Categories
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
  uploadImageBtn: string;
  resetDefaultImageBtn: string;
  thumbnailTitle: string;
  thumbnailDesc: string;
  appCreatedSuccessTitle: string;
  appCreatedSuccessDesc: string;
  appUpdatedSuccessTitle: string;
  appUpdatedSuccessDesc: string;

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
    userDefaultName: '会員様',
    heroTag: '100円定額制 デジタル アプリストア',
    heroTitle1: '一人で使うには惜しすぎる！',
    heroTitleHighlight: 'アプリ 100円ショップ',
    heroDesc: '画像背景削除からPDF AI要約機、自動化ツールまで！たった100円で一生使える高精度アプリを今すぐGETしてください。',
    btnExplore: '100円アプリを探してダウンロード',
    trustBadge1Title: '100円一律定額制',
    trustBadge1Sub: '負担ゼロの超特価',
    trustBadge2Title: 'ワンクリック即時起動',
    trustBadge2Sub: 'インストール不要ウェブアプリ',
    trustBadge3Title: '生涯無料アップデート',
    trustBadge3Sub: '1度購入で永久所有',
    trustBadge4Title: 'PC・スマホ両対応',
    trustBadge4Sub: 'Python・モバイルパッケージ',
    popularCatalogTitle: '🔥 大人気 100円アプリ ラインナップ',
    popularCatalogSub: '100円で即時ダウンロード可能な高品質ユーティリティアプリラインナップです。',
    viewAllApps: 'すべてのアプリを見る',
    catalogBadge: '100円 定額制 デジタル アプリストア',
    catalogTitle: 'アプリ カタログ',
    catalogSubtitle: '100円で即時ダウンロード可能な高品質ユーティリティアプリラインナップです。',
    searchPlaceholder: 'アプリ名または機能で検索...',
    buyBtn: '100円で購入',
    purchasedLabel: '購入済み',
    downloadFile: 'アプリを起動する',
    licenseKey: 'ライセンスキー',
    ratingLabel: '評価',
    downloadCountLabel: 'ダウンロード',
    downloadCountSuffix: '回',
    categoryAll: '全体',
    categoryMobile: 'モバイル アプリ',
    categoryAi: 'AI 生産性',
    categoryDesign: 'デザイン & ミディア',
    categoryDev: '開発 & ツール',
    categoryAuto: '自動化',
    categoryUtil: 'ユーティリティ',

    // MyPage
    resetTestPurchases: '🔄 購入履歴のリセット (テスト用)',
    purchasedAppsTotal: '保有中のアプリ',
    proMember: 'PRO 会員',

    // Upload App Modal
    uploadModalTitle: '新規スマホ/PCアプリ登録',
    uploadModalSub: '100円ショップに新しいアプリを登録して公開します',
    uploadModalEditTitle: 'アプリ情報の編集',
    uploadModalEditSub: '登録済みアプリの情報と説明書を編集します',
    thumbnailLabel: 'アプリ カバー サムネイル画像 (選択)',
    thumbnailDropText: '画像ファイル(.PNG, .JPG, .WebP)をドロップまたは選択してください',
    thumbnailAutoNotice: '※ 画像未登録時はカテゴリ別高品質デフォルト画像が自動割り当てられます。',
    appNameLabel: 'アプリ名',
    appNamePlaceholder: '例: One Month\'s Todo (1ヶ月ToDoカレンダー)',
    categoryLabel: 'カテゴリ',
    priceAndRevenueLabel: '販売価格 & 収益配分 (手数料 10%)',
    revenueShareText: '販売金額の90%をクリエイター精算 / プラットフォーム手数料10%',
    supportedOSLabel: '対応機器 / OS 選択',
    shortDescLabel: 'アプリの一言紹介',
    shortDescPlaceholder: 'アプリの核心機能と特徴を一言で説明...',
    fullDescLabel: 'アプリの詳細紹介',
    fullDescPlaceholder: 'アプリの詳細な機能や特徴を入力してください...',
    usageGuideLabel: 'アプリの使い方・ガイド (How to Use)',
    usageGuidePlaceholder: 'ユーザーがアプリを起動して使用する手順やガイドを入力してください...',
    fileUploadLabel: 'アプリ実行/インストールファイルのアップロード (.APK, .IPA, .ZIP)',
    fileUploadDropText: 'APK、IPA、ZIPファイルをアップロードまたはクリックしてください',
    cancelBtn: 'キャンセル',
    submitUploadBtn: '100円アプリとして登録',
    submitSaveBtn: 'アプリ情報を保存',
    uploadImageBtn: 'カスタム画像アップロード',
    resetDefaultImageBtn: 'デフォルトに戻す',
    thumbnailTitle: 'アプリ カバー画像 (サムネイル)',
    thumbnailDesc: 'アプリのカードや詳細画面に表示されるカバー画像です。未設定時はカテゴリ別の高品質画像が自動適用されます。',
    appCreatedSuccessTitle: 'アプリの登録が完了しました！',
    appCreatedSuccessDesc: 'アプリが正常に登録され、世界中のユーザーに即時公開されました。',
    appUpdatedSuccessTitle: 'アプリ情報の更新が完了しました！',
    appUpdatedSuccessDesc: '変更された情報が正常に保存され、世界中に反映されました。',

    // App Detail Modal
    appIntroTitle: 'アプリケーション紹介',
    keyFeaturesTitle: '主なコア機能',
    usageGuideTitle: 'アプリの使い方・ガイド (How to Use)',
    guaranteeTitle: '100%無制限永久ライセンス保証',
    guaranteeDesc: 'たった一度の100円購入で永久所有および生涯無料アップデートを提供します。',
    closeBtn: '閉じる',
    editBtn: '編集',
    deleteBtn: '削除',
    downloadNowBtn: 'ダウンロード',

    // Footer
    footerDesc: 'AI技術で丁寧に開発された高品質ユーティリティ＆生産性アプリを誰でも気軽に100円(₩1,000)でGETできるマーケットプレイスです。',
    footerTrustHeader: '安心決済 & サービス',
    footerTrust1: '100円単一定価制 (追加料金なし)',
    footerTrust2: '即時ダウンロード & 無制限アップデート',
    footerCategoryHeader: 'カテゴリ',
    footerCategory1: 'AI生産性ツール',
    footerCategory2: 'デザイン & ミディア',
    footerCategory3: '自動化ユーティリティ',
    footerCopyright: '© 2026 アプリ 100円ショップ (100-Yen App Shop). All rights reserved.',
  },
  ko: {
    brandTitle: '어플 100엔 샵',
    brandTagline: 'AI Apps at Just 100 Yen',
    navApps: '어플 카탈로그',
    navMyPage: '마이 다운로드',
    login: '로그인',
    logout: '로그아웃',
    userDefaultName: '회원님',
    heroTag: '100엔 정찰제 디지털 앱 스토어',
    heroTitle1: '혼자 쓰기 너무 아까운!',
    heroTitleHighlight: '어플 100엔 샵',
    heroDesc: '누끼 따기 이미지 배경 제거부터 PDF AI 요약기, 자동화 툴까지! 단돈 100엔으로 평생 쓰는 고성능 어플을 지금 득템하세요.',
    btnExplore: '100엔 어플 찾아보고 다운로드',
    trustBadge1Title: '100엔 일률 정찰제',
    trustBadge1Sub: '부담 제로 초특가',
    trustBadge2Title: '원터치 즉시 실행',
    trustBadge2Sub: '무설치 웹 어플리케이션',
    trustBadge3Title: '평생 무료 업데이트',
    trustBadge3Sub: '1회 결제로 영구 소장',
    trustBadge4Title: 'PC·모바일 완벽 지원',
    trustBadge4Sub: 'Python·모바일 패키지',
    popularCatalogTitle: '🔥 인기 폭발 100엔 어플 라인업',
    popularCatalogSub: '100엔으로 즉시 다운로드 가능한 고품질 유틸리티 어플 라인업입니다.',
    viewAllApps: '모든 어플 카탈로그 보기',
    catalogBadge: '100엔 정찰제 디지털 앱 스토어',
    catalogTitle: '어플 카탈로그',
    catalogSubtitle: '100엔으로 즉시 다운로드 가능한 고품질 유틸리티 어플 라인업입니다.',
    searchPlaceholder: '어플 이름 또는 기능 검색...',
    buyBtn: '1,000원 결제',
    purchasedLabel: '구매 완료',
    downloadFile: '앱 실행하기',
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
    resetTestPurchases: '🔄 구매 내역 초기화 (테스트용)',
    purchasedAppsTotal: '보유 중인 어플',
    proMember: 'PRO 회원',

    // Upload App Modal
    uploadModalTitle: '신규 핸드폰 / PC 어플 등록',
    uploadModalSub: '100엔 마켓에 새로운 어플을 등록하여 출시합니다',
    uploadModalEditTitle: '어플 정보 수정',
    uploadModalEditSub: '등록된 어플의 정보와 설명서를 수정합니다',
    thumbnailLabel: '어플 커버 썸네일 이미지 (선택)',
    thumbnailDropText: '이미지 파일(.PNG, .JPG, .WebP)을 드래그하거나 선택하세요',
    thumbnailAutoNotice: '※ 이미지 미등록 시 카테고리별 고품질 기본 이미지가 자동 할당됩니다.',
    appNameLabel: '어플 이름',
    appNamePlaceholder: '예: One Month\'s Todo (원 먼스 투두)',
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
    uploadImageBtn: '커스텀 이미지 업로드',
    resetDefaultImageBtn: '기본 이미지로 리셋',
    thumbnailTitle: '어플 커버 이미지 (썸네일)',
    thumbnailDesc: '어플 카탈로그 카드 및 상세 모달에 표시될 이미지입니다. 미설정 시 카테고리별 고품질 대표 이미지가 적용됩니다.',
    appCreatedSuccessTitle: '어플 등록이 완료되었습니다!',
    appCreatedSuccessDesc: '어플이 성공적으로 등록되어 전 세계 사용자에게 즉시 공개되었습니다.',
    appUpdatedSuccessTitle: '어플 정보 수정이 완료되었습니다!',
    appUpdatedSuccessDesc: '수정된 정보가 성공적으로 저장되어 전 세계에 반영되었습니다.',

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
    downloadFile: 'Launch App',
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
    uploadImageBtn: 'Upload Custom Image',
    resetDefaultImageBtn: 'Reset Default Image',
    thumbnailTitle: 'App Cover Image (Thumbnail)',
    thumbnailDesc: 'Cover image shown in app cards and details modal. If unset, high-quality category default image applies.',
    appCreatedSuccessTitle: 'App Registered Successfully!',
    appCreatedSuccessDesc: 'Your application has been published globally to all users.',
    appUpdatedSuccessTitle: 'App Details Updated!',
    appUpdatedSuccessDesc: 'Your updated app information has been saved globally.',

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

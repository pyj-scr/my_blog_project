export type AppCategory = '전체' | '모바일 앱' | 'AI 생산성' | '디자인 & 미디어' | '개발 & 툴' | '자동화' | '유틸리티';

export type Language = 'ja' | 'ko' | 'en';
export type Currency = 'JPY' | 'KRW' | 'USD';

export type OSType = 'Windows' | 'Mac' | 'Web' | 'Chrome Extension' | 'Android' | 'iOS' | 'Mobile';

export interface AppItem {
  id: string;
  title: string;
  titleJa?: string;
  titleEn?: string;
  shortDescription: string;
  shortDescriptionJa?: string;
  shortDescriptionEn?: string;
  fullDescription: string;
  fullDescriptionJa?: string;
  fullDescriptionEn?: string;
  priceJpy: number; // 100 JPY
  priceKrw: number; // 1,000 KRW
  priceUsd: number; // $1 USD
  category: AppCategory;
  version: string;
  size: string;
  os: OSType[];
  rating: number;
  reviewsCount: number;
  downloads: number;
  thumbnailUrl: string;
  features: string[];
  featuresJa?: string[];
  featuresEn?: string[];
  usageGuide?: string;
  usageGuideJa?: string;
  usageGuideEn?: string;
  downloadUrl: string;
  isPopular?: boolean;
  isNew?: boolean;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface PurchaseItem {
  id: string;
  appId: string;
  appTitle: string;
  priceJpy: number;
  priceFormatted: string;
  purchasedAt: string;
  licenseKey: string;
  downloadUrl: string;
}

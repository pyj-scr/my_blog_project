export type AppCategory = 
  | '전체'
  | '모바일 앱'
  | 'AI 생산성' 
  | '디자인 & 미디어' 
  | '개발 & 툴' 
  | '자동화' 
  | '유틸리티';

export type Language = 'ko' | 'ja' | 'en';

export type OSType = 'Windows' | 'Mac' | 'Linux' | 'Web' | 'Chrome Extension' | 'Android' | 'iOS';

export interface AppItem {
  id: string;
  title: string;
  titleKo?: string;
  titleJa?: string;
  titleEn?: string;
  shortDescription: string;
  shortDescriptionKo?: string;
  shortDescriptionJa?: string;
  shortDescriptionEn?: string;
  fullDescription: string;
  fullDescriptionKo?: string;
  fullDescriptionJa?: string;
  fullDescriptionEn?: string;
  priceJpy: number;
  priceKrw: number;
  priceUsd: number;
  category: AppCategory;
  version: string;
  size: string;
  os: OSType[];
  rating: number;
  reviewsCount: number;
  downloads: number;
  thumbnailUrl: string;
  features: string[];
  featuresKo?: string[];
  featuresJa?: string[];
  featuresEn?: string[];
  usageGuide?: string;
  usageGuideKo?: string;
  usageGuideJa?: string;
  usageGuideEn?: string;
  downloadUrl: string;
  isPopular?: boolean;
  isNew?: boolean;
  updatedAt: string;
}

export interface UserPurchase {
  id: string;
  appId: string;
  appTitle: string;
  priceJpy?: number;
  priceFormatted?: string;
  purchasedAt: string;
  licenseKey: string;
  userName?: string;
  userEmail?: string;
  downloadUrl?: string;
  sessionId?: string;
}

export type PurchaseItem = UserPurchase;

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isPro?: boolean;
}

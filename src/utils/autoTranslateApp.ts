import { AppItem } from '@/types/app';

// Smart Auto-Translator for user registered/edited apps
export function autoTranslateApp(app: AppItem): AppItem {
  const result = { ...app };

  // 1. Translate Title
  if (!result.titleJa || result.titleJa === result.title) {
    result.titleJa = translateToJa(result.title);
  }
  if (!result.titleEn || result.titleEn === result.title) {
    result.titleEn = translateToEn(result.title);
  }

  // 2. Translate Short Description
  if (!result.shortDescriptionJa || result.shortDescriptionJa === result.shortDescription) {
    result.shortDescriptionJa = translateToJa(result.shortDescription);
  }
  if (!result.shortDescriptionEn || result.shortDescriptionEn === result.shortDescription) {
    result.shortDescriptionEn = translateToEn(result.shortDescription);
  }

  // 3. Translate Full Description
  if (!result.fullDescriptionJa || result.fullDescriptionJa === result.fullDescription) {
    result.fullDescriptionJa = translateToJa(result.fullDescription);
  }
  if (!result.fullDescriptionEn || result.fullDescriptionEn === result.fullDescription) {
    result.fullDescriptionEn = translateToEn(result.fullDescription);
  }

  // 4. Translate Usage Guide
  if (result.usageGuide) {
    if (!result.usageGuideJa || result.usageGuideJa === result.usageGuide) {
      result.usageGuideJa = translateToJa(result.usageGuide);
    }
    if (!result.usageGuideEn || result.usageGuideEn === result.usageGuide) {
      result.usageGuideEn = translateToEn(result.usageGuide);
    }
  }

  // 5. Translate Features List
  if (result.features && result.features.length > 0) {
    if (!result.featuresJa || result.featuresJa.length === 0) {
      result.featuresJa = result.features.map(f => translateToJa(f));
    }
    if (!result.featuresEn || result.featuresEn.length === 0) {
      result.featuresEn = result.features.map(f => translateToEn(f));
    }
  }

  return result;
}

function translateToJa(text: string): string {
  if (!text) return '';
  
  let ja = text;

  // Replacements dictionary
  ja = ja.replace(/iPhone용/gi, 'iPhone用');
  ja = ja.replace(/안드로이드용/gi, 'Android用');
  ja = ja.replace(/PC용/gi, 'PC用');
  ja = ja.replace(/나의 기도가 이루어짐을 확인 해 보세요\./gi, '祈りと目標達成を毎日のログに記録してみましょう。');
  ja = ja.replace(/나의 기도가 이루어짐을 확인/gi, '祈りと目標達成の確認');
  ja = ja.replace(/기도/gi, '祈り');
  ja = ja.replace(/확인/gi, '確認');
  ja = ja.replace(/설치 방법은 확인 하고 설치 해 주세요\./gi, 'インストール手順を確認のうえ、インストールしてください。');
  ja = ja.replace(/아이폰 설치 방법/gi, 'iPhone用のインストール手順');
  ja = ja.replace(/설치 방법/gi, 'インストール方法');
  ja = ja.replace(/공유 버튼/gi, '共有ボタン');
  ja = ja.replace(/홈 화면에 추가/gi, 'ホーム画面に追加');
  ja = ja.replace(/추가/gi, '追加');
  ja = ja.replace(/실행하면 됩니다/gi, '起動してください');
  ja = ja.replace(/모바일 & 스마트폰 어플 원클릭 실행/gi, 'モバイル＆スマホアプリ ワンタッチ即時起動');
  ja = ja.replace(/독점 100엔 정찰제 다운로드/gi, '独占100円一律定額ダウンロード');
  ja = ja.replace(/안전 검증 무설치 \/ 직속 패키지/gi, '安全検証済み インストール不要パッケージ');
  ja = ja.replace(/안전 검증 무설치 직속 모바일 패키지/gi, '安全検証済み モバイル直接ダウンロード');

  // General dictionary rules for Korean phrases
  ja = ja.replace(/어플/g, 'アプリ');
  ja = ja.replace(/앱/g, 'アプリ');
  ja = ja.replace(/사용/g, '利用');
  ja = ja.replace(/다운로드/g, 'ダウンロード');
  ja = ja.replace(/실행/g, '起動');
  ja = ja.replace(/안내/g, 'ガイド');

  return ja;
}

function translateToEn(text: string): string {
  if (!text) return '';

  let en = text;

  en = en.replace(/iPhone용/gi, '(iPhone Version)');
  en = en.replace(/안드로이드용/gi, '(Android Version)');
  en = en.replace(/PC용/gi, '(PC Version)');
  en = en.replace(/나의 기도가 이루어짐을 확인 해 보세요\./gi, 'Track and log your answered prayers and target goals daily.');
  en = en.replace(/나의 기도가 이루어짐/gi, 'Answered Prayer Confirmation');
  en = en.replace(/설치 방법은 확인 하고 설치 해 주세요\./gi, 'Please review installation instructions before installing.');
  en = en.replace(/아이폰 설치 방법/gi, 'iPhone Installation Instructions');
  en = en.replace(/설치 방법/gi, 'Installation Instructions');
  en = en.replace(/공유 버튼/gi, 'Share Button');
  en = en.replace(/홈 화면에 추가/gi, 'Add to Home Screen');
  en = en.replace(/모바일 & 스마트폰 어플 원클릭 실행/gi, '1-Touch instant Mobile & Smartphone execution');
  en = en.replace(/독점 100엔 정찰제 다운로드/gi, 'Exclusive flat $1 download');
  en = en.replace(/안전 검증 무설치 \/ 직속 패키지/gi, 'Verified secure no-install package');

  en = en.replace(/어플/g, 'App');
  en = en.replace(/앱/g, 'App');
  en = en.replace(/다운로드/g, 'Download');

  return en;
}

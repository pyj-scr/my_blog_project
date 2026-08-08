import { AppItem } from '@/types/app';

// Check if text contains Korean characters (Hangul)
export function containsKorean(text?: string): boolean {
  if (!text) return false;
  return /[\u3131-\u318E\uAC00-\uD7A3]/.test(text);
}

// Check if text contains Japanese Hiragana, Katakana, or Kanji without Hangul
export function containsJapanese(text?: string): boolean {
  if (!text) return false;
  return /[\u3040-\u30ff]/.test(text) || (/[\u4e00-\u9faf]/.test(text) && !containsKorean(text));
}

// Universal Real-Time Translation API Fetcher
export async function translateTextDynamic(text: string, targetLang: 'ja' | 'en' | 'ko'): Promise<string> {
  if (!text || text.trim() === '') return text;

  try {
    // If in browser environment, route through server translation endpoint to avoid CORS
    if (typeof window !== 'undefined') {
      const res = await fetch(`/api/translate?text=${encodeURIComponent(text)}&targetLang=${targetLang}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.translatedText && data.translatedText.trim() !== '') {
          return postProcessTranslation(data.translatedText, targetLang);
        }
      }
    } else {
      // Server-side direct Google Translate API call
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.ok) {
        const data = await res.json();
        if (data && data[0] && Array.isArray(data[0])) {
          const translated = data[0].map((item: any) => item[0]).join('');
          if (translated && translated.trim() !== '') {
            return postProcessTranslation(translated, targetLang);
          }
        }
      }
    }
  } catch (err) {
    console.warn('Dynamic translate API failed, using fallback rule', err);
  }

  return fallbackTranslate(text, targetLang);
}

// Post-processing to enforce Natural Language Standard (Rule 1.2)
function postProcessTranslation(text: string, targetLang: 'ja' | 'en' | 'ko'): string {
  if (!text) return '';
  let result = text;

  if (targetLang === 'ja') {
    // Japanese Optimization
    result = result.replace(/祈禱|祈り/g, 'お祈り');
    result = result.replace(/私の祈り/g, '私のお祈り');
    result = result.replace(/（Android用）|\(Android用\)/g, '（Android用）');
  } else if (targetLang === 'ko') {
    // Korean Optimization
    result = result.replace(/私のお祈り|私の祈り/g, '나의 기도');
    result = result.replace(/お祈り/g, '기도');
    result = result.replace(/（Android用）|\(Android용\)|\(Android用\)/g, '(Android용)');
    result = result.replace(/（iPhone用）|\(iPhone用\)|\(iPhone専用\)/g, '(아이폰 전용)');
    result = result.replace(/（グループ用）|\(グループ用\)/g, '(그룹용)');
  } else if (targetLang === 'en') {
    // English Optimization
    result = result.replace(/私のお祈り|私の祈り|나의 기도|내기도/gi, 'My Prayer');
    result = result.replace(/お祈り|기도/gi, 'Prayer');
    result = result.replace(/（Android用）|\(Android용\)|\(Android用\)/gi, '(for Android)');
    result = result.replace(/（iPhone用）|\(iPhone用\)|\(iPhone専用\)|\(iPhone용\)/gi, '(iPhone Edition)');
    result = result.replace(/（グループ用）|\(グループ用\)|\(그룹용\)/gi, '(Group Edition)');
  }

  return result;
}

// Synchronous Fallback rules
function fallbackTranslate(text: string, targetLang: 'ja' | 'en' | 'ko'): string {
  if (targetLang === 'ja') return translateToJa(text);
  if (targetLang === 'en') return translateToEn(text);
  return translateToKo(text);
}

// Synchronous Auto-Translator for App Items
export function autoTranslateApp(app: AppItem): AppItem {
  const result = { ...app };

  const baseTitle = result.title;
  const baseShort = result.shortDescription;
  const baseFull = result.fullDescription || baseShort;
  const baseGuide = result.usageGuide || '';

  // Synchronous fallbacks
  if (!result.titleKo || containsJapanese(result.titleKo)) result.titleKo = translateToKo(baseTitle);
  if (!result.titleJa || containsKorean(result.titleJa)) result.titleJa = translateToJa(baseTitle);
  if (!result.titleEn || containsJapanese(result.titleEn) || containsKorean(result.titleEn)) result.titleEn = translateToEn(baseTitle);

  if (!result.shortDescriptionKo || containsJapanese(result.shortDescriptionKo)) result.shortDescriptionKo = translateToKo(baseShort);
  if (!result.shortDescriptionJa || containsKorean(result.shortDescriptionJa)) result.shortDescriptionJa = translateToJa(baseShort);
  if (!result.shortDescriptionEn || containsJapanese(result.shortDescriptionEn) || containsKorean(result.shortDescriptionEn)) result.shortDescriptionEn = translateToEn(baseShort);

  if (!result.fullDescriptionKo || containsJapanese(result.fullDescriptionKo)) result.fullDescriptionKo = translateToKo(baseFull);
  if (!result.fullDescriptionJa || containsKorean(result.fullDescriptionJa)) result.fullDescriptionJa = translateToJa(baseFull);
  if (!result.fullDescriptionEn || containsJapanese(result.fullDescriptionEn) || containsKorean(result.fullDescriptionEn)) result.fullDescriptionEn = translateToEn(baseFull);

  if (baseGuide) {
    if (!result.usageGuideKo || containsJapanese(result.usageGuideKo)) result.usageGuideKo = translateToKo(baseGuide);
    if (!result.usageGuideJa || containsKorean(result.usageGuideJa)) result.usageGuideJa = translateToJa(baseGuide);
    if (!result.usageGuideEn || containsJapanese(result.usageGuideEn) || containsKorean(result.usageGuideEn)) result.usageGuideEn = translateToEn(baseGuide);
  }

  if (result.features && result.features.length > 0) {
    if (!result.featuresKo || result.featuresKo.length === 0) result.featuresKo = result.features.map(f => translateToKo(f));
    if (!result.featuresJa || result.featuresJa.length === 0) result.featuresJa = result.features.map(f => translateToJa(f));
    if (!result.featuresEn || result.featuresEn.length === 0) result.featuresEn = result.features.map(f => translateToEn(f));
  }

  return result;
}

// Async enrichment for registered/edited apps to fetch 100% accurate API translation
export async function asyncTranslateApp(app: AppItem): Promise<AppItem> {
  const result = { ...app };

  const needsTranslationKo = (t?: string) => !t || t.trim().length <= 1 || containsJapanese(t);
  const needsTranslationEn = (t?: string) => !t || t.trim().length <= 1 || containsJapanese(t) || containsKorean(t);
  const needsTranslationJa = (t?: string) => !t || t.trim().length <= 1 || containsKorean(t);

  try {
    if (needsTranslationKo(result.titleKo)) result.titleKo = await translateTextDynamic(app.title, 'ko');
    if (needsTranslationJa(result.titleJa)) result.titleJa = await translateTextDynamic(app.title, 'ja');
    if (needsTranslationEn(result.titleEn)) result.titleEn = await translateTextDynamic(app.title, 'en');

    if (needsTranslationKo(result.shortDescriptionKo)) result.shortDescriptionKo = await translateTextDynamic(app.shortDescription, 'ko');
    if (needsTranslationJa(result.shortDescriptionJa)) result.shortDescriptionJa = await translateTextDynamic(app.shortDescription, 'ja');
    if (needsTranslationEn(result.shortDescriptionEn)) result.shortDescriptionEn = await translateTextDynamic(app.shortDescription, 'en');

    const baseFull = app.fullDescription || app.shortDescription;
    if (needsTranslationKo(result.fullDescriptionKo)) result.fullDescriptionKo = await translateTextDynamic(baseFull, 'ko');
    if (needsTranslationJa(result.fullDescriptionJa)) result.fullDescriptionJa = await translateTextDynamic(baseFull, 'ja');
    if (needsTranslationEn(result.fullDescriptionEn)) result.fullDescriptionEn = await translateTextDynamic(baseFull, 'en');

    if (app.usageGuide) {
      if (needsTranslationKo(result.usageGuideKo)) result.usageGuideKo = await translateTextDynamic(app.usageGuide, 'ko');
      if (needsTranslationJa(result.usageGuideJa)) result.usageGuideJa = await translateTextDynamic(app.usageGuide, 'ja');
      if (needsTranslationEn(result.usageGuideEn)) result.usageGuideEn = await translateTextDynamic(app.usageGuide, 'en');
    }

    if (app.features && app.features.length > 0) {
      if (!result.featuresJa || result.featuresJa.length === 0) {
        result.featuresJa = await Promise.all(app.features.map(f => translateTextDynamic(f, 'ja')));
      }
      if (!result.featuresEn || result.featuresEn.length === 0) {
        result.featuresEn = await Promise.all(app.features.map(f => translateTextDynamic(f, 'en')));
      }
      if (!result.featuresKo || result.featuresKo.length === 0) {
        result.featuresKo = await Promise.all(app.features.map(f => translateTextDynamic(f, 'ko')));
      }
    }
  } catch (err) {
    console.error('Async translate app failed:', err);
  }

  return autoTranslateApp(result);
}

// Translate input (KO/EN/JA) to Korean
export function translateToKo(text: string): string {
  if (!text) return '';
  let ko = text;

  // Partial phrase mapping for Japanese to Korean
  ko = ko.replace(/私のお祈り|私の祈り/g, '나의 기도');
  ko = ko.replace(/内祈り|내기도/g, '나의 기도');
  ko = ko.replace(/お祈り|祈り|祈祷|祈禱/g, '기도');
  ko = ko.replace(/（Android用）|\(Android用\)/g, '(Android용)');
  ko = ko.replace(/（iPhone用）|\(iPhone用\)|\(iPhone専用\)/g, '(아이폰 전용)');
  ko = ko.replace(/（グループ用）|\(グループ用\)/g, '(그룹용)');
  ko = ko.replace(/アプリ/g, '앱');
  ko = ko.replace(/ツール/g, '툴');

  if (ko.includes("One Month's Todo")) return "One Month's Todo (원 먼스 투두 - 한 달 목표 달성)";
  if (ko.includes("PDF AI Summarizer")) return "PDF AI Summarizer (원클릭 요약기)";
  if (ko.includes("Prompt Magic Generator")) return "Prompt Magic Generator (프롬프트 연동기)";
  if (ko.includes("Auto File Organizer Pro")) return "Auto File Organizer Pro (스마트 폴더 정리)";
  if (ko.includes("Context Native Translator")) return "Context Native Translator (자연스러운 맥락 번역)";

  return postProcessTranslation(ko, 'ko');
}

// Translate input (KO/EN/JA) to Japanese with natural "お祈り" expressions
export function translateToJa(text: string): string {
  if (!text) return '';
  let ja = text;

  // Key Features Translation Rules (Robust Partial Match)
  if (ja.includes("모바일") || ja.includes("스마트폰") || ja.includes("원클릭 실행")) {
    return "モバイル＆スマホアプリ ワンタッチ即時起動";
  }
  if (ja.includes("독점 100엔") || ja.includes("정찰제 다운로드")) {
    return "独占100円一律定額ダウンロード";
  }
  if (ja.includes("안전 검증") || ja.includes("무설치") || ja.includes("직속 패키지")) {
    return "安全検証済み インストール不要パッケージ";
  }

  if (ja.includes("PDF AI Summarizer")) return "PDF AI Summarizer (ワンクリック要約機)";
  if (ja.includes("Prompt Magic Generator")) return "Prompt Magic Generator (プロンプト生成器)";
  if (ja.includes("Auto File Organizer Pro")) return "Auto File Organizer Pro (フォルダ自動整理)";
  if (ja.includes("Context Native Translator")) return "Context Native Translator (自然な文脈翻訳)";
  if (ja.includes("One Month's Todo")) return "One Month's Todo (1ヶ月ToDoカレンダー)";
  if (ja.includes("My Prayer") && (ja.includes("iPhone") || ja.includes("아이폰"))) return "My Prayer (iPhone専用 お祈りカレンダー)";
  if (ja.includes("My Prayer") && !ja.includes("お祈り")) return "My Prayer (お祈り・願望成就カレンダー)";
  if (ja.includes("나의 기도") || ja.includes("내기도")) return "私のお祈り（Android用）";

  return postProcessTranslation(ja, 'ja');
}

// Translate input (KO/EN/JA) to English
export function translateToEn(text: string): string {
  if (!text) return '';
  let en = text;

  if (en.includes("私のお祈り") || en.includes("私の祈り") || en.includes("나의 기도") || en.includes("내기도")) {
    if (en.includes("Android") || en.includes("안드로이드")) return "My Prayer (for Android)";
    if (en.includes("iPhone") || en.includes("아이폰")) return "My Prayer (iPhone Edition)";
    return "My Prayer (Prayer & Goal Tracker)";
  }

  if (en.includes("모바일") || en.includes("스마트폰") || en.includes("원클릭 실행")) {
    return "1-Touch instant Mobile & Smartphone execution";
  }
  if (en.includes("독점 100엔") || en.includes("정찰제 다운로드")) {
    return "Exclusive flat $1 download";
  }
  if (en.includes("안전 검증") || en.includes("무설치")) {
    return "Verified secure no-install package";
  }

  if (en.includes("PDF AI Summarizer")) return "PDF AI Summarizer (1-Click Summarizer)";
  if (en.includes("Prompt Magic Generator")) return "Prompt Magic Generator (Prompt Engineering Tool)";
  if (en.includes("Auto File Organizer Pro")) return "Auto File Organizer Pro (Smart Folder Sort)";
  if (en.includes("Context Native Translator")) return "Context Native Translator (Contextual Translation)";
  if (en.includes("One Month's Todo") || en.includes("1ヶ月ToDo")) return "One Month's Todo (30-Day Goal Tracker)";

  return postProcessTranslation(en, 'en');
}

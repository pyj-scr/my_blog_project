import { AppItem } from '@/types/app';

// Check if text contains Korean characters (Hangul)
export function containsKorean(text: string): boolean {
  return /[\u3131-\u318E\uAC00-\uD7A3]/.test(text);
}

// Universal Real-Time Translation API Fetcher (Google Translate Free API)
export async function translateTextDynamic(text: string, targetLang: 'ja' | 'en' | 'ko'): Promise<string> {
  if (!text || text.trim() === '') return text;

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data && data[0] && Array.isArray(data[0])) {
        const translated = data[0].map((item: any) => item[0]).join('');
        if (translated && translated.trim() !== '') {
          return translated;
        }
      }
    }
  } catch (err) {
    console.warn('Dynamic translate API failed, using fallback rule', err);
  }

  return fallbackTranslate(text, targetLang);
}

// Synchronous Fallback rules
function fallbackTranslate(text: string, targetLang: 'ja' | 'en' | 'ko'): string {
  if (targetLang === 'ja') return translateToJa(text);
  if (targetLang === 'en') return translateToEn(text);
  return translateToKo(text);
}

// Synchronous Auto-Translator with instant API promise enrichment
export function autoTranslateApp(app: AppItem): AppItem {
  const result = { ...app };

  const baseTitle = result.title;
  const baseShort = result.shortDescription;
  const baseFull = result.fullDescription || baseShort;
  const baseGuide = result.usageGuide || '';

  // Preserve user custom manual overrides if provided
  if (!result.titleKo) result.titleKo = translateToKo(baseTitle);
  if (!result.titleJa) result.titleJa = translateToJa(baseTitle);
  if (!result.titleEn) result.titleEn = translateToEn(baseTitle);

  if (!result.shortDescriptionKo) result.shortDescriptionKo = translateToKo(baseShort);
  if (!result.shortDescriptionJa) result.shortDescriptionJa = translateToJa(baseShort);
  if (!result.shortDescriptionEn) result.shortDescriptionEn = translateToEn(baseShort);

  if (!result.fullDescriptionKo) result.fullDescriptionKo = translateToKo(baseFull);
  if (!result.fullDescriptionJa) result.fullDescriptionJa = translateToJa(baseFull);
  if (!result.fullDescriptionEn) result.fullDescriptionEn = translateToEn(baseFull);

  if (baseGuide) {
    if (!result.usageGuideKo) result.usageGuideKo = translateToKo(baseGuide);
    if (!result.usageGuideJa) result.usageGuideJa = translateToJa(baseGuide);
    if (!result.usageGuideEn) result.usageGuideEn = translateToEn(baseGuide);
  }

  if (result.features && result.features.length > 0) {
    result.featuresKo = result.featuresKo && result.featuresKo.length > 0 ? result.featuresKo.map(f => translateToKo(f)) : result.features.map(f => translateToKo(f));
    result.featuresJa = result.featuresJa && result.featuresJa.length > 0 ? result.featuresJa.map(f => translateToJa(f)) : result.features.map(f => translateToJa(f));
    result.featuresEn = result.featuresEn && result.featuresEn.length > 0 ? result.featuresEn.map(f => translateToEn(f)) : result.features.map(f => translateToEn(f));
  }

  return result;
}

// Async enrichment for registered/edited apps to fetch 100% accurate API translation
export async function asyncTranslateApp(app: AppItem): Promise<AppItem> {
  const result = { ...app };

  try {
    if (!result.titleKo) result.titleKo = await translateTextDynamic(app.title, 'ko');
    if (!result.titleJa) result.titleJa = await translateTextDynamic(app.title, 'ja');
    if (!result.titleEn) result.titleEn = await translateTextDynamic(app.title, 'en');

    if (!result.shortDescriptionKo) result.shortDescriptionKo = await translateTextDynamic(app.shortDescription, 'ko');
    if (!result.shortDescriptionJa) result.shortDescriptionJa = await translateTextDynamic(app.shortDescription, 'ja');
    if (!result.shortDescriptionEn) result.shortDescriptionEn = await translateTextDynamic(app.shortDescription, 'en');

    const baseFull = app.fullDescription || app.shortDescription;
    if (!result.fullDescriptionKo) result.fullDescriptionKo = await translateTextDynamic(baseFull, 'ko');
    if (!result.fullDescriptionJa) result.fullDescriptionJa = await translateTextDynamic(baseFull, 'ja');
    if (!result.fullDescriptionEn) result.fullDescriptionEn = await translateTextDynamic(baseFull, 'en');

    if (app.usageGuide) {
      if (!result.usageGuideKo) result.usageGuideKo = await translateTextDynamic(app.usageGuide, 'ko');
      if (!result.usageGuideJa) result.usageGuideJa = await translateTextDynamic(app.usageGuide, 'ja');
      if (!result.usageGuideEn) result.usageGuideEn = await translateTextDynamic(app.usageGuide, 'en');
    }

    if (app.features && app.features.length > 0) {
      if (!result.featuresJa || result.featuresJa.length === 0) {
        result.featuresJa = app.features.map(f => translateToJa(f));
      }
      if (!result.featuresEn || result.featuresEn.length === 0) {
        result.featuresEn = app.features.map(f => translateToEn(f));
      }
      if (!result.featuresKo || result.featuresKo.length === 0) {
        result.featuresKo = app.features.map(f => translateToKo(f));
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

  if (ko.includes("PDF AI Summarizer")) return "PDF AI Summarizer (원클릭 요약기)";
  if (ko.includes("Prompt Magic Generator")) return "Prompt Magic Generator (프롬프트 연동기)";
  if (ko.includes("Auto File Organizer Pro")) return "Auto File Organizer Pro (스마트 폴더 정리)";
  if (ko.includes("Context Native Translator")) return "Context Native Translator (자연스러운 맥락 번역)";
  if (ko.includes("One Month's Todo") || ko.includes("1ヶ月ToDo")) return "One Month's Todo (원 먼스 투두 - 한 달 목표 달성)";
  if (ko.includes("My Prayer") && (ko.includes("iPhone") || ko.includes("아이폰"))) return "My Prayer (아이폰 전용 - 기도 응답 캘린더)";
  if (ko.includes("My Prayer") && !ko.includes("마이 프레이어")) return "My Prayer (마이 프레이어 - 기도 응답 캘린더)";

  if (ko.includes("50ページの長いPDFも") || ko.includes("Summarize 50-page PDFs")) {
    return "50페이지 분량의 긴 PDF도 10초 만에 핵심 요약 노트로 작성해 드립니다.";
  }
  if (ko.includes("アイデアを入力するだけで") || ko.includes("Generate optimal Midjourney")) {
    return "원하는 아이디어만 입력하면 최상의 AI 생성 프롬프트를 만들어줍니다.";
  }
  if (ko.includes("散らかったダウンロードフォルダを") || ko.includes("Sort desktop & download")) {
    return "지저분한 다운로드 폴더를 날짜, 확장자, 내용별로 1초 만에 정리합니다.";
  }
  if (ko.includes("直感的なモバイルUI") || ko.includes("A month's Todo list")) {
    return "한 달 동안의 투두 리스트. 목표 과제 달성 횟수를 한눈에 확인하고 기록해 보세요.";
  }
  if (ko.includes("直訳ではなく状況と文脈に") || ko.includes("Native contextual translations")) {
    return "직역이 아닌 상황과 문맥에 딱 맞는 자연스러운 번역을 제공합니다.";
  }

  ko = ko.replace(/\(iPhone用\)/g, '(아이폰 전용)');
  ko = ko.replace(/\(グループ用\)/g, '(그룹용)');
  ko = ko.replace(/祈禱|祈り/g, '기도');
  ko = ko.replace(/祈祷/g, '기도');

  return ko;
}

// Translate input (KO/EN/JA) to Japanese with natural "お祈り" expressions
export function translateToJa(text: string): string {
  if (!text) return '';

  let ja = text;

  // Key Features Translation Rules (Robust Partial Match)
  if (ja.includes("모바일") || ja.includes("스마트폰") || ja.includes("원클릭 실행") || ja.includes("ワンタッチ")) {
    return "モバイル＆スマホアプリ ワンタッチ即時起動";
  }
  if (ja.includes("독점 100엔") || ja.includes("정찰제 다운로드") || ja.includes("100円")) {
    return "独占100円一律定額ダウンロード";
  }
  if (ja.includes("안전 검증") || ja.includes("무설치") || ja.includes("직속 패키지") || ja.includes("検証済み")) {
    return "安全検証済み インストール不要パッケージ";
  }

  if (ja.includes("PDF AI Summarizer")) return "PDF AI Summarizer (ワンクリック要約機)";
  if (ja.includes("Prompt Magic Generator")) return "Prompt Magic Generator (プロンプト生成器)";
  if (ja.includes("Auto File Organizer Pro")) return "Auto File Organizer Pro (フォルダ自動整理)";
  if (ja.includes("Context Native Translator")) return "Context Native Translator (自然な文脈翻訳)";
  if (ja.includes("One Month's Todo") || ja.includes("원 먼스 투두")) return "One Month's Todo (1ヶ月ToDoカレンダー)";
  if (ja.includes("My Prayer") && (ja.includes("iPhone") || ja.includes("아이폰"))) return "My Prayer (iPhone専用 お祈りカレンダー)";
  if (ja.includes("My Prayer") && !ja.includes("お祈り")) return "My Prayer (お祈り・願望成就カレンダー)";

  if (ja.includes("50페이지 분량의 긴 PDF도") || ja.includes("Summarize 50-page PDFs")) {
    return "50ページの長いPDFも10秒で要約ノートに自動作成します。";
  }
  if (ja.includes("원하는 아이디어만 입력하면") || ja.includes("Generate optimal Midjourney")) {
    return "アイデアを入力するだけで最適なAIプロンプトを自動生成します。";
  }
  if (ja.includes("지저분한 다운로드 폴더를") || ja.includes("Sort desktop & download")) {
    return "散らかったダウンロードフォルダを拡張子や日付別に1秒で自動整理。";
  }
  if (ja.includes("직역이 아닌 상황과 문맥에") || ja.includes("Native contextual translations")) {
    return "直訳ではなく状況と文脈にピッタリな自然な翻訳を提供します。";
  }
  if (ja.includes("A month's Todo list") || ja.includes("한 달 동안의 투두")) {
    return "1ヶ月のToDoリスト。目標タスクを実行した回数を一目で確認できます。";
  }
  if (ja.includes("My Prayer") || ja.includes("나의 기도가 이루어")) {
    return "My Prayerでお祈りと目標が達成されたことを毎日の達成ログに記録してみましょう。";
  }

  // Japanese natural word replacement: Fix 祈禱 to お祈り
  ja = ja.replace(/祈禱|祈祷/g, 'お祈り');
  ja = ja.replace(/iPhone용/gi, 'iPhone専用');
  ja = ja.replace(/Group용|그룹용/gi, 'グループ用');
  ja = ja.replace(/안드로이드용/gi, 'Android用');
  ja = ja.replace(/PC용/gi, 'PC用');
  ja = ja.replace(/어플/g, 'アプリ');
  ja = ja.replace(/앱/g, 'アプリ');
  ja = ja.replace(/기도/g, 'お祈り');

  return ja;
}

// Translate input (KO/EN/JA) to English
export function translateToEn(text: string): string {
  if (!text) return '';

  let en = text;

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
  if (en.includes("One Month's Todo") || en.includes("원 먼스 투두") || en.includes("1ヶ月ToDo")) return "One Month's Todo (30-Day Goal Tracker)";
  if (en.includes("My Prayer") && (en.includes("iPhone") || en.includes("아이폰"))) return "My Prayer (iPhone Edition - Prayer Tracker)";
  if (en.includes("My Prayer") && !en.includes("Prayer & Goal")) return "My Prayer (Prayer & Goal Tracker)";

  if (en.includes("50페이지 분량의 긴 PDF도") || en.includes("50ページの長いPDFも")) {
    return "Summarize 50-page PDFs into key bullet notes within 10 seconds.";
  }
  if (en.includes("원하는 아이디어만 입력하면") || en.includes("アイデアを入力するだけで")) {
    return "Generate optimal Midjourney & ChatGPT prompts instantly.";
  }
  if (en.includes("지저분한 다운로드 폴더를") || en.includes("散らかったダウンロードフォルダ를")) {
    return "Sort desktop & download folder clutter in 1 second by extensions.";
  }
  if (en.includes("직역이 아닌 상황과 문맥에") || en.includes("直訳ではなく状況と文脈に")) {
    return "Native contextual translations for business and casual tone.";
  }

  en = en.replace(/\(\(iPhone Version\)\)/g, '(iPhone Edition)');
  en = en.replace(/\(iPhone Version\)/g, '(iPhone Edition)');
  en = en.replace(/iPhone용/gi, '(iPhone Edition)');
  en = en.replace(/Group용|그룹용/gi, '(Group Edition)');

  return en;
}

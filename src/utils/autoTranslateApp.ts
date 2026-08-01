import { AppItem } from '@/types/app';

// Universal 3-Language Auto-Translator (Korean, Japanese, English)
export function autoTranslateApp(app: AppItem): AppItem {
  const result = { ...app };

  // 1. Title Auto Translation
  if (!result.titleKo || result.titleKo === result.title) {
    result.titleKo = translateToKo(result.title);
  }
  if (!result.titleJa || result.titleJa === result.title) {
    result.titleJa = translateToJa(result.title);
  }
  if (!result.titleEn || result.titleEn === result.title) {
    result.titleEn = translateToEn(result.title);
  }

  // 2. Short Description Auto Translation
  const baseShort = result.shortDescription;
  if (!result.shortDescriptionKo) result.shortDescriptionKo = translateToKo(baseShort);
  if (!result.shortDescriptionJa) result.shortDescriptionJa = translateToJa(baseShort);
  if (!result.shortDescriptionEn) result.shortDescriptionEn = translateToEn(baseShort);

  // 3. Full Description Auto Translation
  const baseFull = result.fullDescription || baseShort;
  if (!result.fullDescriptionKo) result.fullDescriptionKo = translateToKo(baseFull);
  if (!result.fullDescriptionJa) result.fullDescriptionJa = translateToJa(baseFull);
  if (!result.fullDescriptionEn) result.fullDescriptionEn = translateToEn(baseFull);

  // 4. Usage Guide Auto Translation
  if (result.usageGuide) {
    if (!result.usageGuideKo) result.usageGuideKo = translateToKo(result.usageGuide);
    if (!result.usageGuideJa) result.usageGuideJa = translateToJa(result.usageGuide);
    if (!result.usageGuideEn) result.usageGuideEn = translateToEn(result.usageGuide);
  }

  // 5. Features List Auto Translation
  if (result.features && result.features.length > 0) {
    if (!result.featuresKo || result.featuresKo.length === 0) {
      result.featuresKo = result.features.map(f => translateToKo(f));
    }
    if (!result.featuresJa || result.featuresJa.length === 0) {
      result.featuresJa = result.features.map(f => translateToJa(f));
    }
    if (!result.featuresEn || result.featuresEn.length === 0) {
      result.featuresEn = result.features.map(f => translateToEn(f));
    }
  }

  return result;
}

// Translate input (KO/EN/JA) to Korean
export function translateToKo(text: string): string {
  if (!text) return '';

  let ko = text;

  // Title / Key phrase mappings
  if (ko.includes("PDF AI Summarizer")) {
    return "PDF AI Summarizer (원클릭 요약기)";
  }
  if (ko.includes("Prompt Magic Generator")) {
    return "Prompt Magic Generator (프롬프트 연동기)";
  }
  if (ko.includes("Auto File Organizer Pro")) {
    return "Auto File Organizer Pro (스마트 폴더 정리)";
  }
  if (ko.includes("Context Native Translator")) {
    return "Context Native Translator (자연스러운 맥락 번역)";
  }
  if (ko.includes("One Month's Todo") || ko.includes("1ヶ月ToDo")) {
    return "One Month's Todo (원 먼스 투두 - 한 달 목표 달성)";
  }
  if (ko.includes("My Prayer") && (ko.includes("iPhone") || ko.includes("아이폰"))) {
    return "My Prayer (아이폰 전용 - 기도 응답 캘린더)";
  }
  if (ko.includes("My Prayer") && !ko.includes("마이 프레이어")) {
    return "My Prayer (마이 프레이어 - 기도 응답 캘린더)";
  }

  // Descriptions
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

  // General vocabulary fallbacks
  ko = ko.replace(/\(iPhone用\)/g, '(아이폰 전용)');
  ko = ko.replace(/\(\(iPhone Version\)\)/g, '(아이폰 전용)');
  ko = ko.replace(/\(iPhone Version\)/g, '(아이폰 전용)');

  return ko;
}

// Translate input (KO/EN/JA) to Japanese
export function translateToJa(text: string): string {
  if (!text) return '';

  let ja = text;

  // Title / Key phrase mappings
  if (ja.includes("PDF AI Summarizer")) {
    return "PDF AI Summarizer (ワンクリック要約機)";
  }
  if (ja.includes("Prompt Magic Generator")) {
    return "Prompt Magic Generator (プロンプト生成器)";
  }
  if (ja.includes("Auto File Organizer Pro")) {
    return "Auto File Organizer Pro (フォルダ自動整理)";
  }
  if (ja.includes("Context Native Translator")) {
    return "Context Native Translator (自然な文脈翻訳)";
  }
  if (ja.includes("One Month's Todo") || ja.includes("원 먼스 투두")) {
    return "One Month's Todo (1ヶ月ToDoカレンダー)";
  }
  if (ja.includes("My Prayer") && (ja.includes("iPhone") || ja.includes("아이폰"))) {
    return "My Prayer (iPhone専用 願望成就カレンダー)";
  }
  if (ja.includes("My Prayer") && !ja.includes("祈り")) {
    return "My Prayer (祈り・願望成就カレンダー)";
  }

  // Descriptions
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
    return "My Prayerで祈りと目標が達成されたことを毎日の達成ログに記録してみましょう。";
  }

  // Vocabulary fallbacks
  ja = ja.replace(/iPhone용/gi, 'iPhone用');
  ja = ja.replace(/안드로이드용/gi, 'Android用');
  ja = ja.replace(/PC용/gi, 'PC用');
  ja = ja.replace(/어플/g, 'アプリ');
  ja = ja.replace(/앱/g, 'アプリ');

  return ja;
}

// Translate input (KO/EN/JA) to English
export function translateToEn(text: string): string {
  if (!text) return '';

  let en = text;

  // Title / Key phrase mappings
  if (en.includes("PDF AI Summarizer")) {
    return "PDF AI Summarizer (1-Click Summarizer)";
  }
  if (en.includes("Prompt Magic Generator")) {
    return "Prompt Magic Generator (Prompt Engineering Tool)";
  }
  if (en.includes("Auto File Organizer Pro")) {
    return "Auto File Organizer Pro (Smart Folder Sort)";
  }
  if (en.includes("Context Native Translator")) {
    return "Context Native Translator (Contextual Translation)";
  }
  if (en.includes("One Month's Todo") || en.includes("원 먼스 투두") || en.includes("1ヶ月ToDo")) {
    return "One Month's Todo (30-Day Goal Tracker)";
  }
  if (en.includes("My Prayer") && (en.includes("iPhone") || en.includes("아이폰"))) {
    return "My Prayer (iPhone Edition - Prayer Tracker)";
  }
  if (en.includes("My Prayer") && !en.includes("Prayer & Goal")) {
    return "My Prayer (Prayer & Goal Tracker)";
  }

  // Descriptions
  if (en.includes("50페이지 분량의 긴 PDF도") || en.includes("50ページの長いPDFも")) {
    return "Summarize 50-page PDFs into key bullet notes within 10 seconds.";
  }
  if (en.includes("원하는 아이디어만 입력하면") || en.includes("アイデアを入力するだけで")) {
    return "Generate optimal Midjourney & ChatGPT prompts instantly.";
  }
  if (en.includes("지저분한 다운로드 폴더를") || en.includes("散らかったダウンロードフォルダを")) {
    return "Sort desktop & download folder clutter in 1 second by extensions.";
  }
  if (en.includes("직역이 아닌 상황과 문맥에") || en.includes("直訳ではなく状況と文脈に")) {
    return "Native contextual translations for business and casual tone.";
  }

  en = en.replace(/\(\(iPhone Version\)\)/g, '(iPhone Edition)');
  en = en.replace(/\(iPhone Version\)/g, '(iPhone Edition)');
  en = en.replace(/iPhone용/gi, '(iPhone Edition)');

  return en;
}

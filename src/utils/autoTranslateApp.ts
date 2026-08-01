import { AppItem } from '@/types/app';

// Check if text contains Korean characters (Hangul)
export function containsKorean(text: string): boolean {
  return /[\u3131-\u318E\uAC00-\uD7A3]/.test(text);
}

// Universal Real-Time Translation API Fetcher (Google Translate Free API)
export async function translateTextDynamic(text: string, targetLang: 'ja' | 'en' | 'ko'): Promise<string> {
  if (!text || text.trim() === '') return text;

  // Quick fallback if already matching target
  if (targetLang === 'ko' && !containsKorean(text)) {
    // If input is English/Japanese, translate to Korean
  } else if (targetLang === 'ja' && !containsKorean(text) && /[ぁ-んァ-ヶ一-龠]/.test(text)) {
    return text; // Already Japanese
  }

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

  // Synchronous Fallback if API call is unavailable
  return fallbackTranslate(text, targetLang);
}

// Synchronous Fallback rules
function fallbackTranslate(text: string, targetLang: 'ja' | 'en' | 'ko'): string {
  let res = text;
  if (targetLang === 'ja') {
    res = res.replace(/iPhone용/gi, 'iPhone用');
    res = res.replace(/Group용|그룹용/gi, 'グループ用');
    res = res.replace(/기도/gi, '祈り');
    res = res.replace(/리스트/gi, 'リスト');
    res = res.replace(/서로를 위해서 기도 하고 서로의 기도 응답을 확인하세요\./gi, 'お互いのために祈り合い、祈りの応答を確認しましょう。');
    res = res.replace(/어플|앱/g, 'アプリ');
  } else if (targetLang === 'en') {
    res = res.replace(/iPhone용/gi, '(iPhone Version)');
    res = res.replace(/Group용|그룹용/gi, '(Group Version)');
    res = res.replace(/기도/gi, 'Prayer');
    res = res.replace(/리스트/gi, 'List');
    res = res.replace(/서로를 위해서 기도 하고 서로의 기도 응답을 확인하세요\./gi, 'Pray for one another and check each other\'s prayer answers.');
  } else if (targetLang === 'ko') {
    res = res.replace(/\(iPhone用\)/g, '(아이폰 전용)');
    res = res.replace(/\(グループ用\)/g, '(그룹용)');
  }
  return res;
}

// Synchronous Auto-Translator with instant API promise enrichment
export function autoTranslateApp(app: AppItem): AppItem {
  const result = { ...app };

  const baseTitle = result.title;
  const baseShort = result.shortDescription;
  const baseFull = result.fullDescription || baseShort;
  const baseGuide = result.usageGuide || '';

  // Synchronous initial assignment with smart fallback
  result.titleKo = result.titleKo || fallbackTranslate(baseTitle, 'ko');
  result.titleJa = result.titleJa || fallbackTranslate(baseTitle, 'ja');
  result.titleEn = result.titleEn || fallbackTranslate(baseTitle, 'en');

  result.shortDescriptionKo = result.shortDescriptionKo || fallbackTranslate(baseShort, 'ko');
  result.shortDescriptionJa = result.shortDescriptionJa || fallbackTranslate(baseShort, 'ja');
  result.shortDescriptionEn = result.shortDescriptionEn || fallbackTranslate(baseShort, 'en');

  result.fullDescriptionKo = result.fullDescriptionKo || fallbackTranslate(baseFull, 'ko');
  result.fullDescriptionJa = result.fullDescriptionJa || fallbackTranslate(baseFull, 'ja');
  result.fullDescriptionEn = result.fullDescriptionEn || fallbackTranslate(baseFull, 'en');

  if (baseGuide) {
    result.usageGuideKo = result.usageGuideKo || fallbackTranslate(baseGuide, 'ko');
    result.usageGuideJa = result.usageGuideJa || fallbackTranslate(baseGuide, 'ja');
    result.usageGuideEn = result.usageGuideEn || fallbackTranslate(baseGuide, 'en');
  }

  if (result.features && result.features.length > 0) {
    result.featuresKo = result.featuresKo || result.features.map(f => fallbackTranslate(f, 'ko'));
    result.featuresJa = result.featuresJa || result.features.map(f => fallbackTranslate(f, 'ja'));
    result.featuresEn = result.featuresEn || result.features.map(f => fallbackTranslate(f, 'en'));
  }

  return result;
}

// Async enrichment for registered/edited apps to fetch 100% accurate API translation
export async function asyncTranslateApp(app: AppItem): Promise<AppItem> {
  const result = { ...app };

  try {
    const [titleKo, titleJa, titleEn] = await Promise.all([
      translateTextDynamic(app.title, 'ko'),
      translateTextDynamic(app.title, 'ja'),
      translateTextDynamic(app.title, 'en'),
    ]);
    result.titleKo = titleKo;
    result.titleJa = titleJa;
    result.titleEn = titleEn;

    const [shortKo, shortJa, shortEn] = await Promise.all([
      translateTextDynamic(app.shortDescription, 'ko'),
      translateTextDynamic(app.shortDescription, 'ja'),
      translateTextDynamic(app.shortDescription, 'en'),
    ]);
    result.shortDescriptionKo = shortKo;
    result.shortDescriptionJa = shortJa;
    result.shortDescriptionEn = shortEn;

    const baseFull = app.fullDescription || app.shortDescription;
    const [fullKo, fullJa, fullEn] = await Promise.all([
      translateTextDynamic(baseFull, 'ko'),
      translateTextDynamic(baseFull, 'ja'),
      translateTextDynamic(baseFull, 'en'),
    ]);
    result.fullDescriptionKo = fullKo;
    result.fullDescriptionJa = fullJa;
    result.fullDescriptionEn = fullEn;

    if (app.usageGuide) {
      const [guideKo, guideJa, guideEn] = await Promise.all([
        translateTextDynamic(app.usageGuide, 'ko'),
        translateTextDynamic(app.usageGuide, 'ja'),
        translateTextDynamic(app.usageGuide, 'en'),
      ]);
      result.usageGuideKo = guideKo;
      result.usageGuideJa = guideJa;
      result.usageGuideEn = guideEn;
    }
  } catch (err) {
    console.error('Async translate app failed:', err);
  }

  return result;
}

import { AppItem } from '@/types/app';

// Universal 3-Language Auto-Translator (Korean, Japanese, English)
export function autoTranslateApp(app: AppItem): AppItem {
  const result = { ...app };

  // 1. Title Auto Translation
  result.titleKo = translateToKo(result.title);
  result.titleJa = translateToJa(result.title);
  result.titleEn = translateToEn(result.title);

  // 2. Short Description Auto Translation
  const baseShort = result.shortDescription;
  result.shortDescriptionKo = translateToKo(baseShort);
  result.shortDescriptionJa = translateToJa(baseShort);
  result.shortDescriptionEn = translateToEn(baseShort);

  // 3. Full Description Auto Translation
  const baseFull = result.fullDescription || baseShort;
  result.fullDescriptionKo = translateToKo(baseFull);
  result.fullDescriptionJa = translateToJa(baseFull);
  result.fullDescriptionEn = translateToEn(baseFull);

  // 4. Usage Guide Auto Translation
  if (result.usageGuide) {
    result.usageGuideKo = translateToKo(result.usageGuide);
    result.usageGuideJa = translateToJa(result.usageGuide);
    result.usageGuideEn = translateToEn(result.usageGuide);
  }

  // 5. Features List Auto Translation
  if (result.features && result.features.length > 0) {
    result.featuresKo = result.features.map(f => translateToKo(f));
    result.featuresJa = result.features.map(f => translateToJa(f));
    result.featuresEn = result.features.map(f => translateToEn(f));
  }

  return result;
}

// Translate input (KO/EN/JA) to Korean
export function translateToKo(text: string): string {
  if (!text) return '';

  let ko = text;

  // Title / Key phrase mappings
  if (ko.includes("One Month's Todo") || ko.includes("1ヶ月ToDo")) {
    return "One Month's Todo (원 먼스 투두 - 한 달 목표 달성)";
  }
  if (ko.includes("My Prayer(iPhone用)") || ko.includes("My Prayer(iPhoneVersion)") || ko.includes("My Prayer((iPhone Version))")) {
    return "My Prayer (아이폰 전용 - 기도 응답 캘린더)";
  }
  if (ko.includes("My Prayer") && !ko.includes("마이 프레이어")) {
    return "My Prayer (마이 프레이어 - 기도 응답 캘린더)";
  }

  // Short desc mappings
  if (ko.includes("A month's Todo list. You can check how many times")) {
    return "한 달 동안의 투두 리스트. 목표 과제 달성 횟수를 한눈에 확인하고 기록해 보세요.";
  }
  if (ko.includes("My Prayer 나의 기도가 이루어집을 확인") || ko.includes("My Prayer 나의 기도가 이루어 지는 것을 확인") || ko.includes("My Prayerで祈りと目標")) {
    return "My Prayer에서 기도와 소망이 이루어진 것을 매일 확인하고 기록해 보세요.";
  }
  if (ko.includes("iphone용 설치 방법은 확인 하고")) {
    return "아이폰 전용 PWA 설치 방법 안내서를 확인한 후 설치를 진행해 주세요.";
  }

  // Cleaning remnant symbols
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
  if (ja.includes("One Month's Todo") || ja.includes("원 먼스 투두")) {
    return "One Month's Todo (1ヶ月ToDoカレンダー)";
  }
  if (ja.includes("My Prayer") && (ja.includes("iPhone") || ja.includes("아이폰"))) {
    return "My Prayer (iPhone専用 願望成就カレンダー)";
  }
  if (ja.includes("My Prayer") && !ja.includes("祈り")) {
    return "My Prayer (祈り・願望成就カレンダー)";
  }

  // Short desc mappings
  if (ja.includes("A month's Todo list") || ja.includes("한 달 동안의 투두")) {
    return "1ヶ月のToDoリスト。目標タスクを実行した回数を一目で確認できます。";
  }
  if (ja.includes("My Prayer") || ja.includes("나의 기도가 이루어")) {
    return "My Prayerで祈りと目標が達成されたことを毎日の達成ログに記録してみましょう。";
  }
  if (ja.includes("iphone용 설치 방법") || ja.includes("설치 방법은 확인")) {
    return "iPhone専用PWAのインストール手順をご確認のうえ、インストールしてください。";
  }

  // Installation guide full paragraph replacement for Japanese
  if (ja.includes("Safari로 아래 주소") || ja.includes("Safari") && ja.includes("공유")) {
    return `iPhone用のインストール手順 (共通)
1. Safariブラウザで以下のアプリURLにアクセスします。(※必ずSafariをご使用ください)
2. 画面下部の「共有」アイコンボタンをタップします。
3. メニューから「ホーム画面に追加」を選択します。
4. 名前を確認後、「追加」をタップするとホーム画面にアイコンが作成されます。
5. 以降はホーム画面のアイコンをタップして、アプリ同様に全画面で起動できます。

アプリ iPhone専用URL:
My Prayer  https://my-prayer-journal.web.app

• ホーム画面追加後はアドレスバーなしのネイティブアプリとして起動します。
• ログイン情報やデータはFirebaseクラウドに同期されるため、AndroidとiPhone間でリアルタイム共有されます。
• プッシュ通知機能はiOSのPWA仕様により一部制限がある場合があります (iOS 16.4以上対応)。`;
  }

  // Common sentence cleanup
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
  if (en.includes("One Month's Todo") || en.includes("원 먼스 투두") || en.includes("1ヶ月ToDo")) {
    return "One Month's Todo (30-Day Goal Tracker)";
  }
  if (en.includes("My Prayer") && (en.includes("iPhone") || en.includes("아이폰"))) {
    return "My Prayer (iPhone Edition - Prayer Tracker)";
  }
  if (en.includes("My Prayer") && !en.includes("Prayer & Goal")) {
    return "My Prayer (Prayer & Goal Tracker)";
  }

  // Short desc mappings
  if (en.includes("1ヶ月のToDoリスト") || en.includes("한 달 동안의 투두")) {
    return "A month's Todo list. Easily check how many times you carried out targeted tasks.";
  }
  if (en.includes("My Prayerで祈り") || en.includes("나의 기도가 이루어")) {
    return "Track and confirm your daily targeted prayers and habit achievements.";
  }
  if (en.includes("iphone용 설치 방법") || en.includes("설치 방법은 확인")) {
    return "Please review the iPhone PWA installation instructions before installing.";
  }

  // Installation guide full paragraph replacement for English
  if (en.includes("Safari로 아래 주소") || en.includes("Safari") && en.includes("공유")) {
    return `iPhone Installation Instructions (Common)
1. Open the app URL in Safari (Must use Safari browser).
2. Tap the Share button at the bottom of the screen.
3. Select "Add to Home Screen" from the menu.
4. Confirm the name and tap "Add" to create an icon on your home screen.
5. Simply tap the icon on your home screen to run in full screen mode.

App iPhone Dedicated URL:
My Prayer  https://my-prayer-journal.web.app

• Once added to home screen, it launches full screen without address bar.
• Account and data are synced via Firebase cloud between Android and iPhone.
• Push notifications are supported on iOS 16.4+ via web push.`;
  }

  en = en.replace(/\(\(iPhone Version\)\)/g, '(iPhone Edition)');
  en = en.replace(/\(iPhone Version\)/g, '(iPhone Edition)');
  en = en.replace(/iPhone용/gi, '(iPhone Edition)');

  return en;
}

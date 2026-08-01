import { AppItem } from '@/types/app';

// Professional Smart Auto-Translator for user registered/edited apps
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
    result.usageGuideJa = translateUsageGuideToJa(result.usageGuide);
    result.usageGuideEn = translateUsageGuideToEn(result.usageGuide);
  }

  // 5. Translate Features List
  if (result.features && result.features.length > 0) {
    result.featuresJa = result.features.map(f => translateToJa(f));
    result.featuresEn = result.features.map(f => translateToEn(f));
  }

  return result;
}

function translateToJa(text: string): string {
  if (!text) return '';

  let ja = text;

  // Specific Term Replacement
  ja = ja.replace(/iPhone용/gi, 'iPhone用');
  ja = ja.replace(/안드로이드용/gi, 'Android用');
  ja = ja.replace(/PC용/gi, 'PC用');
  ja = ja.replace(/나의 기도가 이루어짐을 확인 해 보세요\./gi, '祈りと目標達成を毎日のログに記録してみましょう。');
  ja = ja.replace(/나의 기도가 이루어짐을 확인/gi, '祈りと目標達成の確認');
  ja = ja.replace(/기도/gi, '祈り');
  ja = ja.replace(/확인/gi, '確認');
  ja = ja.replace(/설치 방법은 확인 하고 설치 해 주세요\./gi, 'インストール手順を確認のうえ、インストールしてください。');

  // Common Korean pattern translations
  ja = ja.replace(/모바일 & 스마트폰 어플 원클릭 실행/gi, 'モバイル＆スマホアプリ ワンタッチ即時起動');
  ja = ja.replace(/모바일 & 스마트폰 어플 원클릭 터치 실행/gi, 'モバイル＆スマホアプリ ワンタッチ即時起動');
  ja = ja.replace(/독점 100엔 정찰제 다운로드/gi, '独占100円一律定額ダウンロード');
  ja = ja.replace(/독점 100엔 정찰제 영구 소장/gi, '独占100円一律定額 永久所有');
  ja = ja.replace(/안전 검증 무설치 \/ 직속 패키지/gi, '安全検証済み インストール不要パッケージ');
  ja = ja.replace(/안전 검증 무설치 직속 모바일 패키지/gi, '安全検証済み モバイル直接ダウンロード');
  ja = ja.replace(/기도 달성 캘린더 및 일일 체크리스트/gi, '祈り達成カレンダー＆デイリーチェックリスト');
  ja = ja.replace(/30일 한 달 목표 카운터 & 체크 박스/gi, '30日間 1ヶ月目標カウンター＆チェックボックス');
  ja = ja.replace(/직관적인 모바일 UI 다크 모드 지원/gi, '直感的なモバイルUI ダークモード対応');

  ja = ja.replace(/어플/g, 'アプリ');
  ja = ja.replace(/앱/g, 'アプリ');
  ja = ja.replace(/다운로드/g, 'ダウンロード');
  ja = ja.replace(/실행/g, '起動');
  ja = ja.replace(/확인/g, '確認');

  return ja;
}

function translateToEn(text: string): string {
  if (!text) return '';

  let en = text;

  en = en.replace(/iPhone용/gi, '(iPhone Version)');
  en = en.replace(/안드로이드용/gi, '(Android Version)');
  en = en.replace(/PC용/gi, '(PC Version)');
  en = en.replace(/나의 기도가 이루어짐을 확인 해 보세요\./gi, 'Track and log your answered prayers and target goals daily.');
  en = en.replace(/설치 방법은 확인 하고 설치 해 주세요\./gi, 'Please review installation instructions before installing.');
  en = en.replace(/모바일 & 스마트폰 어플 원클릭 실행/gi, '1-Touch instant Mobile & Smartphone execution');
  en = en.replace(/독점 100엔 정찰제 다운로드/gi, 'Exclusive flat $1 download');
  en = en.replace(/안전 검증 무설치 \/ 직속 패키지/gi, 'Verified secure no-install package');

  en = en.replace(/어플/g, 'App');
  en = en.replace(/앱/g, 'App');
  en = en.replace(/다운로드/g, 'Download');

  return en;
}

function translateUsageGuideToJa(guideText: string): string {
  if (!guideText) return '';

  let ja = guideText;

  // Full PWA / iPhone Installation Guide text replacement rules
  ja = ja.replace(/아이폰 설치 방법 \(공통\)|아이폰 설치 방법 \(공통\)|아이폰 설치 방법\(공통\)/gi, 'iPhone用のインストール手順 (共通)');
  ja = ja.replace(/아이폰 설치 방법/gi, 'iPhone用のインストール手順');
  ja = ja.replace(/1\.Safari로 아래 주소 중 원하는 앱 주소를 엽니다\. \(다른 브라우저는 안 됨 — 반드시 Safari\)|1\.Safari로 아래 주소 중 원하는 앱 주소를 엽니다\. \(다른 브라우저는 안 됨 ㅡ 반드시 Safari\)/gi, '1. Safariブラウザで以下のアプリURLにアクセスします。(※必ずSafariをご使用ください)');
  ja = ja.replace(/2\.화면 하단\(또는 상단\) 공유 버튼 <img alt=""\/> 📱 을 누릅니다\.|2\.화면 하단\(또는 상단\) 공유 버튼.*을 누릅니다\./gi, '2. 画面下部(または上部)の「共有」アイコンボタンをタップします。');
  ja = ja.replace(/3\.메뉴에서 \*\*\*홈 화면에 추가\*\*\*를 선택합니다\./gi, '3. メニューから「ホーム画面に追加」を選択します。');
  ja = ja.replace(/4\.이름 확인 후 \*\*\*추가\*\*\*를 누르면 홈 화면에 아이콘이 생깁니다\./gi, '4. 名前を確認後、「追加」をタップするとホーム画面にアイコンが作成されます。');
  ja = ja.replace(/5\. 이후엔 그 아이콘을 눌러서 앱처럼 전체화면으로 실행하면 됩니다\.|5\.이후엔 그 아이콘을 눌러서 앱처럼 전체화면으로 실행하면 됩니다\./gi, '5. 以降はホーム画面のアイコンをタップして、全画面で起動できます。');
  
  ja = ja.replace(/앱\s+아이폰용 주소/gi, 'アプリ iPhone専用URL');
  ja = ja.replace(/아이폰용 주소/gi, 'iPhone専用URL');
  
  ja = ja.replace(/• 홈 화면에 추가한 뒤엔 주소창 없이 진짜 앱처럼 보입니다\./gi, '• ホーム画面追加後はアドレスバーなしのネイティブアプリとして起動します。');
  ja = ja.replace(/• 로그인 정보, 데이터는 안드로이드 APK와 동일하게 Firebase에 저장되므로, 같은 계정으로 로그인하면 안드로이드와 아이폰에서 데이터가 공유됩니다\./gi, '• ログイン情報やデータはFirebaseクラウドに同期されるため、AndroidとiPhone間でリアルタイム共有されます。');
  ja = ja.replace(/• 알림\(푸시\) 기능은 iOS의 PWA 제약상 안드로이드보다 제한적일 수 있어요 \(iOS 16\.4\+ 부터 일부 지원\)\./gi, '• プッシュ通知機能はiOSのPWA仕様により一部制限がある場合があります (iOS 16.4以上対応)。');

  // Additional sentence phrase replacements
  ja = ja.replace(/다운로드 버튼을 눌러 앱 패키지를 받습니다\./gi, 'ダウンロードボタンを押してアプリを保存します。');
  ja = ja.replace(/스마트폰에서 앱을 실행하고 매일 기도 및 목표 달성을 체크하세요\./gi, 'スマホでアプリを起動し、毎日の目標をチェックしてください。');
  ja = ja.replace(/앱 실행 후 이번 달 목표 과제 3가지를 등록합니다\./gi, 'アプリ起動後、今月の目標タスクを登録します。');
  ja = ja.replace(/하루 1회 완료 시 버튼을 터치하면 성취 그래프가 기록됩니다\./gi, '達成時にボタンをタップするとグラフが記録されます。');

  // General vocabulary fallbacks
  ja = ja.replace(/아래 주소 중 원하는/g, '以下のURLから');
  ja = ja.replace(/주소를 엽니다/g, 'URLを開きます');
  ja = ja.replace(/다른 브라우저는 안 됨/g, '他のブラウザ不可');
  ja = ja.replace(/반드시/g, '必ず');
  ja = ja.replace(/을 누릅니다|를 누릅니다/g, 'をタップします');
  ja = ja.replace(/선택합니다/g, 'を選択します');
  ja = ja.replace(/누르면/g, 'をタップすると');
  ja = ja.replace(/아이콘이 생깁니다/g, 'アイコンが作成されます');
  ja = ja.replace(/이후엔/g, '以降は');
  ja = ja.replace(/전체화면으로/g, '全画面で');
  ja = ja.replace(/실행하면 됩니다/g, '起動できます');

  return ja;
}

function translateUsageGuideToEn(guideText: string): string {
  if (!guideText) return '';

  let en = guideText;

  en = en.replace(/아이폰 설치 방법 \(공통\)|아이폰 설치 방법/gi, 'iPhone Installation Guide (Common)');
  en = en.replace(/1\.Safari로 아래 주소 중 원하는 앱 주소를 엽니다\..*/gi, '1. Open the app URL in Safari (Must use Safari browser).');
  en = en.replace(/2\.화면 하단\(또는 상단\) 공유 버튼.*/gi, '2. Tap the Share button at the bottom or top of the screen.');
  en = en.replace(/3\.메뉴에서 \*\*\*홈 화면에 추가\*\*\*를 선택합니다\./gi, '3. Select "Add to Home Screen" from the menu.');
  en = en.replace(/4\.이름 확인 후 \*\*\*추가\*\*\*를 누르면 홈 화면에 아이콘이 생깁니다\./gi, '4. Confirm the name and tap "Add" to create an icon on your home screen.');
  en = en.replace(/5\. 이후엔 그 아이콘을 눌러서 앱처럼 전체화면으로 실행하면 됩니다\..*/gi, '5. Simply tap the icon on your home screen to run in full screen mode.');
  
  en = en.replace(/앱\s+아이폰용 주소/gi, 'App iPhone URL');
  en = en.replace(/• 홈 화면에 추가한 뒤엔 주소창 없이 진짜 앱처럼 보입니다\./gi, '• Once added to home screen, it launches full screen without address bar.');
  en = en.replace(/• 로그인 정보, 데이터는 안드로이드 APK와 동일하게 Firebase에 저장되므로.*/gi, '• Account and data are synced via Firebase cloud between Android and iPhone.');
  en = en.replace(/• 알림\(푸시\) 기능은 iOS의 PWA 제약상 안드로이드보다 제한적일 수 있어요.*/gi, '• Push notifications are supported on iOS 16.4+ via web push.');

  return en;
}

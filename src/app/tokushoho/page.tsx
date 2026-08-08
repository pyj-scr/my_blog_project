import { Navbar } from '@/components/Navbar';

export const metadata = {
  title: '特定商取引法に基づく表記 | アプリ 100円ショップ',
  description: '特定商取引法に基づく表記',
};

const ROWS: { label: string; value: React.ReactNode }[] = [
  { label: '販売事業者名', value: '朴榮子' },
  { label: '運営統括責任者', value: '朴榮子' },
  { label: '所在地', value: '東京都渋谷区上原２－３５－３' },
  {
    label: '連絡先',
    value: (
      <a href="mailto:estherjp@gmail.com" className="text-rose-400 hover:text-rose-300 transition-colors">
        estherjp@gmail.com
      </a>
    ),
  },
  { label: '販売価格', value: '各アプリ 100円（税込）' },
  {
    label: '商品代金以外の必要料金',
    value: 'なし（表示価格以外の追加料金は発生しません）',
  },
  {
    label: 'お支払い方法',
    value: 'クレジットカード、PayPay（Stripeを通じて決済処理）',
  },
  { label: 'お支払い時期', value: 'ご注文（決済）時に即時お支払いいただきます。' },
  {
    label: '引き渡し時期',
    value: '決済完了後、即時マイページよりダウンロード・ご利用いただけます。',
  },
  {
    label: '返品・キャンセルについて',
    value:
      'デジタルコンテンツという商品の性質上、決済完了後の返品・返金・キャンセルは承っておりません。あらかじめご了承の上ご購入ください。',
  },
  {
    label: '動作環境',
    value: '各アプリの詳細ページに記載の動作環境をご確認ください。',
  },
];

export default function TokushohoPage() {
  return (
    <div className="min-h-screen flex flex-col text-slate-100">
      <Navbar />
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            特定商取引法に基づく表記
          </h1>
          <p className="text-xs text-slate-400 mb-10">
            特定商取引法第11条に基づき、以下のとおり表示いたします。
          </p>

          <dl className="divide-y divide-slate-900 rounded-2xl border border-slate-900 bg-slate-900/40 overflow-hidden">
            {ROWS.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-1 sm:gap-4 px-5 py-4"
              >
                <dt className="text-xs font-bold text-slate-300">{row.label}</dt>
                <dd className="text-xs text-slate-400 leading-relaxed">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </main>
    </div>
  );
}

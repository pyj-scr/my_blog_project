import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-4xl font-black text-white mb-2">404</h2>
      <p className="text-sm text-slate-400 mb-6">요청하신 페이지를 찾을 수 없습니다.</p>
      <Link
        href="/"
        className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-rose-500 transition-all"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}

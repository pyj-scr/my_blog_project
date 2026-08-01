'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-bold text-white mb-2">오류가 발생했습니다</h2>
      <p className="text-xs text-slate-400 mb-6">
        {error.message || '일시적인 네트워크 또는 시스템 문제입니다.'}
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-rose-500 transition-all"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="rounded-xl bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-300 hover:text-white transition-all"
        >
          홈으로 이동
        </Link>
      </div>
    </div>
  );
}

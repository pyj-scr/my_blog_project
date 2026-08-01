'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko" className="dark">
      <body className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-2">시스템 오류가 발생했습니다</h2>
        <p className="text-xs text-slate-400 mb-6">{error.message}</p>
        <button
          onClick={() => reset()}
          className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-rose-500 transition-all"
        >
          다시 시도
        </button>
      </body>
    </html>
  );
}

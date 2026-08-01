import React from 'react';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-black text-xl text-white mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white font-bold text-sm">
                100
              </div>
              <span>어플 100엔 샾</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              AI 기술로 정성껏 개발한 고품질 유틸리티 & 생산성 어플리케이션을 누구나 부담 없이 100엔(₩1,000)에 득템할 수 있는 마켓플레이스입니다.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">안심 결제 & 서비스</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>100엔 단일 정가제 (추가금 X)</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>평생 다운로드 & 무제한 업데이트</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">카테고리</h4>
            <ul className="space-y-1.5 text-sm">
              <li><a href="/apps?category=AI 생산성" className="hover:text-white transition-colors">AI 생산성 도구</a></li>
              <li><a href="/apps?category=디자인 & 미디어" className="hover:text-white transition-colors">디자인 & 미디어</a></li>
              <li><a href="/apps?category=자동화" className="hover:text-white transition-colors">자동화 유틸리티</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 어플 100엔 샾 (100-Yen App Shop). All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for AI Builders
          </p>
        </div>
      </div>
    </footer>
  );
};

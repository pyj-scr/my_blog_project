'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Zap, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-slate-900 bg-slate-950 text-slate-400 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-900">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-rose-600 to-indigo-600 text-white font-black shadow-md shadow-rose-600/30">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                {t.brandTitle}
              </span>
              <span className="rounded-full bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 text-[10px] font-black text-rose-300">
                100円
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              {t.footerDesc}
            </p>
          </div>

          {/* Trust Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {t.footerTrustHeader}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{t.footerTrust1}</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{t.footerTrust2}</span>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {t.footerCategoryHeader}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/apps" className="hover:text-rose-400 transition-colors">
                  {t.footerCategory1}
                </Link>
              </li>
              <li>
                <Link href="/apps" className="hover:text-rose-400 transition-colors">
                  {t.footerCategory2}
                </Link>
              </li>
              <li>
                <Link href="/apps" className="hover:text-rose-400 transition-colors">
                  {t.footerCategory3}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{t.footerCopyright}</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 inline mx-0.5" />
            <span>for AI Builders</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

'use client';

import React, { useState } from 'react';
import { X, CreditCard, Lock, ShieldCheck, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { usePurchase } from '@/context/PurchaseContext';
import { useLanguage } from '@/context/LanguageContext';

export const PaymentModal: React.FC = () => {
  const { paymentModalApp, closePaymentModal } = usePurchase();
  const { language, formatPrice, t } = useLanguage();
  const [cardHolder, setCardHolder] = useState('YOYOGI YJ');
  const [isStripeRedirecting, setIsStripeRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!paymentModalApp) return null;

  const title = language === 'ja' && paymentModalApp.titleJa ? paymentModalApp.titleJa : language === 'en' && paymentModalApp.titleEn ? paymentModalApp.titleEn : paymentModalApp.title;

  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStripeRedirecting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: paymentModalApp.id,
          title: title,
          price: formatPrice(paymentModalApp),
          currency: language,
        }),
      });

      const data = await res.json();
      if (data.url) {
        // Redirect directly to Stripe Checkout Page
        window.location.href = data.url;
      } else {
        setErrorMessage(data.error || 'Stripe 결제 세션 생성 실패');
        setIsStripeRedirecting(false);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('결제 서버 연결 오류가 발생했습니다.');
      setIsStripeRedirecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white shadow-lg shadow-rose-600/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Stripe 100엔 공식 안심 결제</h2>
              <p className="text-xs text-slate-400">SSL 256-bit 암호화 카드 수금 처리</p>
            </div>
          </div>
          <button
            onClick={closePaymentModal}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleStripeCheckout} className="p-6 space-y-5">
          
          {/* Item Card */}
          <div className="flex items-center justify-between rounded-2xl bg-slate-950 p-4 border border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={paymentModalApp.thumbnailUrl}
                alt={title}
                className="h-12 w-12 rounded-xl object-cover"
              />
              <div>
                <h3 className="text-sm font-bold text-white line-clamp-1">{title}</h3>
                <span className="text-xs text-rose-400 font-semibold">{paymentModalApp.category}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-amber-400">{formatPrice(paymentModalApp)}</span>
              <p className="text-[10px] text-slate-400">영구 소장</p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              구매자 성함 (이름)
            </label>
            <input
              type="text"
              required
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-rose-500 focus:outline-none"
            />
          </div>

          {/* Stripe Guarantee Badge */}
          <div className="flex items-center gap-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 p-3.5 text-indigo-300 text-xs">
            <ShieldCheck className="h-5 w-5 text-indigo-400 shrink-0" />
            <div>
              <p className="font-bold">Stripe 100엔 공식 카드 결제 창으로 연결</p>
              <p className="text-[10px] text-indigo-300/80">버튼을 누르면 Stripe 보안 결제 페이지로 이동합니다.</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isStripeRedirecting}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 py-3.5 text-base font-black text-white shadow-xl shadow-rose-600/30 hover:opacity-95 transition-all disabled:opacity-50"
          >
            {isStripeRedirecting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Stripe 결제 창으로 이동 중...</span>
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" />
                <span>{formatPrice(paymentModalApp)} {t.buyBtn}</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};

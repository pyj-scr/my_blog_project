'use client';

import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, Download, Sparkles, Lock } from 'lucide-react';
import { usePurchase } from '@/context/PurchaseContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export const PaymentModal = () => {
  const { paymentModalApp, closePaymentModal, processPayment } = usePurchase();
  const { user } = useAuth();
  const { language, formatPrice, t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardHolder, setCardHolder] = useState(user?.name || '');

  if (!paymentModalApp) return null;

  const appTitle = language === 'ja' && paymentModalApp.titleJa ? paymentModalApp.titleJa : language === 'en' && paymentModalApp.titleEn ? paymentModalApp.titleEn : paymentModalApp.title;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await processPayment(paymentModalApp, cardHolder);
    setLoading(false);
    if (result) {
      setSuccess(true);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setLoading(false);
    closePaymentModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-rose-950/50">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 rounded-full bg-slate-800/80 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {!success ? (
          <div className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 shadow-lg shadow-rose-600/30">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{t.payModalTitle} ({formatPrice(paymentModalApp)})</h3>
                <p className="text-xs text-slate-400">{t.payModalSub}</p>
              </div>
            </div>

            <div className="mb-6 rounded-2xl bg-slate-950 p-4 border border-slate-800/80">
              <div className="flex items-center gap-3">
                <img
                  src={paymentModalApp.thumbnailUrl}
                  alt={appTitle}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{appTitle}</h4>
                  <p className="text-xs text-slate-400 truncate">{paymentModalApp.category}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-400">{formatPrice(paymentModalApp)}</span>
                    <span className="text-[10px] text-slate-500">Lifetime Access</span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Name / Email
                </label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="User Name (user@example.com)"
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Payment Method (Simulation)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 rounded-xl border border-rose-500/50 bg-rose-500/10 p-3 text-xs font-semibold text-rose-300">
                    <CreditCard className="h-4 w-4" />
                    <span>Credit Card ({formatPrice(paymentModalApp)})</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs font-semibold text-slate-400 opacity-60">
                    <Lock className="h-4 w-4" />
                    <span>PayPay / ApplePay</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-xl shadow-rose-600/30 hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>{t.buyBtn} ({formatPrice(paymentModalApp)})</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-[10px] text-slate-500">
                🔒 Stripe SSL Secured Checkout
              </p>
            </form>
          </div>
        ) : (
          /* Payment Success State */
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-1">{t.paySuccessTitle}</h3>
            <p className="text-xs text-slate-400 mb-6">
              [{appTitle}] {t.paySuccessSub}
            </p>

            <div className="mb-6 rounded-2xl bg-slate-950 p-4 border border-slate-800 text-left space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Price:</span>
                <span className="font-bold text-rose-400">{formatPrice(paymentModalApp)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">License:</span>
                <span className="font-semibold text-slate-200">Lifetime License</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href="/mypage"
                onClick={handleClose}
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-950/50 transition-all"
              >
                <Download className="h-4 w-4" />
                <span>{t.navMyPage}</span>
              </Link>
              <button
                onClick={handleClose}
                className="py-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

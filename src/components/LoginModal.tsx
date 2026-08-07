'use client';

import React, { useState } from 'react';
import { X, User, Mail, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export const LoginModal = () => {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const { language } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    login(name, email);
  };

  const handleQuickGoogleLogin = () => {
    let targetEmail = email.trim();
    if (!targetEmail) {
      const promptMsg =
        language === 'ja'
          ? 'Googleメールアドレスを入力してください:'
          : language === 'en'
          ? 'Enter your Google email address:'
          : 'Google 이메일 주소를 입력하세요:';
      const input = prompt(promptMsg, 'myaccount@gmail.com');
      if (!input) return;
      targetEmail = input.trim();
    }
    const defaultName = targetEmail.split('@')[0] || 'User';
    login(name || defaultName, targetEmail);
  };

  const labels = {
    ja: {
      title: 'アプリ 100円ショップ ログイン',
      sub: 'アプリのダウンロードおよび個人購入履歴の管理',
      googleBtn: 'Google アカウントでログイン',
      orDivider: 'またはメールアドレスでログイン',
      nameLabel: 'お名前 (ニックネーム)',
      namePlaceholder: '例: 山田太郎 / ユーザー',
      emailLabel: 'メールアドレス',
      emailPlaceholder: 'user@example.com',
      submitBtn: 'ログインして開始',
    },
    ko: {
      title: '어플 100엔 샾 로그인',
      sub: '어플 다운로드 및 개인 구매 내역 관리를 위한 로그인',
      googleBtn: 'Google 계정으로 로그인',
      orDivider: '또는 이메일 직접 입력',
      nameLabel: '이름 (닉네임)',
      namePlaceholder: '예: 홍길동 / 유저',
      emailLabel: '이메일 주소',
      emailPlaceholder: 'user@example.com',
      submitBtn: '시작하기 (로그인)',
    },
    en: {
      title: 'App $1 Shop Login',
      sub: 'Login to download apps and manage your purchase history',
      googleBtn: 'Sign in with Google',
      orDivider: 'Or sign in with Email',
      nameLabel: 'Name (Nickname)',
      namePlaceholder: 'e.g. John Doe / User',
      emailLabel: 'Email Address',
      emailPlaceholder: 'user@example.com',
      submitBtn: 'Get Started (Login)',
    },
  }[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl p-6">
        
        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 rounded-full bg-slate-800/80 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Brand & Title */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 shadow-lg shadow-rose-600/30">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-black text-white">{labels.title}</h3>
          <p className="text-xs text-slate-400 mt-1">{labels.sub}</p>
        </div>

        {/* Quick Social Auth Button */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleQuickGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-950 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"
              />
            </svg>
            <span>{labels.googleBtn}</span>
          </button>
        </div>

        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
          <span className="relative bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-500">{labels.orDivider}</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
              <User className="h-3.5 w-3.5 text-rose-400" />
              <span>{labels.nameLabel}</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={labels.namePlaceholder}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-rose-400" />
              <span>{labels.emailLabel}</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={labels.emailPlaceholder}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition-all mt-2"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{labels.submitBtn}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

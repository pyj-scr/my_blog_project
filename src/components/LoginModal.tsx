'use client';

import React, { useState } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff, Sparkles, ShieldCheck, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export const LoginModal = () => {
  const { isLoginModalOpen, closeLoginModal, login, signUp, loginWithGoogle } = useAuth();
  const { language } = useLanguage();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isLoginModalOpen) return null;

  const getTranslatedError = (errKey: string) => {
    switch (errKey) {
      case 'AUTH_WRONG_PASSWORD':
        return language === 'ja'
          ? 'パスワードが正しくありません。'
          : language === 'en'
          ? 'Incorrect password.'
          : '비밀번호가 올바르지 않습니다.';
      case 'AUTH_USER_NOT_FOUND':
        return language === 'ja'
          ? 'アカウントが見つかりません。新規会員登録を行ってください。'
          : language === 'en'
          ? 'Account not found. Please sign up.'
          : '등록되지 않은 계정입니다. 회원가입 탭에서 신규 가입해주세요.';
      case 'AUTH_EMAIL_EXISTS':
        return language === 'ja'
          ? '既に登録されているメールアドレスです。'
          : language === 'en'
          ? 'Email is already registered.'
          : '이미 가입된 이메일 주소입니다.';
      case 'AUTH_WEAK_PASSWORD':
        return language === 'ja'
          ? 'パスワードは6文字以上で入力してください。'
          : language === 'en'
          ? 'Password must be at least 6 characters.'
          : '비밀번호는 6자리 이상이어야 합니다.';
      case 'AUTH_GOOGLE_FAILED':
        return language === 'ja'
          ? 'Googleログイン認証に失敗しました。下のメールアドレス入力欄からご自身のメールを入力してログインしてください。'
          : language === 'en'
          ? 'Google authentication failed. Please enter your email below to sign in.'
          : 'Google 로그인 연동에 실패했습니다. 아래 이메일 입력창에 본인의 이메일을 입력하신 후 로그인해주세요.';
      default:
        return errKey;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      if (isSignUp) {
        await signUp(name, email, password);
      } else {
        await login(name, email, password);
      }
    } catch (err: any) {
      setErrorMsg(getTranslatedError(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await loginWithGoogle(email.trim());
    } catch (err: any) {
      setErrorMsg(getTranslatedError(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const labels = {
    ja: {
      title: 'アプリ 100円ショップ',
      sub: 'アプリのダウンロードおよび個人購入履歴の管理',
      tabLogin: 'ログイン',
      tabSignUp: '新規会員登録',
      googleBtn: 'Google アカウントでログイン',
      orDivider: 'またはメールアドレスとパスワードでログイン',
      nameLabel: 'お名前 (ニックネーム)',
      namePlaceholder: '例: 山田太郎 / ユーザー',
      emailLabel: 'メールアドレス',
      emailPlaceholder: 'user@example.com',
      passwordLabel: 'パスワード',
      passwordPlaceholder: '6文字以上のパスワード',
      submitLoginBtn: 'ログインして開始',
      submitSignUpBtn: '会員登録して開始',
      toggleToSignUp: 'アカウントをお持ちでないですか？ 新規登録',
      toggleToLogin: '既にアカウントをお持ちですか？ ログイン',
    },
    ko: {
      title: '어플 100엔 샾',
      sub: '어플 다운로드 및 개인 구매 내역 관리를 위한 회원 인증',
      tabLogin: '로그인',
      tabSignUp: '회원가입',
      googleBtn: 'Google 계정으로 로그인',
      orDivider: '또는 이메일 & 비밀번호 입력',
      nameLabel: '이름 (닉네임)',
      namePlaceholder: '예: 홍길동 / 유저',
      emailLabel: '이메일 주소',
      emailPlaceholder: 'user@example.com',
      passwordLabel: '비밀번호 (Password)',
      passwordPlaceholder: '6자리 이상 비밀번호',
      submitLoginBtn: '시작하기 (로그인)',
      submitSignUpBtn: '회원가입 완료하기',
      toggleToSignUp: '계정이 없으신가요? 회원가입',
      toggleToLogin: '이미 계정이 있으신가요? 로그인',
    },
    en: {
      title: 'App $1 Shop',
      sub: 'Login or Sign up to manage downloads and purchases',
      tabLogin: 'Sign In',
      tabSignUp: 'Sign Up',
      googleBtn: 'Sign in with Google',
      orDivider: 'Or continue with Email & Password',
      nameLabel: 'Name (Nickname)',
      namePlaceholder: 'e.g. John Doe / User',
      emailLabel: 'Email Address',
      emailPlaceholder: 'user@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: '6+ characters password',
      submitLoginBtn: 'Sign In & Get Started',
      submitSignUpBtn: 'Create Account',
      toggleToSignUp: "Don't have an account? Sign Up",
      toggleToLogin: 'Already have an account? Sign In',
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
        <div className="text-center mb-5">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 shadow-lg shadow-rose-600/30">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-black text-white">{labels.title}</h3>
          <p className="text-xs text-slate-400 mt-1">{labels.sub}</p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 mb-5 rounded-xl bg-slate-950 border border-slate-800">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
              !isSignUp ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>{labels.tabLogin}</span>
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
            className={`flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${
              isSignUp ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>{labels.tabSignUp}</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-300 text-center animate-fadeIn">
            {errorMsg}
          </div>
        )}

        {/* Quick Social Auth Button */}
        <div className="space-y-3 mb-5">
          <button
            onClick={handleGoogleAuth}
            type="button"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-950 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all shadow-sm disabled:opacity-50"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
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

        <div className="relative mb-5 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
          <span className="relative bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-500">{labels.orDivider}</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
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
          )}

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

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-rose-400" />
              <span>{labels.passwordLabel}</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={labels.passwordPlaceholder}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-3 text-xs font-bold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 transition-all mt-2 disabled:opacity-50"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>{isSignUp ? labels.submitSignUpBtn : labels.submitLoginBtn}</span>
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors font-medium"
          >
            {isSignUp ? labels.toggleToLogin : labels.toggleToSignUp}
          </button>
        </div>

      </div>
    </div>
  );
};

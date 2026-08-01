import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { PurchaseProvider } from '@/context/PurchaseContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { Footer } from '@/components/Footer';
import { PaymentModal } from '@/components/PaymentModal';
import { LoginModal } from '@/components/LoginModal';

export const metadata: Metadata = {
  title: '어플 100엔 샾 | アプリ 100円ショップ | App $1 Dollar Shop',
  description: 'AI로 만든 고품질 유틸리티 어플리케이션 100엔 / ₩1,000 / $1 마켓플레이스',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
        <LanguageProvider>
          <AuthProvider>
            <PurchaseProvider>
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <PaymentModal />
              <LoginModal />
            </PurchaseProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

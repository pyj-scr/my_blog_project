'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppItem, PurchaseItem } from '@/types/app';
import confetti from 'canvas-confetti';

interface PurchaseContextType {
  purchases: PurchaseItem[];
  paymentModalApp: AppItem | null;
  openPaymentModal: (app: AppItem) => void;
  closePaymentModal: () => void;
  processPayment: (app: AppItem, cardHolderName: string) => Promise<boolean>;
  isPurchased: (appId: string) => boolean;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export const PurchaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [paymentModalApp, setPaymentModalApp] = useState<AppItem | null>(null);

  useEffect(() => {
    const savedPurchases = localStorage.getItem('app100yen_purchases');
    if (savedPurchases) {
      try {
        setPurchases(JSON.parse(savedPurchases));
      } catch {
        localStorage.removeItem('app100yen_purchases');
      }
    }
  }, []);

  const openPaymentModal = (app: AppItem) => {
    setPaymentModalApp(app);
  };

  const closePaymentModal = () => {
    setPaymentModalApp(null);
  };

  const isPurchased = (appId: string) => {
    return purchases.some((p) => p.appId === appId);
  };

  const processPayment = async (app: AppItem): Promise<boolean> => {
    // 1초 결제 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newPurchase: PurchaseItem = {
      id: 'pur-' + Date.now(),
      appId: app.id,
      appTitle: app.title,
      priceJpy: app.priceJpy,
      priceFormatted: `${app.priceJpy}円 / ₩${app.priceKrw.toLocaleString()} / $${app.priceUsd.toFixed(2)}`,
      purchasedAt: new Date().toISOString().split('T')[0],
      licenseKey: '100YEN-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      downloadUrl: app.downloadUrl,
    };

    const updated = [newPurchase, ...purchases];
    setPurchases(updated);
    localStorage.setItem('app100yen_purchases', JSON.stringify(updated));

    // 결제 축하 축포 애니메이션 (Confetti)
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    return true;
  };

  return (
    <PurchaseContext.Provider
      value={{
        purchases,
        paymentModalApp,
        openPaymentModal,
        closePaymentModal,
        processPayment,
        isPurchased,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = () => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }
  return context;
};

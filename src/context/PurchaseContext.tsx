'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppItem, PurchaseItem } from '@/types/app';
import { useAuth } from '@/context/AuthContext';
import confetti from 'canvas-confetti';

interface PurchaseContextType {
  purchases: PurchaseItem[];
  paymentModalApp: AppItem | null;
  openPaymentModal: (app: AppItem) => void;
  closePaymentModal: () => void;
  processPayment: (app: AppItem, cardHolderName?: string, sessionId?: string) => Promise<boolean>;
  claimFreeApp: (app: AppItem) => Promise<boolean>;
  isPurchased: (appId: string) => boolean;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export const PurchaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [paymentModalApp, setPaymentModalApp] = useState<AppItem | null>(null);

  const getStorageKey = (email?: string | null) => {
    return email ? `app100yen_purchases_${email.toLowerCase().trim()}` : 'app100yen_purchases_guest';
  };

  // Load a cached copy instantly (works offline / before the server responds),
  // then reconcile with the server record for logged-in users so purchase
  // history survives switching browsers or clearing local cache.
  useEffect(() => {
    const key = getStorageKey(user?.email);
    const savedPurchases = localStorage.getItem(key);
    let cached: PurchaseItem[] = [];

    if (savedPurchases) {
      try {
        cached = JSON.parse(savedPurchases);
      } catch {
        localStorage.removeItem(key);
      }
    } else if (!user) {
      // Legacy fallback check for main key
      const legacyPurchases = localStorage.getItem('app100yen_purchases');
      if (legacyPurchases) {
        try {
          cached = JSON.parse(legacyPurchases);
        } catch {
          // ignore corrupt legacy data
        }
      }
    }
    setPurchases(cached);

    if (!user?.email) return;

    fetch(`/api/purchases?email=${encodeURIComponent(user.email)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && Array.isArray(data.purchases)) {
          setPurchases(data.purchases);
          localStorage.setItem(key, JSON.stringify(data.purchases));

          // Claim any purchase made as a guest (before login) on this browser
          // so it becomes visible from other devices too.
          const guestKey = getStorageKey(undefined);
          const guestRaw = localStorage.getItem(guestKey);
          if (guestRaw) {
            try {
              const guestPurchases: PurchaseItem[] = JSON.parse(guestRaw);
              const known = new Set(data.purchases.map((p: PurchaseItem) => p.sessionId).filter(Boolean));
              guestPurchases
                .filter((p) => p.sessionId && !known.has(p.sessionId))
                .forEach((p) => {
                  fetch('/api/purchases', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      appId: p.appId,
                      sessionId: p.sessionId,
                      appTitle: p.appTitle,
                      priceJpy: p.priceJpy,
                      priceFormatted: p.priceFormatted,
                      downloadUrl: p.downloadUrl,
                      userName: user.name,
                      userEmail: user.email,
                    }),
                  }).catch(() => {});
                });
            } catch {
              // ignore corrupt guest cache
            }
          }
        }
      })
      .catch((err) => console.warn('Failed to sync purchases from server', err));
  }, [user]);

  const openPaymentModal = (app: AppItem) => {
    setPaymentModalApp(app);
  };

  const closePaymentModal = () => {
    setPaymentModalApp(null);
  };

  const isPurchased = (appId: string) => {
    return purchases.some((p) => p.appId === appId);
  };

  // Records a purchase only after the given Stripe Checkout session is
  // confirmed paid server-side, and persists it to Firestore (not just
  // localStorage) so it survives browser/device changes for logged-in users.
  const processPayment = async (app: AppItem, cardHolderName?: string, sessionId?: string): Promise<boolean> => {
    if (!sessionId) {
      console.error('processPayment: missing sessionId, refusing to record an unverified purchase');
      return false;
    }
    if (purchases.some((p) => p.sessionId === sessionId)) {
      return true;
    }

    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: app.id,
          sessionId,
          appTitle: app.title,
          priceJpy: app.priceJpy,
          priceFormatted: `${app.priceJpy}円 / ₩${app.priceKrw.toLocaleString()} / $${app.priceUsd.toFixed(2)}`,
          downloadUrl: app.downloadUrl,
          userName: cardHolderName || user?.name || 'Guest',
          userEmail: user?.email,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data?.success || !data.purchase) {
        console.error('Purchase verification failed:', data?.error);
        return false;
      }

      const newPurchase: PurchaseItem = data.purchase;
      const updated = [newPurchase, ...purchases.filter((p) => p.sessionId !== sessionId)];
      setPurchases(updated);
      localStorage.setItem(getStorageKey(user?.email), JSON.stringify(updated));

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
    } catch (err) {
      console.error('processPayment error:', err);
      return false;
    }
  };

  // Grants a free (0-price) app without going through Stripe. The server looks up
  // the app's real stored price itself before recording the purchase, so this
  // can't be used to "claim" an app that actually costs money.
  const claimFreeApp = async (app: AppItem): Promise<boolean> => {
    if (purchases.some((p) => p.appId === app.id)) {
      return true;
    }

    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId: app.id,
          appTitle: app.title,
          downloadUrl: app.downloadUrl,
          userName: user?.name || 'Guest',
          userEmail: user?.email,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data?.success || !data.purchase) {
        console.error('Free app claim failed:', data?.error);
        return false;
      }

      const newPurchase: PurchaseItem = data.purchase;
      const updated = [newPurchase, ...purchases.filter((p) => p.appId !== app.id)];
      setPurchases(updated);
      localStorage.setItem(getStorageKey(user?.email), JSON.stringify(updated));

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
    } catch (err) {
      console.error('claimFreeApp error:', err);
      return false;
    }
  };

  return (
    <PurchaseContext.Provider
      value={{
        purchases,
        paymentModalApp,
        openPaymentModal,
        closePaymentModal,
        processPayment,
        claimFreeApp,
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

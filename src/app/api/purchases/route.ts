import { NextResponse } from 'next/server';
import { db } from '@/lib/firebaseAdmin';
import { fetchStripeCheckoutSession } from '@/lib/stripe';
import { MOCK_APPS } from '@/data/mockApps';
import type { AppItem, UserPurchase } from '@/types/app';

const PURCHASES_COLLECTION = 'purchases';
const APPS_COLLECTION = 'apps';

// Fallback in-memory store for local/dev environments without Firestore credentials
const memoryPurchases: UserPurchase[] = [];

// Looks up an app's authoritative, server-side record so price can never be
// trusted from the client (e.g. forging a paid app as a free claim).
async function getAppById(appId: string): Promise<AppItem | null> {
  if (db) {
    try {
      const doc = await db.collection(APPS_COLLECTION).doc(appId).get();
      if (doc.exists) return doc.data() as AppItem;
    } catch (err) {
      console.error('Firestore app lookup error:', err);
    }
  }
  return MOCK_APPS.find((a) => a.id === appId) || null;
}

// GET: Fetch a logged-in user's purchase history from the global server store
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email')?.toLowerCase().trim();

  if (!email) {
    return NextResponse.json({ success: false, error: 'Missing email' }, { status: 400 });
  }

  if (!db) {
    const purchases = memoryPurchases.filter((p) => p.userEmail === email);
    return NextResponse.json({ success: true, purchases });
  }

  try {
    const snapshot = await db.collection(PURCHASES_COLLECTION).where('userEmail', '==', email).get();
    const purchases = snapshot.docs
      .map((doc) => doc.data() as UserPurchase)
      .sort((a, b) => (a.purchasedAt < b.purchasedAt ? 1 : -1));
    return NextResponse.json({ success: true, purchases });
  } catch (err) {
    console.error('Firestore purchases GET error:', err);
    return NextResponse.json({ success: false, error: 'Failed to load purchases' }, { status: 500 });
  }
}

// POST: Verify a completed Stripe payment and record the purchase globally so it
// survives browser/device changes for logged-in users. A sessionId that Stripe
// confirms as paid is required — this prevents anyone from forging a free
// "purchase" by simply calling this endpoint with an appId.
//
// The one exception is an app that is genuinely free: the client may omit
// sessionId, but the server then looks up the app's real stored price itself
// (never trusting client-supplied price fields) and only proceeds if it is 0.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { appId, appTitle, priceFormatted, downloadUrl, userName, userEmail } = body || {};
    let { sessionId, priceJpy } = body || {};

    if (!appId) {
      return NextResponse.json({ success: false, error: 'Missing appId' }, { status: 400 });
    }

    const cleanEmail = typeof userEmail === 'string' ? userEmail.toLowerCase().trim() : undefined;

    if (!sessionId) {
      const app = await getAppById(appId);
      if (!app || app.priceJpy !== 0) {
        return NextResponse.json({ success: false, error: 'Payment required' }, { status: 402 });
      }
      sessionId = `free_${appId}_${cleanEmail || 'guest'}`;
      priceJpy = 0;
    } else {
      const session = await fetchStripeCheckoutSession(sessionId);
      if (!session || session.payment_status !== 'paid') {
        return NextResponse.json({ success: false, error: 'Payment not verified' }, { status: 402 });
      }
      if (session.metadata?.appId && session.metadata.appId !== appId) {
        return NextResponse.json({ success: false, error: 'Session/app mismatch' }, { status: 400 });
      }
    }

    // Idempotency: a page refresh or React effect re-run must not create duplicates.
    // If the purchase was originally recorded as a guest (no email) and the caller
    // is now logged in, claim it by attaching the account email.
    if (db) {
      const existing = await db.collection(PURCHASES_COLLECTION).where('sessionId', '==', sessionId).limit(1).get();
      if (!existing.empty) {
        const doc = existing.docs[0];
        const existingData = doc.data() as UserPurchase;
        if (cleanEmail && !existingData.userEmail) {
          const claimed = { ...existingData, userEmail: cleanEmail, userName: userName || existingData.userName };
          await doc.ref.set(claimed, { merge: true });
          return NextResponse.json({ success: true, purchase: claimed });
        }
        return NextResponse.json({ success: true, purchase: existingData });
      }
    } else {
      const dup = memoryPurchases.find((p) => p.sessionId === sessionId);
      if (dup) {
        if (cleanEmail && !dup.userEmail) {
          dup.userEmail = cleanEmail;
          dup.userName = userName || dup.userName;
        }
        return NextResponse.json({ success: true, purchase: dup });
      }
    }

    const purchase: UserPurchase = {
      id: 'pur-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      appId,
      appTitle: appTitle || appId,
      priceJpy,
      priceFormatted: priceFormatted || (priceJpy === 0 ? 'Free' : undefined),
      purchasedAt: new Date().toISOString().split('T')[0],
      licenseKey:
        '100YEN-' +
        Math.random().toString(36).substring(2, 8).toUpperCase() +
        '-' +
        Math.random().toString(36).substring(2, 8).toUpperCase(),
      userName: userName || 'Guest',
      userEmail: cleanEmail,
      downloadUrl,
      sessionId,
    };

    if (db) {
      await db.collection(PURCHASES_COLLECTION).doc(purchase.id).set(purchase);
    } else {
      memoryPurchases.unshift(purchase);
    }

    return NextResponse.json({ success: true, purchase });
  } catch (err) {
    console.error('Create purchase error:', err);
    return NextResponse.json({ success: false, error: 'Failed to record purchase' }, { status: 500 });
  }
}

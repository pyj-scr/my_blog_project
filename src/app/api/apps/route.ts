import { NextResponse } from 'next/server';
import { MOCK_APPS } from '@/data/mockApps';
import { AppItem } from '@/types/app';
import { autoTranslateApp, asyncTranslateApp } from '@/utils/autoTranslateApp';
import { sortAppsByNewest } from '@/utils/sortApps';
import { db } from '@/lib/firebaseAdmin';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

// Fallback in-memory store
let globalAppsStore: AppItem[] = sortAppsByNewest(MOCK_APPS.map(autoTranslateApp));

const APPS_COLLECTION = 'apps';

// Helper function to fetch all apps from Firestore or seed if empty
async function getAppsFromFirestore(): Promise<AppItem[]> {
  if (!db) return sortAppsByNewest(globalAppsStore);

  try {
    const snapshot = await db.collection(APPS_COLLECTION).get();
    
    if (snapshot.empty) {
      // Seed Firestore with initial mock apps
      const initialApps = sortAppsByNewest(MOCK_APPS.map(autoTranslateApp));
      const batch = db.batch();
      for (const app of initialApps) {
        const docRef = db.collection(APPS_COLLECTION).doc(app.id);
        batch.set(docRef, app);
      }
      await batch.commit();
      globalAppsStore = initialApps;
      return initialApps;
    }

    const apps: AppItem[] = [];
    snapshot.docs.forEach((doc: QueryDocumentSnapshot) => {
      apps.push(doc.data() as AppItem);
    });

    const sortedApps = sortAppsByNewest(apps);

    // Keep memory fallback updated
    globalAppsStore = sortedApps;
    return sortedApps;
  } catch (error) {
    console.error('Firestore GET error:', error);
    return sortAppsByNewest(globalAppsStore);
  }
}

// GET: Fetch all global apps shared across all browsers and users worldwide (Sorted newest first)
export async function GET() {
  const apps = await getAppsFromFirestore();
  return NextResponse.json({
    success: true,
    apps,
  });
}

// POST: Add new app globally to Firestore & server store
export async function POST(request: Request) {
  try {
    const body: AppItem = await request.json();
    
    // Auto translate to KO, JA, EN 3 languages
    const translatedApp = await asyncTranslateApp(body);

    if (db) {
      await db.collection(APPS_COLLECTION).doc(translatedApp.id).set(translatedApp);
    }

    // Keep memory fallback in sync
    globalAppsStore = sortAppsByNewest([translatedApp, ...globalAppsStore.filter((a) => a.id !== translatedApp.id)]);

    const allApps = await getAppsFromFirestore();

    return NextResponse.json({
      success: true,
      app: translatedApp,
      apps: allApps,
    });
  } catch (err) {
    console.error('Create app error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to create app globally' },
      { status: 500 }
    );
  }
}

// PUT: Update an existing app globally in Firestore & server store
export async function PUT(request: Request) {
  try {
    const body: AppItem = await request.json();
    const translatedApp = await asyncTranslateApp(body);

    if (db) {
      await db.collection(APPS_COLLECTION).doc(translatedApp.id).set(translatedApp, { merge: true });
    }

    globalAppsStore = sortAppsByNewest(
      globalAppsStore.map((app) => (app.id === translatedApp.id ? translatedApp : app))
    );

    const allApps = await getAppsFromFirestore();

    return NextResponse.json({
      success: true,
      app: translatedApp,
      apps: allApps,
    });
  } catch (err) {
    console.error('Update app error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to update app globally' },
      { status: 500 }
    );
  }
}

// DELETE: Remove an app globally from Firestore & server store
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('id');

    if (!appId) {
      return NextResponse.json({ success: false, error: 'Missing app id' }, { status: 400 });
    }

    if (db) {
      await db.collection(APPS_COLLECTION).doc(appId).delete();
    }

    globalAppsStore = sortAppsByNewest(globalAppsStore.filter((app) => app.id !== appId));

    const allApps = await getAppsFromFirestore();

    return NextResponse.json({
      success: true,
      apps: allApps,
    });
  } catch (err) {
    console.error('Delete app error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to delete app globally' },
      { status: 500 }
    );
  }
}

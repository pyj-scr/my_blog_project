import { NextResponse } from 'next/server';
import { MOCK_APPS } from '@/data/mockApps';
import { AppItem } from '@/types/app';
import { autoTranslateApp, asyncTranslateApp } from '@/utils/autoTranslateApp';

// Global In-Memory Server Store (Persists for all visitors across all browsers on the server)
let globalAppsStore: AppItem[] = MOCK_APPS.map(autoTranslateApp);

// GET: Fetch all global apps shared across all browsers and users worldwide
export async function GET() {
  return NextResponse.json({
    success: true,
    apps: globalAppsStore,
  });
}

// POST: Add new app globally to the server store so all visitors instantly see it
export async function POST(request: Request) {
  try {
    const body: AppItem = await request.json();
    
    // Auto translate to KO, JA, EN 3 languages
    const translatedApp = await asyncTranslateApp(body);

    // Unshift to the global server store (Newest first)
    globalAppsStore = [translatedApp, ...globalAppsStore];

    return NextResponse.json({
      success: true,
      app: translatedApp,
      apps: globalAppsStore,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to create app globally' },
      { status: 500 }
    );
  }
}

// PUT: Update an existing app globally in the server store
export async function PUT(request: Request) {
  try {
    const body: AppItem = await request.json();
    const translatedApp = await asyncTranslateApp(body);

    globalAppsStore = globalAppsStore.map((app) =>
      app.id === translatedApp.id ? translatedApp : app
    );

    return NextResponse.json({
      success: true,
      app: translatedApp,
      apps: globalAppsStore,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to update app globally' },
      { status: 500 }
    );
  }
}

// DELETE: Remove an app globally from the server store
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('id');

    if (!appId) {
      return NextResponse.json({ success: false, error: 'Missing app id' }, { status: 400 });
    }

    globalAppsStore = globalAppsStore.filter((app) => app.id !== appId);

    return NextResponse.json({
      success: true,
      apps: globalAppsStore,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete app globally' },
      { status: 500 }
    );
  }
}

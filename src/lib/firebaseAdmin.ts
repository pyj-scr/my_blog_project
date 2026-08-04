import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  if (projectId && clientEmail && privateKey) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else {
    // Fallback to local JSON key file if present
    const jsonPath = path.join(process.cwd(), 'yen-1531f-firebase-adminsdk-fbsvc-ca2cb2217f.json');
    if (fs.existsSync(jsonPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      console.warn('Firebase Admin SDK: No credentials found in ENV or local JSON file.');
    }
  }
}

export const db = getApps().length ? getFirestore() : null;

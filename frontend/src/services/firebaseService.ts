import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { StorageService } from './storageService';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;

export function initializeFirebase() {
  const config = StorageService.getFirebaseConfig();
  
  // Also check Vite environment variables if present
  const envConfig = {
    apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || config.apiKey,
    authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || config.authDomain,
    projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || config.projectId,
    storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || config.storageBucket,
    messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || config.messagingSenderId,
    appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || config.appId,
  };

  const isConfigured = Boolean(envConfig.apiKey && envConfig.projectId);

  if (isConfigured && !getApps().length) {
    try {
      app = initializeApp(envConfig);
      auth = getAuth(app);
      firestore = getFirestore(app);
      console.log('Firebase initialized successfully for Peer Skill Exchange Platform.');
      return { app, auth, firestore, isConfigured: true };
    } catch (err) {
      console.warn('Firebase initialization error, fallback to local demo mode:', err);
      return { app: null, auth: null, firestore: null, isConfigured: false };
    }
  }

  return { app, auth, firestore, isConfigured };
}

export function isFirebaseConfigured(): boolean {
  const config = StorageService.getFirebaseConfig();
  const envKey = (import.meta as any).env?.VITE_FIREBASE_API_KEY;
  return Boolean((envKey || config.apiKey) && (config.projectId || (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID));
}

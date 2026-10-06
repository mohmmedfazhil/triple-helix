import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import configJson from '../../firebase-applet-config.json';

export const firebaseConfig = {
  apiKey: configJson.apiKey,
  authDomain: configJson.authDomain,
  projectId: configJson.projectId,
  storageBucket: configJson.storageBucket,
  messagingSenderId: configJson.messagingSenderId,
  appId: configJson.appId,
  firestoreDatabaseId: configJson.firestoreDatabaseId
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Cloud Firestore with dedicated databaseId
export const db = configJson.firestoreDatabaseId && configJson.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, configJson.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Connectivity check test
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'global_config', 'main'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client offline status check:', error.message);
    }
  }
}
testConnection();

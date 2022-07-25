import type { FirebaseOptions } from 'firebase/app'
import { getApp, getApps } from 'firebase/app'
import { initializeApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore, initializeFirestore } from 'firebase/firestore'
import { connectStorageEmulator, getStorage } from 'firebase/storage'

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// NOTE: 初期化が一度だけ行われるように
const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth()

// undefinedなプロパティを無視する
initializeFirestore(firebaseApp, {
  ignoreUndefinedProperties: true,
})
const db = getFirestore()
const storage = getStorage()

if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'enabled') {
  connectAuthEmulator(auth, 'http://localhost:19099')
  connectFirestoreEmulator(db, 'localhost', 18081)
  connectStorageEmulator(storage, 'localhost', 19199)
}
// eslint-disable-next-line import/no-default-export
export default firebaseApp
export { auth, db, storage }

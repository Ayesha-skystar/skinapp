import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';

const historyFirebaseConfig = {
  apiKey: "AIzaSyBQ-zBkBr7InWXu8CyF_sGEqUWSDiLcf9M",
  authDomain: "expo-sign-up-6d1e3.firebaseapp.com",
  projectId: "expo-sign-up-6d1e3",
  storageBucket: "expo-sign-up-6d1e3.appspot.com",
  messagingSenderId: "148115738082",
  appId: "1:148115738082:web:483b9b5be16f16bb957dbb",
  measurementId: "G-T5DZ659PH9"
};

const historyApp = initializeApp(historyFirebaseConfig, 'HistoryModule');

const historyFirestore = initializeFirestore(historyApp, {
  localCache: persistentLocalCache(),
  experimentalForceLongPolling: true
});

export { historyFirestore };
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDZ-F7zcR7P0esFJfEuJrN0D8wsm-NKbfk",
  authDomain: "my-portfolio-cdd56.firebaseapp.com",
  projectId: "my-portfolio-cdd56",
  storageBucket: "my-portfolio-cdd56.firebasestorage.app",
  messagingSenderId: "413846376234",
  appId: "1:413846376234:web:6ecc2fc35ec137689cd853"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db };
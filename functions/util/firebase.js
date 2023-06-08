import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp({
  apiKey: "XXXXXXXX",
  authDomain: "XXXXXXXX",
  projectId: "XXXXXXXX",
  storageBucket: "XXXXXXXX",
  messagingSenderId: "XXXXXXXX",
  appId: "XXXXXXXX"
});

const auth = getAuth(app);
const firestore = getFirestore(app);


export {
  auth,
  firestore
};
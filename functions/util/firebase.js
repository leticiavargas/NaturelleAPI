import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import config from '../config.js';

const app = initializeApp(config);

const auth = getAuth(app);
const firestore = getFirestore(app);


export {
  auth,
  firestore
};
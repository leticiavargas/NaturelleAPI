
import  functions from 'firebase-functions';
import  express from 'express';

import { loginUser } from './API/login.js';
import { createUser } from './API/users.js';

const app = express();


// Users
app.post('/login', loginUser);
app.post('/users', createUser);


export const api = functions.https.onRequest(app);
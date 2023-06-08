
import  functions from 'firebase-functions';
import  express from 'express';

import { loginUser } from './API/login.js';
import { createUser } from './API/users.js';
import { getAllProducts, getProduct } from './API/products.js';

const app = express();


// Users
app.post('/login', loginUser);
app.post('/users', createUser);

// Products
app.get('/products', getAllProducts);
app.get('/products/:id', getProduct);


export const api = functions.https.onRequest(app);
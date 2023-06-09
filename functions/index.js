
import  functions from 'firebase-functions';
import  express from 'express';

import { loginUser } from './API/login.js';
import { createUser } from './API/users.js';
import { getAllProducts, getProduct } from './API/products.js';
import { getReview, getAllReviewsByProduct } from "./API/reviews.js";
import { getAllCategories } from './API/categories.js';

const app = express();


// Users
app.post('/login', loginUser);
app.post('/users', createUser);

// Products
app.get('/products', getAllProducts);
app.get('/products/:id', getProduct);

//Reviews
app.get('/products/:id/reviews', getAllReviewsByProduct);
app.get('/products/:id/reviews/:reviewId', getReview);
app.get('/reviews/:reviewId', getReview);

//Categories
app.get('/categories', getAllCategories);


export const api = functions.https.onRequest(app);
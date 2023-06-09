import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../util/firebase.js';
import { getCategory } from './categories.js';
import { averageRate } from './reviews.js';

export const getAllProducts = async (request, response) => {

  let products = [];
  const querySnapshot = await getDocs(collection(firestore, "products"));

  if (querySnapshot.size > 0) {
    let error = false;

    for (let doc of querySnapshot.docs) {
      const product = doc.data();
      const category = await getCategory(product.categoryId);
      if (!category) {
        error = true;
        break;
      }

      const average = await averageRate(doc.id);

      products.push({
        id: doc.id,
        category: category.name,
        avgRate: average?.avgRate ?? 0,
        reviewsCount: average?.reviewsCount ?? 0,
        ...product
      })
    }

    if (error) {
      response.status(417).json({ message: "Oopsie-daisy! It appears that the category registration went a little off course."});
    } else {
      response.status(200).json(products);
    }
  } else {
    response.status(404).json({ message: "Whoopsie-daisy! It appears that the list of products decided to play hide-and-seek with us." })
  }

}

export const getProduct = async (request, response) => {
  const productId = request.params.id;

  const docSnap = await getDoc(doc(firestore, "products", productId));

  if (docSnap.exists()) {
    const product = docSnap.data();
    const category = await getCategory(product.categoryId);
   
    if (!category) {
      response.status(417).json({ message: "Oopsie-daisy! It appears that the category registration went a little off course."});
    } else {
      const average = await averageRate(productId);
      delete product.categoryId;
  
      response.status(200).json({
        ...product,
        category: category?.name,
        avgRate: average?.avgRate ?? 0,
        reviewsCount: average?.reviewsCount ?? 0,
      });
    }

  } else {
    response.status(404).json({ message: "Oops! Looks like your product went on a little adventure without us." })
  }
}
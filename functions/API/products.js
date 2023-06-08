import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../util/firebase.js';

export const getAllProducts = async (request, response) => {

  let products = [];
  const querySnapshot = await getDocs(collection(firestore, "products"));
  
  if(querySnapshot.size > 1) {
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      })
    })
    response.status(200).json(products);
  } else {
    response.status(404).json({ message: "Whoopsie-daisy! It appears that the list of products decided to play hide-and-seek with us."})
  }
  
}

export const getProduct = async (request, response) => {
  const productId = request.params.id;

  const docSnap = await getDoc(doc(firestore, "products", productId));

  if(docSnap.exists()) {
    response.status(200).json(docSnap.data());
  } else {
    response.status(404).json({message : "Oops! Looks like your product went on a little adventure without us."})
  }

}
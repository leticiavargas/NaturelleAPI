import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../util/firebase.js';

export const getAllCategories = async (request, response) => {

  let categories = [];
  const querySnapshot = await getDocs(collection(firestore, "categories"));
  
  if(querySnapshot.size > 0) {
    querySnapshot.forEach((doc) => {
      categories.push({
        id: doc.id,
        ...doc.data()
      })
    })
    response.status(200).json(categories);
  } else {
    response.status(404).json({ message: "Oops! It seems like the list of categories went on an unexpected detour. "})
  } 
}

export const getCategory = async(categoryId) => {
    const docSnap = await getDoc(doc(firestore, "categories", categoryId));

    if(docSnap.exists()) {
      return docSnap.data();
    } else {
      return undefined;
    }
}
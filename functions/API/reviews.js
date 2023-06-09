import { collection, getDocs, doc, getDoc, query, where, orderBy, addDoc } from 'firebase/firestore';
import { firestore } from '../util/firebase.js';

export const getAllReviewsByProduct = async (request, response) => {
  const productId = request.params.id;

  let reviews = [];
  const q = query(collection(firestore, "reviews"), where("productId", "==", productId), orderBy("createdAt", "desc"))
  const querySnapshot = await getDocs(q);

  if(querySnapshot.size > 0) {
    querySnapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data()
      })
    })
    response.status(200).json(reviews);
  } else {
    response.status(404).json({ message: "Oopsie! It seems like the product reviews are as shy as a turtle in its shell."})
  }

}

export const getReview = async (request, response) => {
  const reviewId = request.params.reviewId;

  const docSnap = await getDoc(doc(firestore, "reviews", reviewId));

  if(docSnap.exists()) {
    response.status(200).json(docSnap.data());
  } else {
    response.status(404).json({message : "Uh-oh! It looks like that particular review took a little vacation."})
  }
}

export const createReview = async (request, response) => {
  
  const newReview = {
    title: request.body.title ?? '',
    userId: request.body.userId,
    productId: request.body.productId,
    description: request.body.description ?? '',
    rate: request.body.rate,
    createdAt: new Date(),
  };

  //const { valid, errors } = validateCreateReview(newReview);

  //if (!valid) return response.status(400).json(errors);

    try {
      await addDoc(collection(firestore, "reviews"), {
        ...newReview
      });
      return response.status(201).json({ message: "Thank you so much for taking the time to share your valuable review! Your feedback is like a ray of sunshine that brightens our day." });
      
    } catch (error) {
      return response.status(500).json({ general: 'Oh, no worries! It seems like our attempt to create the review hit a tiny bump in the road. ' });
    }
}

export const averageRate = async(productId) => {
  
  const querySnapshot = await getDocs(query(collection(firestore, "reviews"), where("productId", "==", productId)));
  const reviewsCount = querySnapshot.size;
  let rateSum = 0;
  let avgRate = 0;

  if(reviewsCount > 0) {
    querySnapshot.forEach((doc) => {
      rateSum+= parseInt(doc.data().rate);
    })
    avgRate = rateSum / reviewsCount;
  }


  return {
    avgRate,
    reviewsCount
  }
}
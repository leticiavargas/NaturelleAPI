import { auth, firestore } from '../util/firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';

import { validateCreateUserData } from '../util/validators.js';

export const createUser = async (request, response) => {
  const password = request.body.password
  const newUser = {
    name: request.body.name,
    email: request.body.email,
    address: [{
      street: request.body.street,
      number: request.body.number,
      complement: request.body.complement ?? '',
      district: request.body.district,
      cep: request.body.cep,
      city: request.body.city,
      state: request.body.state,
      default: request.body.defaultAddress ?? false,
    }]
  };

  const { valid, errors } = validateCreateUserData(newUser);

  if (!valid) return response.status(400).json(errors);

  const q = query(collection(firestore, "users"), where('email', '==', newUser.email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.size > 0) {
    return response.status(400).json({ username: 'this email is already taken' });
  } else {
    try {
      const credential = await createUserWithEmailAndPassword(auth, newUser.email, password);
      const userUid = credential?.user.uid;
      const token = credential?.user.toJSON().stsTokenManager.accessToken;
      await setDoc(doc(firestore, "users", userUid), {
        ...newUser
      });
      return response.status(201).json({ token });
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        return response.status(400).json({ email: 'Email already in use' });
      } else {
        return response.status(500).json({ general: 'Something went wrong, please try again' });
      }
    }

  }
};
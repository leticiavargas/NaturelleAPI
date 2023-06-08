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

  console.log("usuário  >>>", newUser);

  const { valid, errors } = validateCreateUserData(newUser);

  if (!valid) return response.status(400).json(errors);

  const q = query(collection(firestore, "users"), where('email', '==', newUser.email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.size > 0) {
    return response.status(400).json({ username: 'this email is already taken' });
  } else {
    console.log("CADASTRAR O USUÁRIO MONGÃO");
    try {
      const credential = await createUserWithEmailAndPassword(auth, newUser.email, password);
      console.log("credencial >>>", credential.user.toJSON().stsTokenManager.accessToken);
      const userUid = credential?.user.uid;
      const token = credential?.user.toJSON().stsTokenManager.accessToken;
      await setDoc(doc(firestore, "users", userUid), {
        ...newUser
      });
      return response.status(201).json({ token });
      
    } catch (error) {
      console.log({error})
      if (error.code === 'auth/email-already-in-use') {
        return response.status(400).json({ email: 'Email already in use' });
      } else {
        return response.status(500).json({ general: 'Something went wrong, please try again' });
      }
    }

  }
  
 
/*db
    .doc(`/users/${newUser.email}`)
    .get()
    .then((doc) => {
        if (doc.exists) {
            return response.status(400).json({ username: 'this username is already taken' });
        } else {
            return firebase
                    .auth()
                    .createUserWithEmailAndPassword(
                        newUser.email, 
                        newUser.password
                );
        }
    })
    .then((data) => {
        userId = data.user.uid;
        return data.user.getIdToken();
    })
    .then((idtoken) => {
        token = idtoken;
        const userCredentials = {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            username: newUser.username,
            phoneNumber: newUser.phoneNumber,
            country: newUser.country,
            email: newUser.email,
            createdAt: new Date().toISOString(),
            userId
        };
        return db
                .doc(`/users/${newUser.username}`)
                .set(userCredentials);
    })
    .then(()=>{
        return response.status(201).json({ token });
    })
    .catch((err) => {
  console.error(err);
  if (err.code === 'auth/email-already-in-use') {
    return response.status(400).json({ email: 'Email already in use' });
  } else {
    return response.status(500).json({ general: 'Something went wrong, please try again' });
  }
});*/
};
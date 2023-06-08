import { auth } from '../util/firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { validateLoginData } from '../util/validators.js';

// Login
export const loginUser = (request, response) => {
  const user = {
      email: request.body.email,
      password: request.body.password
  }

  const { valid, errors } = validateLoginData(user);
	if (!valid) return response.status(400).json(errors);

  signInWithEmailAndPassword(auth, user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
        return response.json({ token });
    })
    .catch((error) => {
        console.error(error);
        return response.status(403).json({ general: 'wrong credentials, please try again'});
    })
};
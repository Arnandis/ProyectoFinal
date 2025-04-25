import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
//Logica de login
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { uid: userCredential.user.uid };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Lógica de registro
export const registerWithEmail = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { uid: userCredential.user.uid };
  };
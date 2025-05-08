import { getAuth } from 'firebase/auth';
import {
  collection,
  query,
  where,
  orderBy,
  startAt,
  endAt,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export const buscarUsuariosPorEmail = async (input) => {
  const userId = getAuth().currentUser?.uid;
  if (!input || input.length < 2) return [];

  const q = query(
    collection(db, 'users'),
    orderBy('email'),
    startAt(input),
    endAt(input + '\uf8ff')
  );

  const snapshot = await getDocs(q);
  const results = snapshot.docs
    .filter(doc => doc.id !== userId)
    .map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

  return results;
};

export const enviarSolicitudAmistad = async (input) => {
  const userId = getAuth().currentUser?.uid;
  if (!input || !userId) throw new Error('Faltan datos');

  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error('Usuario actual no encontrado');

  const data = userSnap.data();
  if (data.amigos?.includes(input) || data.peticionesPendientes?.includes(input)) {
    throw new Error('Ya enviaste una solicitud o son amigos');
  }

  if (input.includes('@')) {
    const q = query(collection(db, 'users'), where('email', '==', input));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const otroUsuarioId = userDoc.id;
      const otroUsuarioRef = doc(db, 'users', otroUsuarioId);

      await updateDoc(otroUsuarioRef, {
        peticionesPendientes: arrayUnion(userId),
      });

      return `Has enviado una solicitud a ${input}`;
    } else {
      throw new Error('No se encontró un usuario con ese correo');
    }
  } else {
    const otroUsuarioRef = doc(db, 'users', input);
    const otroUsuarioSnap = await getDoc(otroUsuarioRef);

    if (!otroUsuarioSnap.exists()) {
      throw new Error('No se encontró un usuario con ese nombre');
    }

    await updateDoc(otroUsuarioRef, {
      peticionesPendientes: arrayUnion(userId),
    });

    return `Has enviado una solicitud a ${input}`;
  }
};

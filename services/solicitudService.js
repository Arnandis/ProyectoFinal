import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Alert } from 'react-native';

export const fetchSolicitudes = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      const ids = data.peticionesPendientes || [];

      const detalles = await Promise.all(
        ids.map(async (id) => {
          const docSnap = await getDoc(doc(db, 'users', id));
          return docSnap.exists() ? { id, ...docSnap.data() } : null;
        })
      );

      return detalles.filter(Boolean);
    }
    return [];
  } catch (error) {
    console.error('Error al cargar solicitudes:', error);
    return [];
  }
};

export const aceptarSolicitudService = async (userId, otroId) => {
  try {
    const otroRef = doc(db, 'users', otroId);
    await updateDoc(otroRef, {
      peticionesPendientes: arrayRemove(userId),
      amigos: arrayUnion(userId),
    });
    return true;
  } catch (error) {
    console.error('Error al aceptar solicitud:', error);
    Alert.alert('Error', 'No se pudo aceptar la solicitud');
    return false;
  }
};

export const rechazarSolicitudService = async (userId, otroId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const otroRef = doc(db, 'users', otroId);

    await updateDoc(userRef, {
      peticionesPendientes: arrayRemove(otroId),
    });

    await updateDoc(otroRef, {
      peticionesPendientes: arrayRemove(userId),
    });

    return true;
  } catch (error) {
    console.error('Error al rechazar solicitud:', error);
    Alert.alert('Error', 'No se pudo rechazar la solicitud');
    return false;
  }
};

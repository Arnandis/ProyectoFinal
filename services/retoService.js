import { collection, getDocs, query, where, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// Obtiene todos los retos aceptados donde el usuario participa
export const getRetosActivosPorUsuario = async (uid) => {
  try {
    const ref = collection(db, 'retos');
    const q = query(ref, where('estado', '==', 'aceptado'));

    const snapshot = await getDocs(q);
    const retos = [];

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      if (data.creadorId === uid || data.retadoId === uid) {
        retos.push({ id: docSnap.id, ...data });
      }
    });

    return retos;
  } catch (error) {
    console.error("Error obteniendo retos activos:", error);
    return [];
  }
};

// Obtiene los datos de un usuario por su ID
export const getUserById = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.warn(`Usuario con id ${uid} no encontrado.`);
      return null;
    }
  } catch (error) {
    console.error("Error obteniendo usuario:", error);
    return null;
  }
};

export const sumarEstrellas = async (userId, cantidad) => {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  const estrellasActuales = snap.exists() ? snap.data().estrellas || 0 : 0;
  await updateDoc(ref, { estrellas: estrellasActuales + cantidad });
};

export const restarEstrellas = async (userId, cantidad) => {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  const estrellasActuales = snap.exists() ? snap.data().estrellas || 0 : 0;
  const nuevas = Math.max(0, estrellasActuales - cantidad);
  await updateDoc(ref, { estrellas: nuevas });
};
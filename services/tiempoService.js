// services/tiempoService.js
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export const saveGraficoTiempo = async (fecha, timeData) => {
  try {
    const docRef = doc(db, 'graficos_tiempo', fecha); // Usa la fecha como ID único
    await setDoc(docRef, { fecha, ...timeData });
  } catch (error) {
    console.error('Error al guardar gráfico de tiempo:', error);
    throw error;
  }
};

export const getGraficoTiempo = async (fecha) => {
  try {
    const docRef = doc(db, 'graficos_tiempo', fecha);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener gráfico de tiempo:', error);
    throw error;
  }
};

export const updateGraficoTiempo = async (fecha, timeData) => {
  try {
    const docRef = doc(db, 'graficos_tiempo', fecha);
    await updateDoc(docRef, timeData);
  } catch (error) {
    console.error('Error al actualizar gráfico de tiempo:', error);
    throw error;
  }
};

export const deleteGraficoTiempo = async (fecha) => {
  try {
    const docRef = doc(db, 'graficos_tiempo', fecha);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error al eliminar gráfico de tiempo:', error);
    throw error;
  }
};

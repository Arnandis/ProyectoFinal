import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// Normaliza y valida los campos de ingresos y gastos
const normalizarGrafico = (ingresos, gastos) => {
  const parsedIngresos = parseFloat(ingresos);
  if (isNaN(parsedIngresos)) {
    throw new Error('Ingresos inválidos');
  }

  const categorias = ['ocio', 'alquiler', 'festivales', 'compras', 'juegos', 'otros'];
  const gastosNormalizados = {};

  categorias.forEach(cat => {
    const valor = parseFloat(gastos[cat]);
    gastosNormalizados[cat] = isNaN(valor) ? 0 : valor;
  });

  return {
    ingresos: parsedIngresos,
    gastos: gastosNormalizados
  };
};

// Guardar gráfico en la subcolección del usuario
export const saveGrafico = async (userId, fecha, ingresos, gastos) => {
  try {
    const data = normalizarGrafico(ingresos, gastos);
    const docRef = doc(db, 'usuarios', userId, 'graficos_finanzas', fecha); // Subcolección por usuario
    await setDoc(docRef, { fecha, ...data });
  } catch (error) {
    console.error('Error al guardar gráfico:', error);
    throw error;
  }
};

// Obtener gráfico individual del usuario
export const getGrafico = async (userId, fecha) => {
  try {
    const docRef = doc(db, 'usuarios', userId, 'graficos_finanzas', fecha);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener gráfico:', error);
    throw error;
  }
};

// Actualizar gráfico del usuario
export const updateGrafico = async (userId, fecha, newData) => {
  try {
    const data = normalizarGrafico(newData.ingresos, newData.gastos);
    const docRef = doc(db, 'usuarios', userId, 'graficos_finanzas', fecha);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error al actualizar gráfico:', error);
    throw error;
  }
};

// Eliminar gráfico del usuario
export const deleteGrafico = async (userId, fecha) => {
  try {
    const docRef = doc(db, 'usuarios', userId, 'graficos_finanzas', fecha);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error al eliminar gráfico:', error);
    throw error;
  }
};

// Obtener todos los gráficos del usuario
export const getAllGraficos = async (userId) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'usuarios', userId, 'graficos_finanzas'));
    const graficos = [];
    querySnapshot.forEach((doc) => {
      graficos.push(doc.data());
    });
    return graficos;
  } catch (error) {
    console.error('Error al obtener todos los gráficos:', error);
    throw error;
  }
};

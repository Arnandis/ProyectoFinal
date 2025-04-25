// services/graficoService.js
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
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

export const saveGrafico = async (fecha, ingresos, gastos) => {
  try {
    const data = normalizarGrafico(ingresos, gastos);
    const docRef = doc(db, 'graficos', fecha); // usamos la fecha como ID único
    await setDoc(docRef, { fecha, ...data });
  } catch (error) {
    console.error('Error al guardar gráfico:', error);
    throw error;
  }
};

export const getGrafico = async (fecha) => {
  try {
    const docRef = doc(db, 'graficos', fecha);
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

export const updateGrafico = async (fecha, newData) => {
  try {
    const data = normalizarGrafico(newData.ingresos, newData.gastos);
    const docRef = doc(db, 'graficos', fecha);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error al actualizar gráfico:', error);
    throw error;
  }
};

export const deleteGrafico = async (fecha) => {
  try {
    const docRef = doc(db, 'graficos', fecha);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error al eliminar gráfico:', error);
    throw error;
  }
};

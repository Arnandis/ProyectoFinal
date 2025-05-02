import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// Normaliza los datos de tiempo (convierte a número o 0)
const normalizarTiempo = (tiempos) => {
  const categorias = ['estudio', 'trabajo', 'descanso', 'deporte', 'familia', 'otros'];
  const tiemposNormalizados = {};

  categorias.forEach(cat => {
    const valor = parseFloat(tiempos[cat]);
    tiemposNormalizados[cat] = isNaN(valor) ? 0 : valor;
  });

  return tiemposNormalizados;
};


// Guardar gráfico de tiempo en la subcolección del usuario
export const saveGraficoTiempo = async (userId, fecha, tiempos) => {
  try {
    const datosNormalizados = normalizarTiempo(tiempos);
    const totalHoras = Object.values(datosNormalizados).reduce((a, b) => a + b, 0);
    const docRef = doc(db, 'usuarios', userId, 'graficos_tiempo', fecha);
    await setDoc(docRef, { fecha, tiempos: datosNormalizados, totalHoras });
  } catch (error) {
    console.error('Error al guardar gráfico de tiempo:', error);
    throw error;
  }
};

// Obtener gráfico de tiempo individual del usuario
export const getGraficoTiempo = async (userId, fecha) => {
  try {
    const docRef = doc(db, 'usuarios', userId, 'graficos_tiempo', fecha);
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

// Actualizar gráfico de tiempo del usuario
export const updateGraficoTiempo = async (userId, fecha, nuevosTiempos) => {
  try {
    const tiemposNormalizados = normalizarTiempo(nuevosTiempos);
    const totalHoras = Object.values(tiemposNormalizados).reduce((a, b) => a + b, 0);
    const docRef = doc(db, 'usuarios', userId, 'graficos_tiempo', fecha);
    await updateDoc(docRef, { tiempos: tiemposNormalizados, totalHoras });
  } catch (error) {
    console.error('Error al actualizar gráfico de tiempo:', error);
    throw error;
  }
};

// Eliminar gráfico de tiempo del usuario
export const deleteGraficoTiempo = async (userId, fecha) => {
  try {
    const docRef = doc(db, 'usuarios', userId, 'graficos_tiempo', fecha);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error al eliminar gráfico de tiempo:', error);
    throw error;
  }
};

// Obtener todos los gráficos de tiempo del usuario
export const getAllGraficosTiempo = async (userId) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'usuarios', userId, 'graficos_tiempo'));
    const graficos = [];
    querySnapshot.forEach((doc) => {
      graficos.push({ id: doc.id, ...doc.data() }); // incluye el id y evita errores
    });
    console.log("Graficos tiempo recuperados:", graficos);
    return graficos;
  } catch (error) {
    console.error('Error al obtener gráficos de tiempo:', error);
    throw error;
  }
};

//obtener los graficos filtrado por fechas
export const getGraficosTiempoPorFechas = async (userId, fechaInicio, fechaFin) => {
  try {
    const ref = collection(db, 'usuarios', userId, 'graficos_tiempo');
    const q = query(
      ref,
      where('fecha', '>=', fechaInicio),
      where('fecha', '<=', fechaFin)
    );

    const snapshot = await getDocs(q);
    const graficos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return graficos;
  } catch (error) {
    console.error('Error al obtener gráficos por fecha:', error);
    throw error;
  }
};
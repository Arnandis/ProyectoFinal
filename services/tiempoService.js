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

// Nueva función para actualizar progreso de objetivos activos
const actualizarProgresoObjetivos = async (userId, fecha, tiempos) => {
  try {
    const goalsRef = collection(db, 'usuarios', userId, 'goals');
    const q = query(goalsRef,
      where('startDate', '<=', fecha),
      where('endDate', '>=', fecha)
    );
    const snapshot = await getDocs(q);

    for (const docSnap of snapshot.docs) {
      const goal = docSnap.data();
      const actividad = goal.name.toLowerCase(); // nombre del objetivo = categoría
      const tiempoActividad = tiempos[actividad];

      if (tiempoActividad && tiempoActividad > 0) {
        const nuevoProgreso = (goal.progress || 0) + tiempoActividad;
        const goalRef = doc(db, 'usuarios', userId, 'goals', goal.id);
        await updateDoc(goalRef, { progress: nuevoProgreso });
      }
    }
  } catch (error) {
    console.error('Error al actualizar progreso de metas:', error);
    throw error;
  }
};

// Guardar gráfico de tiempo y actualizar objetivos automáticamente
export const saveGraficoTiempo = async (userId, fecha, tiempos) => {
  try {
    const datosNormalizados = normalizarTiempo(tiempos);
    const totalHoras = Object.values(datosNormalizados).reduce((a, b) => a + b, 0);

    // Guardar gráfico
    const docRef = doc(db, 'usuarios', userId, 'graficos_tiempo', fecha);
    await setDoc(docRef, { fecha, tiempos: datosNormalizados, totalHoras });

    // Actualizar metas activas
    await actualizarProgresoObjetivos(userId, fecha, datosNormalizados);
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
//Grafico en Tiempo 
export const getPromedioTiempoDiario = async (userId) => {
  try {
    const graficos = await getAllGraficosTiempo(userId);

    if (graficos.length === 0) return 0;

    const totalMinutos = graficos.reduce((total, grafico) => total + (grafico.totalHoras || 0), 0);
    const promedio = totalMinutos / graficos.length;

    return Math.round(promedio);
  } catch (error) {
    console.error('Error al calcular el promedio de tiempo diario:', error);
    throw error;
  }
};

// Obtener la distribución porcentual mensual
export const getDistribucionPorcentualMensual = async (userId) => {
  try {
    const graficos = await getAllGraficosTiempo(userId);
    const now = new Date();
    const mesActual = now.getMonth();
    const anioActual = now.getFullYear();

    const acumulado = {
      trabajo: 0,
      estudio: 0,
      descanso: 0,
      deporte: 0,
      familia: 0,
      otros: 0,
    };

    for (const grafico of graficos) {
      const fecha = new Date(grafico.fecha);
      if (fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual) {
        for (const categoria in acumulado) {
          acumulado[categoria] += grafico.tiempos?.[categoria] || 0;
        }
      }
    }

    const total = Object.values(acumulado).reduce((a, b) => a + b, 0);
    if (total === 0) return [];

    return Object.entries(acumulado).map(([categoria, valor]) => ({
      name: categoria.charAt(0).toUpperCase() + categoria.slice(1),
      porcentaje: Math.round((valor / total) * 100),
      minutos: valor,
    }));
  } catch (error) {
    console.error('Error al calcular distribución porcentual mensual:', error);
    return [];
  }
};

export const getRangoFechasActivo = async (userId) => {
  try {
    const graficos = await getAllGraficosTiempo(userId);
    if (graficos.length === 0) return null;

    const fechas = graficos.map(g => new Date(g.fecha));
    const minFecha = new Date(Math.min(...fechas));
    const maxFecha = new Date(Math.max(...fechas));

    const format = (date) => date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return {
      desde: format(minFecha),
      hasta: format(maxFecha),
    };
  } catch (error) {
    console.error('Error al obtener el rango de fechas activo:', error);
    return null;
  }
};

export const getEvolucionMensualCategorias = async (userId, meses = 6) => {
  try {
    const graficos = await getAllGraficosTiempo(userId);

    // Obtener la fecha actual
    const now = new Date();
    const resultados = {};

    // Inicializar meses: últimos 'meses' meses con etiquetas "MMM YYYY"
    for (let i = meses - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      resultados[key] = {
        trabajo: 0,
        estudio: 0,
        descanso: 0,
        deporte: 0,
        familia: 0,
        otros: 0,
      };
    }

    // Sumar tiempos por mes y categoría
    graficos.forEach((grafico) => {
      const fecha = new Date(grafico.fecha);
      const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;

      if (resultados[key]) {
        for (const cat in resultados[key]) {
          resultados[key][cat] += grafico.tiempos?.[cat] || 0;
        }
      }
    });

    // Formatear resultado para gráfica
    const labels = Object.keys(resultados).map(k => {
      const [year, month] = k.split('-');
      const date = new Date(year, month - 1);
      return date.toLocaleString('default', { month: 'short', year: 'numeric' });
    });

    const categorias = ['trabajo', 'estudio', 'descanso', 'deporte', 'familia', 'otros'];

    const datasets = categorias.map(cat => ({
      data: Object.values(resultados).map(mes => mes[cat]),
      color: () => {
        switch (cat) {
          case 'trabajo': return '#FF5733';
          case 'estudio': return '#33FF57';
          case 'descanso': return '#3357FF';
          case 'deporte': return '#FF33A1';
          case 'familia': return '#FFBB33';
          case 'otros': return '#A633FF';
          default: return '#000000';
        }
      },
      strokeWidth: 2,
      label: cat.charAt(0).toUpperCase() + cat.slice(1),
    }));

    return { labels, datasets };
  } catch (error) {
    console.error('Error al obtener evolución mensual:', error);
    return { labels: [], datasets: [] };
  }
};
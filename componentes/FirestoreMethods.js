import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; 

// Guardar un gráfico
export const saveGrafico = async (fecha, ingresos, gastos) => {
  try {
    const graficoRef = collection(db, "Finanzas"); 
    await addDoc(graficoRef, {
      fecha,
      ingresos,
      gastos
    });
    console.log("Gráfico guardado");
  } catch (error) {
    console.error("Error al guardar el gráfico: ", error);
  }
};

// Leer un gráfico
export const getGrafico = async (fecha) => {
  try {
    const graficoRef = collection(db, "Finanzas"); 
    const querySnapshot = await getDocs(graficoRef);
    const graficoData = [];

    querySnapshot.forEach((documento) => {
      if (documento.data().fecha === fecha) {
        graficoData.push({ id: documento.id, ...documento.data() }); // Se incluye el id del documento
      }
    });

    if (graficoData.length > 0) {
      console.log("Gráfico encontrado: ", graficoData);
      return graficoData;
    } else {
      console.log("No se encontró ningún gráfico con esa fecha");
      return [];
    }
  } catch (error) {
    console.error("Error al obtener el gráfico: ", error);
    return [];
  }
};


// Actualizar un gráfico
export const updateGrafico = async (fecha, newData) => {
  try {
    const graficoRef = collection(db, "Finanzas"); 
    const querySnapshot = await getDocs(graficoRef);

    const batch = [];
    querySnapshot.forEach((documento) => {
      if (documento.data().fecha === fecha) {
        batch.push(updateDoc(documento.ref, newData));
      }
    });

    await Promise.all(batch);
    console.log("Gráfico actualizado");
  } catch (error) {
    console.error("Error al actualizar el gráfico: ", error);
  }
};


// Eliminar un gráfico
//arreglar que encara que no trobe una fecha, ixira per pantalla: exito se ha borrado correctamente.
export const deleteGrafico = async (fecha) => {
  try {
    const graficoRef = collection(db, "Finanzas"); 
    const querySnapshot = await getDocs(graficoRef);

    const batch = [];
    querySnapshot.forEach((documento) => {
      if (documento.data().fecha === fecha) {
        batch.push(deleteDoc(documento.ref));
      }
    });

    if (batch.length > 0) {
      await Promise.all(batch);
      console.log("Gráfico eliminado");
    } else {
      console.log("No se encontró ningún gráfico con esa fecha");
    }
  } catch (error) {
    console.error("Error al eliminar el gráfico: ", error);
  }
};



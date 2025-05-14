// services/habiticaService.js
import { db, auth } from '../firebase/firebaseConfig';
import {
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';

/**
 * Guarda las credenciales de Habitica del usuario autenticado
 */
export const saveHabiticaCredentials = async (userId, data) => {
  try {
    const userRef = doc(db, 'habiticaUsers', userId);
    await setDoc(userRef, data, { merge: true });
  } catch (error) {
    console.error('Error al guardar las credenciales de Habitica:', error);
    throw error;
  }
};

/**
 * Obtiene las credenciales de Habitica del usuario autenticado
 */
export const getHabiticaCredentials = async (userId) => {
  try {
    const docSnap = await getDoc(doc(db, 'habiticaUsers', userId));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error al obtener credenciales de Habitica:', error);
    throw error;
  }
};

/**
 * Obtiene las credenciales de Habitica del usuario actualmente autenticado
 */
export const getCurrentUserHabiticaCredentials = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    const data = await getHabiticaCredentials(user.uid);

    if (!data?.userIdHabitica || !data?.apiToken) {
      throw new Error('Credenciales de Habitica incompletas');
    }

    return {
      userIdHabitica: data.userIdHabitica,
      apiToken: data.apiToken,
    };
  } catch (error) {
    console.error('Error al obtener credenciales de Habitica:', error);
    throw error;
  }
};

/**
 * Crea una nueva tarea en Habitica
 */
export const crearTareaHabitica = async (titulo, userIdHabitica, apiToken) => {
  try {
    const response = await fetch('https://habitica.com/api/v3/tasks/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-user': userIdHabitica,
        'x-api-key': apiToken
      },
      body: JSON.stringify({
        text: titulo,
        type: 'todo'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error al crear tarea en Habitica:', data);
      throw new Error(data.message || 'Error desconocido en Habitica');
    }

    return data;
  } catch (error) {
    console.error('Error conectando con Habitica:', error);
    throw error;
  }
};

export const completarTareaHabitica = async (taskId, userIdHabitica, apiToken) => {
  try {
    const response = await fetch(`https://habitica.com/api/v3/tasks/${taskId}/score/up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-user': userIdHabitica,
        'x-api-key': apiToken
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Error al completar tarea en Habitica');
    }

    return result;
  } catch (error) {
    console.error('❌ Error completando tarea en Habitica:', error);
    throw error;
  }
};

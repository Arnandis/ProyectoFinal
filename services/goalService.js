// services/goalService.js
import { db } from '../firebase/firebaseConfig';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';

// Guardar meta
export const saveGoal = async (userId, goal) => {
  try {
    const goalRef = doc(db, 'usuarios', userId, 'goals', goal.id);
    await setDoc(goalRef, goal);
  } catch (error) {
    console.error('Error al guardar la meta:', error);
    throw error;
  }
};

// Obtener todas las metas
export const getGoals = async (userId) => {
  try {
    const goalsRef = collection(db, 'usuarios', userId, 'goals');
    const snapshot = await getDocs(goalsRef);
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error al obtener las metas:', error);
    throw error;
  }
};

// Eliminar una meta
export const deleteGoal = async (userId, goalId) => {
  try {
    const goalRef = doc(db, 'usuarios', userId, 'goals', goalId);
    await deleteDoc(goalRef);
  } catch (error) {
    console.error('Error al eliminar la meta:', error);
    throw error;
  }
};

// Actualizar progreso
export const updateGoalProgress = async (userId, goalId, progress) => {
  try {
    const goalRef = doc(db, 'usuarios', userId, 'goals', goalId);
    await updateDoc(goalRef, { progress });
  } catch (error) {
    console.error('Error al actualizar el progreso:', error);
    throw error;
  }
};

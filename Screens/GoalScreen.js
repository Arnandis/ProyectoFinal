import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import { goalStyles as styles } from '../styles/goalStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import UUID from 'react-native-uuid';
import { getAuth } from 'firebase/auth';
import { saveGoal, getGoals, deleteGoal, updateGoalProgress } from '../services/goalService';
import { enviarNotificacionInmediata, enviarNotificacionProgramada } from '../utils/notifications';
import { useNavigation } from '@react-navigation/native';

export default function GoalScreen() {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalProgress, setGoalProgress] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('pendientes'); // 'pendientes' | 'caducados' | 'cumplidos'

  const userId = getAuth().currentUser?.uid;
  const navigation = useNavigation();

  useEffect(() => {
    if (userId) {
      cargarMetas();
    }
  }, [userId]);

  const cargarMetas = async () => {
    try {
      const metas = await getGoals(userId);
      setGoals(metas);
    } catch (error) {
      console.error('Error al cargar las metas:', error);
    }
  };

  const addGoal = async () => {
    if (goalName && goalTarget && goalProgress && startDate && endDate) {
      const newGoal = {
        id: UUID.v4(),
        name: goalName.trim().toLowerCase(),
        target: parseFloat(goalTarget),
        progress: parseFloat(goalProgress),
        startDate,
        endDate,
      };

      try {
        await saveGoal(userId, newGoal);
        setGoals(prev => [...prev, newGoal]);
        setGoalName('');
        setGoalTarget('');
        setGoalProgress('');
        setStartDate('');
        setEndDate('');

        // 🟢 Notificación inmediata al crear la meta
        await enviarNotificacionInmediata(
          '¡Meta creada!',
          `Has creado la meta "${newGoal.name}". ¡Mucho ánimo! 💪`
        );

        // 🟡 Notificación programada un día antes de la fecha de fin
        const fechaFin = new Date(endDate);
        const fechaRecordatorio = new Date(fechaFin);
        fechaRecordatorio.setDate(fechaFin.getDate() - 1);

        const hoy = new Date();
        const diferenciaDias = Math.ceil((fechaRecordatorio - hoy) / (1000 * 60 * 60 * 24));

        if (diferenciaDias === 1) {
          await enviarNotificacionProgramada(
            '⏰ Recordatorio de meta',
            `Mañana vence tu meta "${newGoal.name}". ¡A por ello!`,
            { date: fechaRecordatorio }
          );
        }

      } catch (error) {
        console.error('Error al guardar la meta:', error);
      }
    } else {
      Alert.alert('Completa todos los campos', 'Por favor, rellena todos los campos para añadir la meta.');
    }
  };

  const updateProgress = async (id, progress) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, progress } : goal
    );
    setGoals(updatedGoals);

    try {
      await updateGoalProgress(userId, id, progress);
    } catch (error) {
      console.error('Error al actualizar progreso:', error);
    }

    const goal = updatedGoals.find(g => g.id === id);
    if (goal && goal.progress >= goal.target) {
      Alert.alert('¡Felicidades!', 'Has cumplido tu objetivo');
    }
  };

  const eliminarGoal = (id) => {
    Alert.alert(
      "¿Estás seguro?",
      "¿Quieres eliminar este objetivo?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await deleteGoal(userId, id);
              setGoals(goals.filter(goal => goal.id !== id));
            } catch (error) {
              console.error('Error al eliminar la meta:', error);
            }
          },
        },
      ]
    );
  };

  const hoy = new Date();

  const metasFiltradas = goals.filter(goal => {
    const fechaFinal = new Date(goal.endDate);
    const cumplido = goal.progress >= goal.target;

    if (filtroActivo === 'pendientes') {
      return !cumplido && fechaFinal >= hoy;
    }
    if (filtroActivo === 'caducados') {
      return !cumplido && fechaFinal < hoy;
    }
    if (filtroActivo === 'cumplidos') {
      return cumplido;
    }
    return true;
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mis Logros y Objetivos</Text>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Retos')}
        style={styles.retosBtn}
      >
        <Text style={styles.retosBtnText}>Ir a Retos</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nombre del objetivo (Ej: Estudiar)"
        value={goalName}
        onChangeText={setGoalName}
      />
      <TextInput
        style={styles.input}
        placeholder="Objetivo en minutos (Ej: 180)"
        keyboardType="numeric"
        value={goalTarget}
        onChangeText={setGoalTarget}
      />
      <TextInput
        style={styles.input}
        placeholder="Progreso actual en minutos (Ej: 60)"
        keyboardType="numeric"
        value={goalProgress}
        onChangeText={setGoalProgress}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de inicio (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de fin (YYYY-MM-DD)"
        value={endDate}
        onChangeText={setEndDate}
      />
      <Button title="Agregar Meta" onPress={addGoal} />

      {/* Filtros */}
      <View style={styles.filtrosContainer}>
        {['pendientes', 'caducados', 'cumplidos'].map(tipo => (
          <TouchableOpacity
            key={tipo}
            onPress={() => setFiltroActivo(tipo)}
            style={[
              styles.filtroBtn,
              filtroActivo === tipo && styles.filtroBtnActivo
            ]}
          >
            <Text style={filtroActivo === tipo ? styles.filtroTextActivo : styles.filtroText}>
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de metas filtradas */}
      {metasFiltradas.length > 0 ? (
        <View style={styles.goalsContainer}>
          {metasFiltradas.map((goal) => (
            <View key={goal.id} style={styles.goalContainer}>
              <Text style={styles.goalText}>{goal.name}</Text>
              <Text style={styles.goalText}>
                {goal.progress} / {goal.target} minutos
              </Text>
              <Text style={styles.goalSubText}>
                Desde: {goal.startDate} — Hasta: {goal.endDate}
              </Text>
              <Progress.Bar
                progress={goal.progress / goal.target}
                width={200}
                height={20}
                borderRadius={5}
                color={goal.progress >= goal.target ? '#4CAF50' : '#FF5722'}
              />
              <TextInput
                style={styles.input}
                placeholder="Actualizar progreso en minutos"
                keyboardType="numeric"
                value={String(goal.progress)}
                onChangeText={(text) => updateProgress(goal.id, parseFloat(text))}
              />
              <MaterialCommunityIcons
                name="delete"
                size={24}
                color="red"
                style={styles.deleteIcon}
                onPress={() => eliminarGoal(goal.id)}
              />
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noGoalsText}>
          No hay metas para este filtro.
        </Text>
      )}
    </ScrollView>
  );
}

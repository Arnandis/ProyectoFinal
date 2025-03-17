import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import * as Progress from 'react-native-progress'; // Importamos la librería de barras de progreso
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Importamos los iconos
import UUID from 'react-native-uuid'; 

export default function GoalScreen() {
  // Estados para metas y logros
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalProgress, setGoalProgress] = useState('');

  // Función para agregar metas
  const addGoal = () => {
    if (goalName && goalTarget && goalProgress) {
      const newGoal = {
        id: UUID.v4(),  // Generamos un id único con react-native-uuid
        name: goalName,
        target: parseFloat(goalTarget),
        progress: parseFloat(goalProgress),
      };
      setGoals(prevGoals => [
        ...prevGoals,  // Agregamos el nuevo objetivo al array de metas
        newGoal
      ]);
      setGoalName('');
      setGoalTarget('');
      setGoalProgress('');
    }
  };

  // Función para actualizar el progreso
  const updateProgress = (id, progress) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, progress: progress } : goal
    );
    setGoals(updatedGoals);

    // Verificar si el objetivo ha sido alcanzado
    const goal = updatedGoals.find(g => g.id === id);

    // Si el progreso es mayor o igual al objetivo, mostrar alerta
    if (goal && goal.progress >= goal.target) {
      Alert.alert('¡Felicidades!', 'Has cumplido tu objetivo');
    }
  };

  // Función para borrar una meta
  const deleteGoal = (id) => {
    Alert.alert(
      "¿Estás seguro?",
      "¿Quieres eliminar este objetivo?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: () => {
            // Filtramos las metas para eliminar la meta seleccionada
            setGoals(goals.filter(goal => goal.id !== id));
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mis Logros y Objetivos</Text>

      {/* Input para agregar metas */}
      <TextInput
        style={styles.input}
        placeholder="Nombre del objetivo (Ej: Estudiar, Deporte)"
        value={goalName}
        onChangeText={setGoalName}
      />
      <TextInput
        style={styles.input}
        placeholder="Objetivo (Ej: 3 Horas)"
        keyboardType="numeric"
        value={goalTarget}
        onChangeText={setGoalTarget}
      />
      <TextInput
        style={styles.input}
        placeholder="Progreso actual (Ej: 2 Horas)"
        keyboardType="numeric"
        value={goalProgress}
        onChangeText={setGoalProgress}
      />
      
      {/* Botón para agregar la meta */}
      <Button title="Agregar Meta" onPress={addGoal} />

      {/* Mostrar las metas con las barras de progreso */}
      {goals.length > 0 && (
        <View style={styles.goalsContainer}>
          {goals.map((goal) => (
            <View key={goal.id} style={styles.goalContainer}>
              <Text style={styles.goalText}>{goal.name}</Text>
              <Text style={styles.goalText}>
                {goal.progress} / {goal.target} horas
              </Text>

              {/* Barra de progreso */}
              <Progress.Bar
                progress={goal.progress / goal.target}
                width={200}
                height={20}
                borderRadius={5}
                color={goal.progress >= goal.target ? '#4CAF50' : '#FF5722'}
              />

              {/* Botón para actualizar el progreso */}
              <TextInput
                style={styles.input}
                placeholder="Actualizar progreso"
                keyboardType="numeric"
                value={String(goal.progress)}
                onChangeText={(text) => updateProgress(goal.id, parseFloat(text))}
              />
              
              {/* Botón de eliminar con icono de basura */}
              <MaterialCommunityIcons 
                name="delete" 
                size={24} 
                color="red" 
                style={styles.deleteIcon} 
                onPress={() => deleteGoal(goal.id)} 
              />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,  // Asegura que el contenido se puede desplazar
    padding: 20,
    backgroundColor: '#f4f4f4',
    paddingBottom: 20,  // Agregar espacio en la parte inferior
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
  },
  goalsContainer: {
    marginTop: 20,
  },
  goalContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  goalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  deleteIcon: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
});

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

export default function Tiempo() {
  // Estado para almacenar el tiempo en cada categoría
  const [timeData, setTimeData] = useState({
    trabajo: 0,
    estudio: 0,
    descanso: 0,
    deporte: 0,
    familia: 0,
    otros:0,
  });

  // Función para manejar el cambio en los inputs
  const handleInputChange = (category, value) => {
    setTimeData(prevState => ({
      ...prevState,
      [category]: parseInt(value) || 0, // Asegurarse de que sea un número
    }));
  };

  // Calcular el total de tiempo ingresado
  const totalTime = Object.values(timeData).reduce((acc, time) => acc + time, 0);

  // Datos para el gráfico (solo si el total de tiempo es mayor a 0)
  const chartData = totalTime > 0 ? [
    { name: 'Trabajo', population: timeData.trabajo, color: '#FF5733', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Estudio', population: timeData.estudio, color: '#33FF57', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Descanso', population: timeData.descanso, color: '#3357FF', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Deporte', population: timeData.deporte, color: '#FF33A1', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Familia', population: timeData.familia, color: '#FFBB33', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Otros', population: timeData.otros, color: '#A633FF', legendFontColor: '#7F7F7F', legendFontSize: 15 }, 

  ] : [];

  // Función para mostrar una alerta si el total de tiempo es 0
  const showAlert = () => {
    if (totalTime === 0) {
      alert('Por favor, ingresa tiempo en al menos una categoría.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Distribución del tiempo</Text>

      {/* Inputs para ingresar el tiempo */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Minutos de trabajo"
          keyboardType="numeric"
          onChangeText={(value) => handleInputChange('trabajo', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Minutos de estudio"
          keyboardType="numeric"
          onChangeText={(value) => handleInputChange('estudio', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Minutos de descanso"
          keyboardType="numeric"
          onChangeText={(value) => handleInputChange('descanso', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Minutos de deporte"
          keyboardType="numeric"
          onChangeText={(value) => handleInputChange('deporte', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Minutos en familia"
          keyboardType="numeric"
          onChangeText={(value) => handleInputChange('familia', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Minutos en otros"
          keyboardType="numeric"
          onChangeText={(value) => handleInputChange('otros', value)}
        />
      </View>

      {/* Botón para mostrar alerta si no hay datos */}
      <TouchableOpacity style={styles.button} onPress={showAlert}>
        <Text style={styles.buttonText}>Ver gráfico</Text>
      </TouchableOpacity>

      {/* Mostrar el gráfico solo si hay datos */}
      {totalTime > 0 && (
        <PieChart
          data={chartData}
          width={width - 30}
          height={220}
          chartConfig={{
            backgroundColor: '#1cc910',
            backgroundGradientFrom: '#eff3ff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

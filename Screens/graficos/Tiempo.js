import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { tiempoStyles } from '../../styles/tiempoStyles';
import TimeInput from '../../components/TimeInput';
import { Dimensions } from 'react-native';
import { saveGraficoTiempo } from '../../services/tiempoService';
import { getAuth } from 'firebase/auth';

const { width } = Dimensions.get('window');

export default function Tiempo() {
  const [timeData, setTimeData] = useState({
    trabajo: 0,
    estudio: 0,
    descanso: 0,
    deporte: 0,
    familia: 0,
    otros: 0,
  });

  const [fecha, setFecha] = useState('');
  const [grafico, setGrafico] = useState(null);
  const userId = getAuth().currentUser?.uid;

  const handleInputChange = (category, value) => {
    setTimeData(prevState => ({
      ...prevState,
      [category]: parseInt(value) || 0,
    }));
  };

  const totalTime = Object.values(timeData).reduce((acc, time) => acc + time, 0);

  const chartData = totalTime > 0 ? [
    { name: 'Trabajo', population: timeData.trabajo, color: '#FF5733', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Estudio', population: timeData.estudio, color: '#33FF57', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Descanso', population: timeData.descanso, color: '#3357FF', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Deporte', population: timeData.deporte, color: '#FF33A1', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Familia', population: timeData.familia, color: '#FFBB33', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Otros', population: timeData.otros, color: '#A633FF', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ] : [];

  const showAlert = () => {
    if (totalTime === 0) {
      alert('Por favor, ingresa tiempo en al menos una categoría.');
    }
  };

  const handleSave = async () => {
    if (!fecha) {
      alert('Por favor, ingresa una fecha para guardar.');
      return;
    }
    if (!userId) {
      alert('Usuario no autenticado.');
      return;
    }
    try {
      await saveGraficoTiempo(userId, fecha, timeData);
      Alert.alert('Éxito', 'Gráfico guardado con fecha ' + fecha);
    } catch (error) {
      Alert.alert('Error', 'Error al guardar el gráfico.');
    }
  };
  
  const handleReset = () => {
    setTimeData({
      trabajo: 0,
      estudio: 0,
      descanso: 0,
      deporte: 0,
      familia: 0,
      otros: 0,
    });
    setFecha('');
  };

  return (
    <View style={tiempoStyles.container}>
      <Text style={tiempoStyles.title}>Distribución del tiempo</Text>

      <TextInput
        placeholder="Fecha (YYYY-MM-DD)"
        style={tiempoStyles.input}
        value={fecha}
        onChangeText={setFecha}
      />
      <TimeInput placeholder="Minutos de trabajo" onChange={(val) => handleInputChange('trabajo', val)} />
      <TimeInput placeholder="Minutos de estudio" onChange={(val) => handleInputChange('estudio', val)} />
      <TimeInput placeholder="Minutos de descanso" onChange={(val) => handleInputChange('descanso', val)} />
      <TimeInput placeholder="Minutos de deporte" onChange={(val) => handleInputChange('deporte', val)} />
      <TimeInput placeholder="Minutos en familia" onChange={(val) => handleInputChange('familia', val)} />
      <TimeInput placeholder="Minutos en otros" onChange={(val) => handleInputChange('otros', val)} />

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

      <TouchableOpacity style={tiempoStyles.button} onPress={handleSave}>
        <Text style={tiempoStyles.buttonText}>Guardar gráfico</Text>
      </TouchableOpacity>

      <TouchableOpacity style={tiempoStyles.button} onPress={handleReset}>
        <Text style={tiempoStyles.buttonText}>Resetear</Text>
      </TouchableOpacity>
    </View>
  );
}

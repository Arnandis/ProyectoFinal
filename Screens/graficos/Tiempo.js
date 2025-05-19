import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit'; // Quitamos PieChart de aquí
import { tiempoStyles } from '../../styles/tiempoStyles';
import TimeInput from '../../components/TimeInput';
import {
  saveGraficoTiempo,
  getPromedioTiempoDiario,
  getDistribucionPorcentualMensual,
  getRangoFechasActivo,
  getEvolucionMensualCategorias,
} from '../../services/tiempoService';
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
  const [promedioDiario, setPromedioDiario] = useState(null);
  const [distribucionMensual, setDistribucionMensual] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [rangoFechas, setRangoFechas] = useState(null);
  const [evolucionMensual, setEvolucionMensual] = useState({ labels: [], datasets: [] });

  const userId = getAuth().currentUser?.uid;

  const handleInputChange = (category, value) => {
    setTimeData(prevState => ({
      ...prevState,
      [category]: parseInt(value) || 0,
    }));
  };

  const totalTime = Object.values(timeData).reduce((acc, time) => acc + time, 0);

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
      await cargarEstadisticas();
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

  const cargarEstadisticas = async () => {
    if (!userId) return;
    try {
      const [promedio, distribucion, rango, evolucion] = await Promise.all([
        getPromedioTiempoDiario(userId),
        getDistribucionPorcentualMensual(userId),
        getRangoFechasActivo(userId),
        getEvolucionMensualCategorias(userId, 6),
      ]);
      setPromedioDiario(promedio);
      setDistribucionMensual(distribucion);
      setRangoFechas(rango);
      setEvolucionMensual(evolucion);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
  }, [userId]);

  // Definimos colores y nombres para leyenda del gráfico evolución
  const categoriasColores = [
    { nombre: 'Trabajo', color: '#FF5733' },
    { nombre: 'Estudio', color: '#33FF57' },
    { nombre: 'Descanso', color: '#3357FF' },
    { nombre: 'Deporte', color: '#FF33A1' },
    { nombre: 'Familia', color: '#FFBB33' },
    { nombre: 'Otros', color: '#A633FF' },
  ];

  return (
    <ScrollView contentContainerStyle={tiempoStyles.container}>
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

      {/* Ya no mostramos el PieChart */}

      <TouchableOpacity style={tiempoStyles.button} onPress={handleSave}>
        <Text style={tiempoStyles.buttonText}>Guardar gráfico</Text>
      </TouchableOpacity>

      <TouchableOpacity style={tiempoStyles.button} onPress={handleReset}>
        <Text style={tiempoStyles.buttonText}>Resetear</Text>
      </TouchableOpacity>

      {promedioDiario !== null && (
        <Text style={tiempoStyles.resultadoTexto}>
          Promedio de tiempo diario: {promedioDiario} minutos
        </Text>
      )}

      {rangoFechas && (
        <Text style={tiempoStyles.resultadoTexto}>
          Rango activo: del {rangoFechas.desde} al {rangoFechas.hasta}
        </Text>
      )}

      {distribucionMensual.length > 0 && (
        <>
          <Text style={tiempoStyles.subtitulo}>Distribución porcentual mensual</Text>
          <BarChart
            data={{
              labels: distribucionMensual.map(d => d.name),
              datasets: [{ data: distribucionMensual.map(d => d.porcentaje) }],
            }}
            width={width - 30}
            height={220}
            chartConfig={{
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: () => '#000',
              barPercentage: 0.6,
            }}
            verticalLabelRotation={0}
            fromZero
            showValuesOnTopOfBars
            withHorizontalLabels={true}
            onDataPointClick={({ index }) => {
              setCategoriaSeleccionada(distribucionMensual[index]);
              setModalVisible(true);
            }}
          />

          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={tiempoStyles.modalContainer}>
              <View style={tiempoStyles.modalContent}>
                <Text style={tiempoStyles.modalTitle}>
                  {categoriaSeleccionada?.name}
                </Text>
                <Text style={tiempoStyles.modalText}>
                  {categoriaSeleccionada?.minutos} minutos este mes
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={tiempoStyles.button}
                >
                  <Text style={tiempoStyles.buttonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}

      {/* Nuevo gráfico: Evolución mensual por categoría */}
      {evolucionMensual.labels.length > 0 && (
        <>
          <Text style={tiempoStyles.subtitulo}>Evolución mensual por categoría</Text>
          <ScrollView horizontal>
            <LineChart
              data={evolucionMensual}
              width={Math.max(width, evolucionMensual.labels.length * 60)}
              height={260}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: () => '#000',
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '3',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              verticalLabelRotation={30}
              fromZero
              segments={5}
            />
          </ScrollView>

          {/* Leyenda para el gráfico de evolución */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, justifyContent: 'center' }}>
            {categoriasColores.map(({ nombre, color }) => (
              <View
                key={nombre}
                style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8, marginVertical: 4 }}
              >
                <View style={{ width: 15, height: 15, backgroundColor: color, marginRight: 6, borderRadius: 3 }} />
                <Text>{nombre}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

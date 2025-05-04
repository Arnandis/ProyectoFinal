import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Button,
  Alert,
  Dimensions,
  Modal,
  Pressable,
  FlatList,
  StyleSheet
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { getAllGraficosTiempo } from '../../services/tiempoService';
import { getAuth } from 'firebase/auth';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');

export default function DetalleGraficoTiempo({ route }) {
  const { grafico } = route.params;

  const [comparar, setComparar] = useState(false);
  const [otroGrafico, setOtroGrafico] = useState(null);
  const [graficosDisponibles, setGraficosDisponibles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const userId = getAuth().currentUser?.uid;

  const chartRef = useRef();

  useEffect(() => {
    cargarGraficosDisponibles();
  }, []);

  const cargarGraficosDisponibles = async () => {
    if (!userId) return;
    const data = await getAllGraficosTiempo(userId);
    const otros = data.filter(g => g.fecha !== grafico.fecha);
    setGraficosDisponibles(otros);
  };

  const sanitize = (val) => isNaN(Number(val)) ? 0 : Number(val);

  const crearPieData = (g) => {
    const colores = ['#1e90ff', '#ff8c00', '#32cd32', '#8a2be2', '#ff1493', '#808080'];
    const labels = ['Trabajo', 'Estudio', 'Descanso', 'Deporte', 'Familia', 'Otros'];

    return labels.map((label, idx) => {
      const key = label.toLowerCase();
      return {
        name: label,
        population: sanitize(g?.tiempos?.[key]),
        color: colores[idx],
        legendFontColor: '#333',
        legendFontSize: 14,
      };
    }).filter(d => d.population > 0);
  };

  const handleSeleccionarComparar = () => {
    if (graficosDisponibles.length === 0) {
      Alert.alert('No hay otros gráficos disponibles para comparar');
      return;
    }
    setModalVisible(true);
  };

  const calcularComparacion = (actual, comparado) => {
    const tiemposActual = actual.tiempos || {};
    const tiemposComparado = comparado.tiempos || {};

    const labels = ['trabajo', 'estudio', 'descanso', 'deporte', 'familia', 'otros'];
    const comparaciones = [];

    const diferencias = labels.map((actividad) => {
      const actualTiempo = sanitize(tiemposActual[actividad]);
      const comparadoTiempo = sanitize(tiemposComparado[actividad]);
      const diferencia = actualTiempo - comparadoTiempo;
      const porcentaje = comparadoTiempo === 0
        ? (actualTiempo > 0 ? 100 : 0)
        : Math.round((diferencia / comparadoTiempo) * 100);

      return {
        actividad,
        actual: actualTiempo,
        comparado: comparadoTiempo,
        diferencia,
        porcentaje,
      };
    });

    const mayorActual = diferencias.reduce((prev, curr) => curr.actual > prev.actual ? curr : prev, diferencias[0]);
    const menorActual = diferencias.reduce((prev, curr) => curr.actual < prev.actual ? curr : prev, diferencias[0]);

    comparaciones.push(
      `🟢 Has pasado más tiempo en **${mayorActual.actividad}**: ${mayorActual.actual} min (${Math.abs(mayorActual.porcentaje)}% ${mayorActual.diferencia >= 0 ? 'más' : 'menos'} que el otro gráfico).`
    );

    comparaciones.push(
      `🔵 Has pasado menos tiempo en **${menorActual.actividad}**: ${menorActual.actual} min (${Math.abs(menorActual.porcentaje)}% ${menorActual.diferencia >= 0 ? 'más' : 'menos'} que el otro gráfico).`
    );

    if (mayorActual.actividad === 'descanso' && mayorActual.actual > 300) {
      comparaciones.push('💡 Estás dedicando mucho tiempo a descansar. ¿Puedes redistribuir parte de ese tiempo a otras actividades como estudio o deporte?');
    }

    if (mayorActual.actividad === 'otros' && mayorActual.actual > 200) {
      comparaciones.push('💡 Gran parte de tu tiempo está en "otros". Considera identificar mejor en qué se va ese tiempo para aprovecharlo más.');
    }

    return comparaciones;
  };

  const handleCompartirGrafico = async () => {
    try {
      const uri = await captureRef(chartRef, {
        format: 'png',
        quality: 1,
      });

      await Sharing.shareAsync(uri, {
        dialogTitle: 'Compartir gráfico de tiempo',
      });
    } catch (error) {
      console.error('Error al compartir:', error);
      Alert.alert('Error al compartir el gráfico');
    }
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Detalle del gráfico (Tiempo) - {grafico.fecha}
      </Text>

      <View ref={chartRef} collapsable={false}>
        <PieChart
          data={crearPieData(grafico)}
          width={width - 30}
          height={220}
          accessor="population"
          backgroundColor="transparent"
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
          }}
          paddingLeft="15"
          absolute
        />
      </View>

      <Button title="Compartir gráfico" onPress={handleCompartirGrafico} />

      <Button title="Comparar con otro gráfico" onPress={handleSeleccionarComparar} style={{ marginTop: 12 }} />

      {/* MODAL DE SELECCIÓN */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Selecciona un gráfico</Text>
            <FlatList
              data={graficosDisponibles}
              keyExtractor={(item) => item.fecha}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.modalItem}
                  onPress={() => {
                    setOtroGrafico(item);
                    setComparar(true);
                    setModalVisible(false);
                  }}
                >
                  <Text>{item.fecha}</Text>
                </Pressable>
              )}
            />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {comparar && otroGrafico && (
        <>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>
            Comparando con: {otroGrafico.fecha}
          </Text>

          <PieChart
            data={crearPieData(otroGrafico)}
            width={width - 30}
            height={220}
            accessor="population"
            backgroundColor="transparent"
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
            }}
            paddingLeft="15"
            absolute
          />

          <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 16 }}>
            Comparación personalizada:
          </Text>
          {calcularComparacion(grafico, otroGrafico).map((linea, idx) => (
            <Text key={idx} style={{ marginBottom: 6 }}>{linea}</Text>
          ))}

          <View style={{ marginTop: 12 }}>
            <Button title="Compartir gráfico con comparación" onPress={handleCompartirGrafico} />
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

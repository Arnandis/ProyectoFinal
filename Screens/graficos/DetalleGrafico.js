import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Button, Alert, Dimensions, Modal, Pressable, FlatList, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getAllGraficos } from '../../services/financeService';  
import { getAuth } from 'firebase/auth';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');

export default function DetalleGraficoFinanzas({ route }) {
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
    const data = await getAllGraficos(userId);  
    const otros = data.filter(g => g.fecha !== grafico.fecha);
    setGraficosDisponibles(otros);
  };

  const sanitize = (val) => isNaN(Number(val)) ? 0 : Number(val);

  const crearLineData = (g) => {
    const labels = ['Ocio', 'Alquiler', 'Festivales', 'Compras', 'Juegos', 'Otros'];
    const data = [
      sanitize(g.gastos?.ocio),
      sanitize(g.gastos?.alquiler),
      sanitize(g.gastos?.festivales),
      sanitize(g.gastos?.compras),
      sanitize(g.gastos?.juegos),
      sanitize(g.gastos?.otros),
    ];

    return {
      labels,
      datasets: [{ data, strokeWidth: 2, color: () => 'rgba(0, 0, 255, 1)' }]
    };
  };

  const handleSeleccionarComparar = () => {
    if (graficosDisponibles.length === 0) {
      Alert.alert('No hay otros gráficos disponibles para comparar');
      return;
    }
    setModalVisible(true);
  };

  const calcularComparacion = (actual, comparado) => {
    const gastosActual = actual.gastos || {};
    const gastosComparado = comparado.gastos || {};

    const labels = ['ocio', 'alquiler', 'festivales', 'compras', 'juegos', 'otros'];
    const comparaciones = [];

    const diferencias = labels.map((gasto) => {
      const actualGasto = sanitize(gastosActual[gasto]);
      const comparadoGasto = sanitize(gastosComparado[gasto]);
      const diferencia = actualGasto - comparadoGasto;
      const porcentaje = comparadoGasto === 0
        ? (actualGasto > 0 ? 100 : 0)
        : Math.round((diferencia / comparadoGasto) * 100);

      return {
        gasto,
        actual: actualGasto,
        comparado: comparadoGasto,
        diferencia,
        porcentaje,
      };
    });

    const mayorActual = diferencias.reduce((prev, curr) => curr.actual > prev.actual ? curr : prev, diferencias[0]);
    const menorActual = diferencias.reduce((prev, curr) => curr.actual < prev.actual ? curr : prev, diferencias[0]);

    comparaciones.push(
      `🟢 Has gastado más en **${mayorActual.gasto}**: ${mayorActual.actual}€ (${Math.abs(mayorActual.porcentaje)}% ${mayorActual.diferencia >= 0 ? 'más' : 'menos'} que el otro gráfico).`
    );

    comparaciones.push(
      `🔵 Has gastado menos en **${menorActual.gasto}**: ${menorActual.actual}€ (${Math.abs(menorActual.porcentaje)}% ${menorActual.diferencia >= 0 ? 'más' : 'menos'} que el otro gráfico).`
    );

    return comparaciones;
  };

  const handleCompartirGrafico = async () => {
    try {
      const uri = await captureRef(chartRef, {
        format: 'png',
        quality: 1,
      });

      await Sharing.shareAsync(uri, {
        dialogTitle: 'Compartir gráfico de finanzas',
      });
    } catch (error) {
      console.error('Error al compartir:', error);
      Alert.alert('Error al compartir el gráfico');
    }
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Detalle del gráfico (Finanzas) - {grafico.fecha}
      </Text>

      <View ref={chartRef} collapsable={false}>
        <LineChart
          data={crearLineData(grafico)}
          width={width - 30}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#e0f7fa',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            labelColor: () => '#000',
          }}
          style={{ marginVertical: 20, borderRadius: 16 }}
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

          <LineChart
            data={crearLineData(otroGrafico)}
            width={width - 30}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#e0f7fa',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
              labelColor: () => '#000',
            }}
            style={{ marginVertical: 20, borderRadius: 16 }}
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

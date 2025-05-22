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
import { getAllGraficosTiempo, updateGraficoTiempo, deleteGraficoTiempo } from '../../services/tiempoService';
import { getAuth } from 'firebase/auth';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { TextInput } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function DetalleGraficoTiempo({ route }) {
  const { grafico } = route.params;

  const [comparar, setComparar] = useState(false);
  const [otroGrafico, setOtroGrafico] = useState(null);
  const [graficosDisponibles, setGraficosDisponibles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const userId = getAuth().currentUser?.uid;
  const [modalEdicionVisible, setModalEdicionVisible] = useState(false);
  const [tiemposEditados, setTiemposEditados] = useState({ ...grafico.tiempos });

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

  const handleActualizar = async () => {
    try {
      await updateGraficoTiempo(userId, grafico.fecha, grafico.tiempos);
      Alert.alert('Éxito', 'Gráfico actualizado correctamente.');
    } catch (error) {
      Alert.alert('Error', 'Error al actualizar el gráfico.');
    }
  };

  const handleEliminar = async () => {
    try {
      await deleteGraficoTiempo(userId, grafico.fecha);
      Alert.alert('Éxito', 'Gráfico eliminado correctamente.');
    } catch (error) {
      Alert.alert('Error', 'Error al eliminar el gráfico.');
    }
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
      <Text style={styles.sectionTitle}>
        Detalle de Tiempo - {grafico.fecha}
      </Text>


      <View ref={chartRef} collapsable={false} style={styles.chartContainer}>
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
      <Pressable style={[styles.actionButton, { backgroundColor: '#4a90e2' }]} onPress={handleCompartirGrafico}>
        <Text style={styles.buttonText}>Compartir gráfico</Text>
      </Pressable>
      <Pressable style={[styles.actionButton, { backgroundColor: '#4a90e2' }]} onPress={handleSeleccionarComparar}>
        <Text style={styles.buttonText}>Comparar con otro gráfico</Text>
      </Pressable>
      <View >
        <Pressable style={[styles.actionButton, { backgroundColor: '#4a90e2' }]} onPress={() => setModalEdicionVisible(true)}>
          <Text style={styles.buttonText}>Editar gráfico</Text>
        </Pressable>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalEdicionVisible}
          onRequestClose={() => setModalEdicionVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Editar tiempos</Text>
              {Object.keys(tiemposEditados).map((key) => (
                <View key={key} style={{ marginVertical: 6 }}>
                  <Text style={{ fontWeight: 'bold' }}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={String(tiemposEditados[key])}
                    onChangeText={(val) =>
                      setTiemposEditados((prev) => ({
                        ...prev,
                        [key]: val,
                      }))
                    }
                  />
                </View>
              ))}

              <Button
                title="Guardar cambios"
                onPress={async () => {
                  try {
                    await updateGraficoTiempo(userId, grafico.fecha, tiemposEditados);
                    Alert.alert('Éxito', 'Gráfico actualizado correctamente.');
                    grafico.tiempos = tiemposEditados;
                    setModalEdicionVisible(false);
                  } catch (error) {
                    Alert.alert('Error', 'No se pudo actualizar el gráfico.');
                  }
                }}
                color="#2196F3"
              />

              <View style={{ height: 10 }} />
              <Button title="Cancelar" onPress={() => setModalEdicionVisible(false)} color="#999" />
            </View>
          </View>
        </Modal>

        <View style={{ height: 10 }} />
        <Pressable style={[styles.actionButton, { backgroundColor: '#ff4d4d' }]} onPress={handleEliminar}>
          <Text style={styles.buttonText}>Eliminar gráfico</Text>
        </Pressable>


      </View>


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
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginVertical: 12,
  },
  chartContainer: {
    marginTop: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    borderRadius: 12,
    marginVertical: 6,
  },
  actionButton: {
    marginVertical: 6,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});


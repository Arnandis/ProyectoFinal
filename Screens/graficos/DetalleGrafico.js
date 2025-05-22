import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Button, Alert, Dimensions, Modal, Pressable, FlatList, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { deleteGrafico, getAllGraficos, updateGrafico } from '../../services/financeService';  
import { getAuth } from 'firebase/auth';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { TextInput } from 'react-native-paper';
import styles from "../../styles/detalleGraficoStyles";

const { width } = Dimensions.get('window');

export default function DetalleGraficoFinanzas({ route }) {
  const { grafico } = route.params;
  
  const [comparar, setComparar] = useState(false);
  const [otroGrafico, setOtroGrafico] = useState(null);
  const [graficosDisponibles, setGraficosDisponibles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const userId = getAuth().currentUser?.uid;
const [modalEdicionVisible, setModalEdicionVisible] = useState(false);
const [gastosEditados, setGastosEditados] = useState({ ...grafico.gastos });

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


  const handleEliminarGrafico = () => {
    Alert.alert(
      'Eliminar gráfico',
      '¿Estás seguro de que deseas eliminar este gráfico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGrafico(userId, grafico.fecha);
              Alert.alert('Gráfico eliminado correctamente');
              // Podrías navegar atrás si quieres: navigation.goBack();
            } catch (error) {
              console.error('Error al eliminar:', error);
              Alert.alert('Error al eliminar el gráfico');
            }
          },
        },
      ]
    );
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
    <ScrollView style={styles.container}>
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

      <Pressable style={styles.button} onPress={handleCompartirGrafico}>
        <Text style={styles.buttonText}>Compartir gráfico</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={handleSeleccionarComparar}>
        <Text style={styles.buttonText}>Comparar con otro gráfico</Text>
      </Pressable>
<Pressable style={styles.button} onPress={() => setModalEdicionVisible(true)}>
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
      <Text style={styles.modalTitle}>Editar gastos</Text>
      {Object.keys(gastosEditados).map((key) => (
        <View key={key} style={{ marginVertical: 4 }}>
          <Text>{key}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(gastosEditados[key])}
            onChangeText={(val) =>
              setGastosEditados((prev) => ({
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
          const nuevoGrafico = { ...grafico, gastos: gastosEditados };
          try {
            await updateGrafico(userId, grafico.fecha, nuevoGrafico);
            Alert.alert("Gráfico actualizado correctamente");
            setModalEdicionVisible(false);
            // Actualiza el estado para reflejar los nuevos datos en pantalla
            Object.assign(grafico.gastos, gastosEditados);
          } catch (error) {
            console.error("Error al actualizar:", error);
            Alert.alert("Error al actualizar el gráfico");
          }
        }}
      />
      <Button title="Cancelar" onPress={() => setModalEdicionVisible(false)} />
    </View>
  </View>
</Modal>

<Pressable style={[styles.button, { backgroundColor: '#ff4d4d' }]} onPress={handleEliminarGrafico}>
  <Text style={styles.buttonText}>Eliminar gráfico</Text>
</Pressable>

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
        </>
      )}
    </ScrollView>
  );
}


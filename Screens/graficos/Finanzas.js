import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, Dimensions, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { getAuth } from 'firebase/auth';
import {
  getComparacionMesActualYAnterior,
  getGastosTotalesPorMes,
  getIngresosTotalesPorMes,
  saveGrafico,
  getGastosTotalesPorCategoria,
  getGastosPorDiaYCategoriaEnMes  // <-- Importamos el método nuevo
} from '../../services/financeService';
import { finanzasStyles } from '../../styles/finanzasStyles';
import GastoInput from '../../components/GastoInput';

export default function Finanzas() {
  const [ingresos, setIngresos] = useState('');
  const [fecha, setFecha] = useState('');
  const [gastosPorMes, setGastosPorMes] = useState(Array(12).fill(0));
  const [ingresosPorMes, setIngresosPorMes] = useState(Array(12).fill(0));
  const [modalVisible, setModalVisible] = useState(false);
  const [mesSeleccionado, setMesSeleccionado] = useState('');
  const [gastosMesSeleccionado, setGastosMesSeleccionado] = useState(0);
  const [ingresosMesSeleccionado, setIngresosMesSeleccionado] = useState(0);
  const [tipoModal, setTipoModal] = useState('');
  const [gastosPorCategoria, setGastosPorCategoria] = useState({});

  const [gastos, setGastos] = useState({
    ocio: 0,
    alquiler: 0,
    festivales: 0,
    compras: 0,
    juegos: 0,
    otros: 0,
  });

  // NUEVO: Estado para gastos diarios por categoría (heatmap)
  const [gastosDiariosCategorias, setGastosDiariosCategorias] = useState({});
  const [modalCeldaVisible, setModalCeldaVisible] = useState(false);
  const [modalGastoCelda, setModalGastoCelda] = useState(0);
  const [modalDiaCelda, setModalDiaCelda] = useState(null);
  const [modalCategoriaCelda, setModalCategoriaCelda] = useState('');

  const userId = getAuth().currentUser?.uid;

  // Categorías fijas
  const categorias = ['ocio', 'alquiler', 'festivales', 'compras', 'juegos', 'otros'];

  useEffect(() => {
    const cargarDatos = async () => {
      if (!userId) return;

      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;

      const gastos = await getGastosTotalesPorMes(userId, year);
      setGastosPorMes(gastos);

      const ingresos = await getIngresosTotalesPorMes(userId, year);
      setIngresosPorMes(ingresos);

      const categoriasTotales = await getGastosTotalesPorCategoria(userId);
      setGastosPorCategoria(categoriasTotales);

      // NUEVO: cargar datos para heatmap
      const gastosDiarios = await getGastosPorDiaYCategoriaEnMes(userId, year, month);
      setGastosDiariosCategorias(gastosDiarios);
    };
    cargarDatos();
  }, [userId]);

  const handleGastosChange = (category, value) => {
    setGastos({ ...gastos, [category]: parseFloat(value) || 0 });
  };

  const handleGuardar = async () => {
    if (!userId) {
      Alert.alert('Error', 'Usuario no autenticado.');
      return;
    }

    if (!fecha) {
      Alert.alert('Error', 'Por favor introduce una fecha.');
      return;
    }

    try {
      await saveGrafico(userId, fecha, ingresos, gastos);
      Alert.alert('Éxito', 'Gráfico guardado correctamente.');

      setFecha('');
      setIngresos('');
      setGastos({ ocio: 0, alquiler: 0, festivales: 0, compras: 0, juegos: 0, otros: 0 });

      const nuevaComparacion = await getComparacionMesActualYAnterior(userId, new Date().toISOString());
      if (nuevaComparacion) {
        // Puedes actualizar otros estados si quieres con nuevaComparacion
      }

      const categoriasTotales = await getGastosTotalesPorCategoria(userId);
      setGastosPorCategoria(categoriasTotales);

      // Recargar heatmap después de guardar
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;
      const gastosDiarios = await getGastosPorDiaYCategoriaEnMes(userId, year, month);
      setGastosDiariosCategorias(gastosDiarios);
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al guardar el gráfico.');
    }
  };

  // Calcular % para gráfico de porcentaje de gastos por categoría
  const totalGastosCategorias = Object.values(gastosPorCategoria).reduce((a, b) => a + b, 0);
  const porcentajesCategorias = Object.values(gastosPorCategoria).map(v => totalGastosCategorias ? (v / totalGastosCategorias) * 100 : 0);

  // Función para calcular color según gasto (de 0 a max)
  const calcularColor = (gasto, maxGasto) => {
    if (gasto === 0) return '#e0e0e0'; // gris claro sin gasto
    const opacity = gasto / maxGasto;
    // Color rojo con opacidad proporcional
    return `rgba(255, 0, 0, ${opacity > 1 ? 1 : opacity})`;
  };

  // Calcular máximo gasto para escala de colores (entre todas las celdas)
  const maxGasto = React.useMemo(() => {
    let max = 0;
    Object.values(gastosDiariosCategorias).forEach(diaObj => {
      Object.values(diaObj).forEach(g => {
        if (g > max) max = g;
      });
    });
    return max || 1; // evitar división por 0
  }, [gastosDiariosCategorias]);

  return (
    <ScrollView contentContainerStyle={finanzasStyles.container}>
      <Text style={finanzasStyles.title}>Finanzas</Text>

      {/* INPUTS EXISTENTES */}
      <TextInput
        style={finanzasStyles.input}
        placeholder="Fecha (YYYY-MM-DD)"
        value={fecha}
        onChangeText={setFecha}
      />

      <TextInput
        style={finanzasStyles.input}
        placeholder="Ingresos"
        keyboardType="numeric"
        value={ingresos}
        onChangeText={setIngresos}
      />

      <Text style={finanzasStyles.subtitle}>Categorías de Gastos</Text>
      {categorias.map(cat => (
        <GastoInput
          key={cat}
          label={cat.charAt(0).toUpperCase() + cat.slice(1)}
          value={gastos[cat]}
          onChange={(text) => handleGastosChange(cat, text)}
        />
      ))}

      <Text style={finanzasStyles.result}>Total de Ingresos: {ingresos}</Text>
      <Text style={finanzasStyles.result}>Total de Gastos: {Object.values(gastos).reduce((a, b) => a + b, 0)}</Text>

      <View style={finanzasStyles.buttonContainer}>
        <Button title="Guardar Gráfico" onPress={handleGuardar} />
        <Button title="Resetear" onPress={() => {
          setFecha('');
          setIngresos('');
          setGastos({ ocio: 0, alquiler: 0, festivales: 0, compras: 0, juegos: 0, otros: 0 });
        }} />
      </View>

      {/* GRÁFICOS EXISTENTES */}
      <Text style={finanzasStyles.chartTitle}>Gastos por Mes</Text>
      <LineChart
        data={{
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
          datasets: [{ data: gastosPorMes }],
        }}
        width={Dimensions.get('window').width - 30}
        height={220}
        yAxisSuffix="€"
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: { r: '5', strokeWidth: '2', stroke: '#007AFF' },
        }}
        bezier
        style={{ marginVertical: 10, borderRadius: 16 }}
        onDataPointClick={({ index, value }) => {
          const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
          setMesSeleccionado(meses[index]);
          setGastosMesSeleccionado(value);
          setTipoModal('gasto');
          setModalVisible(true);
        }}
      />

      <Text style={finanzasStyles.chartTitle}>Ingresos por Mes</Text>
      <LineChart
        data={{
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
          datasets: [{ data: ingresosPorMes }],
        }}
        width={Dimensions.get('window').width - 30}
        height={220}
        yAxisSuffix="€"
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: { r: '5', strokeWidth: '2', stroke: '#228B22' },
        }}
        bezier
        style={{ marginVertical: 10, borderRadius: 16 }}
        onDataPointClick={({ index, value }) => {
          const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
          setMesSeleccionado(meses[index]);
          setIngresosMesSeleccionado(value);
          setTipoModal('ingreso');
          setModalVisible(true);
        }}
      />

      {/* GRÁFICO DE PORCENTAJES DE GASTOS POR CATEGORÍA */}
      {Object.keys(gastosPorCategoria).length > 0 && (
        <>
          <Text style={finanzasStyles.chartTitle}>Porcentaje de Gastos por Categoría</Text>
          <BarChart
            data={{
              labels: Object.keys(gastosPorCategoria),
              datasets: [{ data: porcentajesCategorias }],
            }}
            width={Dimensions.get('window').width - 30}
            height={300}
            fromZero
            yAxisSuffix="%"
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              barPercentage: 0.5,
            }}
            verticalLabelRotation={0}
            style={{ marginVertical: 10, borderRadius: 16 }}
          />
        </>
      )}

      {/* NUEVO: GRÁFICO DE CALOR (HEATMAP) DE GASTOS POR DÍA Y CATEGORÍA */}
      <Text style={[finanzasStyles.chartTitle, { marginTop: 20 }]}>Gastos Diarios por Categoría (Mes Actual)</Text>

      <ScrollView horizontal style={{ marginBottom: 20 }}>
        <View>
          {/* Header: Categorías */}
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: 40, borderWidth: 1, borderColor: '#ccc', backgroundColor: '#f0f0f0' }}>
              <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Día</Text>
            </View>
            {categorias.map(cat => (
              <View
                key={cat}
                style={{
                  width: 50,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  backgroundColor: '#f0f0f0',
                  paddingVertical: 5,
                }}
              >
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 12 }}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
              </View>
            ))}
          </View>

          {/* Filas por día */}
          {Array.from({ length: 31 }, (_, i) => i + 1).map(dia => (
            <View key={dia} style={{ flexDirection: 'row' }}>
              {/* Columna día */}
              <View style={{ width: 40, borderWidth: 1, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center' }}>
                <Text>{dia}</Text>
              </View>

              {/* Celdas por categoría */}
              {categorias.map(cat => {
                const gastoCelda = gastosDiariosCategorias[dia]?.[cat] || 0;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={{
                      width: 50,
                      height: 30,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      backgroundColor: calcularColor(gastoCelda, maxGasto),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      setModalGastoCelda(gastoCelda);
                      setModalDiaCelda(dia);
                      setModalCategoriaCelda(cat);
                      setModalCeldaVisible(true);
                    }}
                  >
                    <Text style={{ fontSize: 11, color: gastoCelda > maxGasto / 2 ? 'white' : 'black' }}>
                      {gastoCelda > 0 ? gastoCelda.toFixed(2) + '€' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
      {/* MODAL GENERAL MES */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={finanzasStyles.modalContainer}>
          <View style={finanzasStyles.modalContent}>
            <Text style={finanzasStyles.modalTitle}>{mesSeleccionado}</Text>
            {tipoModal === 'gasto' && <Text>Gastos: {gastosMesSeleccionado} €</Text>}
            {tipoModal === 'ingreso' && <Text>Ingresos: {ingresosMesSeleccionado} €</Text>}
            <Button title="Cerrar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* MODAL CELDA HEATMAP */}
      <Modal visible={modalCeldaVisible} transparent animationType="fade" onRequestClose={() => setModalCeldaVisible(false)}>
  <View style={finanzasStyles.modalContainer}>
    <View style={finanzasStyles.modalContent}>
      <Text style={finanzasStyles.modalTitle}>Detalles</Text>
      <Text style={finanzasStyles.modalText}>Día: {modalDiaCelda}</Text>
      <Text style={finanzasStyles.modalText}>Categoría: {modalCategoriaCelda.charAt(0).toUpperCase() + modalCategoriaCelda.slice(1)}</Text>
      <Text style={finanzasStyles.modalText}>Gasto: {modalGastoCelda.toFixed(2)} €</Text>
      <View style={finanzasStyles.modalButton}>
        <Button title="Cerrar" onPress={() => setModalCeldaVisible(false)} />
      </View>
    </View>
  </View>
</Modal>

    </ScrollView>
  );
}
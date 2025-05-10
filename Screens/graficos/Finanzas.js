import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, Dimensions } from 'react-native';
import { RadarChart } from '@salmonco/react-native-radar-chart';
import { getAuth } from 'firebase/auth';
import { getComparacionMesActualYAnterior, getGastosTotalesPorMes, getIngresosTotalesPorMes, saveGrafico } from '../../services/financeService';
import { finanzasStyles } from '../../styles/finanzasStyles';
import GastoInput from '../../components/GastoInput';
import { LineChart } from 'react-native-chart-kit';

export default function Finanzas() {
  const [ingresos, setIngresos] = useState('');
  const [fecha, setFecha] = useState('');
  const [gastosPorMes, setGastosPorMes] = useState(Array(12).fill(0));
  const [ingresosPorMes, setIngresosPorMes] = useState(Array(12).fill(0));

  const [gastos, setGastos] = useState({
    ocio: 0,
    alquiler: 0,
    festivales: 0,
    compras: 0,
    juegos: 0,
    otros: 0,
  });

  const [gastosGraficoActual, setGastosGraficoActual] = useState({
    ocio: 0,
    alquiler: 0,
    festivales: 0,
    compras: 0,
    juegos: 0,
    otros: 0,
  });

  const [gastosGraficoAnterior, setGastosGraficoAnterior] = useState({
    ocio: 0,
    alquiler: 0,
    festivales: 0,
    compras: 0,
    juegos: 0,
    otros: 0,
  });

  const userId = getAuth().currentUser?.uid;

  useEffect(() => {
  const cargarDatosMensuales = async () => {
    if (!userId) return;

    const gastos = await getGastosTotalesPorMes(userId, new Date().getFullYear());
    setGastosPorMes(gastos);

    const ingresos = await getIngresosTotalesPorMes(userId, new Date().getFullYear());
    setIngresosPorMes(ingresos);
  };
    cargarDatosMensuales();
  }, [userId]);

  const handleIngresosChange = (text) => setIngresos(text);
  const handleFechaChange = (text) => setFecha(text);

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

      // Resetear solo formulario
      setFecha('');
      setIngresos('');
      setGastos({
        ocio: 0,
        alquiler: 0,
        festivales: 0,
        compras: 0,
        juegos: 0,
        otros: 0,
      });

      // Volver a cargar los gráficos después de guardar
      const nuevaComparacion = await getComparacionMesActualYAnterior(userId, new Date().toISOString());
      if (nuevaComparacion) {
        setGastosGraficoActual(nuevaComparacion.actual);
        setGastosGraficoAnterior(nuevaComparacion.anterior);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al guardar el gráfico.');
    }
  };

  return (
    <ScrollView contentContainerStyle={finanzasStyles.container}>
      <Text style={finanzasStyles.title}>Finanzas</Text>

      <TextInput
        style={finanzasStyles.input}
        placeholder="Fecha (YYYY-MM-DD)"
        value={fecha}
        onChangeText={handleFechaChange}
      />

      <TextInput
        style={finanzasStyles.input}
        placeholder="Ingresos"
        keyboardType="numeric"
        value={ingresos}
        onChangeText={handleIngresosChange}
      />

      <Text style={finanzasStyles.subtitle}>Categorías de Gastos</Text>

      <GastoInput label="Ocio" value={gastos.ocio} onChange={(text) => handleGastosChange('ocio', text)} />
      <GastoInput label="Alquiler" value={gastos.alquiler} onChange={(text) => handleGastosChange('alquiler', text)} />
      <GastoInput label="Festivales" value={gastos.festivales} onChange={(text) => handleGastosChange('festivales', text)} />
      <GastoInput label="Compras" value={gastos.compras} onChange={(text) => handleGastosChange('compras', text)} />
      <GastoInput label="Juegos" value={gastos.juegos} onChange={(text) => handleGastosChange('juegos', text)} />
      <GastoInput label="Otros" value={gastos.otros} onChange={(text) => handleGastosChange('otros', text)} />

      <Text style={finanzasStyles.result}>Total de Ingresos: {ingresos}</Text>
      <Text style={finanzasStyles.result}>
        Total de Gastos: {Object.values(gastos).reduce((a, b) => a + b, 0)}
      </Text>

      <View style={finanzasStyles.buttonContainer}>
        <Button title="Guardar Gráfico" onPress={handleGuardar} />
        <Button title="Resetear" onPress={() => {
          setFecha('');
          setIngresos('');
          setGastos({ ocio: 0, alquiler: 0, festivales: 0, compras: 0, juegos: 0, otros: 0 });
        }} />
      </View>

      <Text style={finanzasStyles.chartTitle}>Gastos por Mes</Text>
      {gastosPorMes.length === 12 && (
        <LineChart
          data={{
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{ data: gastosPorMes, strokeWidth: 2 }],
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
            style: { borderRadius: 16 },
            propsForDots: { r: '5', strokeWidth: '2', stroke: '#007AFF' },
          }}
          bezier
          style={{ marginVertical: 10, borderRadius: 16 }}
        />
      )}

      <Text style={finanzasStyles.chartTitle}>Ingresos por Mes</Text>
      {ingresosPorMes.length === 12 && (
        <LineChart
          data={{
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{ data: ingresosPorMes, strokeWidth: 2 }],
          }}
          width={Dimensions.get('window').width - 30}
          height={220}
          yAxisSuffix="€"
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(34, 139, 34, ${opacity})`, // verde
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: '5', strokeWidth: '2', stroke: '#228B22' },
          }}
          bezier
          style={{ marginVertical: 10, borderRadius: 16 }}
        />
      )}

    </ScrollView>
  );
}

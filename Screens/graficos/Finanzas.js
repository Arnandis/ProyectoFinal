import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { saveGrafico } from '../../services/financeService';
import { finanzasStyles } from '../../styles/finanzasStyles';
import GastoInput from '../../components/GastoInput';
import { getAuth } from 'firebase/auth';

const { width } = Dimensions.get('window');

export default function Finanzas() {
  const [ingresos, setIngresos] = useState('');
  const [gastos, setGastos] = useState({
    ocio: 0,
    alquiler: 0,
    festivales: 0,
    compras: 0,
    juegos: 0,
    otros: 0,
  });
  const [fecha, setFecha] = useState('');
  const userId = getAuth().currentUser?.uid;

  const handleIngresosChange = (text) => setIngresos(text);

  const handleGastosChange = (category, value) => {
    setGastos({ ...gastos, [category]: parseFloat(value) || 0 });
  };

  const handleFechaChange = (text) => setFecha(text);

  const chartData = {
    labels: ['Ocio', 'Alquiler', 'Festivales', 'Compras', 'Juegos', 'Otros'],
    datasets: [
      {
        data: [gastos.ocio, gastos.alquiler, gastos.festivales, gastos.compras, gastos.juegos, gastos.otros],
        strokeWidth: 2,
      },
    ],
  };

  const handleGuardar = async () => {
    if (!userId) {
      Alert.alert('Error', 'Usuario no autenticado.');
      return;
    }
    try {
      await saveGrafico(userId, fecha, ingresos, gastos);
      Alert.alert('Éxito', 'Gráfico guardado correctamente.');
      setFecha('');
      setIngresos('');
      setGastos({ ocio: 0, alquiler: 0, festivales: 0, compras: 0, juegos: 0, otros: 0 });
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al guardar el gráfico.');
    }
  };

  return (
    <ScrollView contentContainerStyle={finanzasStyles.container}>
      <Text style={finanzasStyles.title}>Finanzas</Text>

      <TextInput
        style={finanzasStyles.input}
        placeholder="Ingrese la fecha (YYYY-MM-DD)"
        value={fecha}
        onChangeText={handleFechaChange}
      />

      <TextInput
        style={finanzasStyles.input}
        placeholder="Ingrese sus ingresos"
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

      <Text style={finanzasStyles.chartTitle}>Distribución de Gastos</Text>
      <LineChart
        data={chartData}
        width={width - 30}
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 },
        }}
        style={{ marginVertical: 8, borderRadius: 16 }}
      />

      <Text style={finanzasStyles.result}>Total de Ingresos: {ingresos}</Text>
      <Text style={finanzasStyles.result}>
        Total de Gastos: {gastos.ocio + gastos.alquiler + gastos.festivales + gastos.compras + gastos.juegos + gastos.otros}
      </Text>

      <View style={finanzasStyles.buttonContainer}>
        <Button title="Guardar Gráfico" onPress={handleGuardar} />
        <Button title="Resetear" onPress={() => {
          setFecha('');
          setIngresos('');
          setGastos({ ocio: 0, alquiler: 0, festivales: 0, compras: 0, juegos: 0, otros: 0 });
        }} />
      </View>
    </ScrollView>
  );
}

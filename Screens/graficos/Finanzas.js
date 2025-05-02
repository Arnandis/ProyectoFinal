import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { saveGrafico, getGrafico, updateGrafico, deleteGrafico } from '../../services/financeService';
import { finanzasStyles } from '../../styles/finanzasStyles';
import GastoInput from '../../components/GastoInput';
import { getAuth } from 'firebase/auth';

const { width } = Dimensions.get('window');

export default function Finanzas() {
  // Estados para almacenar los ingresos, los gastos y la fecha
  const [ingresos, setIngresos] = useState('');
  const [gastos, setGastos] = useState({
    ocio: 0,
    alquiler: 0,
    festivales:0,
    compras:0,
    juegos: 0,
    otros:0,
  });
  const [fecha, setFecha] = useState(''); // Nuevo estado para la fecha
  const [grafico, setGrafico] = useState(null); // Estado para almacenar el gráfico recuperado
  const userId = getAuth().currentUser?.uid;

  // Funciones para manejar los cambios en los inputs
  const handleIngresosChange = (text) => {
    setIngresos(text);
  };

  const handleGastosChange = (category, value) => {
    setGastos({ ...gastos, [category]: parseFloat(value) });
  };

  const handleFechaChange = (text) => {
    setFecha(text); // Actualiza la fecha
  };

  // Verificar si los gastos superan los ingresos
  const checkGastosVsIngresos = () => {
    const totalIngresos = parseFloat(ingresos);
    if (isNaN(totalIngresos)) {
      Alert.alert('Error', 'Por favor, ingresa una cantidad válida de ingresos.', [{ text: 'Entendido' }], { cancelable: false });
      return;
    }

    const totalGastos = gastos.ocio + gastos.alquiler + gastos.festivales + gastos.compras + gastos.juegos + gastos.otros;
    if (totalGastos > totalIngresos) {
      Alert.alert('Alerta', 'Tus gastos son mayores que tus ingresos. ¡Cuidado!', [{ text: 'Entendido' }], { cancelable: false });
    } else {
      Alert.alert('Todo está bien', 'Tus ingresos son suficientes para cubrir tus gastos.', [{ text: 'Entendido' }], { cancelable: false });
    }
  };


  // Datos para el gráfico
  const chartData = {
    labels: ['Ocio', 'Alquiler','Festivales','Compras' ,'Juegos','Otros'],
    datasets: [
      {
        data: [gastos.ocio, gastos.alquiler,gastos.festivales,gastos.compras ,gastos.juegos,gastos.otros],
        strokeWidth: 2, // Tercer parámetro es el grosor de la línea
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
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al guardar el gráfico.');
    }
  };
  
  const handleLeer = async () => {
    if (!userId) {
      Alert.alert('Error', 'Usuario no autenticado.');
      return;
    }
    try {
      const data = await getGrafico(userId, fecha);
      if (data) {
        setIngresos(data.ingresos.toString());
        setGastos(data.gastos);
        Alert.alert('Éxito', 'Gráfico cargado correctamente.');
      } else {
        Alert.alert('Info', 'No se encontró un gráfico para esa fecha.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al obtener el gráfico.');
    }
  };
  
  const handleActualizar = async () => {
    if (!userId) {
      Alert.alert('Error', 'Usuario no autenticado.');
      return;
    }
    try {
      await updateGrafico(userId, fecha, { ingresos, gastos });
      Alert.alert('Éxito', 'Gráfico actualizado correctamente.');
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al actualizar el gráfico.');
    }
  };
  
  const handleEliminar = async () => {
    if (!userId) {
      Alert.alert('Error', 'Usuario no autenticado.');
      return;
    }
    try {
      await deleteGrafico(userId, fecha);
      Alert.alert('Éxito', 'Gráfico eliminado correctamente.');
      setIngresos('');
      setGastos({ ocio: 0, alquiler: 0, festivales: 0, compras: 0, juegos: 0, otros: 0 });
    } catch (error) {
      Alert.alert('Error', error.message || 'Error al eliminar el gráfico.');
    }
  };
  
  
  return (
    <ScrollView contentContainerStyle={finanzasStyles.container}>
      <Text style={finanzasStyles.title}>Finanzas</Text>

      {/* Campo de Fecha */}
      <TextInput
        style={finanzasStyles.input}
        placeholder="Ingrese la fecha (YYYY-MM-DD)"
        value={fecha}
        onChangeText={handleFechaChange}
      />

      {/* Ingresos */}
      <TextInput
        style={finanzasStyles.input}
        placeholder="Ingrese sus ingresos"
        keyboardType="numeric"
        value={ingresos}
        onChangeText={handleIngresosChange}
      />

      <Text style={finanzasStyles.subtitle}>Categorías de Gastos</Text>

      {/* Gastos */}
      <GastoInput label="Ocio" value={gastos.ocio} onChange={(text) => handleGastosChange('ocio', text)} />
      <GastoInput label="Alquiler" value={gastos.alquiler} onChange={(text) => handleGastosChange('alquiler', text)} />
      <GastoInput label="Festivales" value={gastos.festivales} onChange={(text) => handleGastosChange('festivales', text)} />
      <GastoInput label="Compras" value={gastos.compras} onChange={(text) => handleGastosChange('compras', text)} />
      <GastoInput label="Juegos" value={gastos.juegos} onChange={(text) => handleGastosChange('juegos', text)} />
      <GastoInput label="Otros" value={gastos.otros} onChange={(text) => handleGastosChange('otros', text)} />


      {/* Gráfico */}
      <Text style={finanzasStyles.chartTitle}>Distribución de Gastos</Text>
      <LineChart
        data={chartData}
        width={width - 30} // Se ajusta al tamaño de la pantalla
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 2, // Muestra dos decimales
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />

      {/* Mostrar el total de ingresos y gastos */}
      <Text style={finanzasStyles.result}>Total de Ingresos: {ingresos}</Text>
      <Text style={finanzasStyles.result}>Total de Gastos: {gastos.ocio + gastos.alquiler + gastos.festivales + gastos.compras + gastos.juegos +gastos.otros}</Text>

      {/* Botones de CRUD */}
      <View style={finanzasStyles.buttonContainer}>
  <Button title="Verificar Gastos" onPress={checkGastosVsIngresos} />
  <Button title="Guardar Gráfico" onPress={handleGuardar} />
  <Button title="Leer Gráfico" onPress={handleLeer} />
  <Button title="Actualizar Gráfico" onPress={handleActualizar} />
  <Button title="Eliminar Gráfico" onPress={handleEliminar} />
  <Button title="Resetear" onPress={() => {
    setIngresos('');
    setGastos({ ocio: 0, alquiler: 0, festivales: 0, compras: 0, juegos: 0, otros: 0 });
  }} />
</View>

    </ScrollView>
  );
}
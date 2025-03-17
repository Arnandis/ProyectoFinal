import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { saveGrafico, getGrafico, updateGrafico, deleteGrafico } from '/home/pau/Escritorio/ProyectoFinal/my-proyect/componentes/FirestoreMethods.js'; // Importa los métodos CRUD
import Encabezado from '../componentes/Encabezado';

const { width } = Dimensions.get('window');


//En els metodos de FirestoreMethods comprovabem que tots els camps estigueren posats en
//if (fecha && ingresos && gastos.ocio && gastos.alquiler && gastos.juegos && gastos.compras && gastos.festivales &&gastos.otros) {
//pero nian camps que poden estar a 0 pq alom no has gastat dines en alquiler...
//mirar que els estilos els agarre del package Styles. 

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

  // Crear un gráfico gastamos FirestoreMethods probar si festivales es 0 se guarda
  const handleGuardar = async () => {
    if (fecha && ingresos) {
      await saveGrafico(fecha, ingresos, gastos);
      Alert.alert('Éxito', 'Gráfico guardado correctamente.');
    } else {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
    }
  };

  // Leer un gráfico
  const handleLeer = async () => {
    if (fecha) {
      const graficoData = await getGrafico(fecha);
      if (graficoData.length > 0) {
        setGrafico(graficoData[0]); // Asignamos el primer gráfico encontrado
      } else {
        Alert.alert('No encontrado', 'No hay gráficos guardados para esta fecha.');
      }
    } else {
      Alert.alert('Error', 'Por favor, ingrese una fecha.');
    }
  };

  // Actualizar un gráfico
  const handleActualizar = async () => {
    if (fecha && ingresos) {
      const newData = { ingresos, gastos };
      await updateGrafico(fecha, newData);
      Alert.alert('Éxito', 'Gráfico actualizado correctamente.');
    } else {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
    }
  };

  // Eliminar un gráfico
  const handleEliminar = async () => {
    if (fecha) {
      await deleteGrafico(fecha);
      Alert.alert('Éxito', 'Gráfico eliminado correctamente.');
      setGrafico(null); // Limpiar gráfico mostrado
    } else {
      Alert.alert('Error', 'Por favor, ingrese una fecha.');
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Finanzas</Text>

      {/* Campo de Fecha */}
      <TextInput
        style={styles.input}
        placeholder="Ingrese la fecha (YYYY-MM-DD)"
        value={fecha}
        onChangeText={handleFechaChange}
      />

      {/* Ingresos */}
      <TextInput
        style={styles.input}
        placeholder="Ingrese sus ingresos"
        keyboardType="numeric"
        value={ingresos}
        onChangeText={handleIngresosChange}
      />

      <Text style={styles.subtitle}>Categorías de Gastos</Text>

      {/* Gastos */}
      <TextInput
        style={styles.input}
        placeholder="Gasto en Ocio"
        keyboardType="numeric"
        value={gastos.ocio.toString()}
        onChangeText={(text) => handleGastosChange('ocio', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Gasto en Alquiler"
        keyboardType="numeric"
        value={gastos.alquiler.toString()}
        onChangeText={(text) => handleGastosChange('alquiler', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Gasto en Festivales"
        keyboardType="numeric"
        value={gastos.festivales.toString()}
        onChangeText={(text) => handleGastosChange('festivales', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Gasto en Compras"
        keyboardType="numeric"
        value={gastos.compras.toString()}
        onChangeText={(text) => handleGastosChange('compras', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Gasto en Juegos"
        keyboardType="numeric"
        value={gastos.juegos.toString()}
        onChangeText={(text) => handleGastosChange('juegos', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Gasto en Otros"
        keyboardType="numeric"
        value={gastos.otros.toString()}
        onChangeText={(text) => handleGastosChange('otros', text)}
      />

      {/* Gráfico */}
      <Text style={styles.chartTitle}>Distribución de Gastos</Text>
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
      <Text style={styles.result}>Total de Ingresos: {ingresos}</Text>
      <Text style={styles.result}>Total de Gastos: {gastos.ocio + gastos.alquiler + gastos.festivales + gastos.compras + gastos.juegos +gastos.otros}</Text>

      {/* Botones de CRUD */}
      <View style={styles.buttonContainer}>
        <Button title="Verificar Gastos" onPress={checkGastosVsIngresos} />
        <Button title="Guardar Gráfico" onPress={handleGuardar} />
        <Button title="Leer Gráfico" onPress={handleLeer} />
        <Button title="Actualizar Gráfico" onPress={handleActualizar} />
        <Button title="Eliminar Gráfico" onPress={handleEliminar} />
        <Button title="Resetear" onPress={() => { setIngresos(''); setGastos({ ocio: 0, alquiler: 0, juegos: 0 ,festivales:0,compras:0,otros:0}) }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,  // Asegura que el contenido se puede desplazar
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    paddingBottom: 20, 
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
  },
  chartTitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  result: {
    fontSize: 16,
    marginVertical: 5,
  },
  
  buttonContainer: {
    marginTop: 20,
    width: '70%',
    marginBottom: 20,
    gap:15,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15, 
    backgroundColor: "#ddd", 

  },
});

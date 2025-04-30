import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { getAllGraficos } from '../services/financeService';
import { getAuth } from 'firebase/auth';

export default function HistorialGraficos({ navigation }) {
  const [graficos, setGraficos] = useState([]);
  const userId = getAuth().currentUser?.uid;

  useEffect(() => {
    cargarGraficos();
  }, []);

  // Función que carga todos los gráficos
  const cargarGraficos = async () => {
    if (!userId) return;
  
    try {
      const data = await getAllGraficos(userId);
      setGraficos(data);
    } catch (error) {
      console.error('Error al cargar gráficos:', error);
    }
  };
  

  // Renderiza cada gráfico
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('DetalleGrafico', { grafico: item })}
      style={{ padding: 16, borderBottomWidth: 1, borderColor: '#ccc' }}
    >
      <Text style={{ fontWeight: 'bold' }}>{item.fecha}</Text>
      <Text>Ingresos: {item.ingresos}</Text>
      <Text>Gastos: {JSON.stringify(item.gastos)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Historial de Gráficos</Text>

      <FlatList
        data={graficos}
        keyExtractor={(item, index) => item.fecha + index} // Usa la fecha como clave
        renderItem={renderItem} // Renderiza cada gráfico
      />
    </View>
  );
}

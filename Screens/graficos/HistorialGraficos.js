import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { getAllGraficos } from '../../services/financeService';
import { getAllGraficosTiempo } from '../../services/tiempoService';
import { getAuth } from 'firebase/auth';

export default function HistorialGraficos({ navigation }) {
  const [graficos, setGraficos] = useState([]);
  const [tipoGrafico, setTipoGrafico] = useState('finanzas'); // 'finanzas' o 'tiempo'
  const userId = getAuth().currentUser?.uid;

  useEffect(() => {
    cargarGraficos();
  }, [tipoGrafico]);

  const cargarGraficos = async () => {
    if (!userId) return;

    try {
      if (tipoGrafico === 'finanzas') {
        const data = await getAllGraficos(userId);
        setGraficos(data);
      } else if (tipoGrafico === 'tiempo') {
        const data = await getAllGraficosTiempo(userId);
        setGraficos(data);
      }
    } catch (error) {
      console.error('Error al cargar gráficos:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('DetalleGraficoTiempo', { grafico: item, tipo: tipoGrafico })}
      style={{ padding: 16, borderBottomWidth: 1, borderColor: '#ccc' }}
    >
      <Text style={{ fontWeight: 'bold' }}>{item.fecha}</Text>
      {tipoGrafico === 'finanzas' ? (
        <>
          <Text>Ingresos: {item.ingresos}</Text>
          <Text>Gastos: {JSON.stringify(item.gastos)}</Text>
        </>
      ) : (
        <>
          <Text>Trabajo: {item.tiempos?.trabajo ?? 0} min</Text>
          <Text>Estudio: {item.tiempos?.estudio ?? 0} min</Text>
          <Text>Descanso: {item.tiempos?.descanso ?? 0} min</Text>
          <Text>Deporte: {item.tiempos?.deporte ?? 0} min</Text>
          <Text>Familia: {item.tiempos?.familia ?? 0} min</Text>
          <Text>Otros: {item.tiempos?.otros ?? 0} min</Text>

        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Historial de Gráficos</Text>

      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => setTipoGrafico('finanzas')}
          style={{
            padding: 10,
            backgroundColor: tipoGrafico === 'finanzas' ? '#007BFF' : '#ccc',
            marginRight: 8,
            borderRadius: 8
          }}
        >
          <Text style={{ color: '#fff' }}>Finanzas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTipoGrafico('tiempo')}
          style={{
            padding: 10,
            backgroundColor: tipoGrafico === 'tiempo' ? '#007BFF' : '#ccc',
            borderRadius: 8
          }}
        >
          <Text style={{ color: '#fff' }}>Tiempo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={graficos}
        keyExtractor={(item, index) => item.fecha + index}
        renderItem={renderItem}
      />
    </View>
  );
}

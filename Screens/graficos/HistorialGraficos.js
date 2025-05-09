import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { getAllGraficos, getGraficosFinanzasPorFechas } from '../../services/financeService';
import { getAllGraficosTiempo, getGraficosTiempoPorFechas } from '../../services/tiempoService';
import { getAuth } from 'firebase/auth';

export default function HistorialGraficos({ navigation }) {
  const [graficos, setGraficos] = useState([]);
  const [tipoGrafico, setTipoGrafico] = useState('finanzas');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const userId = getAuth().currentUser?.uid;

  useEffect(() => {
    cargarGraficos();
  }, [tipoGrafico]);

  const ordenarPorFechaDesc = (datos) => {
    return datos.sort((a, b) => b.fecha.localeCompare(a.fecha));
  };

  const cargarGraficos = async () => {
    if (!userId) return;
    try {
      let data = [];

      if (tipoGrafico === 'finanzas') {
        data = await getAllGraficos(userId);
      } else {
        data = await getAllGraficosTiempo(userId);
      }

      setGraficos(ordenarPorFechaDesc(data));
    } catch (error) {
      console.error('Error al cargar gráficos:', error);
    }
  };

  const filtrarPorFechas = async () => {
    if (!userId || !fechaInicio || !fechaFin) return;
    try {
      let data = [];

      if (tipoGrafico === 'tiempo') {
        data = await getGraficosTiempoPorFechas(userId, fechaInicio, fechaFin);
      } else {
        data = await getGraficosFinanzasPorFechas(userId, fechaInicio, fechaFin);
      }

      setGraficos(ordenarPorFechaDesc(data));
    } catch (error) {
      console.error('Error al filtrar gráficos:', error);
    }
  };

  const limpiarFiltro = () => {
    setFechaInicio('');
    setFechaFin('');
    cargarGraficos();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (tipoGrafico === 'finanzas') {
          navigation.navigate('DetalleGraficoFinanzas', { grafico: item });
        } else {
          navigation.navigate('DetalleGraficoTiempo', { grafico: item });
        }
      }}
      style={{
        padding: 20,
        marginBottom: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5
      }}
    >
      <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 4 }}>{item.fecha}</Text>
      {tipoGrafico === 'finanzas' ? (
        <>
          <Text style={{ color: '#666' }}>Ingresos: {item.ingresos}</Text>
          <Text style={{ color: '#666' }}>Gastos: {JSON.stringify(item.gastos)}</Text>
        </>
      ) : (
        <>
          <Text style={{ color: '#666' }}>Trabajo: {item.tiempos?.trabajo ?? 0} min</Text>
          <Text style={{ color: '#666' }}>Estudio: {item.tiempos?.estudio ?? 0} min</Text>
          <Text style={{ color: '#666' }}>Descanso: {item.tiempos?.descanso ?? 0} min</Text>
          <Text style={{ color: '#666' }}>Deporte: {item.tiempos?.deporte ?? 0} min</Text>
          <Text style={{ color: '#666' }}>Familia: {item.tiempos?.familia ?? 0} min</Text>
          <Text style={{ color: '#666' }}>Otros: {item.tiempos?.otros ?? 0} min</Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#f7f7f7' }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 16, color: '#333' }}>Historial de Gráficos</Text>

      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => setTipoGrafico('finanzas')}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 20,
            backgroundColor: tipoGrafico === 'finanzas' ? '#007BFF' : '#e0e0e0',
            borderRadius: 50,
            marginRight: 8
          }}
        >
          <Text style={{ color: tipoGrafico === 'finanzas' ? '#fff' : '#333', fontWeight: '500' }}>Finanzas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTipoGrafico('tiempo')}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 20,
            backgroundColor: tipoGrafico === 'tiempo' ? '#007BFF' : '#e0e0e0',
            borderRadius: 50
          }}
        >
          <Text style={{ color: tipoGrafico === 'tiempo' ? '#fff' : '#333', fontWeight: '500' }}>Tiempo</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 24 }}>
        <Text style={{ marginBottom: 8, fontSize: 14, color: '#555' }}>Fecha inicio (YYYY-MM-DD):</Text>
        <TextInput
          value={fechaInicio}
          onChangeText={setFechaInicio}
          placeholder="2024-01-01"
          style={{
            borderWidth: 1,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 8,
            borderColor: '#ddd',
            backgroundColor: '#fff',
            marginBottom: 16
          }}
        />
        <Text style={{ marginBottom: 8, fontSize: 14, color: '#555' }}>Fecha fin (YYYY-MM-DD):</Text>
        <TextInput
          value={fechaFin}
          onChangeText={setFechaFin}
          placeholder="2024-12-31"
          style={{
            borderWidth: 1,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 8,
            borderColor: '#ddd',
            backgroundColor: '#fff',
            marginBottom: 16
          }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={filtrarPorFechas}
            style={{
              backgroundColor: '#28a745',
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 50,
              flex: 1,
              marginRight: 8
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '500' }}>Filtrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={limpiarFiltro}
            style={{
              backgroundColor: '#dc3545',
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 50,
              flex: 1
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '500' }}>Limpiar Filtro</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={graficos}
        keyExtractor={(item, index) => item.fecha + index}
        renderItem={renderItem}
      />
    </View>
  );
}

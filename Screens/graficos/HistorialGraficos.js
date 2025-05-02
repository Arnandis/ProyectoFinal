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

      <View style={{ marginBottom: 16 }}>
        <Text>Fecha inicio (YYYY-MM-DD):</Text>
        <TextInput
          value={fechaInicio}
          onChangeText={setFechaInicio}
          placeholder="2024-01-01"
          style={{ borderWidth: 1, padding: 8, marginBottom: 8, borderRadius: 6 }}
        />
        <Text>Fecha fin (YYYY-MM-DD):</Text>
        <TextInput
          value={fechaFin}
          onChangeText={setFechaFin}
          placeholder="2024-12-31"
          style={{ borderWidth: 1, padding: 8, marginBottom: 8, borderRadius: 6 }}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={filtrarPorFechas}
            style={{ backgroundColor: '#28a745', padding: 10, borderRadius: 8, flex: 1, marginRight: 8 }}
          >
            <Text style={{ color: '#fff', textAlign: 'center' }}>Filtrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={limpiarFiltro}
            style={{ backgroundColor: '#dc3545', padding: 10, borderRadius: 8, flex: 1 }}
          >
            <Text style={{ color: '#fff', textAlign: 'center' }}>Limpiar Filtro</Text>
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

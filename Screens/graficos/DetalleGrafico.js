import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { getAllGraficosFinanzas } from '../../services/financeService';
import { getAllGraficosTiempo } from '../../services/tiempoService';

const { width } = Dimensions.get('window');

export default function DetalleGrafico({ route }) {
  const { grafico, tipo } = route.params;
  const [comparar, setComparar] = useState(false);
  const [otroGrafico, setOtroGrafico] = useState(null);
  const [graficosDisponibles, setGraficosDisponibles] = useState([]);

  useEffect(() => {
    cargarGraficosDisponibles();
  }, []);

  const cargarGraficosDisponibles = async () => {
    const data = tipo === 'Finanzas'
      ? await getAllGraficosFinanzas()
      : await getAllGraficosTiempo();

    const otros = data.filter(g => g.fecha !== grafico.fecha);
    setGraficosDisponibles(otros);
  };

  const sanitize = (val) => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  };

  const renderGrafico = (g, color = 'rgba(0,0,255,1)') => {
    if (!g) return { labels: [], datasets: [] };

    const labels =
      tipo === 'Finanzas'
        ? ['Ocio', 'Alquiler', 'Festivales', 'Compras', 'Juegos', 'Otros']
        : Object.keys(g.tiempos || {});

    const data =
      tipo === 'Finanzas'
        ? [
            sanitize(g.gastos?.ocio),
            sanitize(g.gastos?.alquiler),
            sanitize(g.gastos?.festivales),
            sanitize(g.gastos?.compras),
            sanitize(g.gastos?.juegos),
            sanitize(g.gastos?.otros)
          ]
        : labels.map(key => sanitize(g.tiempos?.[key]));

    console.log("Labels:", labels);
    console.log("Data:", data);

    return {
      labels,
      datasets: [{ data, strokeWidth: 2, color: () => color }]
    };
  };

  const handleSeleccionarComparar = () => {
    if (graficosDisponibles.length === 0) {
      Alert.alert('No hay otros gráficos disponibles para comparar');
      return;
    }

    setOtroGrafico(graficosDisponibles[0]);
    setComparar(true);
  };

  const renderRecomendacion = () => {
    if (!grafico) return null;

    if (tipo === 'Finanzas') {
      const ahorro = grafico.ingresos - Object.values(grafico.gastos || {}).reduce((a, b) => a + b, 0);
      if (ahorro >= 300) return '¡Con tus ahorros podrías comprarte un móvil Xiaomi!';
      if (ahorro > 0) return 'Estás ahorrando bien, sigue así.';
      return 'Estás gastando más de lo que ganas. ¡Cuidado!';
    } else {
      const totalHoras = grafico.totalHoras ?? Object.values(grafico.tiempos || {}).reduce((a, b) => a + b, 0);
      if (totalHoras >= 30) return '¡Has hecho el equivalente a dos maratones este mes!';
      if (totalHoras >= 15) return '¡Muy buen ritmo de actividad!';
      return 'Puedes mejorar tu distribución del tiempo, ¡ánimo!';
    }
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Detalle del gráfico ({tipo}) - {grafico.fecha}
      </Text>

      <LineChart
        data={renderGrafico(grafico)}
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

      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
        Recomendación personalizada:
      </Text>
      <Text style={{ marginBottom: 16 }}>{renderRecomendacion()}</Text>

      <Button title="Comparar con otro gráfico" onPress={handleSeleccionarComparar} />

      {comparar && otroGrafico && (
        <>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>
            Comparando con: {otroGrafico.fecha}
          </Text>

          <LineChart
            data={renderGrafico(otroGrafico, 'rgba(255,0,0,1)')}
            width={width - 30}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fce4ec',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              labelColor: () => '#000',
            }}
            style={{ marginVertical: 20, borderRadius: 16 }}
          />
        </>
      )}
    </ScrollView>
  );
}

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, Alert, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getAllGraficosTiempo } from '../../services/tiempoService';

const { width } = Dimensions.get('window');

export default function DetalleGraficoTiempo({ route }) {
  const { grafico } = route.params;
  const [comparar, setComparar] = useState(false);
  const [otroGrafico, setOtroGrafico] = useState(null);
  const [graficosDisponibles, setGraficosDisponibles] = useState([]);

  useEffect(() => {
    cargarGraficosDisponibles();
  }, []);

  const cargarGraficosDisponibles = async () => {
    const data = await getAllGraficosTiempo();
    const otros = data.filter(g => g.fecha !== grafico.fecha);
    setGraficosDisponibles(otros);
  };

  const sanitize = (val) => isNaN(Number(val)) ? 0 : Number(val);

  const renderGrafico = (g, color = 'rgba(0, 0, 255, 1)') => {
    const labels = ['Trabajo', 'Estudio', 'Descanso', 'Deporte', 'Familia', 'Otros'];
    const data = labels.map(label => sanitize(g?.tiempos?.[label.toLowerCase()]));

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

  const renderRecomendacion = (graficoTiempo) => {
    const tiempos = graficoTiempo.tiempos || {};
    const estudio = sanitize(tiempos.estudio);
    const descanso = sanitize(tiempos.descanso);
    const total = Object.values(tiempos).reduce((a, b) => a + sanitize(b), 0);

    if (estudio > 200) return '¡Has estudiado más de 200 minutos! Eso equivale a leer unas 70 páginas de Harry Potter.';
    if (descanso > 300) return 'Has pasado mucho tiempo descansando, intenta equilibrar con más estudio o deporte.';
    if (tiempos.deporte >= 150) return '¡Buen trabajo manteniéndote activo!';
    if (total < 200) return 'Puedes distribuir más tu tiempo, hay margen de mejora.';

    return '¡Buena organización! Sigue así.';
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Detalle del gráfico (Tiempo) - {grafico.fecha}
      </Text>

      <LineChart
        data={renderGrafico(grafico)}
        width={width - 30}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#f0f8ff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
          labelColor: () => '#000',
        }}
        style={{ marginVertical: 20, borderRadius: 16 }}
      />

      <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
        Recomendación personalizada:
      </Text>
      <Text style={{ marginBottom: 16 }}>{renderRecomendacion(grafico)}</Text>

      <Button title="Comparar con otro gráfico" onPress={handleSeleccionarComparar} />

      {comparar && otroGrafico && (
        <>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 20 }}>
            Comparando con: {otroGrafico.fecha}
          </Text>

          <LineChart
            data={renderGrafico(otroGrafico, 'rgba(255, 0, 0, 1)')}
            width={width - 30}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#ffe0f0',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
              labelColor: () => '#000',
            }}
            style={{ marginVertical: 20, borderRadius: 16 }}
          />

          <Text style={{ fontWeight: '600' }}>
            Consejo del gráfico comparado:
          </Text>
          <Text style={{ marginBottom: 16 }}>{renderRecomendacion(otroGrafico)}</Text>
        </>
      )}
    </ScrollView>
  );
}

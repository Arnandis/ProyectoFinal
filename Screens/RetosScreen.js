import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  increment,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { enviarNotificacionProgramada } from '../utils/notifications';

// Extensión para calcular semana del año
Date.prototype.getWeek = function () {
  const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

const retos = {
  diarios: [
    { id: 'd1', titulo: 'Haz 10 minutos de meditación', estrellas: 1, icono: 'meditation' },
    { id: 'd2', titulo: 'Escribe 3 cosas positivas del día', estrellas: 1, icono: 'pen' },
  ],
  semanales: [
    { id: 's1', titulo: 'Camina 30 minutos al día', estrellas: 3, icono: 'dog' },
    { id: 's2', titulo: 'Desconéctate 1h de pantallas', estrellas: 3, icono: 'turtle' },
    { id: 's3', titulo: 'Toma 2L de agua al día', estrellas: 3, icono: 'cup-water' },
  ],
  mensuales: [
    { id: 'm1', titulo: 'Lee un libro completo', estrellas: 5, icono: 'book-open-page-variant' },
    { id: 'm2', titulo: 'Evita comida rápida 2 semanas', estrellas: 5, icono: 'food-off' },
    { id: 'm3', titulo: 'Haz 10 entrenamientos', estrellas: 5, icono: 'weight-lifter' },
  ],
  anuales: [
    { id: 'a1', titulo: 'Corre una media maratón', estrellas: 10, icono: 'run-fast' },
    { id: 'a2', titulo: 'Ahorra 500€', estrellas: 10, icono: 'cash' },
    { id: 'a3', titulo: 'Haz voluntariado', estrellas: 10, icono: 'hand-heart' },
  ],
};

export default function RetosScreen() {
  const [retosCompletados, setRetosCompletados] = useState([]);
  const [totalEstrellas, setTotalEstrellas] = useState(0);
  const userId = getAuth().currentUser?.uid;

  useEffect(() => {
    if (userId) {
      cargarRetosCompletados();
    }
  }, [userId]);

  const estaVigente = (reto) => {
    const ahora = new Date();
    const fecha = new Date(reto.fecha);

    switch (reto.tipo) {
      case 'diarios':
        return ahora.toDateString() === fecha.toDateString();
      case 'semanales':
        return ahora.getFullYear() === fecha.getFullYear() &&
               ahora.getWeek() === fecha.getWeek();
      case 'mensuales':
        return ahora.getFullYear() === fecha.getFullYear() &&
               ahora.getMonth() === fecha.getMonth();
      case 'anuales':
        return ahora.getFullYear() === fecha.getFullYear();
      default:
        return false;
    }
  };

  const filtrarRetosVigentes = (retos) => retos.filter(estaVigente);

  const cargarRetosCompletados = async () => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const completados = data.retosCompletados || [];

        const vigentes = filtrarRetosVigentes(completados);

        setRetosCompletados(vigentes);
        setTotalEstrellas(data.estrellas || 0);

        // Limpieza automática de Firestore
        if (vigentes.length !== completados.length) {
          await updateDoc(userRef, {
            retosCompletados: vigentes,
          });
        }
      }
    } catch (error) {
      console.error('Error al cargar los retos completados:', error);
    }
  };

  const yaCompletado = (id, tipo) =>
    retosCompletados.some((r) => r.id === id && r.tipo === tipo && estaVigente(r));

  const completarReto = async (reto, tipo) => {
    if (!userId) return Alert.alert('Error', 'Usuario no autenticado');
    if (yaCompletado(reto.id, tipo)) return Alert.alert('Ya completado', 'Ya has completado este reto');

    const fechaActual = new Date().toISOString();
    const nuevoReto = { id: reto.id, fecha: fechaActual, tipo };

    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          estrellas: reto.estrellas,
          retosCompletados: [nuevoReto],
        });
        setTotalEstrellas(reto.estrellas);
      } else {
        const prevRetos = retosCompletados;
        await updateDoc(userRef, {
          estrellas: increment(reto.estrellas),
          retosCompletados: [...prevRetos, nuevoReto],
        });
        setTotalEstrellas((prev) => prev + reto.estrellas);
      }

      setRetosCompletados((prev) => [...prev, nuevoReto]);
      Alert.alert('¡Reto completado!', `Ganaste ⭐ ${reto.estrellas} estrellas`);

      const fechaRecordatorio = new Date();
      fechaRecordatorio.setDate(fechaRecordatorio.getDate() + 7);
      await enviarNotificacionProgramada(
        '¡Sigue así!',
        `Recuerda seguir cumpliendo retos como "${reto.titulo}"`,
        { date: fechaRecordatorio }
      );
    } catch (error) {
      console.error('Error al completar el reto:', error);
    }
  };

  const renderRetos = (categoria, tipo) => (
    <View key={tipo} style={styles.categoria}>
      <Text style={styles.tituloCategoria}>{tipo.toUpperCase()}</Text>
      {categoria.map((reto) => {
        const completado = yaCompletado(reto.id, tipo);
        const fecha = retosCompletados.find((r) => r.id === reto.id && r.tipo === tipo)?.fecha;

        return (
          <TouchableOpacity
            key={reto.id}
            style={[styles.retoContainer, completado && styles.retoCompletado]}
            onPress={() => completarReto(reto, tipo)}
            disabled={completado}
          >
            <MaterialCommunityIcons
              name={reto.icono}
              size={28}
              color={completado ? '#aaa' : '#333'}
              style={{ marginRight: 10 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.retoTexto, completado && { color: '#aaa' }]}>
                {reto.titulo}
              </Text>
              <Text style={styles.estrellas}>
                ⭐ {reto.estrellas} estrella{reto.estrellas > 1 ? 's' : ''}
              </Text>
              {completado && fecha && (
                <Text style={{ fontSize: 12, color: '#888' }}>
                  Cumplido el {new Date(fecha).toLocaleDateString()}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.tituloPrincipal}>Retos para ti</Text>
      <Text style={styles.totalEstrellas}>Total estrellas: ⭐ {totalEstrellas}</Text>
      {renderRetos(retos.diarios, 'diarios')}
      {renderRetos(retos.semanales, 'semanales')}
      {renderRetos(retos.mensuales, 'mensuales')}
      {renderRetos(retos.anuales, 'anuales')}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  tituloPrincipal: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  totalEstrellas: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
    marginBottom: 20,
  },
  categoria: {
    marginBottom: 30,
  },
  tituloCategoria: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  retoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  retoCompletado: {
    backgroundColor: '#e0e0e0',
  },
  retoTexto: {
    fontSize: 16,
    fontWeight: '600',
  },
  estrellas: {
    fontSize: 14,
    color: '#888',
  },
});

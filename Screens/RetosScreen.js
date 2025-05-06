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
import { doc, getDoc, updateDoc, arrayUnion, increment, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { enviarNotificacionProgramada } from '../utils/notifications';

const retos = {
  semanales: [
    { id: 1, titulo: 'Camina 30 minutos al día', estrellas: 1, icono: 'dog' },
    { id: 2, titulo: 'Desconéctate 1h de pantallas', estrellas: 1, icono: 'turtle' },
    { id: 7, titulo: 'Toma 2L de agua al día', estrellas: 1, icono: 'cup-water' },
  ],
  mensuales: [
    { id: 3, titulo: 'Lee un libro completo', estrellas: 3, icono: 'book-open-page-variant' },
    { id: 4, titulo: 'Evita comida rápida 2 semanas', estrellas: 3, icono: 'food-off' },
    { id: 8, titulo: 'Haz 10 entrenamientos', estrellas: 3, icono: 'weight-lifter' },
  ],
  anuales: [
    { id: 5, titulo: 'Corre una media maratón', estrellas: 10, icono: 'run-fast' },
    { id: 6, titulo: 'Ahorra 500€', estrellas: 10, icono: 'cash' },
    { id: 9, titulo: 'Haz voluntariado', estrellas: 10, icono: 'hand-heart' },
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

  const cargarRetosCompletados = async () => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const completados = data.retosCompletados || [];
        setRetosCompletados(completados);
        setTotalEstrellas(data.estrellas || 0);
      }
    } catch (error) {
      console.error('Error al cargar los retos completados:', error);
    }
  };

  const yaCompletado = (id) => retosCompletados.some((r) => r.id === id);

  const completarReto = async (reto) => {
    if (!userId) return Alert.alert('Error', 'Usuario no autenticado');
    if (yaCompletado(reto.id)) return Alert.alert('Ya completado', 'Ya has completado este reto');

    const fechaActual = new Date().toISOString();
    const nuevoReto = { id: reto.id, fecha: fechaActual };

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
        await updateDoc(userRef, {
          estrellas: increment(reto.estrellas),
          retosCompletados: arrayUnion(nuevoReto),
        });
        setTotalEstrellas((prev) => prev + reto.estrellas);
      }

      setRetosCompletados((prev) => [...prev, nuevoReto]);
      Alert.alert('¡Reto completado!', `Ganaste ⭐ ${reto.estrellas} estrellas`);

      // Notificación programada para motivación futura (por ejemplo, en 7 días)
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

  const renderRetos = (categoria, nombreCategoria) => (
    <View key={nombreCategoria} style={styles.categoria}>
      <Text style={styles.tituloCategoria}>{nombreCategoria.toUpperCase()}</Text>
      {categoria.map((reto) => {
        const completado = yaCompletado(reto.id);
        const fecha = retosCompletados.find((r) => r.id === reto.id)?.fecha;

        return (
          <TouchableOpacity
            key={reto.id}
            style={[styles.retoContainer, completado && styles.retoCompletado]}
            onPress={() => completarReto(reto)}
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
      {renderRetos(retos.semanales, 'Semanales')}
      {renderRetos(retos.mensuales, 'Mensuales')}
      {renderRetos(retos.anuales, 'Anuales')}
      <View style={{ marginTop: 20 }}>
        <Text style={styles.tituloCategoria}>RETOS CON AMIGOS (Próximamente)</Text>
        <Text style={{ fontSize: 14, color: '#666' }}>Podrás competir con tus amistades 💪</Text>
      </View>
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

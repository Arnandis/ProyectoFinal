import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function SolicitudesAmistadScreen() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cargandoSolicitudes, setCargandoSolicitudes] = useState(true);
  const userId = getAuth().currentUser?.uid;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          const idsSolicitantes = data.peticionesPendientes || [];

          const detalles = await Promise.all(
            idsSolicitantes.map(async (id) => {
              const docRef = doc(db, 'users', id);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                return { id, ...docSnap.data() };
              }
              return null;
            })
          );

          setSolicitudes(detalles.filter(Boolean));
        }
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
      } finally {
        setCargandoSolicitudes(false);
      }
    };

    fetchSolicitudes();
  }, []);

  const aceptarSolicitud = async (otroUsuarioId) => {
    const userSnap = await getDoc(doc(db, 'users', userId));
    const data = userSnap.data();

    if (!data.peticionesPendientes?.includes(otroUsuarioId)) {
      Alert.alert('No puedes aceptar esta solicitud');
      return;
    }

    try {
      setLoading(true);
      const otroUsuarioRef = doc(db, 'users', otroUsuarioId);

      await updateDoc(otroUsuarioRef, {
        peticionesPendientes: arrayRemove(userId),
        amigos: arrayUnion(userId),
      });

      setSolicitudes((prev) => prev.filter((u) => u.id !== otroUsuarioId));
      Alert.alert('Solicitud aceptada', 'Ahora son amigos');
    } catch (error) {
      console.error('Error al aceptar solicitud:', error);
      Alert.alert('Error', 'No se pudo aceptar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const rechazarSolicitud = async (otroUsuarioId) => {
    try {
      setLoading(true);
      const userRef = doc(db, 'users', userId);
      const otroUsuarioRef = doc(db, 'users', otroUsuarioId);

      await updateDoc(userRef, {
        peticionesPendientes: arrayRemove(otroUsuarioId),
      });

      await updateDoc(otroUsuarioRef, {
        peticionesPendientes: arrayRemove(userId),
      });

      setSolicitudes((prev) => prev.filter((u) => u.id !== otroUsuarioId));
      Alert.alert('Solicitud rechazada');
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
      Alert.alert('Error', 'No se pudo rechazar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  if (cargandoSolicitudes) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Cargando solicitudes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solicitudes de amistad</Text>
      {solicitudes.length === 0 ? (
        <Text style={styles.noRequests}>No tienes solicitudes pendientes.</Text>
      ) : (
        <FlatList
          data={solicitudes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.userInfo}>
                {item.photo ? (
                  <Image source={{ uri: item.photo }} style={styles.avatar} />
                ) : (
                  <View style={styles.placeholderAvatar}>
                    <Text style={styles.avatarInitial}>
                      {item.username?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                  </View>
                )}
                <View style={styles.userTextContainer}>
                  <Text style={styles.username}>{item.username || item.email}</Text>
                  <Text style={styles.email}>{item.email}</Text>
                </View>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.acceptButton]}
                  onPress={() => aceptarSolicitud(item.id)}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>Aceptar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.rejectButton]}
                  onPress={() => rechazarSolicitud(item.id)}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>Rechazar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.viewProfileButton]}
                  onPress={() => navigation.navigate('PerfilUsuario', { userId: item.id })}
                >
                  <Text style={styles.buttonText}>Ver perfil</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1F2937',
  },
  noRequests: {
    fontSize: 16,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  placeholderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarInitial: {
    fontSize: 18,
    color: '#374151',
    fontWeight: 'bold',
  },
  userTextContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  viewProfileButton: {
    backgroundColor: '#3B82F6',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#6B7280',
  },
});

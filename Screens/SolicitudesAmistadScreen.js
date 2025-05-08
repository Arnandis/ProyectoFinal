import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/solicitudesStyles';
import {
  fetchSolicitudes,
  aceptarSolicitudService,
  rechazarSolicitudService,
} from '../services/solicitudService';

export default function SolicitudesAmistadScreen() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cargandoSolicitudes, setCargandoSolicitudes] = useState(true);
  const userId = getAuth().currentUser?.uid;
  const navigation = useNavigation();

  useEffect(() => {
    const cargar = async () => {
      const data = await fetchSolicitudes(userId);
      setSolicitudes(data);
      setCargandoSolicitudes(false);
    };
    cargar();
  }, []);

  const aceptarSolicitud = async (otroUsuarioId) => {
    setLoading(true);
    const success = await aceptarSolicitudService(userId, otroUsuarioId);
    if (success) {
      setSolicitudes((prev) => prev.filter((u) => u.id !== otroUsuarioId));
      Alert.alert('Solicitud aceptada', 'Ahora son amigos');
    }
    setLoading(false);
  };

  const rechazarSolicitud = async (otroUsuarioId) => {
    setLoading(true);
    const success = await rechazarSolicitudService(userId, otroUsuarioId);
    if (success) {
      setSolicitudes((prev) => prev.filter((u) => u.id !== otroUsuarioId));
      Alert.alert('Solicitud rechazada');
    }
    setLoading(false);
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

import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
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

          // Obtener información de cada solicitante
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
    try {
      setLoading(true);
      const userRef = doc(db, 'users', userId);
      const otroUsuarioRef = doc(db, 'users', otroUsuarioId);

      await updateDoc(userRef, {
        peticionesPendientes: arrayRemove(otroUsuarioId),
        amigos: arrayUnion(otroUsuarioId),
      });

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
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text>Cargando solicitudes...</Text>
      </View>
    );
  }

  return (
    <View className="p-4">
      <Text className="text-xl font-bold mb-4">Solicitudes de amistad</Text>
      {solicitudes.length === 0 ? (
        <Text>No tienes solicitudes pendientes.</Text>
      ) : (
        <FlatList
          data={solicitudes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="bg-white p-4 rounded-xl shadow mb-4">
              <View className="flex-row items-center">
                {item.fotoPerfil ? (
                  <Image source={{ uri: item.fotoPerfil }} className="w-12 h-12 rounded-full mr-4" />
                ) : (
                  <View className="w-12 h-12 rounded-full bg-gray-300 mr-4 justify-center items-center">
                    <Text>{item.username?.charAt(0)?.toUpperCase()}</Text>
                  </View>
                )}
                <View className="flex-1">
                  <Text className="font-semibold">{item.username || item.email}</Text>
                  <Text className="text-gray-500">{item.email}</Text>
                </View>
              </View>

              <View className="flex-row mt-3 space-x-2">
                <Button title="Aceptar" onPress={() => aceptarSolicitud(item.id)} disabled={loading} />
                <Button title="Rechazar" onPress={() => rechazarSolicitud(item.id)} disabled={loading} />
                <Button
                  title="Ver perfil"
                  onPress={() => navigation.navigate('PerfilUsuario', { userId: item.id })}
                />
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

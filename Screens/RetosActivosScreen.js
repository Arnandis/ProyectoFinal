import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getRetosActivosPorUsuario, getUserById, eliminarReto } from '../services/retoService';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import styles from "../styles/retosActivosStyles";

const RetosActivosScreen = () => {
  const { currentUser } = getAuth();
  const [retos, setRetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    cargarRetos();
  }, []);

  const cargarRetos = async () => {
    setLoading(true);
    const retosUsuario = await getRetosActivosPorUsuario(currentUser.uid);

    const retosConInfo = await Promise.all(
      retosUsuario.map(async (reto) => {
        const amigoId = reto.creadorId === currentUser.uid ? reto.retadoId : reto.creadorId;
        const amigo = await getUserById(amigoId);
        return { ...reto, amigo };
      })
    );

    setRetos(retosConInfo);
    setLoading(false);
  };

  const handleEliminarReto = (retoId) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro que quieres eliminar este reto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const eliminado = await eliminarReto(retoId, currentUser.uid);
            if (eliminado) {
              setRetos(prevRetos => prevRetos.filter(r => r.id !== retoId));
            } else {
              Alert.alert("Error", "No se pudo eliminar el reto");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate('DetalleReto', { retoId: item.id })}
      >
        <Text style={styles.title}>{item.titulo}</Text>
        <Text style={styles.detail}>{item.detalle}</Text>
        <Text style={styles.dates}>Del {item.fechaInicio} al {item.fechaFin}</Text>
        <View style={styles.userContainer}>
          {item.amigo?.photo && (
            <Image source={{ uri: item.amigo.photo }} style={styles.avatar} />
          )}
          <Text style={styles.userName}>{item.amigo?.name}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleEliminarReto(item.id)}>
        <Text style={styles.deleteButtonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={retos}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

export default RetosActivosScreen;

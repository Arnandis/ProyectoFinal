import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getRetosActivosPorUsuario, getUserById, eliminarReto } from '../services/retoService';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

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

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  dates: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  userName: {
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#e53935',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RetosActivosScreen;

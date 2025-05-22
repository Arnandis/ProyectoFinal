import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import styles from '../styles/addFriendStyles';
import { buscarUsuariosPorEmail, enviarSolicitudAmistad } from '../services/friendsService';

export default function AñadirAmigosScreen() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    const fetchResultados = async () => {
      try {
        const results = await buscarUsuariosPorEmail(input);
        setResultados(results);
      } catch (error) {
        console.error('Error en búsqueda:', error);
      }
    };

    fetchResultados();
  }, [input]);

  const handleEnviar = async () => {
    if (!input) return;

    setLoading(true);
    try {
      const msg = await enviarSolicitudAmistad(input);
      Alert.alert('Solicitud enviada', msg);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setInput(item.email)} style={styles.resultItem}>
      <Text style={styles.resultText}>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Añadir un amigo</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscar por email..."
        value={input}
        onChangeText={setInput}
      />
      <FlatList
        data={resultados}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={styles.list}
      />
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleEnviar}>
          <Text style={styles.buttonText}>Enviar solicitud</Text>
        </TouchableOpacity>
      )}

    </View>
  );
}

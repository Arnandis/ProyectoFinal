import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator } from 'react-native';
import styles from '../styles/addFriendStyles';
import { enviarSolicitudAmistad } from '../services/friendsService';

export default function AñadirAmigosScreen() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Añadir un amigo</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario o correo"
        value={input}
        onChangeText={setInput}
      />
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <Button title="Enviar solicitud" onPress={() => enviarSolicitudAmistad(input, setLoading)} />
      )}
    </View>
  );
}

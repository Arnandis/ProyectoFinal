import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { saveHabiticaCredentials } from '../services/habiticaService';

export default function HabiticaConnectScreen() {
  const [userIdHabitica, setUserIdHabitica] = useState('');
  const [apiToken, setApiToken] = useState('');
  const firebaseUserId = getAuth().currentUser?.uid;

  const handleSave = async () => {
    if (!userIdHabitica || !apiToken) {
      Alert.alert('Faltan datos', 'Completa ambos campos');
      return;
    }

    try {
      await saveHabiticaCredentials(firebaseUserId, {
        userIdHabitica,
        apiToken,
      });

      Alert.alert('¡Conectado!', 'Tu cuenta de Habitica está vinculada');
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al guardar los datos');
      console.error(error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>
        Conectar con Habitica
      </Text>
      <TextInput
        placeholder="User ID de Habitica"
        value={userIdHabitica}
        onChangeText={setUserIdHabitica}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="API Token de Habitica"
        value={apiToken}
        onChangeText={setApiToken}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title="Guardar y Conectar" onPress={handleSave} />
    </View>
  );
}

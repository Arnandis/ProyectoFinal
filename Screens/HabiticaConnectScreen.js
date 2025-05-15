import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, useColorScheme,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import { saveHabiticaCredentials } from '../services/habiticaService';

export default function HabiticaConnectScreen() {
  const [userIdHabitica, setUserIdHabitica] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [loading, setLoading] = useState(false);
  const firebaseUserId = getAuth().currentUser?.uid;
  const isDark = useColorScheme() === 'dark';

  const handleSave = async () => {
    if (!userIdHabitica || !apiToken) {
      Alert.alert('Faltan datos', 'Completa ambos campos');
      return;
    }

    setLoading(true);
    try {
      await saveHabiticaCredentials(firebaseUserId, { userIdHabitica, apiToken });
      Alert.alert('¡Conectado!', 'Tu cuenta de Habitica está vinculada');
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al guardar los datos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#1c1c1e' : '#f2f2f7', justifyContent: 'center', padding: 20 }}>
      <View style={{
        backgroundColor: isDark ? '#2c2c2e' : 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
      }}>
        <Image
          source={require('../assets/habitica_logo.webp')}
          style={{ width: 110, height: 60, alignSelf: 'center', marginBottom: 20 }}
        />
        <Text style={{ fontWeight: 'bold', fontSize: 22, textAlign: 'center', marginBottom: 20 }}>
          Conecta tu cuenta Habitica
        </Text>

        <TextInput
          placeholder="User ID de Habitica"
          value={userIdHabitica}
          onChangeText={setUserIdHabitica}
          placeholderTextColor={isDark ? '#aaa' : '#666'}
          style={{
            backgroundColor: isDark ? '#3a3a3c' : '#f0f0f0',
            borderRadius: 10,
            padding: 12,
            marginBottom: 15,
            color: isDark ? '#fff' : '#000',
          }}
        />
        <TextInput
          placeholder="API Token de Habitica"
          value={apiToken}
          onChangeText={setApiToken}
          secureTextEntry
          placeholderTextColor={isDark ? '#aaa' : '#666'}
          style={{
            backgroundColor: isDark ? '#3a3a3c' : '#f0f0f0',
            borderRadius: 10,
            padding: 12,
            marginBottom: 20,
            color: isDark ? '#fff' : '#000',
          }}
        />
        <TouchableOpacity
          onPress={handleSave}
          style={{
            backgroundColor: '#6f42c1',
            padding: 14,
            borderRadius: 10,
            alignItems: 'center',
          }}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Guardar y Conectar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

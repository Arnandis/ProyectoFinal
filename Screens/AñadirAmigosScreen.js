import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, query, where, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function AñadirAmigosScreen() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const userId = getAuth().currentUser?.uid;

  const enviarSolicitud = async () => {
    if (!input) {
      Alert.alert('Error', 'Por favor, ingresa un nombre de usuario o correo electrónico');
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        setLoading(false);
        return;
      }

      const data = userSnap.data();

      // Verificación de amigos y solicitudes previas
      if (data.amigos?.includes(input) || data.peticionesPendientes?.includes(input)) {
        Alert.alert('Ya enviaste una solicitud o son amigos');
        setLoading(false);
        return;
      }

      if (input.includes('@')) {
        const q = query(collection(db, 'users'), where('email', '==', input));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const otroUsuarioId = userDoc.id;
          const otroUsuarioRef = doc(db, 'users', otroUsuarioId);

          // ✅ Solo añadir solicitud al receptor
          await updateDoc(otroUsuarioRef, {
            peticionesPendientes: arrayUnion(userId),
          });

          Alert.alert('Solicitud enviada', `Has enviado una solicitud a ${input}`);
        } else {
          Alert.alert('Usuario no encontrado', 'No se encontró un usuario con ese correo');
        }
      } else {
        const otroUsuarioRef = doc(db, 'users', input);
        const otroUsuarioSnap = await getDoc(otroUsuarioRef);

        if (!otroUsuarioSnap.exists()) {
          Alert.alert('Usuario no encontrado', 'No se encontró un usuario con ese nombre');
          setLoading(false);
          return;
        }

        await updateDoc(otroUsuarioRef, {
          peticionesPendientes: arrayUnion(userId),
        });

        Alert.alert('Solicitud enviada', `Has enviado una solicitud a ${input}`);
      }
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      Alert.alert('Error', 'No se pudo enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

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
        <Button title="Enviar solicitud" onPress={enviarSolicitud} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f9f9f9',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 20,
    fontSize: 16,
  },
});

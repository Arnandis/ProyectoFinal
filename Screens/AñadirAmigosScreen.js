import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion, query, where, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

export default function AñadirAmigosScreen() {
  const [input, setInput] = useState(''); // Campo de entrada para nombre o correo
  const [loading, setLoading] = useState(false);
  const userId = getAuth().currentUser?.uid;

  // Función para enviar la solicitud de amistad
  const enviarSolicitud = async () => {
    if (!input) {
      Alert.alert('Error', 'Por favor, ingresa un nombre de usuario o correo electrónico');
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();

        // Verificar si el usuario ya es amigo
        if (data.amigos && data.amigos.includes(input)) {
          Alert.alert('¡Ya son amigos!', 'No puedes enviar una solicitud a un amigo.');
          setLoading(false);
          return;
        }

        // Verificar si ya existe la solicitud pendiente
        if (data.peticionesPendientes && data.peticionesPendientes.includes(input)) {
          Alert.alert('¡Ya enviaste una solicitud!', 'La solicitud ya está pendiente.');
          setLoading(false);
          return;
        }

        // Verificar si el input es un correo electrónico
        if (input.includes('@')) {
          // Buscar por correo electrónico
          const q = query(collection(db, 'users'), where('email', '==', input)); 
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((userDoc) => {
                const otroUsuarioId = userDoc.id;
                const otroUsuarioRef = doc(db, 'users', otroUsuarioId);
              
                // Enviar la solicitud de amistad
                updateDoc(userRef, {
                  peticionesPendientes: arrayUnion(otroUsuarioId),
                });
                updateDoc(otroUsuarioRef, {
                  peticionesPendientes: arrayUnion(userId),
                });
              });
              

            Alert.alert('Solicitud enviada', `Has enviado una solicitud a ${input}.`);
          } else {
            Alert.alert('Usuario no encontrado', 'No se ha encontrado un usuario con ese correo electrónico.');
          }
        } else {
          // Si es un nombre de usuario
          const otroUsuarioRef = doc(db, 'users', input);
          const otroUsuarioSnap = await getDoc(otroUsuarioRef);

          if (!otroUsuarioSnap.exists()) {
            Alert.alert('Usuario no encontrado', 'No se ha encontrado un usuario con ese nombre.');
            setLoading(false);
            return;
          }

          // Enviar la solicitud de amistad
          await updateDoc(userRef, {
            peticionesPendientes: arrayUnion(input),
          });
          await updateDoc(otroUsuarioRef, {
            peticionesPendientes: arrayUnion(userId),
          });

          Alert.alert('Solicitud enviada', `Has enviado una solicitud a ${input}.`);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      Alert.alert('Error', 'Hubo un problema al enviar la solicitud.');
      setLoading(false);
    }
  };

  return (
    <View>
      <Text>Añadir un amigo</Text>
      <TextInput
        placeholder="Ingresa el nombre de usuario o correo electrónico"
        value={input}
        onChangeText={setInput}
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button title={loading ? 'Enviando...' : 'Enviar solicitud'} onPress={enviarSolicitud} disabled={loading} />
    </View>
  );
}

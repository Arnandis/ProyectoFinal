import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const ProfileScreen = () => {
  const db = getFirestore();
  const auth = getAuth();
  const userId = auth.currentUser?.uid; // Obtiene el ID del usuario autenticado

  const [user, setUser] = useState({
    name: '',
    email: '',
    bio: '',
    photo: null,
    theme: 'light', // 'light' o 'dark'
    notifications: true, // Activar/desactivar notificaciones
  });

  // 📌 Cargar datos desde Firestore
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser(docSnap.data());
        }
      } catch (error) {
        console.error('Error al obtener perfil:', error);
      }
    };

    fetchProfile();
  }, [userId]);

  // 📌 Guardar cambios en Firestore
  const saveProfile = async () => {
    if (!userId) {
      console.log('Usuario no autenticado');
      return;
    }

    try {
      await setDoc(doc(db, 'users', userId), user);
      console.log('Perfil guardado correctamente');
    } catch (error) {
      console.error('Error al guardar perfil:', error);
    }
  };

  // 📌 Manejar cambios en los campos
  const handleChange = (key, value) => {
    setUser((prev) => ({ ...prev, [key]: value }));
  };

  // 📌 Seleccionar imagen
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      handleChange('photo', result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>

      {user.photo && <Image source={{ uri: user.photo }} style={styles.profileImage} />}
      <Button title="Cambiar foto" onPress={pickImage} />

      <TextInput style={styles.input} placeholder="Nombre" value={user.name} onChangeText={(text) => handleChange('name', text)} />
      <TextInput style={styles.input} placeholder="Email" value={user.email} onChangeText={(text) => handleChange('email', text)} />
      <TextInput style={styles.input} placeholder="Biografía" value={user.bio} onChangeText={(text) => handleChange('bio', text)} multiline />

      {/* Switch para cambiar tema */}
      <View style={styles.switchContainer}>
        <Text>Tema oscuro</Text>
        <Switch value={user.theme === 'dark'} onValueChange={(value) => handleChange('theme', value ? 'dark' : 'light')} />
      </View>

      {/* Switch para activar/desactivar notificaciones */}
      <View style={styles.switchContainer}>
        <Text>Notificaciones</Text>
        <Switch value={user.notifications} onValueChange={(value) => handleChange('notifications', value)} />
      </View>

      <Button title="Guardar cambios" onPress={saveProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});

export default ProfileScreen;

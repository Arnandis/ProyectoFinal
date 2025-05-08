import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const ProfileScreen = () => {
  const db = getFirestore();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const [user, setUser] = useState({
    name: '',
    email: '',
    bio: '',
    photo: null,
    estrellas: 0,
    graficosFechas: [], // array de fechas tipo '2025-05-06'
  });

  const [rachaDias, setRachaDias] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUser(data);
          calcularRacha(data.graficosFechas || []);
        }
      } catch (error) {
        console.error('Error al obtener perfil:', error);
      }
    };

    fetchProfile();
  }, [userId]);

  const calcularRacha = (fechas) => {
    if (!fechas.length) return setRachaDias(0);

    const fechasOrdenadas = [...fechas].sort().reverse();
    let racha = 1;
    let fechaAnterior = new Date(fechasOrdenadas[0]);

    for (let i = 1; i < fechasOrdenadas.length; i++) {
      const fechaActual = new Date(fechasOrdenadas[i]);
      const diferencia = (fechaAnterior - fechaActual) / (1000 * 60 * 60 * 24);

      if (diferencia <= 1) {
        racha++;
        fechaAnterior = fechaActual;
      } else {
        break;
      }
    }

    setRachaDias(racha);
  };

  const saveProfile = async () => {
    try {
      await setDoc(doc(db, 'users', userId), user, { merge: true });
      Alert.alert('Perfil guardado');
    } catch (error) {
      console.error('Error al guardar perfil:', error);
    }
  };

  const handleChange = (key, value) => {
    setUser((prev) => ({ ...prev, [key]: value }));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      handleChange('photo', result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mi perfil</Text>

      <TouchableOpacity onPress={pickImage}>
        {user.photo ? (
          <Image source={{ uri: user.photo }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarPlaceholderText}>+</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={user.name}
        onChangeText={(text) => handleChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={user.email}
        onChangeText={(text) => handleChange('email', text)}
        editable={false}
      />
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Biografía"
        value={user.bio}
        onChangeText={(text) => handleChange('bio', text)}
        multiline
      />

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user.estrellas || 0}</Text>
          <Text style={styles.statLabel}>⭐ Estrellas</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{rachaDias}</Text>
          <Text style={styles.statLabel}>🔥 Racha</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveButtonText}>Guardar cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 20,
  },
  avatarPlaceholder: {
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    fontSize: 40,
    color: '#999',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  textarea: {
    height: 80,
    textAlignVertical: 'top',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 30,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#444',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },
  saveButton: {
    backgroundColor: '#0a84ff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;

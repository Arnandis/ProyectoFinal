import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getOrUpdateHabiticaProfile } from '../services/habiticaService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  });

  const [habiticaProfile, setHabiticaProfile] = useState(null);
  const [loadingHabitica, setLoadingHabitica] = useState(true);
  const [habiticaAvatarUrl, setHabiticaAvatarUrl] = useState(null);

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

    const fetchHabitica = async () => {
      try {
        const profile = await getOrUpdateHabiticaProfile();
        setHabiticaProfile(profile);
      } catch (err) {
        console.log('No se pudo obtener perfil de Habitica (puede que no esté vinculado):', err.message);
      } finally {
        setLoadingHabitica(false);
      }
    };

    fetchProfile();
    fetchHabitica();
  }, [userId]);

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
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const base64 = result.assets[0].base64;
      const uriBase64 = `data:image/jpeg;base64,${base64}`;
      handleChange('photo', uriBase64);
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
          <Text style={styles.statLabel}>
            <MaterialCommunityIcons name="star" size={16} color="gold" /> Estrellas
          </Text>
        </View>
      </View>

      {/* 🔵 Perfil de Habitica */}
      {loadingHabitica ? (
        <ActivityIndicator size="large" color="#0a84ff" />
      ) : habiticaProfile ? (
        <View style={styles.habiticaBox}>
  <Text style={styles.habiticaTitle}>
    <MaterialCommunityIcons name="wizard-hat" size={20} /> Perfil de Habitica
  </Text>
  <Text>
    <MaterialCommunityIcons name="account" size={16} /> Usuario: {habiticaProfile.profile.name || 'Desconocido'}
  </Text>
  <Text>
    <MaterialCommunityIcons name="star" size={16} /> Nivel: {habiticaProfile.stats?.lvl}
  </Text>
  <Text>
    <MaterialCommunityIcons name="heart" size={16} color="red" /> HP: {habiticaProfile.stats?.hp}
  </Text>
  <Text>
    <MaterialCommunityIcons name="flash" size={16} color="blue" /> MP: {habiticaProfile.stats?.mp}
  </Text>
  <Text>
    <MaterialCommunityIcons name="cash" size={16} color="gold" /> Oro: {Number(habiticaProfile.stats?.gp).toFixed(2)}
  </Text>
  <Text>
    <MaterialCommunityIcons name="sword-cross" size={16} /> Clase: {habiticaProfile.stats?.class}
  </Text>
</View>
      ) : (
        <Text style={{ marginTop: 16, color: '#666' }}>
          No has conectado tu cuenta de Habitica.
        </Text>
      )}

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
  habiticaBox: {
    width: '100%',
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  habiticaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
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

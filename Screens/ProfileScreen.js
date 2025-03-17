// screens/ProfileScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [name, setName] = useState('Pau Arnandis'); // Nombre editable
  const [bio, setBio] = useState('¡Hola! Soy un usuario de ejemplo.'); // Biografía editable
  const [image, setImage] = useState('https://via.placeholder.com/150'); // Foto de perfil

  const handleChangeName = (newName) => setName(newName);
  const handleChangeBio = (newBio) => setBio(newBio);

  // Función para cambiar la foto de perfil (simulada por un URL)
  const handleChangeProfileImage = () => {
    // Aquí podrías abrir una interfaz para seleccionar la imagen desde la galería o cámara
    setImage('https://via.placeholder.com/150'); // Cambia la URL de la imagen por la seleccionada
  };

  return (
    <View style={styles.container}>
      {/* Foto de Perfil */}
      <TouchableOpacity onPress={handleChangeProfileImage}>
        <Image source={{ uri: image }} style={styles.profileImage} />
      </TouchableOpacity>

      {/* Nombre Editable */}
      <TextInput
        style={styles.nameInput}
        value={name}
        onChangeText={handleChangeName}
        placeholder="Escribe tu nombre"
        placeholderTextColor="#888"
      />

      {/* Biografía Editable */}
      <TextInput
        style={styles.bioInput}
        value={bio}
        onChangeText={handleChangeBio}
        placeholder="Escribe una biografía"
        placeholderTextColor="#888"
        multiline
      />

      {/* Botón de Guardar */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  nameInput: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
    fontSize: 18,
  },
  bioInput: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#ddd',
    fontSize: 16,
    textAlignVertical: 'top',
    height: 100,
  },
  saveButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ProfileScreen;

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const [user, setUser] = useState({
    name: 'Juan Pérez',
    email: 'juan@example.com',
    bio: '¡Hola! Soy un apasionado de React Native.',
    photo: null, // Aquí guardaremos la URL de la foto
  });

  const handleChange = (key, value) => {
    setUser({ ...user, [key]: value });
  };

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

  const saveProfile = () => {
    // Aquí puedes guardar los cambios en una base de datos o AsyncStorage
    console.log('Perfil guardado:', user);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>

      {user.photo && (
        <Image source={{ uri: user.photo }} style={styles.profileImage} />
      )}

      <Button title="Cambiar foto" onPress={pickImage} />

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={user.name}
        onChangeText={(text) => handleChange('name', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={user.email}
        onChangeText={(text) => handleChange('email', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Biografía"
        value={user.bio}
        onChangeText={(text) => handleChange('bio', text)}
        multiline
      />

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
});

export default ProfileScreen;
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Encabezado = () => {
  return (
    <View style={styles.container}>
      {/* Título del encabezado */}
      <Text style={styles.title}>MyBalance</Text>

      {/* Icono de perfil en la esquina superior derecha */}
      <TouchableOpacity style={styles.profileIconContainer}>
        <Image
          source={require('/home/pau/Escritorio/ProyectoFinal/my-proyect/assets/Perfil.jpeg')} // Cambia esto por la ruta de tu imagen o usa un ícono
          style={styles.profileIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    backgroundColor: '#181818',  // Color de fondo del encabezado
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    position: 'relative',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  profileIconContainer: {
    position: 'absolute',
    right: 20,  // Alinea el ícono a la derecha
    top: 20,    // Alinea el ícono un poco hacia abajo
  },
  profileIcon: {
    width: 30,    // Tamaño del ícono
    height: 30,   // Tamaño del ícono
  },
});

export default Encabezado;

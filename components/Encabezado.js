import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 

const Encabezado = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <MaterialCommunityIcons name="menu" size={28} color="white" />
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
        <MaterialCommunityIcons name="account" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Encabezado;

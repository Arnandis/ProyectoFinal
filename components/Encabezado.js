import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Menu } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Encabezado = ({ title }) => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <View style={styles.header}>
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <TouchableOpacity onPress={openMenu}>
            <MaterialCommunityIcons name="menu" size={28} color="white" />
          </TouchableOpacity>
        }
        contentStyle={{ backgroundColor: 'white' }}
      >
        <Menu.Item
          onPress={() => {
            closeMenu();
            navigation.navigate('HistorialGrafico');
          }}
          title="Ver Historial"
          leadingIcon="history"
        />
        <Menu.Item
          onPress={() => {
            closeMenu();
            navigation.navigate('Perfil');
          }}
          title="Perfil"
          leadingIcon="account"
        />
      </Menu>

      <Text style={styles.title}>{title}</Text>

      {/* Placeholder para mantener el título centrado */}
      <View style={{ width: 28 }} />
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

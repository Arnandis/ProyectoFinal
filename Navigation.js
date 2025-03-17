// src/Navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack';

// Pantallas
import LoginScreen from './Screens/LoginScreen'; // Asegúrate de tener el path correcto
import FormularioRegistro from './Screens/FormularioRegistro'; // Asegúrate de tener el path correcto

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="FormularioRegistro" component={FormularioRegistro} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Screens/Login'; 
import BottomNavigator from './componentes/BottomNavigator';
import Registro from './Screens/Registro'; 

//Finanzas, Tiempo,Logros y Objetivos,Login,Registrar,Ranking y comparacion.
//Consejos y Articulos, Notificaciones y recordatorios.
//Gráfico combinado: En lugar de mostrar dos gráficos separados, también podrías combinarlos en un solo gráfico, pero con colores diferentes para cada conjunto de datos.
//Mirar de añadir un cronometro tipo the forest que calcule el temps que estas enfocat y temps de descans
// Crea el Stack Navigator
const Stack = createStackNavigator();

// Configuración de deep linking
const linking = {
  prefixes: ['http://localhost:8081'], // El prefijo de la URL
  config: {
    screens: {
      Login: 'Login', // URL: http://localhost:8081/Login
      Finanzas: 'Finanzas', // URL: http://localhost:8081/Finanzas
      Tiempo: 'Tiempo', // URL: http://localhost:8081/Tiempo
      
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      {/* Definimos el Stack Navigator para que Login sea accesible */}
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registro" component={Registro} />
        {/* Aquí se agregan las pantallas de Finanzas y Tiempo */}
        <Stack.Screen name="Finanzas" component={BottomNavigator} />
        <Stack.Screen name="Tiempo" component={BottomNavigator} />
        <Stack.Screen name="Logros" component={BottomNavigator} />
        <Stack.Screen name="Ranking" component={BottomNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

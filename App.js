import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/auth/Login'; 
import BottomNavigator from './components/BottomNavigator';
import Registro from './screens/auth/Register'; 
import ProfileScreen from './screens/ProfileScreen';
import { Provider as PaperProvider } from 'react-native-paper';
import HistorialGraficos from './screens/graficos/HistorialGraficos';
import DetalleGrafico from './screens/graficos/DetalleGrafico';
import DetalleGraficoTiempo from './screens/graficos/DetalleGraficoTiempo';

// 👇 IMPORTA LA FUNCIÓN DE NOTIFICACIONES
import { pedirPermisosNotificaciones } from './utils/notifications';
import RetosScreen from './screens/RetosScreen';
import AñadirAmigosScreen from './screens/AñadirAmigosScreen';
import SolicitudesAmistadScreen from './screens/SolicitudesAmistadScreen';

const Stack = createStackNavigator();

const linking = {
  prefixes: ['http://localhost:8081'],
  config: {
    screens: {
      Login: 'Login',
      Finanzas: 'Finanzas',
      Tiempo: 'Tiempo',
    },
  },
};

export default function App() {
  // Solicitar permisos al iniciar la app
  useEffect(() => {
    pedirPermisosNotificaciones();
  }, []);

  return (
    <PaperProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Registro" component={Registro} />
          <Stack.Screen name="Finanzas" component={BottomNavigator} />
          <Stack.Screen name="Tiempo" component={BottomNavigator} />
          <Stack.Screen name="Logros" component={BottomNavigator} />
          <Stack.Screen name="Ranking" component={BottomNavigator} />
          <Stack.Screen name="Perfil" component={ProfileScreen} />
          <Stack.Screen name="HistorialGrafico" component={HistorialGraficos} />
          <Stack.Screen name="DetalleGraficoFinanzas" component={DetalleGrafico} />
          <Stack.Screen name="DetalleGraficoTiempo" component={DetalleGraficoTiempo} />
          <Stack.Screen name="Retos" component={RetosScreen} />
          <Stack.Screen name="AñadirAmigos" component={AñadirAmigosScreen} />
          <Stack.Screen name="Solicitudes" component={SolicitudesAmistadScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

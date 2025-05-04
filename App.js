import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/auth/Login'; 
import BottomNavigator from './components/BottomNavigator';
import Registro from './screens/auth/Register'; 
import Encabezado from './components/Encabezado';
import ProfileScreen from './screens/ProfileScreen';
import { Provider as PaperProvider } from 'react-native-paper';
import HistorialGraficos from './screens/graficos/HistorialGraficos';
import DetalleGrafico from './screens/graficos/DetalleGrafico';
import DetalleGraficoTiempo from './screens/graficos/DetalleGraficoTiempo';

//Finanzas, Tiempo,Logros y Objetivos,Login,Registrar,Ranking y comparacion,Perfil,.
//Consejos y Articulos, Notificaciones y recordatorios.
//Gráfico combinado: En lugar de mostrar dos gráficos separados, también podrías combinarlos en un solo gráfico, pero con colores diferentes para cada conjunto de datos.
//Mirar de añadir un cronometro tipo the forest que calcule el temps que estas enfocat y temps de descans
//afegir un menu lateral.
//idea futuro, que en el perfil apareguen grafics depenguent de si utilitza la app... i que se puga compartir el perfil a amics per a añadir com amigos...
//en el perfil que puga apareixer els logros personals y de la app que has cumplit.


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
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

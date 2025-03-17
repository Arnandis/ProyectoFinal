// components/BottomNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Para los iconos
import Finanzas from '../Screens/Finanzas'; 
import Tiempo from '../Screens/Tiempo'; 
import GoalScreen from '../Screens/GoalScreen';
import RankingScreen from '../Screens/RankingScreen';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Finanzas" // Pantalla inicial
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Finanzas') {
            iconName = 'cash'; // Icono para Finanzas
          } else if (route.name === 'Tiempo') {
            iconName = 'clock-time-four'; // Icono para Tiempo
          } else if (route.name === 'Logros') {
            iconName = 'trophy'; // Icono para Logros
          }else if (route.name === 'Ranking') {
            iconName = 'medal';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato', // Color cuando la pestaña está activa
        inactiveTintColor: 'gray', // Color cuando la pestaña está inactiva
        style: { backgroundColor: '#fff' }, // Color de fondo de la barra
      }}
    >
      <Tab.Screen name="Finanzas" component={Finanzas} />
      <Tab.Screen name="Tiempo" component={Tiempo} />
      <Tab.Screen name="Logros" component={GoalScreen} />
      <Tab.Screen name="Ranking" component={RankingScreen} /> 
    </Tab.Navigator>
  );
};

export default BottomNavigator;

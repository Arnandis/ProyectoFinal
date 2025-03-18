// components/BottomNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Finanzas from '../Screens/Finanzas'; 
import Tiempo from '../Screens/Tiempo'; 
import GoalScreen from '../Screens/GoalScreen';
import RankingScreen from '../Screens/RankingScreen';
import Encabezado from './Encabezado'; // Importa el Encabezado

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Finanzas"
      screenOptions={({ route }) => ({
        header: () => <Encabezado title={route.name} />, // Muestra el Encabezado con el nombre de la pantalla arreglar pq aso es el bottomNavigator
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Finanzas') {
            iconName = 'cash';
          } else if (route.name === 'Tiempo') {
            iconName = 'clock-time-four';
          } else if (route.name === 'Logros') {
            iconName = 'trophy';
          } else if (route.name === 'Ranking') {
            iconName = 'medal';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
        style: { backgroundColor: '#fff' },
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

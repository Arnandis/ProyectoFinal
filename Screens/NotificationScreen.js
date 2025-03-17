// screens/NotificationScreen.js
//falta implementar en la app o fer desde 0
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Switch } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

const NotificationScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false); // Controla el estado del interruptor
  const [frequency, setFrequency] = useState(1); // 1 = cada hora, 2 = diario, etc.

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        console.log('Permiso para notificaciones denegado');
      }
    };

    requestPermission();
  }, []);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const scheduleNotification = async () => {
    if (isEnabled) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "¡Recuerda tus metas!",
          body: "Hoy es un buen día para alcanzar tus objetivos.",
        },
        trigger: {
          seconds: frequency === 1 ? 3600 : 86400, // 1 hora o 1 día
          repeats: true,
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración de Notificaciones</Text>
      <Text>¿Activar recordatorios diarios?</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      {isEnabled && (
        <View style={styles.frequencyContainer}>
          <Text>Frecuencia de notificaciones:</Text>
          <Button title="Cada Hora" onPress={() => setFrequency(1)} />
          <Button title="Diariamente" onPress={() => setFrequency(2)} />
        </View>
      )}
      <Button title="Programar Notificación" onPress={scheduleNotification} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  frequencyContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
});

export default NotificationScreen;

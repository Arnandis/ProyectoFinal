// utils/notifications.js
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const registerForPushNotificationsAsync = async () => {
  // Pedir permiso para recibir notificaciones (ahora solo con expo-notifications)
  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== 'granted') {
    alert('¡Necesitas permitir las notificaciones para poder recibirlas!');
    return;
  }

  // Generar el token de dispositivo
  const token = await Notifications.getExpoPushTokenAsync();
  console.log('Token generado para este dispositivo:', token);

  return token;
};

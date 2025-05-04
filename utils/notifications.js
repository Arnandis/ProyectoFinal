import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configurar cómo se muestran las notificaciones cuando la app está abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Solicitar permisos al iniciar la app
export async function pedirPermisosNotificaciones() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('No se concedieron permisos para notificaciones.');
      return false;
    }

    return true;
  } else {
    alert('Debes usar un dispositivo físico para recibir notificaciones.');
    return false;
  }
}

// Enviar notificación inmediata
export async function enviarNotificacionInmediata(titulo, cuerpo) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: cuerpo,
      sound: true,
    },
    trigger: null, // Disparo inmediato
  });
}

// Enviar notificación programada (por fecha y hora exacta)
export async function enviarNotificacionProgramada(titulo, cuerpo, fechaDisparo) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titulo,
      body: cuerpo,
      sound: true,
    },
    trigger: fechaDisparo, // { date: new Date(fechaDisparo) }
  });
}

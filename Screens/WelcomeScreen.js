import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface, Icon } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { uid } = route.params || {};

  const handleContinue = () => {
    navigation.replace('Finanzas', { uid });
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.card} elevation={4}>
        <Text variant="headlineMedium" style={styles.title}>
          Bienvenido a MyBalance
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Descubre todo lo que puedes hacer:
        </Text>

        <View style={styles.feature}>
          <Icon source="chart-line" size={20} color="#4caf50" />
          <Text style={styles.featureText}>Visualiza tus finanzas y tu tiempo</Text>
        </View>

        <View style={styles.feature}>
          <Icon source="target" size={20} color="#4caf50" />
          <Text style={styles.featureText}>Crea y alcanza tus metas personales</Text>
        </View>

        <View style={styles.feature}>
          <Icon source="trophy-outline" size={20} color="#4caf50" />
          <Text style={styles.featureText}>Compite en rankings con otros usuarios</Text>
        </View>

        <View style={styles.feature}>
          <Icon source="link-variant" size={20} color="#4caf50" />
          <Text style={styles.featureText}>Conéctate con Habitica para más motivación</Text>
        </View>

        <Button
          mode="contained"
          onPress={handleContinue}
          style={styles.button}
          buttonColor="#4caf50"
        >
          Empezar
        </Button>
      </Surface>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#1c1c1c',
    padding: 24,
    borderRadius: 20,
  },
  title: {
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#aaaaaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    color: '#dddddd',
    marginLeft: 12,
    fontSize: 16,
  },
  button: {
    marginTop: 30,
    borderRadius: 12,
  },
});

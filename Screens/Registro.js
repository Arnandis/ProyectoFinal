import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import * as Svg from 'react-native-svg';
import { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { auth } from '../firebase/firebaseConfig'; // Asegúrate de importar la configuración de Firebase
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Importar el método de registro

const { width, height } = Dimensions.get('window');

export default function FormularioRegistro({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); // Para manejar errores

  function SvgTop() {
    return (
      <Svg.Svg
        width={width}
        height={height / 2}
        viewBox={`0 0 ${width} ${height / 2}`}
        style={styles.svgContainer}
      >
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#6DD5FA" stopOpacity="1" />
            <Stop offset="100%" stopColor="#2980B9" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Path
          d={`M0,0 C${width / 2},${height / 4} ${width / 2},0 ${width},0 V${height / 2} H0 Z`}
          fill="url(#grad1)" 
        />
      </Svg.Svg>
    );
  }

  // Función para registrar el usuario en Firebase
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Navegar a la pantalla de login o finanzas después del registro
      navigation.navigate('Login');
    } catch (error) {
      setError(error.message); // Mostrar mensaje de error si ocurre algún problema
    }
  };

  return (
    <View style={styles.container}>
      <SvgTop />
      <Text style={styles.titulo}>Crear una cuenta</Text>
      <Text style={styles.subTitle}>Registra tu cuenta</Text>

      <TextInput
        placeholder="tuemail@gmail.com"
        style={styles.textInput}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="contraseña"
        style={styles.textInput}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="confirmar contraseña"
        style={styles.textInput}
        secureTextEntry={true}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Mostrar error si ocurre */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity onPress={handleRegister} style={styles.button}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>

      <Text style={styles.subTitle}>¿Ya tienes una cuenta?</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.registerButton}>
        <Text style={styles.registerButtonText}>Iniciar Sesion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  },
  titulo: {
    fontSize: 80,  
    color: '#34434D',
    fontWeight: 'bold',
    zIndex: 1,
    marginTop: height / 18,
    marginBottom: 30,
  },
  subTitle: {
    fontSize: 20,
    color: 'gray',
    zIndex: 1, 
    marginTop: 10,
  },
  textInput: {
    paddingStart: 20,
    padding: 10,
    width: '80%',
    height: 50,
    marginTop: 20,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#2980B9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2980B9',
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#2980B9',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: 14,
  },
});

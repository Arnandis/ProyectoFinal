import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import * as Svg from 'react-native-svg';
import { Path, Defs, LinearGradient, Stop } from 'react-native-svg'; 
import { auth } from '../firebase/firebaseConfig'; // Importa el objeto auth
import { signInWithEmailAndPassword } from 'firebase/auth'; // Importa el método de autenticación de Firebase

//En el Svg dona error de text, tinc q clavar una imatge de fondo que quede be
const { width, height } = Dimensions.get('window');

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Maneja el evento de Sign In
  const handleSignIn = () => {
    // Validación básica de campos vacíos
    if (!email || !password) {
      setError("Por favor ingresa tu email y contraseña");
      return;
    }

    // Lógica de inicio de sesión con Firebase
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Si la autenticación es exitosa, redirige a la pantalla de Finanzas
        navigation.navigate('Finanzas');
      })
      .catch((error) => {
        // Si hay un error, muestra un mensaje de error
        setError(error.message);
      });
  };

  //repasar y posar una imatge ja descarga pq no apareix el Svg en el movil
  function SvgTop() {
    return (
      <Svg.Svg
        width={width}
        height={height / 2} // Esto hace que el SVG ocupe la mitad superior de la pantalla
        viewBox={`0 0 ${width} ${height / 2}`}
        style={[styles.svgContainer, { zIndex: -1 }]} // Asegura que el SVG quede completamente en el fondo
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
  

  return (
    <View style={styles.container}>
      <SvgTop />
      <Text style={styles.titulo}>¡Hola!</Text>
      <Text style={styles.subTitle}>Inicia Sesion con tu Cuenta</Text>
      <TextInput 
        placeholder="tuemail@gmail.com" 
        style={styles.textInput}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput 
        placeholder="password"
        style={styles.textInput}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}  {/* Mostrar mensaje de error */}
      <Text style={styles.forgotPassword}>¿Has olvidado tu contraseña?</Text>

      {/* Modifica el botón para que navegue a Finanzas */}
      <TouchableOpacity onPress={handleSignIn} style={styles.button}>
        <Text style={styles.buttonText}>Iniciar Sesion</Text>
      </TouchableOpacity>
      
      <Text style={styles.subTitle}>¿No tienes una cuenta?</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Registro')} style={styles.registerButton}>
        <Text style={styles.registerButtonText}>¿Crear una cuenta?</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'flex-start', // Asegura que el contenido empieza desde la parte superior
    paddingTop: 20, // Añadir un poco de margen superior
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1, // Poner el SVG en el fondo
  },
  titulo: {
    fontSize: 80,  
    color: '#34434D',
    fontWeight: 'bold',
    zIndex: 1, // Asegúrate de que el texto esté encima del SVG
    marginTop: height / 18, // Coloca el título un poco más abajo
    marginBottom: 30
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
  forgotPassword: {
    fontSize: 14,
    color: 'gray',
    zIndex: 1,
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2980B9',
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
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
  },
});

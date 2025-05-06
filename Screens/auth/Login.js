import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { loginWithEmail } from '../../services/authService';
import { loginStyles } from '../../styles/auth/loginStyles';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig'; // ✅ Usa el auth que tú ya exportas

WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '888506260696-q1pq20q2u2mo16orvbqu9d0o5ps4fdfa.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@Arnandis/my-proyect',
    androidClientId: '888506260696-guofqe8su44hrbjmeof9gfg3pdj2b69k.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token, access_token } = response.authentication;

      if (id_token && access_token) {
        const credential = GoogleAuthProvider.credential(id_token, access_token);

        signInWithCredential(auth, credential)
          .then(userCredential => {
            console.log('Usuario logueado con Google:', userCredential.user);
            navigation.navigate('Finanzas', { uid: userCredential.user.uid });
          })
          .catch(error => {
            console.error('Error al autenticar con Firebase:', error);
            setError('No se pudo iniciar sesión con Google');
          });
      } else {
        console.error('Tokens inválidos:', response.authentication);
        setError('Error con la autenticación de Google');
      }
    }
  }, [response]);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Por favor ingresa tu email y contraseña");
      return;
    }

    try {
      const { uid } = await loginWithEmail(email, password);
      navigation.navigate('Finanzas', { uid });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={loginStyles.container}>
      <Text style={loginStyles.titulo}>¡Hola!</Text>
      <Text style={loginStyles.subTitle}>Inicia sesión con tu cuenta</Text>

      <TextInput
        placeholder="tuemail@gmail.com"
        style={loginStyles.textInput}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="password"
        style={loginStyles.textInput}
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={loginStyles.errorText}>{error}</Text> : null}

      <TouchableOpacity onPress={handleSignIn} style={loginStyles.button}>
        <Text style={loginStyles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => promptAsync()}
        style={[loginStyles.button, { backgroundColor: '#DB4437', marginTop: 10 }]}
        disabled={!request}
      >
        <Text style={loginStyles.buttonText}>Iniciar con Google</Text>
      </TouchableOpacity>

      <Text style={loginStyles.subTitle}>¿No tienes una cuenta?</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Registro')} style={loginStyles.registerButton}>
        <Text style={loginStyles.registerButtonText}>Crear una cuenta</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

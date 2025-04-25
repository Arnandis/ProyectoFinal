import React, { useState } from 'react';
import { Text, View, TextInput, Dimensions, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { loginWithEmail } from '../../services/authService';
import { loginStyles } from '../../styles/auth/loginStyles';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Por favor ingresa tu email y contraseña");
      return;
    }

    try {
      const { uid } = await loginWithEmail(email, password);
      console.log('Usuario autenticado con UID:', uid);
      navigation.navigate('Finanzas', { uid });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={loginStyles.container}>
      <Text style={loginStyles.titulo}>¡Hola!</Text>
      <Text style={loginStyles.subTitle}>Inicia Sesion con tu Cuenta</Text>
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
      <Text style={loginStyles.forgotPassword}>¿Has olvidado tu contraseña?</Text>

      <TouchableOpacity onPress={handleSignIn} style={loginStyles.button}>
        <Text style={loginStyles.buttonText}>Iniciar Sesion</Text>
      </TouchableOpacity>

      <Text style={loginStyles.subTitle}>¿No tienes una cuenta?</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Registro')} style={loginStyles.registerButton}>
        <Text style={loginStyles.registerButtonText}>¿Crear una cuenta?</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

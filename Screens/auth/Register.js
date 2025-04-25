import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { registerWithEmail } from '../../services/authService';
import { registerStyles } from '../../styles/auth/registerStyles';

export default function FormularioRegistro({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await registerWithEmail(email, password);
      navigation.navigate('Login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={registerStyles.container}>
      <Text style={registerStyles.titulo}>Crear una cuenta</Text>
      <Text style={registerStyles.subTitle}>Registra tu cuenta</Text>

      <TextInput
        placeholder="tuemail@gmail.com"
        style={registerStyles.textInput}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="contraseña"
        style={registerStyles.textInput}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="confirmar contraseña"
        style={registerStyles.textInput}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {error ? <Text style={registerStyles.errorText}>{error}</Text> : null}

      <TouchableOpacity onPress={handleRegister} style={registerStyles.button}>
        <Text style={registerStyles.buttonText}>Registrar</Text>
      </TouchableOpacity>

      <Text style={registerStyles.subTitle}>¿Ya tienes una cuenta?</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={registerStyles.registerButton}>
        <Text style={registerStyles.registerButtonText}>Iniciar Sesion</Text>
      </TouchableOpacity>
    </View>
  );
}

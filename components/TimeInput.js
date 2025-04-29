// components/TimeInput.js
import React from 'react';
import { TextInput } from 'react-native';
import { tiempoStyles } from '../styles/tiempoStyles';

export default function TimeInput({ placeholder, onChange }) {
  return (
    <TextInput
      className="w-full h-10 border border-gray-300 mb-2 px-3 rounded"
      placeholder={placeholder}
      keyboardType="numeric"
      onChangeText={onChange}
      style={tiempoStyles.input}
    />
  );
}

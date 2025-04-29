import React from 'react';
import { TextInput } from 'react-native';
import { finanzasStyles } from '../styles/finanzasStyles';

const GastoInput = ({ label, value, onChange }) => (
  <TextInput
    style={finanzasStyles.input}
    placeholder={`Gasto en ${label}`}
    keyboardType="numeric"
    value={value.toString()}
    onChangeText={onChange}
  />
);

export default GastoInput;

import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { finanzasStyles } from '../styles/finanzasStyles';

const GastoInput = ({ label, value, onChange }) => (
  <View style={finanzasStyles.inputCard}>
    <Text style={finanzasStyles.inputLabel}>{label}</Text>
    <TextInput
      style={finanzasStyles.inputField}
      placeholder={`Introduce gasto en ${label}`}
      keyboardType="numeric"
      value={value.toString()}
      onChangeText={onChange}
    />
  </View>
);

export default GastoInput;

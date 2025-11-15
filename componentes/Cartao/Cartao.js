import React from 'react';
import { View } from 'react-native';
import styles from './Estilo';

const Cartao = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

export default Cartao;

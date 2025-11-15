import React from 'react';
import { View, Text } from 'react-native';
import { useCurrency } from '../../contexto/ContextoMoeda';
import styles from './Estilo';

export default function SeloDeTaxa() {
  const { rate, loading } = useCurrency();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        1 USD → BRL {loading ? '...' : rate?.toFixed(2) ?? '-'}
      </Text>
    </View>
  );
}

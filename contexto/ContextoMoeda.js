import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getTaxaConversao } from '../api/conversorMoedas';

// 1. Criar o Contexto
const CurrencyContext = createContext(null);

// 2. Criar o Provedor (Provider)
export const CurrencyProvider = ({ children }) => {
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarTaxa = async () => {
      try {
        const taxa = await getTaxaConversao('USD', 'BRL');
        setRate(taxa);
      } catch (error) {
        // O Alert foi movido de TelaSimulador para cá para centralizar o erro
        Alert.alert("Erro de Câmbio", "Não foi possível buscar a cotação do dólar. A conversão pode não funcionar.");
      } finally {
        setLoading(false);
      }
    };

    buscarTaxa();
  }, []);

  const value = {
    rate, // A taxa de conversão (ex: 5.25)
    loading, // Booleano para indicar se a taxa está sendo carregada
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

// 3. Criar o Hook customizado para usar o contexto
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency deve ser usado dentro de um CurrencyProvider');
  }
  return context;
};

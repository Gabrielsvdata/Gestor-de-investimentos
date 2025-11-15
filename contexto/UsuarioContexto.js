import React, { createContext, useContext, useState } from 'react';

const UsuarioContext = createContext(null);

export const UsuarioProvider = ({ children }) => {
  const [nomeUsuario, setNomeUsuario] = useState('');

  const fazerLogin = (nome) => {
    setNomeUsuario(nome);
  };

  const fazerLogout = () => {
    setNomeUsuario('');
  };

  return (
    <UsuarioContext.Provider value={{ nomeUsuario, fazerLogin, fazerLogout }}>
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuario = () => {
  const context = useContext(UsuarioContext);
  if (!context) {
    throw new Error('useUsuario deve ser usado dentro de um UsuarioProvider');
  }
  return context;
};

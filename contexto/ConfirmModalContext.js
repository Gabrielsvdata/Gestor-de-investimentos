import React from 'react';
import ConfirmModal from '../componentes/ConfirmModal/ConfirmModal';

const ConfirmModalContext = React.createContext(null);

export const ConfirmModalProvider = ({ children }) => {
  const [state, setState] = React.useState({ visible: false, title: '', message: '' });
  const resolveRef = React.useRef(null);

  const showConfirm = ({ title = 'Confirmar', message = '' } = {}) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setState({ visible: true, title, message });
    });
  };

  const hide = () => {
    setState((s) => ({ ...s, visible: false }));
    resolveRef.current = null;
  };

  const handleConfirm = () => {
    if (resolveRef.current) resolveRef.current(true);
    hide();
  };

  const handleCancel = () => {
    if (resolveRef.current) resolveRef.current(false);
    hide();
  };

  return (
    <ConfirmModalContext.Provider value={{ showConfirm, hide }}>
      {children}
      <ConfirmModal
        visible={state.visible}
        title={state.title}
        message={state.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmModalContext.Provider>
  );
};

export const useConfirm = () => {
  const ctx = React.useContext(ConfirmModalContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmModalProvider');
  return ctx;
};

export default ConfirmModalContext;

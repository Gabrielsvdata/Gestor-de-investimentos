import React from 'react';import { Modal, View, Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { theme } from '../../theme';

export default function ConfirmModal({ visible, title = 'Confirmar', message = '', onConfirm, onCancel }) {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
        Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true, easing: Easing.in(Easing.ease) }),
        Animated.timing(translateY, { toValue: 10, duration: 180, useNativeDriver: true, easing: Easing.in(Easing.ease) }),
      ]).start();
    }
  }, [visible, opacity, translateY]);

  return (
    <Modal animationType="none" transparent visible={visible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }] }>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.cancel]} onPress={onCancel} accessibilityRole="button">
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.confirm]} onPress={onConfirm} accessibilityRole="button">
              <Text style={styles.confirmText}>Sair</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: '#111827'
  },
  message: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancel: {
    backgroundColor: '#f3f4f6',
  },
  confirm: {
    backgroundColor: theme.colors.primary || '#6b21a8',
  },
  cancelText: {
    color: '#111827',
    fontWeight: '600',
  },
  confirmText: {
    color: '#fff',
    fontWeight: '700',
  },
});

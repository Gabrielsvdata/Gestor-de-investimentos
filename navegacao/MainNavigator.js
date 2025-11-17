import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import TelaSimulador from '../telas/TelaSimulador';
import TelaMetas from '../telas/TelaMetas';
import { theme } from '../theme';
import { useUsuario } from '../contexto/UsuarioContexto';
import { useConfirm } from '../contexto/ConfirmModalContext';

import { Modal, TouchableOpacity } from 'react-native';

const Stack = createNativeStackNavigator();

function HeaderMenu({ onOpen }) {
  return (
    <Pressable onPress={onOpen} style={{ marginRight: 12 }} accessibilityRole="button" accessibilityLabel="Abrir menu">
      <MaterialIcons name="menu" size={26} color="#fff" />
    </Pressable>
  );
}

function HeaderWithUser() {
  const { nomeUsuario } = useUsuario();
  const firstName = nomeUsuario ? String(nomeUsuario).trim().split(' ')[0] : null;
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Simulador de Investimentos</Text>
      {firstName ? (
        <Text style={styles.greeting} numberOfLines={1} ellipsizeMode="tail">
          Olá, <Text style={styles.userName}>{firstName}</Text>
        </Text>
      ) : null}
    </View>
  );
}

export default function MainNavigator() {
  const navigation = useNavigation();
  const { nomeUsuario, fazerLogout } = useUsuario();
  const { showConfirm } = useConfirm();

  const [menuVisible, setMenuVisible] = React.useState(false);
  const openMenu = React.useCallback(() => setMenuVisible(true), []);
  const closeMenu = React.useCallback(() => setMenuVisible(false), []);

  const handleNavigate = (name) => {
    closeMenu();
    navigation.navigate(name);
  };

  const handleLogout = async () => {
    // Ensure menu modal is closed before showing confirmation so the confirm
    // modal appears above on iOS (stacked native Modals can hide the new one).
    closeMenu();
    // small delay to allow menu modal to dismiss animation on iOS
    await new Promise((resolve) => setTimeout(resolve, 220));

    const ok = await showConfirm({ title: 'Sair', message: 'Tem certeza que deseja sair da sua conta?' });
    if (!ok) return;
    try { fazerLogout(); } catch (e) { }
    const rootNav = navigation.getParent ? navigation.getParent() : null;
    try {
      if (rootNav) {
        rootNav.reset({ index: 0, routes: [{ name: 'Login' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    } catch (err) {
      console.warn('Erro ao resetar navegação no logout (menu):', err);
    }
  };

  React.useEffect(() => {
    if (!nomeUsuario) {
      try {
        const rootNav = navigation.getParent ? navigation.getParent() : null;
        if (rootNav) {
          rootNav.reset({ index: 0, routes: [{ name: 'Login' }] });
        } else {
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
      } catch (e) {
        console.warn('Falha ao resetar navegação para Login', e);
      }
    }
  }, [nomeUsuario, navigation]);

  return (
    <>
      <Stack.Navigator
        initialRouteName="Simulador"
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.bg },
          headerTitleStyle: {
            color: '#fff',
            fontWeight: '800',
            fontSize: 18,
            fontFamily: 'Inter_800ExtraBold'
          },
          headerTintColor: '#fff',
          headerRight: () => <HeaderMenu onOpen={openMenu} />,
          headerTitle: () => <HeaderWithUser />,
        }}
      >
        <Stack.Screen name="Simulador" component={TelaSimulador} options={{ title: 'Simulador de Investimentos' }} />
        <Stack.Screen name="Metas" component={TelaMetas} options={{ title: 'Planejador de Metas' }} />
      </Stack.Navigator>

      <Modal visible={menuVisible} animationType="fade" transparent onRequestClose={closeMenu}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={closeMenu} />
        <View style={styles.modalContent} pointerEvents="box-none">
          <View style={styles.menuCard}>
            <Text style={styles.sheetTitle}>Menu</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('Simulador')}>
              <Text style={styles.menuText}>Simulador</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('Metas')}>
              <Text style={styles.menuText}>Metas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Text style={[styles.menuText, { color: theme.colors.danger }]}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  modalContent: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 56 : 50,
    right: 12,
    width: 220,
    // ensure it sits above header
    zIndex: 9999,
  },
  menuCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    ...theme.shadow.card,
  },
  sheetTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '600',
  },
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingRight: 8,
  },
  title: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    lineHeight: 18,
  },
  greeting: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 0,
    opacity: 0.95,
  },
  userName: {
    color: '#fff',
    fontWeight: '700',
  },
});

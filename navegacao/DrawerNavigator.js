import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Platform } from 'react-native';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import TelaSimulador from '../telas/TelaSimulador';
import TelaMetas from '../telas/TelaMetas';
import { theme } from '../theme';
import { useUsuario } from '../contexto/UsuarioContexto';

const Drawer = createDrawerNavigator();

import { useConfirm } from '../contexto/ConfirmModalContext';

export function HeaderComUsuario({ navigation: navProp }) {
  const { nomeUsuario, fazerLogout } = useUsuario();
  const navigation = navProp || useNavigation();
  const { showConfirm } = useConfirm();

  const handleLogout = async () => {
    // open confirm modal
    const ok = await showConfirm({ title: 'Sair', message: 'Tem certeza que deseja sair da sua conta?' });
    if (!ok) return;
    try { fazerLogout(); } catch (e) { /* noop */ }
    const rootNav = navigation.getParent ? navigation.getParent() : null;
    try {
      if (rootNav) {
        rootNav.reset({ index: 0, routes: [{ name: 'Login' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    } catch (err) {
      console.warn('Erro ao resetar navegação no logout (header):', err);
    }
  };

  return (
    <View style={styles.headerUsuario} pointerEvents="box-none">
      <View style={styles.avatarContainer} pointerEvents="none">
        <MaterialIcons name="account-circle" size={32} color="#FFF" />
      </View>
      <View style={styles.infoUsuario} pointerEvents="none">
        <Text style={styles.saudacao}>Olá,</Text>
        <Text style={styles.nomeUsuario}>{nomeUsuario}</Text>
      </View>
      <Pressable onPress={handleLogout} style={styles.logoutButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} accessibilityLabel="Sair" accessibilityRole="button">
        <MaterialIcons name="logout" size={22} color="#FFF" />
      </Pressable>
    </View>
  );
}

function CustomDrawerContent(props) {
  const { fazerLogout } = useUsuario();
  const navigation = props.navigation;
  const { showConfirm } = useConfirm();

  const handleLogout = async () => {
    // open confirm modal
    const ok = await showConfirm({ title: 'Sair', message: 'Tem certeza que deseja sair da sua conta?' });
    if (!ok) return;
    try { fazerLogout(); } catch (e) { /* noop */ }
    const rootNav = navigation.getParent ? navigation.getParent() : null;
    try {
      if (rootNav) {
        rootNav.reset({ index: 0, routes: [{ name: 'Login' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }
    } catch (err) {
      console.warn('Erro ao resetar navegação no logout (drawer):', err);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Sair"
        icon={({ color, size }) => <MaterialIcons name="logout" size={size} color={color} />}
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  const { nomeUsuario } = useUsuario();
  const navigation = useNavigation();

  React.useEffect(() => {
    if (!nomeUsuario) {
      // Quando o usuário não estiver mais autenticado, voltar para Login
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
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
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
        headerRight: () => <HeaderComUsuario />,
      }}
    >
      <Drawer.Screen name="Simulador" component={TelaSimulador} options={{ title: 'Simulador de Investimentos' }} />
      <Drawer.Screen name="Metas" component={TelaMetas} options={{ title: 'Planejador de Metas' }} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  headerUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  avatarContainer: {
    marginRight: 8,
  },
  infoUsuario: {
    justifyContent: 'center',
  },
  saudacao: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Inter_400Regular',
  },
  nomeUsuario: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
    fontFamily: 'Inter_600SemiBold',
  },
  logoutButton: {
    marginLeft: 10,
    padding: 6,
  },
});

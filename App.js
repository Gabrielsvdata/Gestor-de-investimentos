import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaLogin from './telas/TelaLogin';
import DrawerNavigator from './navegacao/DrawerNavigator';
import { theme } from './theme';
import { CurrencyProvider } from './contexto/ContextoMoeda';
import { CalculosProvider } from './contexto/CalculosContexto';
import { UsuarioProvider } from './contexto/UsuarioContexto';
import { ConfirmModalProvider } from './contexto/ConfirmModalContext';

import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_800ExtraBold } from '@expo-google-fonts/inter';

const Stack = createNativeStackNavigator();

export default function App() {

  const [loaded] = useFonts({
    Inter_400Regular, Inter_600SemiBold, Inter_800ExtraBold
  });

  const navTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: theme.colors.screen },
  };

  if (!loaded) return null;

  return (
    <UsuarioProvider>
      <ConfirmModalProvider>
        <CurrencyProvider>
          <CalculosProvider>
          <NavigationContainer theme={navTheme}>
            <StatusBar style="light" />
            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{
                headerShown: false
              }}
            >
              <Stack.Screen name="Login" component={TelaLogin} />
              <Stack.Screen name="Drawer" component={DrawerNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </CalculosProvider>
      </CurrencyProvider>
      </ConfirmModalProvider>
    </UsuarioProvider>
  );
}

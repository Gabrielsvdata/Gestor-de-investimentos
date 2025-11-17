import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import CaixaDeTexto from '../componentes/CaixaDeTexto';
import BotaoPersonalizado from '../componentes/BotaoPersonalizado';
import { useUsuario } from '../contexto/UsuarioContexto';

export default function TelaLogin({ navigation }) {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const { fazerLogin } = useUsuario();

  const handleLogin = () => {
    if (!nome.trim() || !senha.trim()) {
      setErro('Por favor, preencha todos os campos');
      return;
    }

    if (nome.trim().length < 3) {
      setErro('Nome deve ter pelo menos 3 caracteres');
      return;
    }

    if (senha.length < 4) {
      setErro('Senha deve ter pelo menos 4 caracteres');
      return;
    }

    setErro('');
    fazerLogin(nome.trim());
    navigation.replace('Main');
  };

  return (
    <LinearGradient
      colors={['#6366F1', '#8B5CF6', '#EC4899']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Ilustração/Logo */}
          <View style={styles.ilustracaoContainer}>
            <View style={styles.circuloGrande}>
              <View style={styles.circuloMedio}>
                <View style={styles.circuloPequeno}>
                  <MaterialIcons name="trending-up" size={60} color="#FFF" />
                </View>
              </View>
            </View>
            <Text style={styles.tituloApp}>Investidor Pro</Text>
            <Text style={styles.subtituloApp}>Seu futuro financeiro começa aqui</Text>
          </View>

          {/* Formulário */}
          <View style={styles.formularioCard}>
            <Text style={styles.tituloFormulario}>Bem-vindo!</Text>
            <Text style={styles.subtituloFormulario}>Faça login para continuar</Text>

            <CaixaDeTexto
              placeholder="Seu nome"
              value={nome}
              onChangeText={setNome}
              icon="person"
              style={styles.input}
            />

            <CaixaDeTexto
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              icon="lock"
              style={{ marginTop: theme.spacing.md }}
            />

            {erro ? (
              <View style={styles.erroContainer}>
                <MaterialIcons name="error-outline" size={16} color={theme.colors.danger} />
                <Text style={styles.erro}>{erro}</Text>
              </View>
            ) : null}

            <BotaoPersonalizado
              title="Entrar"
              onPress={handleLogin}
              style={styles.botaoEntrar}
            />

            <View style={styles.infoContainer}>
              <MaterialIcons name="info-outline" size={16} color={theme.colors.textSoft} />
              <Text style={styles.infoTexto}>
                Use qualquer nome e senha com 4+ caracteres
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  ilustracaoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  circuloGrande: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  circuloMedio: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circuloPequeno: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tituloApp: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFF',
    fontFamily: 'Inter_800ExtraBold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtituloApp: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Inter_400Regular',
    marginTop: theme.spacing.xs,
  },
  formularioCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: theme.radius.xl,
    padding: theme.spacing.xl,
    ...theme.shadow.card,
  },
  tituloFormulario: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: theme.spacing.xs,
  },
  subtituloFormulario: {
    fontSize: 14,
    color: theme.colors.textSoft,
    fontFamily: 'Inter_400Regular',
    marginBottom: theme.spacing.xl,
  },
  input: {
    marginTop: 0,
  },
  erroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.dangerMuted || '#FEE',
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
  },
  erro: {
    color: theme.colors.danger,
    fontSize: 12,
    marginLeft: theme.spacing.sm,
    fontFamily: 'Inter_400Regular',
    flex: 1,
  },
  botaoEntrar: {
    marginTop: theme.spacing.xl,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  infoTexto: {
    fontSize: 12,
    color: theme.colors.textSoft,
    fontFamily: 'Inter_400Regular',
    marginLeft: theme.spacing.sm,
  },
});

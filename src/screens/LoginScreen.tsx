import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors, radius, shadow, spacing } from '../theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [focado, setFocado] = useState<'email' | 'senha' | null>(null);

  async function handleLogin() {
    setErro(null);
    if (!email.trim() || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }
    setEnviando(true);
    try {
      await login(email.trim(), senha);
    } catch (e) {
      setErro('E-mail ou senha invalidos.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.brand}>
        <View style={styles.logo}>
          <Text style={styles.logoEmoji}>🚌</Text>
        </View>
        <Text style={styles.brandNome}>App Ônibus</Text>
        <Text style={styles.brandSub}>Painel administrativo</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={[styles.input, focado === 'email' && styles.inputFocado]}
          placeholder="voce@empresa.com"
          placeholderTextColor={colors.inactive}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setFocado('email')}
          onBlur={() => setFocado(null)}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={[styles.input, focado === 'senha' && styles.inputFocado]}
          placeholder="••••••••"
          placeholderTextColor={colors.inactive}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          onFocus={() => setFocado('senha')}
          onBlur={() => setFocado(null)}
        />

        {erro && (
          <View style={styles.erroBox}>
            <Text style={styles.erroTexto}>{erro}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.botao, enviando && styles.botaoDesabilitado]}
          onPress={handleLogin}
          disabled={enviando}
          activeOpacity={0.85}
        >
          {enviando ? (
            <ActivityIndicator color={colors.textOnPrimary} />
          ) : (
            <Text style={styles.botaoTexto}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.rodape}>Acesso restrito à equipe administrativa</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  brand: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadow,
  },
  logoEmoji: {
    fontSize: 38,
  },
  brandNome: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textOnPrimary,
    letterSpacing: 0.5,
  },
  brandSub: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surfaceMuted,
    marginBottom: spacing.md,
  },
  inputFocado: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  erroBox: {
    backgroundColor: '#fef2f2',
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  erroTexto: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '500',
  },
  botao: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xs,
    ...shadow,
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  botaoTexto: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  rodape: {
    textAlign: 'center',
    color: '#475569',
    fontSize: 12,
    marginTop: spacing.lg,
  },
});

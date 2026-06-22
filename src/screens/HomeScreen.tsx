import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import type { AppStackParamList } from '../navigation/AppNavigator';
import { colors, radius, shadow, spacing } from '../theme';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

type Modulo = {
  rota: keyof AppStackParamList;
  titulo: string;
  descricao: string;
  emoji: string;
  cor: string;
};

const MODULOS: Modulo[] = [
  {
    rota: 'Frota',
    titulo: 'Frota',
    descricao: 'Ônibus e veículos',
    emoji: '🚌',
    cor: colors.frota,
  },
  {
    rota: 'Motoristas',
    titulo: 'Motoristas',
    descricao: 'Equipe de condução',
    emoji: '👤',
    cor: colors.motoristas,
  },
  {
    rota: 'Manutencao',
    titulo: 'Manutenção',
    descricao: 'Revisões e reparos',
    emoji: '🔧',
    cor: colors.manutencao,
  },
  {
    rota: 'Escalas',
    titulo: 'Escalas',
    descricao: 'Turnos e rotas',
    emoji: '📅',
    cor: colors.escalas,
  },
];

export default function HomeScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const inicial = (user?.email?.[0] ?? '?').toUpperCase();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.ola}>Bem-vindo de volta</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>{inicial}</Text>
        </View>
      </View>

      <Text style={styles.secao}>Módulos</Text>

      <View style={styles.grid}>
        {MODULOS.map((modulo) => (
          <TouchableOpacity
            key={modulo.rota}
            style={styles.card}
            onPress={() => navigation.navigate(modulo.rota)}
            activeOpacity={0.85}
          >
            <View style={[styles.iconeBox, { backgroundColor: modulo.cor }]}>
              <Text style={styles.icone}>{modulo.emoji}</Text>
            </View>
            <Text style={styles.cardTitulo}>{modulo.titulo}</Text>
            <Text style={styles.cardDescricao}>{modulo.descricao}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.botaoSair}
        onPress={() => logout()}
        activeOpacity={0.85}
      >
        <Text style={styles.botaoSairTexto}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  conteudo: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  ola: {
    fontSize: 14,
    color: colors.textMuted,
  },
  email: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  avatarTexto: {
    color: colors.textOnPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  secao: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  card: {
    flexGrow: 1,
    flexBasis: '45%',
    minWidth: 150,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow,
  },
  iconeBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  icone: {
    fontSize: 24,
  },
  cardTitulo: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  cardDescricao: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  botaoSair: {
    marginTop: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  botaoSairTexto: {
    color: colors.danger,
    fontSize: 15,
    fontWeight: '600',
  },
});

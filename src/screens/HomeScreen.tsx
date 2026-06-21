import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import type { AppStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<AppStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bem-vindo</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={styles.modulos}>
        <TouchableOpacity
          style={styles.modulo}
          onPress={() => navigation.navigate('Frota')}
        >
          <Text style={styles.moduloTexto}>🚌 Frota</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.info}>
        Motoristas, Manutenção e Escalas serão adicionados nas próximas etapas.
      </Text>

      <TouchableOpacity style={styles.botaoSair} onPress={() => logout()}>
        <Text style={styles.botaoSairTexto}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  email: {
    fontSize: 16,
    color: '#2563eb',
    marginTop: 4,
  },
  modulos: {
    width: '100%',
    marginTop: 32,
    gap: 12,
  },
  modulo: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: 'center',
  },
  moduloTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  info: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 24,
  },
  botaoSair: {
    marginTop: 'auto',
    marginBottom: 32,
    backgroundColor: '#dc2626',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  botaoSairTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

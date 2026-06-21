import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Motorista } from '../../types';
import {
  excluirMotorista,
  listarMotoristas,
} from '../../services/motoristaService';
import type { MotoristasStackParamList } from '../../navigation/MotoristasNavigator';

type Props = NativeStackScreenProps<MotoristasStackParamList, 'MotoristasList'>;

const STATUS_LABEL: Record<Motorista['status'], string> = {
  ativo: 'Ativo',
  inativo: 'Inativo',
};

export default function MotoristasListScreen({ navigation }: Props) {
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      setMotoristas(await listarMotoristas());
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar os motoristas.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function confirmarExclusao(item: Motorista) {
    Alert.alert('Excluir motorista', `Remover ${item.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirMotorista(item.id);
            carregar();
          } catch (e) {
            Alert.alert('Erro', 'Não foi possível excluir.');
          }
        },
      },
    ]);
  }

  if (carregando) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={motoristas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum motorista cadastrado ainda.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('MotoristaForm', { motorista: item })}
            onLongPress={() => confirmarExclusao(item)}
          >
            <View style={styles.cardInfo}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.detalhe}>
                CNH {item.cnh} • {item.telefone}
              </Text>
            </View>
            <Text style={[styles.status, item.status === 'ativo' ? styles.ativo : styles.inativo]}>
              {STATUS_LABEL[item.status]}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('MotoristaForm', {})}
      >
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  lista: { padding: 16, gap: 12 },
  vazio: { textAlign: 'center', color: '#64748b', marginTop: 48 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardInfo: { flex: 1 },
  nome: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  detalhe: { fontSize: 14, color: '#64748b', marginTop: 2 },
  status: { fontSize: 13, fontWeight: '600' },
  ativo: { color: '#16a34a' },
  inativo: { color: '#64748b' },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabTexto: { color: '#fff', fontSize: 28, lineHeight: 32 },
});

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
import { Onibus } from '../../types';
import { excluirOnibus, listarOnibus } from '../../services/onibusService';
import type { FrotaStackParamList } from '../../navigation/FrotaNavigator';

type Props = NativeStackScreenProps<FrotaStackParamList, 'FrotaList'>;

const STATUS_LABEL: Record<Onibus['status'], string> = {
  ativo: 'Ativo',
  'em manutencao': 'Em manutenção',
  inativo: 'Inativo',
};

export default function FrotaListScreen({ navigation }: Props) {
  const [onibus, setOnibus] = useState<Onibus[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      setOnibus(await listarOnibus());
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar a frota.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function confirmarExclusao(item: Onibus) {
    Alert.alert('Excluir ônibus', `Remover o ônibus ${item.placa}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirOnibus(item.id);
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
        data={onibus}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum ônibus cadastrado ainda.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('FrotaForm', { onibus: item })}
            onLongPress={() => confirmarExclusao(item)}
          >
            <View style={styles.cardInfo}>
              <Text style={styles.placa}>{item.placa}</Text>
              <Text style={styles.modelo}>
                {item.modelo} • {item.anoFabricacao}
              </Text>
            </View>
            <Text style={[styles.status, statusStyle(item.status)]}>
              {STATUS_LABEL[item.status]}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('FrotaForm', {})}
      >
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

function statusStyle(status: Onibus['status']) {
  switch (status) {
    case 'ativo':
      return { color: '#16a34a' };
    case 'em manutencao':
      return { color: '#d97706' };
    default:
      return { color: '#64748b' };
  }
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
  placa: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  modelo: { fontSize: 14, color: '#64748b', marginTop: 2 },
  status: { fontSize: 13, fontWeight: '600' },
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

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
import { Manutencao, Onibus } from '../../types';
import {
  excluirManutencao,
  listarManutencoes,
} from '../../services/manutencaoService';
import { listarOnibus } from '../../services/onibusService';
import type { ManutencaoStackParamList } from '../../navigation/ManutencaoNavigator';

type Props = NativeStackScreenProps<ManutencaoStackParamList, 'ManutencaoList'>;

function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function ManutencaoListScreen({ navigation }: Props) {
  const [manutencoes, setManutencoes] = useState<Manutencao[]>([]);
  const [onibus, setOnibus] = useState<Onibus[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const [listaManutencoes, listaOnibus] = await Promise.all([
        listarManutencoes(),
        listarOnibus(),
      ]);
      setManutencoes(listaManutencoes);
      setOnibus(listaOnibus);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar as manutenções.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function placaDoOnibus(onibusId: string): string {
    return onibus.find((o) => o.id === onibusId)?.placa ?? 'Ônibus removido';
  }

  function confirmarExclusao(item: Manutencao) {
    Alert.alert('Excluir manutenção', 'Remover este registro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirManutencao(item.id);
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
        data={manutencoes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhuma manutenção registrada ainda.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('ManutencaoForm', {
                manutencao: item,
                onibus,
              })
            }
            onLongPress={() => confirmarExclusao(item)}
          >
            <View style={styles.cardTopo}>
              <Text style={styles.placa}>{placaDoOnibus(item.onibusId)}</Text>
              <Text
                style={[
                  styles.status,
                  item.status === 'concluida' ? styles.concluida : styles.aberta,
                ]}
              >
                {item.status === 'concluida' ? 'Concluída' : 'Aberta'}
              </Text>
            </View>
            <Text style={styles.descricao}>{item.descricao}</Text>
            <Text style={styles.detalhe}>
              {item.data} • {formatarMoeda(item.custo)}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('ManutencaoForm', { onibus })}
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
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  cardTopo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placa: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  status: { fontSize: 13, fontWeight: '600' },
  aberta: { color: '#d97706' },
  concluida: { color: '#16a34a' },
  descricao: { fontSize: 15, color: '#334155', marginTop: 8 },
  detalhe: { fontSize: 13, color: '#64748b', marginTop: 4 },
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

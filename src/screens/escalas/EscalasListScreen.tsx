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
import { Escala, Motorista, Onibus, Turno } from '../../types';
import { excluirEscala, listarEscalas } from '../../services/escalaService';
import { listarOnibus } from '../../services/onibusService';
import { listarMotoristas } from '../../services/motoristaService';
import type { EscalasStackParamList } from '../../navigation/EscalasNavigator';

type Props = NativeStackScreenProps<EscalasStackParamList, 'EscalasList'>;

const TURNO_LABEL: Record<Turno, string> = {
  manha: 'Manhã',
  tarde: 'Tarde',
  noite: 'Noite',
};

export default function EscalasListScreen({ navigation }: Props) {
  const [escalas, setEscalas] = useState<Escala[]>([]);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [onibus, setOnibus] = useState<Onibus[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const [listaEscalas, listaMotoristas, listaOnibus] = await Promise.all([
        listarEscalas(),
        listarMotoristas(),
        listarOnibus(),
      ]);
      setEscalas(listaEscalas);
      setMotoristas(listaMotoristas);
      setOnibus(listaOnibus);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar as escalas.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  function nomeMotorista(id: string): string {
    return motoristas.find((m) => m.id === id)?.nome ?? 'Motorista removido';
  }

  function placaOnibus(id: string): string {
    return onibus.find((o) => o.id === id)?.placa ?? 'Ônibus removido';
  }

  function confirmarExclusao(item: Escala) {
    Alert.alert('Excluir escala', 'Remover esta escala?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await excluirEscala(item.id);
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
        data={escalas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhuma escala registrada ainda.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('EscalaForm', { escala: item, motoristas, onibus })
            }
            onLongPress={() => confirmarExclusao(item)}
          >
            <View style={styles.cardTopo}>
              <Text style={styles.motorista}>{nomeMotorista(item.motoristaId)}</Text>
              <Text style={styles.turno}>{TURNO_LABEL[item.turno]}</Text>
            </View>
            <Text style={styles.detalhe}>🚌 {placaOnibus(item.onibusId)}</Text>
            <Text style={styles.detalhe}>
              {item.dataInicio} → {item.dataFim}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('EscalaForm', { motoristas, onibus })}
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
  motorista: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  turno: { fontSize: 13, fontWeight: '600', color: '#2563eb' },
  detalhe: { fontSize: 14, color: '#64748b', marginTop: 6 },
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

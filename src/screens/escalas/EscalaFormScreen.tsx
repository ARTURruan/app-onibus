import React, { useLayoutEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Turno } from '../../types';
import {
  atualizarEscala,
  criarEscala,
  EscalaInput,
} from '../../services/escalaService';
import type { EscalasStackParamList } from '../../navigation/EscalasNavigator';

type Props = NativeStackScreenProps<EscalasStackParamList, 'EscalaForm'>;

const TURNO_OPCOES: { valor: Turno; label: string }[] = [
  { valor: 'manha', label: 'Manhã' },
  { valor: 'tarde', label: 'Tarde' },
  { valor: 'noite', label: 'Noite' },
];

function hojeISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function EscalaFormScreen({ navigation, route }: Props) {
  const editando = route.params?.escala;
  const motoristas = route.params?.motoristas ?? [];
  const onibus = route.params?.onibus ?? [];

  const [motoristaId, setMotoristaId] = useState(
    editando?.motoristaId ?? motoristas[0]?.id ?? ''
  );
  const [onibusId, setOnibusId] = useState(
    editando?.onibusId ?? onibus[0]?.id ?? ''
  );
  const [dataInicio, setDataInicio] = useState(editando?.dataInicio ?? hojeISO());
  const [dataFim, setDataFim] = useState(editando?.dataFim ?? hojeISO());
  const [turno, setTurno] = useState<Turno>(editando?.turno ?? 'manha');
  const [salvando, setSalvando] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: editando ? 'Editar escala' : 'Nova escala',
    });
  }, [navigation, editando]);

  async function salvar() {
    if (!motoristaId) {
      Alert.alert('Motorista obrigatório', 'Cadastre um motorista primeiro.');
      return;
    }
    if (!onibusId) {
      Alert.alert('Ônibus obrigatório', 'Cadastre um ônibus na Frota primeiro.');
      return;
    }
    if (!dataInicio.trim() || !dataFim.trim()) {
      Alert.alert('Campos obrigatórios', 'Informe data de início e fim.');
      return;
    }
    if (dataFim < dataInicio) {
      Alert.alert('Datas inválidas', 'A data de fim não pode ser anterior à de início.');
      return;
    }

    const dados: EscalaInput = {
      motoristaId,
      onibusId,
      dataInicio: dataInicio.trim(),
      dataFim: dataFim.trim(),
      turno,
    };

    setSalvando(true);
    try {
      if (editando) {
        await atualizarEscala(editando.id, dados);
      } else {
        await criarEscala(dados);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar a escala.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.label}>Motorista</Text>
      {motoristas.length === 0 ? (
        <Text style={styles.aviso}>Nenhum motorista cadastrado.</Text>
      ) : (
        <View style={styles.chips}>
          {motoristas.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.chip, motoristaId === m.id && styles.chipAtivo]}
              onPress={() => setMotoristaId(m.id)}
            >
              <Text
                style={[
                  styles.chipTexto,
                  motoristaId === m.id && styles.chipTextoAtivo,
                ]}
              >
                {m.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>Ônibus</Text>
      {onibus.length === 0 ? (
        <Text style={styles.aviso}>Nenhum ônibus cadastrado.</Text>
      ) : (
        <View style={styles.chips}>
          {onibus.map((o) => (
            <TouchableOpacity
              key={o.id}
              style={[styles.chip, onibusId === o.id && styles.chipAtivo]}
              onPress={() => setOnibusId(o.id)}
            >
              <Text
                style={[
                  styles.chipTexto,
                  onibusId === o.id && styles.chipTextoAtivo,
                ]}
              >
                {o.placa}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>Data de início</Text>
      <TextInput
        style={styles.input}
        placeholder="AAAA-MM-DD"
        value={dataInicio}
        onChangeText={setDataInicio}
      />

      <Text style={styles.label}>Data de fim</Text>
      <TextInput
        style={styles.input}
        placeholder="AAAA-MM-DD"
        value={dataFim}
        onChangeText={setDataFim}
      />

      <Text style={styles.label}>Turno</Text>
      <View style={styles.statusLinha}>
        {TURNO_OPCOES.map((opcao) => (
          <TouchableOpacity
            key={opcao.valor}
            style={[
              styles.statusChip,
              turno === opcao.valor && styles.statusChipAtivo,
            ]}
            onPress={() => setTurno(opcao.valor)}
          >
            <Text
              style={[
                styles.statusChipTexto,
                turno === opcao.valor && styles.statusChipTextoAtivo,
              ]}
            >
              {opcao.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.botao, salvando && styles.botaoDesabilitado]}
        onPress={salvar}
        disabled={salvando}
      >
        <Text style={styles.botaoTexto}>{salvando ? 'Salvando...' : 'Salvar'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  conteudo: { padding: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 6 },
  aviso: { color: '#d97706', marginBottom: 16 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  chipAtivo: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  chipTexto: { color: '#334155', fontSize: 13 },
  chipTextoAtivo: { color: '#fff', fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  statusLinha: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  statusChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  statusChipAtivo: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  statusChipTexto: { color: '#334155', fontSize: 13 },
  statusChipTextoAtivo: { color: '#fff', fontWeight: '600' },
  botao: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  botaoDesabilitado: { opacity: 0.7 },
  botaoTexto: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

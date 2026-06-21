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
import { StatusManutencao } from '../../types';
import {
  atualizarManutencao,
  criarManutencao,
  ManutencaoInput,
} from '../../services/manutencaoService';
import type { ManutencaoStackParamList } from '../../navigation/ManutencaoNavigator';

type Props = NativeStackScreenProps<ManutencaoStackParamList, 'ManutencaoForm'>;

const STATUS_OPCOES: { valor: StatusManutencao; label: string }[] = [
  { valor: 'aberta', label: 'Aberta' },
  { valor: 'concluida', label: 'Concluída' },
];

function hojeISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function ManutencaoFormScreen({ navigation, route }: Props) {
  const editando = route.params?.manutencao;
  const onibus = route.params?.onibus ?? [];

  const [onibusId, setOnibusId] = useState(
    editando?.onibusId ?? onibus[0]?.id ?? ''
  );
  const [descricao, setDescricao] = useState(editando?.descricao ?? '');
  const [data, setData] = useState(editando?.data ?? hojeISO());
  const [custo, setCusto] = useState(
    editando ? String(editando.custo) : ''
  );
  const [status, setStatus] = useState<StatusManutencao>(
    editando?.status ?? 'aberta'
  );
  const [salvando, setSalvando] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: editando ? 'Editar manutenção' : 'Nova manutenção',
    });
  }, [navigation, editando]);

  async function salvar() {
    if (!onibusId) {
      Alert.alert('Ônibus obrigatório', 'Cadastre um ônibus na Frota primeiro.');
      return;
    }
    if (!descricao.trim() || !data.trim() || !custo.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha descrição, data e custo.');
      return;
    }
    const custoNumero = Number(custo.replace(',', '.'));
    if (Number.isNaN(custoNumero) || custoNumero < 0) {
      Alert.alert('Custo inválido', 'Informe um valor de custo válido.');
      return;
    }

    const dados: ManutencaoInput = {
      onibusId,
      descricao: descricao.trim(),
      data: data.trim(),
      custo: custoNumero,
      status,
    };

    setSalvando(true);
    try {
      if (editando) {
        await atualizarManutencao(editando.id, dados);
      } else {
        await criarManutencao(dados);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar a manutenção.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.label}>Ônibus</Text>
      {onibus.length === 0 ? (
        <Text style={styles.aviso}>
          Nenhum ônibus cadastrado. Cadastre um na Frota antes de registrar manutenção.
        </Text>
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

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.inputMulti]}
        placeholder="Troca de óleo e filtros"
        multiline
        value={descricao}
        onChangeText={setDescricao}
      />

      <Text style={styles.label}>Data</Text>
      <TextInput
        style={styles.input}
        placeholder="AAAA-MM-DD"
        value={data}
        onChangeText={setData}
      />

      <Text style={styles.label}>Custo (R$)</Text>
      <TextInput
        style={styles.input}
        placeholder="0,00"
        keyboardType="decimal-pad"
        value={custo}
        onChangeText={setCusto}
      />

      <Text style={styles.label}>Status</Text>
      <View style={styles.statusLinha}>
        {STATUS_OPCOES.map((opcao) => (
          <TouchableOpacity
            key={opcao.valor}
            style={[
              styles.statusChip,
              status === opcao.valor && styles.statusChipAtivo,
            ]}
            onPress={() => setStatus(opcao.valor)}
          >
            <Text
              style={[
                styles.statusChipTexto,
                status === opcao.valor && styles.statusChipTextoAtivo,
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
  inputMulti: { minHeight: 72, textAlignVertical: 'top' },
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

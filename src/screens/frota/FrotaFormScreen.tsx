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
import { StatusOnibus } from '../../types';
import {
  atualizarOnibus,
  criarOnibus,
  OnibusInput,
} from '../../services/onibusService';
import type { FrotaStackParamList } from '../../navigation/FrotaNavigator';

type Props = NativeStackScreenProps<FrotaStackParamList, 'FrotaForm'>;

const STATUS_OPCOES: { valor: StatusOnibus; label: string }[] = [
  { valor: 'ativo', label: 'Ativo' },
  { valor: 'em manutencao', label: 'Em manutenção' },
  { valor: 'inativo', label: 'Inativo' },
];

export default function FrotaFormScreen({ navigation, route }: Props) {
  const editando = route.params?.onibus;

  const [placa, setPlaca] = useState(editando?.placa ?? '');
  const [modelo, setModelo] = useState(editando?.modelo ?? '');
  const [ano, setAno] = useState(
    editando ? String(editando.anoFabricacao) : ''
  );
  const [status, setStatus] = useState<StatusOnibus>(editando?.status ?? 'ativo');
  const [salvando, setSalvando] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: editando ? 'Editar ônibus' : 'Novo ônibus',
    });
  }, [navigation, editando]);

  async function salvar() {
    if (!placa.trim() || !modelo.trim() || !ano.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha placa, modelo e ano.');
      return;
    }
    const anoNumero = Number(ano);
    if (!Number.isInteger(anoNumero) || anoNumero < 1950 || anoNumero > 2100) {
      Alert.alert('Ano inválido', 'Informe um ano de fabricação válido.');
      return;
    }

    const dados: OnibusInput = {
      placa: placa.trim().toUpperCase(),
      modelo: modelo.trim(),
      anoFabricacao: anoNumero,
      status,
    };

    setSalvando(true);
    try {
      if (editando) {
        await atualizarOnibus(editando.id, dados);
      } else {
        await criarOnibus(dados);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o ônibus.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.label}>Placa</Text>
      <TextInput
        style={styles.input}
        placeholder="ABC1D23"
        autoCapitalize="characters"
        value={placa}
        onChangeText={setPlaca}
      />

      <Text style={styles.label}>Modelo</Text>
      <TextInput
        style={styles.input}
        placeholder="Mercedes-Benz O500"
        value={modelo}
        onChangeText={setModelo}
      />

      <Text style={styles.label}>Ano de fabricação</Text>
      <TextInput
        style={styles.input}
        placeholder="2020"
        keyboardType="number-pad"
        value={ano}
        onChangeText={setAno}
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

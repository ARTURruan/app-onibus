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
import { StatusMotorista } from '../../types';
import {
  atualizarMotorista,
  criarMotorista,
  MotoristaInput,
} from '../../services/motoristaService';
import type { MotoristasStackParamList } from '../../navigation/MotoristasNavigator';

type Props = NativeStackScreenProps<MotoristasStackParamList, 'MotoristaForm'>;

const STATUS_OPCOES: { valor: StatusMotorista; label: string }[] = [
  { valor: 'ativo', label: 'Ativo' },
  { valor: 'inativo', label: 'Inativo' },
];

export default function MotoristaFormScreen({ navigation, route }: Props) {
  const editando = route.params?.motorista;

  const [nome, setNome] = useState(editando?.nome ?? '');
  const [cnh, setCnh] = useState(editando?.cnh ?? '');
  const [telefone, setTelefone] = useState(editando?.telefone ?? '');
  const [status, setStatus] = useState<StatusMotorista>(
    editando?.status ?? 'ativo'
  );
  const [salvando, setSalvando] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: editando ? 'Editar motorista' : 'Novo motorista',
    });
  }, [navigation, editando]);

  async function salvar() {
    if (!nome.trim() || !cnh.trim() || !telefone.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha nome, CNH e telefone.');
      return;
    }

    const dados: MotoristaInput = {
      nome: nome.trim(),
      cnh: cnh.trim(),
      telefone: telefone.trim(),
      status,
    };

    setSalvando(true);
    try {
      if (editando) {
        await atualizarMotorista(editando.id, dados);
      } else {
        await criarMotorista(dados);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o motorista.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="João da Silva"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>CNH</Text>
      <TextInput
        style={styles.input}
        placeholder="00000000000"
        keyboardType="number-pad"
        value={cnh}
        onChangeText={setCnh}
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={styles.input}
        placeholder="(00) 00000-0000"
        keyboardType="phone-pad"
        value={telefone}
        onChangeText={setTelefone}
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

export type StatusOnibus = 'ativo' | 'em manutencao' | 'inativo';

export interface Onibus {
  id: string;
  placa: string;
  modelo: string;
  anoFabricacao: number;
  status: StatusOnibus;
}

export type StatusMotorista = 'ativo' | 'inativo';

export interface Motorista {
  id: string;
  nome: string;
  cnh: string;
  telefone: string;
  status: StatusMotorista;
}

export type StatusManutencao = 'aberta' | 'concluida';

export interface Manutencao {
  id: string;
  onibusId: string;
  descricao: string;
  data: string;
  custo: number;
  status: StatusManutencao;
}

export type Turno = 'manha' | 'tarde' | 'noite';

export interface Escala {
  id: string;
  motoristaId: string;
  onibusId: string;
  dataInicio: string;
  dataFim: string;
  turno: Turno;
}

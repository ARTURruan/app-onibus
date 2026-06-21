import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Motorista } from '../types';

const COLECAO = 'motoristas';

export type MotoristaInput = Omit<Motorista, 'id'>;

export async function listarMotoristas(): Promise<Motorista[]> {
  const q = query(collection(db, COLECAO), orderBy('nome'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as MotoristaInput) }));
}

export async function criarMotorista(dados: MotoristaInput): Promise<void> {
  await addDoc(collection(db, COLECAO), dados);
}

export async function atualizarMotorista(
  id: string,
  dados: MotoristaInput
): Promise<void> {
  await updateDoc(doc(db, COLECAO, id), dados);
}

export async function excluirMotorista(id: string): Promise<void> {
  await deleteDoc(doc(db, COLECAO, id));
}

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
import { Manutencao } from '../types';

const COLECAO = 'manutencoes';

export type ManutencaoInput = Omit<Manutencao, 'id'>;

export async function listarManutencoes(): Promise<Manutencao[]> {
  const q = query(collection(db, COLECAO), orderBy('data', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as ManutencaoInput),
  }));
}

export async function criarManutencao(dados: ManutencaoInput): Promise<void> {
  await addDoc(collection(db, COLECAO), dados);
}

export async function atualizarManutencao(
  id: string,
  dados: ManutencaoInput
): Promise<void> {
  await updateDoc(doc(db, COLECAO, id), dados);
}

export async function excluirManutencao(id: string): Promise<void> {
  await deleteDoc(doc(db, COLECAO, id));
}

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
import { Escala } from '../types';

const COLECAO = 'escalas';

export type EscalaInput = Omit<Escala, 'id'>;

export async function listarEscalas(): Promise<Escala[]> {
  const q = query(collection(db, COLECAO), orderBy('dataInicio', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as EscalaInput) }));
}

export async function criarEscala(dados: EscalaInput): Promise<void> {
  await addDoc(collection(db, COLECAO), dados);
}

export async function atualizarEscala(
  id: string,
  dados: EscalaInput
): Promise<void> {
  await updateDoc(doc(db, COLECAO, id), dados);
}

export async function excluirEscala(id: string): Promise<void> {
  await deleteDoc(doc(db, COLECAO, id));
}

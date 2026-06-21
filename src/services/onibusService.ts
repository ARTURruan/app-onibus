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
import { Onibus } from '../types';

const COLECAO = 'onibus';

export type OnibusInput = Omit<Onibus, 'id'>;

export async function listarOnibus(): Promise<Onibus[]> {
  const q = query(collection(db, COLECAO), orderBy('placa'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as OnibusInput) }));
}

export async function criarOnibus(dados: OnibusInput): Promise<void> {
  await addDoc(collection(db, COLECAO), dados);
}

export async function atualizarOnibus(id: string, dados: OnibusInput): Promise<void> {
  await updateDoc(doc(db, COLECAO, id), dados);
}

export async function excluirOnibus(id: string): Promise<void> {
  await deleteDoc(doc(db, COLECAO, id));
}

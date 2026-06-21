import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Manutencao, Onibus } from '../types';
import ManutencaoListScreen from '../screens/manutencao/ManutencaoListScreen';
import ManutencaoFormScreen from '../screens/manutencao/ManutencaoFormScreen';

export type ManutencaoStackParamList = {
  ManutencaoList: undefined;
  ManutencaoForm: { manutencao?: Manutencao; onibus: Onibus[] };
};

const Stack = createNativeStackNavigator<ManutencaoStackParamList>();

export default function ManutencaoNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ManutencaoList"
        component={ManutencaoListScreen}
        options={{ title: 'Manutenção' }}
      />
      <Stack.Screen name="ManutencaoForm" component={ManutencaoFormScreen} />
    </Stack.Navigator>
  );
}

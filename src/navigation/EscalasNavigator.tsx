import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Escala, Motorista, Onibus } from '../types';
import EscalasListScreen from '../screens/escalas/EscalasListScreen';
import EscalaFormScreen from '../screens/escalas/EscalaFormScreen';

export type EscalasStackParamList = {
  EscalasList: undefined;
  EscalaForm: { escala?: Escala; motoristas: Motorista[]; onibus: Onibus[] };
};

const Stack = createNativeStackNavigator<EscalasStackParamList>();

export default function EscalasNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EscalasList"
        component={EscalasListScreen}
        options={{ title: 'Escalas' }}
      />
      <Stack.Screen name="EscalaForm" component={EscalaFormScreen} />
    </Stack.Navigator>
  );
}

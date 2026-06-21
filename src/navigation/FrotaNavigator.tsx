import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Onibus } from '../types';
import FrotaListScreen from '../screens/frota/FrotaListScreen';
import FrotaFormScreen from '../screens/frota/FrotaFormScreen';

export type FrotaStackParamList = {
  FrotaList: undefined;
  FrotaForm: { onibus?: Onibus };
};

const Stack = createNativeStackNavigator<FrotaStackParamList>();

export default function FrotaNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FrotaList"
        component={FrotaListScreen}
        options={{ title: 'Frota' }}
      />
      <Stack.Screen name="FrotaForm" component={FrotaFormScreen} />
    </Stack.Navigator>
  );
}

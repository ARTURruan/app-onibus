import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Motorista } from '../types';
import MotoristasListScreen from '../screens/motoristas/MotoristasListScreen';
import MotoristaFormScreen from '../screens/motoristas/MotoristaFormScreen';

export type MotoristasStackParamList = {
  MotoristasList: undefined;
  MotoristaForm: { motorista?: Motorista };
};

const Stack = createNativeStackNavigator<MotoristasStackParamList>();

export default function MotoristasNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MotoristasList"
        component={MotoristasListScreen}
        options={{ title: 'Motoristas' }}
      />
      <Stack.Screen name="MotoristaForm" component={MotoristaFormScreen} />
    </Stack.Navigator>
  );
}

import * as React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';

export default function RegistrationScreen() {
  return (
    <View className='flex-1 justify-center items-center p-6 bg-background'>
      <Text className='text-2xl font-bold text-center text-foreground'>
        Tela de Registro
      </Text>
      <Text className='text-center text-muted-foreground mt-4'>
        Em construção...
      </Text>
    </View>
  );
}

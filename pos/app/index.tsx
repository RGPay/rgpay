import * as React from 'react';
import { View, Image } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Text } from '~/components/ui/text';

export default function WelcomeScreen() {
  const handleIniciarVendas = () => {
    router.push('/registration');
  };

  return (
    <View className='flex-1 justify-center items-center gap-8 p-6 bg-background'>
      <Animated.View entering={FadeInUp.delay(200)} className='items-center gap-4'>
        <View className='w-32 h-32 rounded-full items-center justify-center'>
          <Image source={require('~/assets/images/icon.png')} className='w-24 h-24' resizeMode='contain' />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400)} className='w-full max-w-sm'>
        <Card className='rounded-2xl border-2'>
          <CardHeader className='items-center pb-4'>
            <CardTitle className='text-2xl text-center'>Bem-vindo!</CardTitle>
          </CardHeader>
          <CardContent className='gap-4'>
            <Text className='text-center text-muted-foreground'>
              Prepare-se para começar suas vendas com o RGPay
            </Text>
            <View className='gap-3 mt-4'>
              <Button className='w-full h-12 rounded-xl' onPress={handleIniciarVendas}>
                <Text className='text-lg font-semibold'>Iniciar Vendas</Text>
              </Button>
            </View>
          </CardContent>
        </Card>
      </Animated.View>

      {/* <Animated.View entering={FadeInUp.delay(600)} className='items-center'>
        <Text className='text-sm text-muted-foreground'>
          Versão 1.0.0
        </Text>
      </Animated.View> */}
    </View>
  );
}

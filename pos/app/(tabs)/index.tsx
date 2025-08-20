import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/lib/AuthContext';

export default function HomeScreen() {
  const { registration } = useAuth();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">RGPAY</ThemedText>
        <HelloWave />
      </ThemedView>

      {registration && (
        <ThemedView style={styles.infoContainer}>
          <ThemedText type="subtitle">Dispositivo Configurado</ThemedText>
          <ThemedView style={styles.infoCard}>
            <ThemedText style={styles.infoLabel}>Unidade:</ThemedText>
            <ThemedText style={styles.infoValue}>
              {registration.unit}
            </ThemedText>

            <ThemedText style={styles.infoLabel}>Restaurante:</ThemedText>
            <ThemedText style={styles.infoValue}>
              {registration.restaurantName}
            </ThemedText>

            {registration.deviceName && (
              <>
                <ThemedText style={styles.infoLabel}>Aparelho:</ThemedText>
                <ThemedText style={styles.infoValue}>
                  {registration.deviceName}
                </ThemedText>
              </>
            )}

            <ThemedText style={styles.infoLabel}>Serial:</ThemedText>
            <ThemedText style={styles.infoValue}>
              {registration.serialId}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      )}

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Sistema de Comandas</ThemedText>
        <ThemedText>
          Bem-vindo ao RGPAY! Seu sistema de comandas está pronto para uso.
          Gerencie pedidos, produtos e relatórios de forma simples e eficiente.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Funcionalidades</ThemedText>
        <ThemedText>
          • Gerenciamento de produtos e categorias{'\n'}• Criação e
          acompanhamento de pedidos{'\n'}• Relatórios de vendas e faturamento
          {'\n'}• Configurações personalizadas
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Próximos Passos</ThemedText>
        <ThemedText>
          Navegue pelas abas abaixo para começar a usar o sistema. Configure
          seus produtos e comece a criar comandas!
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoContainer: {
    gap: 8,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    gap: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 16,
    marginBottom: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

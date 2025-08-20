import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/lib/AuthContext';

export default function RegistroScreen() {
  const { registration, verifyDevice } = useAuth();
  const [unit, setUnit] = useState(registration?.unit || '');
  const [restaurantName, setRestaurantName] = useState(
    registration?.restaurantName || ''
  );
  const [deviceName, setDeviceName] = useState(registration?.deviceName || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmar = async () => {
    if (!unit.trim() || !restaurantName.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setIsLoading(true);
      await verifyDevice({
        unit: unit.trim(),
        restaurantName: restaurantName.trim(),
        deviceName: deviceName.trim() || undefined,
      });
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error verifying device:', error);
      Alert.alert(
        'Erro de Conexão',
        'Não foi possível verificar o dispositivo. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Configurar Dispositivo
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Configure as informações do seu estabelecimento
          </ThemedText>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Unidade *</ThemedText>
            <TextInput
              style={styles.input}
              value={unit}
              onChangeText={setUnit}
              placeholder="Ex: Unidade Centro"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Nome do Restaurante *</ThemedText>
            <TextInput
              style={styles.input}
              value={restaurantName}
              onChangeText={setRestaurantName}
              placeholder="Ex: Restaurante RGPAY"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              Nome do Aparelho (Opcional)
            </ThemedText>
            <TextInput
              style={styles.input}
              value={deviceName}
              onChangeText={setDeviceName}
              placeholder="Ex: Caixa 1"
              placeholderTextColor="#999"
            />
          </View>

          {registration && (
            <View style={styles.infoContainer}>
              <ThemedText style={styles.infoLabel}>
                Serial do Dispositivo:
              </ThemedText>
              <ThemedText style={styles.infoValue}>
                {registration.serialId}
              </ThemedText>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleConfirmar}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? 'Verificando...' : 'Confirmar'}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  infoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'monospace',
    backgroundColor: '#e9ecef',
    padding: 8,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

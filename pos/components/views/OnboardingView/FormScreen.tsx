import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ErrorMessage } from './ErrorMessage';
import { DeviceMetadata } from '@/lib/devices/schemas';
import { FormFields } from './FormFields';
import { SubmitButton } from './SubmitButton';

interface FormScreenProps {
  onBack: () => void;
  onSubmit: () => Promise<void>;
  deviceMetadata: DeviceMetadata | null;
  error: string | null;
}

export const FormScreen: React.FC<FormScreenProps> = ({
  onBack,
  onSubmit,
  deviceMetadata,
  error,
}) => {
  const [formData, setFormData] = useState({
    locationId: '',
    locationName: '',
    locationType: '',
    deviceName: deviceMetadata?.deviceName || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (
      !formData.locationId.trim() ||
      !formData.locationName.trim() ||
      !formData.locationType.trim()
    ) {
      return; // Form validation will handle this
    }

    try {
      setIsSubmitting(true);
      await onSubmit();
    } catch (error) {
      // Error is handled by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.locationId.trim() &&
    formData.locationName.trim() &&
    formData.locationType.trim();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>← Voltar</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <ThemedText style={styles.title}>Registrar Dispositivo</ThemedText>

          {/* Device Information Section */}
          <View style={styles.deviceSection}>
            <ThemedText style={styles.sectionTitle}>
              Informações do Dispositivo
            </ThemedText>

            {deviceMetadata ? (
              <View style={styles.deviceInfo}>
                <View style={styles.deviceInfoRow}>
                  <ThemedText style={styles.deviceLabel}>Serial:</ThemedText>
                  <ThemedText style={styles.deviceValue}>
                    {deviceMetadata.serialId}
                  </ThemedText>
                </View>
                <View style={styles.deviceInfoRow}>
                  <ThemedText style={styles.deviceLabel}>Sistema:</ThemedText>
                  <ThemedText style={styles.deviceValue}>
                    {deviceMetadata.operationalSystem}
                  </ThemedText>
                </View>
                <View style={styles.deviceInfoRow}>
                  <ThemedText style={styles.deviceLabel}>Provedor:</ThemedText>
                  <ThemedText style={styles.deviceValue}>
                    {deviceMetadata.provider || 'N/A'}
                  </ThemedText>
                </View>
              </View>
            ) : (
              <View style={styles.noDeviceInfo}>
                <ThemedText style={styles.noDeviceText}>
                  Não foi possível obter as informações do dispositivo
                  automaticamente. Por favor, preencha o formulário abaixo.
                </ThemedText>
              </View>
            )}
          </View>

          {/* Error Message */}
          {error && <ErrorMessage message={error} />}

          {/* Form Section */}
          <View style={styles.formSection}>
            <ThemedText style={styles.sectionTitle}>
              Informações da Localização
            </ThemedText>
            <FormFields formData={formData} setFormData={setFormData} />
          </View>

          <SubmitButton
            onPress={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            isLoading={isSubmitting}
            title="Registrar Dispositivo"
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: 16,
    color: '#0a7ea4',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  deviceSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  deviceInfo: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  deviceInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  deviceLabel: {
    fontWeight: '500',
    color: '#666',
  },
  deviceValue: {
    fontWeight: '600',
  },
  noDeviceInfo: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  noDeviceText: {
    color: '#856404',
    fontSize: 14,
    lineHeight: 20,
  },
  formSection: {
    marginBottom: 32,
  },
});

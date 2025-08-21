import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface FormHeaderProps {
  hasRegistration: boolean;
  onRestoreDefaults: () => void;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ hasRegistration, onRestoreDefaults }) => {
  if (hasRegistration) {
    return (
      <>
        <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
          Dados do dispositivo encontrados! 🎉
        </ThemedText>
        <ThemedText style={{ fontSize: 14, marginBottom: 20, textAlign: 'center', color: '#666' }}>
          Encontramos informações do seu dispositivo. Você pode editar os dados abaixo ou manter os valores originais.
        </ThemedText>
        <TouchableOpacity
          onPress={onRestoreDefaults}
          style={{ backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8, marginBottom: 20, alignItems: 'center' }}
        >
          <ThemedText style={{ color: '#0a7ea4', fontSize: 14 }}>Restaurar dados originais</ThemedText>
        </TouchableOpacity>
      </>
    );
  }

  return (
    <>
      <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
        Configurar dispositivo
      </ThemedText>
      <ThemedText style={{ fontSize: 14, marginBottom: 20, textAlign: 'center', color: '#666' }}>
        Não foi possível recuperar automaticamente os dados do dispositivo. Por favor, preencha as informações abaixo.
      </ThemedText>
    </>
  );
};


import React from 'react';
import { View, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface FormFieldsProps {
  formData: {
    locationId: string;
    locationName: string;
    locationType: string;
    deviceName: string;
  };
  setFormData: (data: any) => void;
}

const inputStyle = {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  padding: 12,
  fontSize: 16,
  backgroundColor: '#fff',
};

export const FormFields: React.FC<FormFieldsProps> = ({ formData, setFormData }) => (
  <>
    <View style={{ marginBottom: 16 }}>
      <ThemedText style={{ fontSize: 16, marginBottom: 8, fontWeight: '500' }}>ID da Localização *</ThemedText>
      <TextInput
        style={inputStyle}
        value={formData.locationId}
        onChangeText={text => setFormData({ ...formData, locationId: text })}
        placeholder="Ex: 1234567890"
        placeholderTextColor="#999"
      />
    </View>

    <View style={{ marginBottom: 16 }}>
      <ThemedText style={{ fontSize: 16, marginBottom: 8, fontWeight: '500' }}>Nome da Localização *</ThemedText>
      <TextInput
        style={inputStyle}
        value={formData.locationName}
        onChangeText={text => setFormData({ ...formData, locationName: text })}
        placeholder="Ex: Restaurante Exemplo"
        placeholderTextColor="#999"
      />
    </View>

    <View style={{ marginBottom: 16 }}>
      <ThemedText style={{ fontSize: 16, marginBottom: 8, fontWeight: '500' }}>Tipo da Localização *</ThemedText>
      <TextInput
        style={inputStyle}
        value={formData.locationType}
        onChangeText={text => setFormData({ ...formData, locationType: text })}
        placeholder="Ex: restaurant"
        placeholderTextColor="#999"
      />
    </View>

    <View style={{ marginBottom: 24 }}>
      <ThemedText style={{ fontSize: 16, marginBottom: 8, fontWeight: '500' }}>Nome do Dispositivo (opcional)</ThemedText>
      <TextInput
        style={inputStyle}
        value={formData.deviceName}
        onChangeText={text => setFormData({ ...formData, deviceName: text })}
        placeholder="Ex: Caixa Principal"
        placeholderTextColor="#999"
      />
    </View>
  </>
);


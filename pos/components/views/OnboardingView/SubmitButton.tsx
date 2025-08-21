import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface SubmitButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  title?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  onPress,
  disabled = false,
  isLoading = false,
  title = 'Confirmar',
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled || isLoading}
    style={[styles.button, (disabled || isLoading) && styles.buttonDisabled]}
  >
    {isLoading ? (
      <ActivityIndicator color="#fff" size="small" />
    ) : (
      <ThemedText style={styles.buttonText}>{title}</ThemedText>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0a7ea4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

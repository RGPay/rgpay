import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Carregando...',
}) => (
  <ThemedView style={styles.container}>
    <ActivityIndicator size="large" color="#0a7ea4" style={styles.spinner} />
    <ThemedText style={styles.message}>{message}</ThemedText>
  </ThemedView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});

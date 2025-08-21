import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <ThemedView
    style={{
      marginTop: 16,
      padding: 12,
      backgroundColor: '#ffebee',
      borderRadius: 8,
    }}
  >
    <ThemedText style={{ color: '#c62828', fontSize: 14, textAlign: 'center' }}>
      {message}
    </ThemedText>
  </ThemedView>
);


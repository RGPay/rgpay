import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/lib/AuthContext';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

export const OnboardingWrapper: React.FC<OnboardingWrapperProps> = ({
  children,
}) => {
  const { isRegistered, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isRegistered) {
        // If not registered, go to onboarding
        router.replace('/onboarding');
      } else {
        // If registered, go to main app
        router.replace('/(tabs)');
      }
    }
  }, [isRegistered, isLoading]);

  // Show loading screen while checking registration status
  if (isLoading) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color="#0a7ea4" />
        <ThemedText style={{ marginTop: 16, fontSize: 16 }}>
          Carregando...
        </ThemedText>
      </ThemedView>
    );
  }

  return <>{children}</>;
};

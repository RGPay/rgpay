import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { LoadingScreen } from './LoadingScreen';
import { FormScreen } from './FormScreen';
import { WelcomeScreen } from './WelcomeScreen';
import { useAuth } from '@/lib/hooks';

type OnboardingState = 'welcome' | 'loading' | 'form' | 'registering';

export const OnboardingView: React.FC = () => {
  const {
    deviceMetadata,
    isRegistered,
    isLoading,
    error,
    fetchDeviceInfo,
    assignDevice,
    clearError,
  } = useAuth();

  const [currentState, setCurrentState] = useState<OnboardingState>('welcome');

  useEffect(() => {
    if (isRegistered) {
      // If already registered, don't show onboarding
      return;
    }

    if (isLoading) {
      setCurrentState('loading');
    } else if (deviceMetadata && currentState !== 'registering') {
      setCurrentState('form');
    } else if (!isLoading && currentState === 'loading') {
      // If finished loading and no device metadata, stay in form but show error
      setCurrentState('form');
    }
  }, [isLoading, deviceMetadata, isRegistered, currentState]);

  const handleStartRegistration = async () => {
    try {
      setCurrentState('loading');
      await fetchDeviceInfo();
      // State will be updated by useEffect
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      Alert.alert('Erro', errorMessage);
      setCurrentState('form'); // Show form even if device fetch failed
    }
  };

  const handleFormSubmit = async () => {
    try {
      setCurrentState('registering');
      await assignDevice();
      // Device is now registered, component will unmount or redirect
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      Alert.alert('Erro', errorMessage);
      setCurrentState('form');
    }
  };

  const handleBackToWelcome = () => {
    clearError();
    setCurrentState('welcome');
  };

  // Render appropriate screen based on current state
  if (currentState === 'loading') {
    return <LoadingScreen message="Buscando informações do dispositivo..." />;
  }

  if (currentState === 'registering') {
    return <LoadingScreen message="Registrando dispositivo..." />;
  }

  if (currentState === 'form') {
    return (
      <FormScreen
        onBack={handleBackToWelcome}
        onSubmit={handleFormSubmit}
        deviceMetadata={deviceMetadata}
        error={error}
      />
    );
  }

  return <WelcomeScreen onStart={handleStartRegistration} />;
};

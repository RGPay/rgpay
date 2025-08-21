import { useAuth } from '@/lib/hooks';
import React from 'react';
import { HomeView } from './views/HomeView';
import { OnboardingView } from './views/OnboardingView';

interface OnboardingWrapperProps {
  children: React.ReactNode;
}

export const OnboardingWrapper: React.FC<OnboardingWrapperProps> = ({
  children,
}) => {
  const { isRegistered, isLoading, error, clearError } = useAuth();

  // If user is registered, show the main app
  if (isRegistered) {
    return <HomeView />;
  }

  // If not registered, show onboarding flow
  return <OnboardingView />;
};

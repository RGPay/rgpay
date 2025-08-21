import { useAuthStore } from '~/lib/stores';

export const useAuth = () => {
  const {
    deviceMetadata,
    isRegistered,
    isLoading,
    error,
    fetchDeviceInfo,
    assignDevice,
    login,
    logout,
    clearError,
  } = useAuthStore();

  return {
    // State
    deviceMetadata,
    isRegistered,
    isLoading,
    error,
    // Actions
    fetchDeviceInfo,
    assignDevice,
    login,
    logout,
    clearError,
  };
};

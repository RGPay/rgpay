import React, { createContext, useContext, useEffect, useState } from 'react';
import { DeviceRegistration } from '../api/device';
import { AuthService } from './auth';
import { deviceService } from './maquineta';
import { authLog } from './logger';

interface AuthContextType {
  isRegistered: boolean;
  registration: DeviceRegistration | null;
  isLoading: boolean;
  registerDevice: () => Promise<void>;
  verifyDevice: (data: {
    unit: string;
    restaurantName: string;
    deviceName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [registration, setRegistration] = useState<DeviceRegistration | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkRegistrationStatus();
  }, []);

  const checkRegistrationStatus = async () => {
    try {
      authLog.info('Checking registration status...');
      const storedRegistration = await AuthService.getStoredRegistration();
      if (storedRegistration?.verified) {
        setRegistration(storedRegistration);
        setIsRegistered(true);
        authLog.info('Device is registered and verified');
      } else {
        authLog.info('Device is not registered or not verified');
      }
    } catch (error) {
      authLog.error('Error checking registration status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const registerDevice = async () => {
    try {
      authLog.info('Starting device registration...');
      setIsLoading(true);
      const newRegistration = await deviceService.registerDevice();
      setRegistration(newRegistration);
      await AuthService.saveRegistration(newRegistration);
      authLog.info('Device registered successfully:', {
        serialId: newRegistration.serialId,
      });
    } catch (error) {
      authLog.error('Error registering device:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyDevice = async (data: {
    unit: string;
    restaurantName: string;
    deviceName?: string;
  }) => {
    if (!registration) {
      authLog.error('No registration found for verification');
      throw new Error('No registration found');
    }

    try {
      authLog.info('Verifying device with data:', data);
      setIsLoading(true);
      const updatedRegistration = await deviceService.verifyDevice(
        registration.serialId,
        registration.id,
        {
          verified: true,
          unit: data.unit,
          restaurantName: data.restaurantName,
          deviceName: data.deviceName,
        }
      );

      setRegistration(updatedRegistration);
      setIsRegistered(true);
      await AuthService.saveRegistration(updatedRegistration);
      authLog.info('Device verified successfully');
    } catch (error) {
      authLog.error('Error verifying device:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      authLog.info('Logging out user...');
      await AuthService.clearRegistration();
      setRegistration(null);
      setIsRegistered(false);
      authLog.info('User logged out successfully');
    } catch (error) {
      authLog.error('Error logging out:', error);
    }
  };

  const value: AuthContextType = {
    isRegistered,
    registration,
    isLoading,
    registerDevice,
    verifyDevice,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

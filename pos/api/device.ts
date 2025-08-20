// Mock API service for device registration
import { DeviceAuth } from '@/lib/auth/schema';
import { apiLog } from '../lib/logger';

// Mock delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simple array to store devices with real emulator data
const devices: DeviceAuth[] = [
  {
    id: 'EMULATOR36X1X9X0-1703123456789',
    locationId: 'default_location',
    deviceMetadata: {
      serialId: 'EMULATOR36X1X9X0',
      deviceName: 'sdk_gphone64_arm64',
      operationalSystem: 'android',
      provider: 'Cielo',
    },
    verified: false,
    active: true,
  },
];

export const deviceAPI = {
  // POST /device/{serialId}/registrations
  async registerDevice(serialId: string): Promise<DeviceAuth> {
    apiLog.info('Registering device:', { serialId });
    await delay(2000); // Simulate network delay

    // Simulate random error (10% chance)
    if (Math.random() < 0.1) {
      apiLog.error('Random error occurred during registration');
      throw new Error('Erro de conexão. Tente novamente.');
    }

    const device = devices.find(d => d.deviceMetadata.serialId === serialId);

    if (!device) {
      apiLog.error('Device not found:', { serialId });
      throw new Error('Dispositivo não encontrado');
    }

    if (device.verified) {
      apiLog.warn('Device already registered:', { serialId });
      return device;
    }

    return device;
  },

  // PATCH /device/{serialId}/registrations/{id}
  async verifyDevice(
    serialId: string,
    registrationId: string
  ): Promise<DeviceAuth> {
    apiLog.info('Verifying device:', { serialId, registrationId });
    await delay(1500); // Simulate network delay

    // Find device by ID
    const deviceIndex = devices.findIndex(d => d.id === registrationId);
    if (deviceIndex === -1) {
      apiLog.error('Device not found:', { registrationId });
      throw new Error('Dispositivo não encontrado');
    }

    const device = devices[deviceIndex];

    // Verify serial ID matches
    if (device.deviceMetadata.serialId !== serialId) {
      apiLog.error('Serial ID mismatch:', {
        expected: serialId,
        actual: device.deviceMetadata.serialId,
      });
      throw new Error('Serial ID não corresponde');
    }

    // Update device
    const updatedDevice: DeviceAuth = { ...device, verified: true };
    devices[deviceIndex] = updatedDevice;

    apiLog.info('Device verified successfully');
    return updatedDevice;
  },

  // GET /device/{serialId}/registrations
  async findRegistration(serialId: string): Promise<DeviceAuth | null> {
    apiLog.info('Finding registration:', { serialId });
    await delay(1000); // Simulate network delay

    const device = devices.find(d => d.deviceMetadata.serialId === serialId);
    if (device) {
      apiLog.info('Device found:', { registrationId: device.id });
      return device;
    } else {
      apiLog.info('No device found for serialId:', { serialId });
      return null;
    }
  },
};

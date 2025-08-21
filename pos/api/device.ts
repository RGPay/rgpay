// Mock API service for device registration
import { DeviceMetadata } from '~/lib/devices/schemas';
import {
  DeviceAlreadyAssignedError,
  DeviceAlreadyRevokedError,
  DeviceNotAssignedError,
  DeviceNotFoundError,
} from '~/lib/errors';
import { logger } from '~/lib/logger';

// Mock delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const devices: DeviceMetadata[] = [
  {
    serialId: 'EMULATOR36X1X9X0',
    deviceName: 'sdk_gphone64_arm64',
    operationalSystem: 'android',
    provider: 'Cielo',
    assigned: false,
    revoked: false,
    revokedAt: undefined,
  },
];

export const deviceAPI = {
  // GET /device/{serialId}
  async getDevice(serialId: string): Promise<DeviceMetadata> {
    logger.info('Registering device:', { serialId });
    await delay(2000); // Simulate network delay

    // // Simulate random error (10% chance)
    // if (Math.random() < 0.1) {
    //   logger.error('Random error occurred during registration');
    //   throw new Error('Erro de conexão. Tente novamente.');
    // }

    const device = devices.find(d => d.serialId === serialId);

    if (!device) {
      logger.error('Device not found:', { serialId });
      throw new DeviceNotFoundError('Dispositivo não encontrado');
    }

    return device;
  },

  // PUT /device/{serialId}/assignments
  async assignDevice(serialId: string): Promise<DeviceMetadata> {
    logger.info('Verifying device:', { serialId });
    await delay(1500); // Simulate network delay

    // Find device by ID
    const deviceIndex = devices.findIndex(d => d.serialId === serialId);
    if (deviceIndex === -1) {
      logger.error('Device not found:', { serialId });
      throw new DeviceNotFoundError('Dispositivo não encontrado');
    }

    const device = devices[deviceIndex];

    /**
     * @todo Implement an UI to logout the device and then reassign it
     * like we have in Banks where we can have just one main device logged in at a time
     */
    if (device.assigned) {
      logger.error('Device is already assigned:', { serialId });
      throw new DeviceAlreadyAssignedError('Dispositivo já está ativo');
    }

    if (device.revoked) {
      logger.error('Device is revoked:', { serialId });
      throw new DeviceAlreadyRevokedError('Dispositivo não está mais ativo');
    }

    // Update device
    const updatedDevice: DeviceMetadata = { ...device, assigned: true };
    devices[deviceIndex] = updatedDevice;

    logger.info('Device verified successfully');
    return updatedDevice;
  },

  // POST login
  async login(serialId: string): Promise<string> {
    logger.info('Logging in:', { serialId });
    await delay(1000); // Simulate network delay

    const device = devices.find(d => d.serialId === serialId);
    if (!device) {
      logger.error('Device not found:', { serialId });
      throw new DeviceNotFoundError('Dispositivo não encontrado');
    }

    if (!device.assigned) {
      logger.error('Device is not assigned:', { serialId });
      throw new DeviceNotAssignedError('Dispositivo não está registrado');
    }

    if (device.revoked) {
      logger.error('Device is revoked:', { serialId });
      throw new DeviceAlreadyRevokedError('Dispositivo não está mais ativo');
    }

    logger.info('Device logged in successfully');
    return `jwt_${JSON.stringify(device)}`;
  },
};

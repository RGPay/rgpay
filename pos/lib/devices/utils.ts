import { getUniqueId, getSystemName } from 'react-native-device-info';
import { deviceLog } from '../logger';

export async function getDeviceId(): Promise<string | null> {
  try {
    const deviceId = await getUniqueId();
    return deviceId;
  } catch (error: unknown) {
    deviceLog.error('Error getting device id:', error);
    return null;
  }
}

export async function getDeviceOs(): Promise<string | null> {
  try {
    const os = await getSystemName();
    return os;
  } catch (error: unknown) {
    deviceLog.error('Error getting device os:', error);
    return null;
  }
}

/**
 * @description Get the provider of the device.
 * @returns The provider of the device.
 * @example "Cielo", "PagBank", "Ton"
 * @todo Discover the provider of the device.
 */
export async function getDeviceProvider(): Promise<string | null> {
  try {
    const provider = 'Cielo';
    return provider;
  } catch (error: unknown) {
    deviceLog.error('Error getting device provider:', error);
    return null;
  }
}

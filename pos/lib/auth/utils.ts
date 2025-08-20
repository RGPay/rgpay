import { AUTH_STORAGE_KEY } from '@/lib/auth/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authLog } from '../logger';
import { DeviceAuth, DeviceAuthSchema } from '@/lib/auth/schema';
import { validateZodSchema } from '@/lib/validation';

/**
 * @description Get the stored registration from the AsyncStorage.
 * @returns The stored registration.
 * @throws {Error} If the registration is not valid.
 */
export async function getStoredRegistration(): Promise<DeviceAuth> {
  const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  const registration = validateZodSchema({
    schema: DeviceAuthSchema,
    data: stored,
    jsonParse: true,
  });

  if (!registration) {
    authLog.debug('No stored registration found');
    throw new Error('No stored registration found');
  }

  return registration;
}

/**
 * @description Get the stored registration from the AsyncStorage.
 * @returns The stored registration or null if the registration is not valid.
 */
export async function safeGetStoredRegistration(): Promise<DeviceAuth | null> {
  try {
    return await getStoredRegistration();
  } catch (error) {
    authLog.error('Error getting stored registration', { error });
    return null;
  }
}

/**
 *
 * @throws {Error} If the registration is not valid.
 */
export async function saveRegistration(
  registration: DeviceAuth
): Promise<void> {
  const validated = validateZodSchema({
    schema: DeviceAuthSchema,
    data: registration,
    throwOnError: true,
  });

  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(validated));
}

/**
 * @description Clear the stored registration from the AsyncStorage.
 */
export async function clearRegistration(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
}

/**
 * @description Check if the device is registered.
 * @returns True if the device is registered, false otherwise.
 */
export async function isRegistered(): Promise<boolean> {
  const registration = await getStoredRegistration();
  return registration !== null;
}

/**
 * @description Check if the device is verified.
 * @returns True if the device is verified, false otherwise.
 */
export async function isVerified(): Promise<boolean> {
  const registration = await getStoredRegistration();
  return registration?.verified ?? false;
}

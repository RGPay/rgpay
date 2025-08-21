import { AuthState, AuthStateFactory } from '~/lib/stores/auth.state';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { deviceAPI } from '../../api/device';
import { getDeviceId } from '../devices/utils';
import { LOCAL_STORAGE_DEVICE_METADATA_KEY } from '~/lib/stores/constants';
import { validateZodSchema } from '~/lib/validation';
import { DeviceMetadata, DeviceMetadataSchema } from '~/lib/devices';

interface AuthActions {
  // Device discovery flow
  fetchDeviceInfo: () => Promise<void>;

  // Registration flow
  assignDevice: () => Promise<void>;

  // Login flow
  login: () => Promise<void>;

  // Utility actions
  logout: () => Promise<void>;
  clearError: () => void;
}

type AuthStore = AuthState & AuthActions;

async function getDeviceMetadataFromStorage({
  asyncStorage,
}: {
  asyncStorage: typeof AsyncStorage;
}): Promise<DeviceMetadata | null> {
  const deviceMetadataInStorage = await asyncStorage.getItem(
    LOCAL_STORAGE_DEVICE_METADATA_KEY
  );
  return validateZodSchema({
    data: JSON.parse(deviceMetadataInStorage || '{}'),
    schema: DeviceMetadataSchema,
    throwOnError: false,
  });
}

function getDeviceMetadata({
  get,
  asyncStorage,
}: {
  get: () => AuthStore;
  asyncStorage: typeof AsyncStorage;
}): Promise<DeviceMetadata | null> {
  const deviceMetadataInState = get().deviceMetadata;

  if (deviceMetadataInState) {
    return Promise.resolve(deviceMetadataInState);
  }

  return getDeviceMetadataFromStorage({ asyncStorage });
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state - sempre começa limpo na tela de onboarding
  deviceMetadata: null,
  isRegistered: false,
  isLoading: false,
  error: null,

  // Device discovery flow
  fetchDeviceInfo: async () => {
    try {
      const state = AuthStateFactory.start().addIsLoading(true).build();
      set(state);

      // Get device metadata from state or storage
      const device = await getDeviceMetadata({
        get,
        asyncStorage: AsyncStorage,
      });

      if (device) {
        const state = AuthStateFactory.start()
          .addDeviceMetadata(device)
          .build();
        set(state);
        return;
      }

      const deviceId = await getDeviceId();

      if (!deviceId) {
        const state = AuthStateFactory.start()
          .addError('Número de série do dispositivo não encontrado')
          .build();
        set(state);
        return;
      }

      const deviceMetadata = await deviceAPI.getDevice(deviceId);

      if (!deviceMetadata) {
        const state = AuthStateFactory.start()
          .addError('Dispositivo não registrado')
          .build();
        set(state);
        return;
      }

      AsyncStorage.setItem(
        LOCAL_STORAGE_DEVICE_METADATA_KEY,
        JSON.stringify(deviceMetadata)
      );

      const successState = AuthStateFactory.start()
        .addDeviceMetadata(deviceMetadata)
        .build();

      set(successState);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      const errorState = AuthStateFactory.start()
        .addError(errorMessage)
        .build();
      set(errorState);
      throw error;
    }
  },

  // Registration flow
  assignDevice: async () => {
    try {
      const state = AuthStateFactory.start().addIsLoading(true).build();
      set(state);

      const deviceMetadata = await getDeviceMetadata({
        get,
        asyncStorage: AsyncStorage,
      });

      if (!deviceMetadata) {
        const state = AuthStateFactory.start()
          .addError('Dispositivo não encontrado')
          .build();
        set(state);
        return;
      }

      const updatedDeviceMetadata = await deviceAPI.assignDevice(
        deviceMetadata.serialId
      );

      // After successful assignment, automatically login
      await deviceAPI.login(deviceMetadata.serialId);

      const successState = AuthStateFactory.start()
        .addDeviceMetadata(updatedDeviceMetadata)
        .addIsRegistered(true)
        .build();

      set(successState);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      const errorState = AuthStateFactory.start()
        .addError(errorMessage)
        .build();
      set(errorState);
      throw error;
    }
  },

  // Login flow
  login: async () => {
    try {
      const state = AuthStateFactory.start().addIsLoading(true).build();
      set(state);

      const deviceMetadata = await getDeviceMetadata({
        get,
        asyncStorage: AsyncStorage,
      });

      if (!deviceMetadata) {
        const state = AuthStateFactory.start()
          .addError('Dispositivo não encontrado')
          .build();
        set(state);
        return;
      }

      await deviceAPI.login(deviceMetadata.serialId);

      const successState = AuthStateFactory.start()
        .addDeviceMetadata(deviceMetadata)
        .addIsRegistered(true)
        .build();

      set(successState);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      const errorState = AuthStateFactory.start()
        .addError(errorMessage)
        .build();
      set(errorState);
      throw error;
    }
  },

  // Device logout
  logout: async () => {
    AsyncStorage.removeItem(LOCAL_STORAGE_DEVICE_METADATA_KEY);
    set(AuthStateFactory.start().build());
  },

  // Clear error
  clearError: () => {
    set(AuthStateFactory.start().build());
  },
}));

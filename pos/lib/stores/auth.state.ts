import { z } from 'zod';
import { DeviceMetadata, DeviceMetadataSchema } from '../devices/schemas';

export const authStateSchema = z.object({
  deviceMetadata: DeviceMetadataSchema.nullable().default(null),
  isRegistered: z.boolean().default(false),
  isLoading: z.boolean().default(false),
  error: z.string().nullable().default(null),
});

export type AuthState = z.infer<typeof authStateSchema>;

export class AuthStateFactory {
  static create(data: Partial<AuthState>): AuthState {
    return authStateSchema.parse(data);
  }

  static start(partialState: Partial<AuthState> = {}): AuthStateFactory {
    return new AuthStateFactory(partialState);
  }

  constructor(private readonly state: Partial<AuthState> = {}) {}

  addDeviceMetadata(deviceMetadata: DeviceMetadata): AuthStateFactory {
    this.state.deviceMetadata = deviceMetadata;
    return this;
  }

  addIsRegistered(isRegistered: boolean): AuthStateFactory {
    this.state.isRegistered = isRegistered;
    return this;
  }

  addIsLoading(isLoading: boolean): AuthStateFactory {
    this.state.isLoading = isLoading;
    return this;
  }

  addError(error: string): AuthStateFactory {
    this.state.error = error;
    return this;
  }

  build(): AuthState {
    return authStateSchema.parse(this.state);
  }
}

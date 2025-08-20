import { DeviceMetadataSchema } from '@/lib/devices/schemas';
import { z } from 'zod';

// Base schema without ID (for creation)
export const BaseDeviceAuthSchema = z.object({
  locationId: z.string().min(1, 'Location ID is required'),
  deviceMetadata: DeviceMetadataSchema,
});

// Complete schema with ID (for database operations)
export const DeviceAuthSchema = BaseDeviceAuthSchema.extend({
  id: z.string().min(1, 'Device ID is required'),
  verified: z.boolean().default(false),
  active: z.boolean().default(true),
});

// TypeScript types
export type BaseDeviceAuth = z.infer<typeof BaseDeviceAuthSchema>;
export type DeviceAuth = z.infer<typeof DeviceAuthSchema>;

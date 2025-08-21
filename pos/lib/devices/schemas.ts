import { z } from 'zod';

// Zod schema for DeviceMetadata
export const DeviceMetadataSchema = z.object({
  serialId: z.string().min(1, 'Serial ID is required'),
  deviceName: z.string().optional(),
  operationalSystem: z.string().min(1, 'Operational system is required'),
  /**
   * @description The provider of the device.
   * @example "Cielo", "PagBank", "Ton"
   */
  provider: z.string().optional(),
  assigned: z.boolean().default(false),
  revoked: z.boolean().default(false),
  revokedAt: z.date().optional(),
});

// TypeScript type inferred from Zod schema
export type DeviceMetadata = z.infer<typeof DeviceMetadataSchema>;

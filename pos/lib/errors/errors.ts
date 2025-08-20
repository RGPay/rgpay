import { RgPayErrorFactory } from '@/lib/errors/utils';

// Device errors
export const DeviceNotFoundError = RgPayErrorFactory.create(
  'DeviceNotFoundError'
);
export const DeviceNotRegisteredError = RgPayErrorFactory.create(
  'DeviceNotRegisteredError'
);
export const DeviceNotVerifiedError = RgPayErrorFactory.create(
  'DeviceNotVerifiedError'
);
export const DeviceNotActiveError = RgPayErrorFactory.create(
  'DeviceNotActiveError'
);

export const ValidationError = RgPayErrorFactory.create('ValidationError');

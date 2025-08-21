import { RgPayErrorFactory } from '~/lib/errors/utils';

// Device errors
export const DeviceNotFoundError = RgPayErrorFactory.create(
  'DeviceNotFoundError'
);
export const DeviceNotRegisteredError = RgPayErrorFactory.create(
  'DeviceNotRegisteredError'
);
export const DeviceAlreadyAssignedError = RgPayErrorFactory.create(
  'DeviceAlreadyAssignedError'
);
export const DeviceAlreadyRevokedError = RgPayErrorFactory.create(
  'DeviceAlreadyRevokedError'
);
export const DeviceNotAssignedError = RgPayErrorFactory.create(
  'DeviceNotAssignedError'
);

export const ValidationError = RgPayErrorFactory.create('ValidationError');

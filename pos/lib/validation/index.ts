import logger from '@/lib/logger';
import { z } from 'zod';

interface ValidateZodSchemaArgs<T> {
  schema: z.ZodSchema<T>;
  data: unknown;
  throwOnError?: boolean;
  jsonParse?: boolean;
}

interface ValidateZodSchemaArgsThrow<T> {
  schema: z.ZodSchema<T>;
  data: unknown;
  throwOnError: true;
  jsonParse?: boolean;
}

/**
 * Safe JSON parse
 * @param data - The data to parse
 * @returns The parsed data or the original data if it is not a string
 */
function safeJsonParse<T>(data: unknown): T | null {
  if (typeof data !== 'string') {
    logger.warn('Data is not a string', { data });
    return null;
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    logger.error('Error parsing JSON', { error });
    return null;
  }
}

// Function overloads
export function validateZodSchema<T>(args: ValidateZodSchemaArgsThrow<T>): T;
export function validateZodSchema<T>(args: ValidateZodSchemaArgs<T>): T | null;
export function validateZodSchema<T>(
  args: ValidateZodSchemaArgs<T> | ValidateZodSchemaArgsThrow<T>
): T | null {
  const { schema, throwOnError = false, jsonParse = false } = args;

  const data: unknown = jsonParse ? safeJsonParse<T>(args.data) : args.data;

  const result = schema.safeParse(data);

  if (result.success) {
    return result.data;
  }

  if (throwOnError) {
    throw new Error('Validation failed');
  }

  return null;
}

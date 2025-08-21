import { z } from 'zod';

export function validateZodSchema<T>({
  data,
  schema,
  throwOnError = true,
}: {
  data: unknown;
  schema: z.ZodSchema<T>;
  throwOnError?: boolean;
}): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    if (throwOnError) {
      throw error;
    }
    return null;
  }
}
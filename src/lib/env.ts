import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_API_ORIGIN: z.string().url(),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

export const env = {
  apiBaseUrl: parsed.data.VITE_API_BASE_URL,
  apiOrigin: parsed.data.VITE_API_ORIGIN,
} as const;

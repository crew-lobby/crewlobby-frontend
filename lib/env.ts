import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.url(),
  NEXT_PUBLIC_AUTH_URL: z.url(),
});

// Next.js only inlines `process.env.NEXT_PUBLIC_*` into the client bundle
// when it sees that exact literal reference at build time. Spreading or
// looping over `process.env` here would break that, since the client
// bundle would see an empty object instead of the real values. Each
// variable has to be referenced by its full name, explicitly.
export const env = envSchema.parse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
});
import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
  plugins: [
    organizationClient({
      schema: {
        organization: {
          additionalFields: {
            addressLine1: { type: "string", required: true },
            addressLine2: { type: "string", required: false },
            city: { type: "string", required: true },
            state: { type: "string", required: true },
            country: { type: "string", required: true },
            zip: { type: "string", required: true },
            employeeCount: { type: "number", required: true },
            sector: { type: "string", required: true },
          },
        },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
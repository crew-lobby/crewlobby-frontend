import axios from "axios";

import { env } from "@/lib/env";

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // essencial: envia o cookie de sessão do Better Auth nas requisições
  headers: {
    "Content-Type": "application/json",
  },
});
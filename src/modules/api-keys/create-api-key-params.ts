import { ApiKey } from "./api-key";
export type CreateApiKeyParams = Omit<ApiKey, "uid" | "createdAt" | "updatedAt" | "apiKey">;
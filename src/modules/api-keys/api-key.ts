export interface ApiKey {
  uid: string;
  name: string;
  apiKey: string;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
  appId?: string;
  balance: {
    [key: string]: number;
  }
}
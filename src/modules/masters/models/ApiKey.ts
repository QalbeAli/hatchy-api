export class ApiKey {
  id!: string;
  createdAt = new Date();
  updatedAt = new Date();
  apiKey!: string;
  name!: string;
  service!: string;
  eggsLimit!: number;
  tokenLimit!: number;
  mastersItemsLimit!: number;
}
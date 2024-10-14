import { wrap } from "@mikro-orm/core";
import { DI } from "..";

export class ApiKeysService {
  async getApiKeyById(id: string) {
    const apiKey = await DI.apiKeys.findOne({
      id
    });
    return apiKey;
  }

  async updateApiKey(id: string, data: any) {
    console.log(data);
    const apiKey = await DI.apiKeys.findOne({
      id
    });
    wrap(apiKey).assign(data);
    await DI.em.flush();
    return apiKey;
  }
}
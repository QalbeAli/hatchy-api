import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Route,
  Security,
  Tags,
} from "tsoa";
import { ApiKeysService } from "./api-keys-service";
import { CreateApiKeyParams } from "./create-api-key-params";
import { ApiKey } from "./api-key";

@Security("jwt", ["admin"])
@Route("api-keys")
@Tags("ApiKeys")
export class ApiKeysController extends Controller {
  @Get("")
  public async getApiKeys(): Promise<ApiKey[]> {
    const apiKeys = await new ApiKeysService().getApiKeys();
    return apiKeys;
  }

  @Post("")
  public async createApiKey(
    @Body() body: CreateApiKeyParams,
  ): Promise<ApiKey> {
    const asset = await new ApiKeysService().createApiKey(body);
    return asset;
  }

  @Delete("{uid}")
  public async deleteApiKey(uid: string): Promise<void> {
    await new ApiKeysService().deleteAsset(uid);
  }
}
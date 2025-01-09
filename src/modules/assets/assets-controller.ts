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
import { Asset } from "./asset";
import { AssetsService } from "./assets-service";
import { CreateAssetParams } from "./create-asset-params";

@Security("jwt", ["admin"])
@Route("assets")
@Tags("Assets")
export class AssetsController extends Controller {
  @Get("")
  public async getAssets(
  ): Promise<Asset[]> {
    const assets = await new AssetsService().getAssets();
    return assets;
  }

  @Post("")
  public async createAsset(
    @Body() body: CreateAssetParams,
  ): Promise<Asset> {
    const asset = await new AssetsService().createAsset(body);
    return asset;
  }

  @Delete("{uid}")
  public async deleteAsset(
    uid: string,
  ): Promise<void> {
    await new AssetsService().deleteAsset(uid);
  }
}
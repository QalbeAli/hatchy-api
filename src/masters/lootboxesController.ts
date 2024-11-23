import {
  Controller,
  Get,
  Query,
  Route,
  Tags,
} from "tsoa";
import { LootboxesService } from "../services/LootboxesService";
import { DefaultChainId } from "../contracts/networks";
import { MastersLootbox } from "./MastersLootbox";

@Route("masters")
@Tags("Masters")
export class LootboxesController extends Controller {

  @Get("lootbox")
  public async getMastersLootboxes(
    @Query() chainId?: number,
    @Query() gameId?: string,
  ): Promise<MastersLootbox[]> {
    const lootboxesService = new LootboxesService(chainId || DefaultChainId);
    const lootboxes = await lootboxesService.getLootboxes(gameId);
    return (lootboxes as unknown) as MastersLootbox[];
  }
}
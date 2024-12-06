import {
  Controller,
  Get,
  Query,
  Route,
  Tags,
} from "tsoa";
import { DefaultChainId } from "../modules/contracts/networks";
import { MastersService } from "../services/MastersService";
import { MastersTrait } from "./models/MastersTrait";
import { MastersTraitType } from "./models/MastersTraitType";

@Route("masters")
@Tags("Masters")
export class TraitsController extends Controller {
  @Get("traits")
  public async getMastersTraits(
    @Query() chainId?: number,
  ): Promise<MastersTrait[]> {
    const mastersService = new MastersService(chainId || DefaultChainId);
    const traits = await mastersService.getAllTraits();
    return (traits as unknown) as MastersTrait[];
  }

  @Get("traits/types")
  public async getMastersTraitTypes(
    @Query() chainId?: number,
  ): Promise<MastersTraitType[]> {
    const mastersService = new MastersService(chainId || DefaultChainId);
    const traitTypes = await mastersService.getTraitTypes();
    return (traitTypes as unknown) as MastersTraitType[];
  }

}
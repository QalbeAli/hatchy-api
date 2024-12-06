import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Route,
  Tags,
} from "tsoa";
import { DefaultChainId } from "../modules/contracts/networks";
import { MastersService } from "../services/MastersService";
import { MastersColor } from "./models/MastersColor";
import { TraitGender } from "./models/TraitGender";
import { EquipService } from "../services/EquipService";
import { isAddress } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { MastersTrait } from "./models/MastersTrait";
import { MastersTraitType } from "./models/MastersTraitType";
import { MastersMintTrait } from "./models/MastersMintTrait";

@Route("masters")
@Tags("Masters")
export class MastersController extends Controller {
  @Get("colors")
  public async getMastersColors(
    @Query() chainId?: number,
    @Query() typeId?: number,
  ): Promise<MastersColor[]> {
    const mastersService = new MastersService(chainId || DefaultChainId);
    const colors = await mastersService.getColors(Number(typeId));
    return colors;
  }

  @Get("genders")
  public async getMastersGenders(
    @Query() chainId?: number,
  ): Promise<TraitGender[]> {
    const mastersService = new MastersService(chainId || DefaultChainId);
    const genders = await mastersService.getGenders();
    return genders;
  }

  @Post("equip/signature")
  public async getMastersEquipSignature(
    @Body() body: { itemIds: number[], owner: string, tokenId: number },
    @Query() chainId?: number,
  ): Promise<{
    owner: string;
    itemIds: number[];
    tokenId: number;
    nonce: BigNumber;
    signature: string;
  }> {
    const equipService = new EquipService(chainId || DefaultChainId);
    const { itemIds, owner, tokenId } = body;
    if (!isAddress(owner)) {
      this.setStatus(400);
      return // messageResponse(res, 400, 'Invalid address');
    }
    if (!itemIds || tokenId == null || isNaN(tokenId)) {
      this.setStatus(400);
      return // messageResponse(res, 400, 'Invalid itemIds or tokenId');
    }
    const equipSignatureData = await equipService.getEquipItemsSignatureData(owner, itemIds, tokenId);
    return equipSignatureData;
  }

  @Post("mint/traits")
  public async getMintTraits(
    @Query() chainId?: number,
  ): Promise<MastersMintTrait[]> {
    const mastersService = new MastersService(chainId || DefaultChainId);
    const traits = await mastersService.getMintTraits();
    return (traits as unknown) as {
      colors: MastersColor[],
      traits: MastersTrait[],
      type: MastersTraitType,
    }[];
  }
}
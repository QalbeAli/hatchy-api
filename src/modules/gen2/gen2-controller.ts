import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { isAddress } from "ethers/lib/utils";
import { DefaultChainId } from "../contracts/networks";
import { CoingeckoService } from "../../services/CoingeckoService";
import { Gen2Service } from "./gen2-Service";
import { BigNumber, ethers } from "ethers";
import { gen2DiscountMultiplier, gen2MaxPrice, gen2UsdtPrice } from "../../constants";
import { BadRequestError } from "../../errors/bad-request-error";
import { HatchyBalance } from "./hatchy-balance";

@Route("gen2")
@Tags("Gen2")
export class Gen2Controller extends Controller {
  @Post("sale-signature")
  public async getGen2SaleSignature(
    @Body() body: {
      receiver: string;
      eggType: number;
      amount: number;
      referral: string;
    }
  ): Promise<{
    receiver: string;
    eggType: number;
    amount: number;
    referral: string;
    price: string;
    nonce: BigNumber;
    signature: string;
  }> {
    const chainId = DefaultChainId;
    const gen2Service = new Gen2Service(chainId);

    const { eggType, amount, referral, receiver } = body;
    if (!isAddress(receiver) || (referral && !isAddress(referral))) {
      throw new BadRequestError("Invalid address");
    }
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new BadRequestError("Invalid amount");
    }
    if (!Number.isInteger(eggType) || ![0, 1].includes(eggType)) {
      throw new BadRequestError("Invalid egg type");
    }
    const signatureData = await gen2Service.getGen2SaleSignature(eggType, amount, referral || ethers.constants.AddressZero, receiver);
    return signatureData;
  }

  @Get("price")
  public async getGen2SalePrice(
  ): Promise<{
    price: number;
  }> {
    const coingeckoService = new CoingeckoService();
    const livePrice = await coingeckoService.getHatchyPrice();
    const hatchyPriceUsdt = parseFloat(gen2UsdtPrice) / livePrice;
    const hatchyPriceDiscounted = hatchyPriceUsdt * gen2DiscountMultiplier;
    const cappedPrice = Math.min(hatchyPriceDiscounted, gen2MaxPrice);
    const hatchyPrice = cappedPrice.toFixed(0);
    return {
      price: Number(hatchyPrice)
    };
  }

  @Security("jwt")
  @Get("balance")
  public async getGen2Balance(
    @Request() request: any,
  ): Promise<HatchyBalance[]> {
    const chainId = DefaultChainId;
    const gen2Service = new Gen2Service(chainId);
    const balances = await gen2Service.getGen2Balance(request.user.uid);
    return balances;
  }
}
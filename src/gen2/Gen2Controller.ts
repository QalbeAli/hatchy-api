import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  Tags,
} from "tsoa";
import { isAddress } from "ethers/lib/utils";
import { DefaultChainId } from "../contracts/networks";
import { CoingeckoService } from "../services/CoingeckoService";
import { Gen2Service } from "../services/Gen2Service";
import { BigNumber, ethers } from "ethers";

const usdtPrice = '3';
const discountMultiplier = 1;

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
      this.setStatus(400);
      return // messageResponse(res, 400, 'Invalid address');
    }
    if (!Number.isInteger(amount) || amount <= 0) {
      this.setStatus(400);
      return //messageResponse(res, 400, 'Invalid amount');
    }
    if (!Number.isInteger(eggType) || ![0, 1].includes(eggType)) {
      this.setStatus(400);
      return //messageResponse(res, 400, 'Invalid egg type');
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
    const hatchyPriceUsdt = parseFloat(usdtPrice) / livePrice;
    const hatchyPriceDiscounted = hatchyPriceUsdt * discountMultiplier;
    const hatchyPrice = hatchyPriceDiscounted.toFixed(0);
    return {
      price: Number(hatchyPrice)
    };
  }
}
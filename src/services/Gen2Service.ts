import { BigNumber, ethers, logger, Wallet } from "ethers";
import config from "../config";
import { DefaultChainId } from "../modules/contracts/networks";
import { CoingeckoService } from "./CoingeckoService";
import { gen2DiscountMultiplier, gen2MaxPrice, gen2UsdtPrice } from "../constants";

export class Gen2Service {
  chainId: number;
  coingeckoService: CoingeckoService;

  constructor(chainId?: number) {
    this.chainId = chainId || DefaultChainId;
    this.coingeckoService = new CoingeckoService();
  }

  async getGen2SaleSignature(
    eggType: number,
    amount: number,
    referral: string,
    receiver: string
  ) {
    const livePrice = await this.coingeckoService.getHatchyPrice();

    let hatchyPrice = '0';
    const hatchyPriceUsdt = parseFloat(gen2UsdtPrice) / livePrice;
    const hatchyPriceDiscounted = hatchyPriceUsdt * gen2DiscountMultiplier;
    const cappedPrice = Math.min(hatchyPriceDiscounted, gen2MaxPrice);
    hatchyPrice = cappedPrice.toFixed(0);

    const parsedPrice = ethers.utils.parseUnits(hatchyPrice, 18);

    const nonce = BigNumber.from(ethers.utils.randomBytes(32));
    const provider = new ethers.providers.JsonRpcProvider(config.JSON_RPC_URL);
    const signer = new Wallet(config.MASTERS_SIGNER_KEY, provider);
    const hash = ethers.utils.solidityKeccak256(
      ['address', 'uint8', 'uint256', 'address', 'uint256', 'uint'],
      [receiver, eggType, amount, referral, parsedPrice, nonce]);

    const signature = await signer.signMessage(ethers.utils.arrayify(hash));
    return {
      receiver,
      eggType,
      amount,
      referral,
      price: parsedPrice.toString(),
      nonce,
      signature
    }
  }
}
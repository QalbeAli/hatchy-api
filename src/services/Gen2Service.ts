import { BigNumber, ethers, Wallet } from "ethers";
import config from "../config";
import { DefaultChainId } from "../contracts/networks";
import { CoingeckoService } from "./CoingeckoService";

const usdtPrice = '3';
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
    if (usdtPrice) {
      const hatchyPriceUsdt = parseFloat(usdtPrice) / livePrice;
      const hatchyPriceDiscounted = hatchyPriceUsdt * 0.8;
      hatchyPrice = hatchyPriceDiscounted.toFixed(0);
    }

    const parsedPrice = ethers.utils.parseUnits(hatchyPrice, 18);

    const nonce = BigNumber.from(ethers.utils.randomBytes(32));
    const provider = new ethers.providers.JsonRpcProvider(config.JSON_RPC_URL);
    const signer = new Wallet(config.MASTERS_SIGNER_KEY, provider);
    const hash = ethers.utils.solidityKeccak256(
      ['address', 'uint256', 'uint256', 'address', 'uint256', 'uint256'],
      [receiver, eggType, amount, referral, parsedPrice, nonce]);

    const signature = await signer.signMessage(ethers.utils.arrayify(hash));
    return {
      receiver,
      eggType,
      amount,
      referral,
      price: parsedPrice.toString(),
      nonce: nonce.toString(),
      signature
    }
  }
}
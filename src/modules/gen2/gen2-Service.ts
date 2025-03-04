import { BigNumber, ethers, logger, Wallet } from "ethers";
import config from "../../config";
import { DefaultChainId, getContract } from "../contracts/networks";
import { CoingeckoService } from "../../services/CoingeckoService";
import { gen2DiscountMultiplier, gen2MaxPrice, gen2UsdtPrice } from "../../constants";
import { UsersService } from "../users/usersService";
import { HatchyBalance } from "./hatchy-balance";
import { createArrayOf } from "../../utils";
import { gen2CommonIds, gen2ShinyIds, gen2SpecialIds } from "./gen2-constants";

export class Gen2Service {
  chainId: number;
  coingeckoService: CoingeckoService;
  userService = new UsersService();

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

  /*
  public async getAddressGen2Balance(address: string): Promise<HatchyBalance[]> {
    const hatchyGen2Contract = getContract('hatchypocketGen2', this.chainId);
    const commonAmounts: BigNumber[] = await hatchyGen2Contract.balanceOfBatch(
      createArrayOf(gen2CommonIds.length, address),
      gen2CommonIds
    );

    const shinyAmounts: BigNumber[] = await hatchyGen2Contract.balanceOfBatch(
      createArrayOf(gen2ShinyIds.length, address),
      gen2ShinyIds
    );

    const specialAmounts: BigNumber[] = await hatchyGen2Contract.balanceOfBatch(
      createArrayOf(gen2SpecialIds.length, address),
      gen2SpecialIds
    );

    const gen2Balance: {
      [key: number]: {
        commonAmount: number;
        shinyAmount: number;
      }
    } = {};
    for (let i = 0; i < commonAmounts.length; i++) {
      const commonAmount = commonAmounts[i].toNumber();
      const shinyAmount = shinyAmounts[i].toNumber();
      if (commonAmount > 0 || shinyAmount > 0) {
        gen2Balance[gen2CommonIds[i]] = {
          commonAmount,
          shinyAmount
        }
      }
    }

    // extra shiny like dragon and voids
    for (let i = 0; i < specialAmounts.length; i++) {
      const shinyAmount = specialAmounts[i].toNumber();
      if (shinyAmount > 0) {
        let auxTokenId = gen2SpecialIds[i];
        if ((gen2SpecialIds[i] - 888) / 1000 >= 137 && (gen2SpecialIds[i] - 888) / 1000 <= 142) {
          auxTokenId = (gen2SpecialIds[i] - 888) / 1000;
        }
        gen2Balance[auxTokenId] = {
          commonAmount: gen2Balance[auxTokenId]?.commonAmount || 0,
          shinyAmount: shinyAmount
        }
      }
    }

    const stakingGen2Contract = getContract('hatchypocketStakingGen2', this.chainId);
    const stakedAmountsArr: BigNumber[][] = await stakingGen2Contract.userStakedNFT(
      address
    );
    const stakedTokenIds = stakedAmountsArr[0]
    const stakedAmounts = stakedAmountsArr[1]
    if (stakedTokenIds.length > 0) {
      for (let i = 0; i < stakedTokenIds.length; i++) {
        const tokenId = stakedTokenIds[i].toNumber();
        const amount = stakedAmounts[i].toNumber();
        if (tokenId <= 136) {
          gen2Balance[tokenId] = {
            commonAmount: amount,
            shinyAmount: gen2Balance[tokenId]?.shinyAmount || 0
          }
        } else {
          let auxTokenId = tokenId;
          if ((tokenId - 888) / 1000 <= 142) {
            auxTokenId = (tokenId - 888) / 1000;
          }
          gen2Balance[auxTokenId] = {
            commonAmount: gen2Balance[auxTokenId]?.commonAmount || 0,
            shinyAmount: amount
          }
        }
      }
    }
    return gen2Balance;
  }

  public async getGen2Balance(uid: string): Promise<HatchyBalance[]> {
    const linkedWallets = await this.userService.getLinkedWallets(uid);
    if (linkedWallets && linkedWallets.length > 0) {
      for (let i = 0; i < linkedWallets.length; i++) {
        const linkedWallet = linkedWallets[i];
        const gen1Collection = await this.getAddressGen2Balance(linkedWallet.address);
        collections.push(gen1Collection);
      }
    }
  }
  */
}
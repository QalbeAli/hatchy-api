import { BigNumber, ethers, logger, Wallet } from "ethers";
import config from "../../config";
import { DefaultChainId, getContract } from "../contracts/networks";
import { CoingeckoService } from "../../services/CoingeckoService";
import { gen2DiscountMultiplier, gen2MaxPrice, gen2UsdtPrice } from "../../constants";
import { UsersService } from "../users/usersService";
import { HatchyBalance } from "./hatchy-balance";
import { createArrayOf } from "../../utils";
import { cloudfrontBaseUrl, gen2CommonIds, gen2ShinyIds, gen2SpecialIds, hatchiesDataGen2 } from "./gen2-constants";
import { BadRequestError } from "../../errors/bad-request-error";

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

  async getGen2StakedAmounts(address: string): Promise<{
    tokenIds: BigNumber[];
    amounts: BigNumber[];
  }> {
    const stakingGen2Contract = getContract('hatchypocketStakingGen2', this.chainId);
    const stakedAmountsArr: BigNumber[][] = await stakingGen2Contract.userStakedNFT(
      address
    );
    return {
      tokenIds: stakedAmountsArr[0],
      amounts: stakedAmountsArr[1]
    }
  }


  async getGen2Amounts(address: string): Promise<{
    commonAmounts: BigNumber[];
    shinyAmounts: BigNumber[];
    specialAmounts: BigNumber[];
  }> {
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
    return {
      commonAmounts,
      shinyAmounts,
      specialAmounts
    }
  }

  async getAddressesGen2Balance(addresses: string[]): Promise<HatchyBalance[]> {
    const balanceAmounts = await Promise.all(addresses.map((address) => this.getGen2Amounts(address)));
    const stakedAmounts = await Promise.all(addresses.map((address) => this.getGen2StakedAmounts(address)));

    // merge balanceAmounts
    const mergedBalance: {
      [key: number]: {
        commonAmount: number;
        shinyAmount: number;
      }
    } = {};
    balanceAmounts.forEach((balance) => {
      for (let i = 0; i < balance.commonAmounts.length; i++) {
        const commonAmount = balance.commonAmounts[i].toNumber();
        const shinyAmount = balance.shinyAmounts[i].toNumber();
        const index = gen2CommonIds[i];
        if (commonAmount > 0 || shinyAmount > 0) {
          if (!mergedBalance[index]) {
            mergedBalance[index] = {
              commonAmount: 0,
              shinyAmount: 0
            }
          }
          mergedBalance[index] = {
            commonAmount: mergedBalance[index].commonAmount + commonAmount,
            shinyAmount: mergedBalance[index].shinyAmount + shinyAmount
          }
        }
      }

      for (let i = 0; i < balance.specialAmounts.length; i++) {
        const shinyAmount = balance.specialAmounts[i].toNumber();
        if (shinyAmount > 0) {
          let auxTokenId = gen2SpecialIds[i];
          if ((gen2SpecialIds[i] - 888) / 1000 >= 137 && (gen2SpecialIds[i] - 888) / 1000 <= 142) {
            auxTokenId = (gen2SpecialIds[i] - 888) / 1000;
          }
          mergedBalance[auxTokenId] = {
            commonAmount: mergedBalance[auxTokenId]?.commonAmount || 0,
            shinyAmount: mergedBalance[auxTokenId].shinyAmount + shinyAmount
          }
        }
      }
    });

    stakedAmounts.forEach((staked) => {
      for (let i = 0; i < staked.tokenIds.length; i++) {
        const tokenId = staked.tokenIds[i].toNumber();
        const amount = staked.amounts[i].toNumber();
        if (tokenId <= 136) {
          if (!mergedBalance[tokenId]) {
            mergedBalance[tokenId] = {
              commonAmount: 0,
              shinyAmount: 0
            }
          }
          mergedBalance[tokenId] = {
            commonAmount: mergedBalance[tokenId].commonAmount + amount,
            shinyAmount: mergedBalance[tokenId].shinyAmount || 0
          }
        } else {
          let auxTokenId = tokenId;
          if ((tokenId - 888) / 1000 <= 142) {
            auxTokenId = (tokenId - 888) / 1000;
          }
          if (!mergedBalance[auxTokenId]) {
            mergedBalance[auxTokenId] = {
              commonAmount: 0,
              shinyAmount: 0
            }
          }
          mergedBalance[auxTokenId] = {
            commonAmount: mergedBalance[auxTokenId].commonAmount || 0,
            shinyAmount: mergedBalance[auxTokenId].shinyAmount + amount
          }
        }
      }
    });

    // create balances array
    const balances: HatchyBalance[] = Object.keys(mergedBalance).map((key) => {
      const tokenId = parseInt(key);
      const hatchy = hatchiesDataGen2.find((h) => h.monsterId === tokenId);
      if (!hatchy) {
        throw new BadRequestError(`Hatchy not found for tokenId ${tokenId}`);
      }
      return {
        commonAmount: mergedBalance[tokenId].commonAmount,
        shinyAmount: mergedBalance[tokenId].shinyAmount,
        id: tokenId,
        name: hatchy.name,
        image: `${cloudfrontBaseUrl}gen2/cards/common/${hatchy.name.toLowerCase()}.gif`,
        element: hatchy.element,
      };
    }).filter((b) => b !== null) as HatchyBalance[];

    return balances;
  }

  public async getGen2Balance(uid: string): Promise<HatchyBalance[]> {
    const linkedWallets = await this.userService.getLinkedWallets(uid);
    if (linkedWallets && linkedWallets.length > 0) {
      const balance = await this.getAddressesGen2Balance(linkedWallets.map((wallet) => wallet.address));
      return balance;
    }
    return [];
  }
}
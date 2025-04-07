import { BigNumber } from "ethers";
import { getContract } from "../contracts/networks";
import { CoingeckoService } from "../../services/CoingeckoService";
import { UsersService } from "../users/usersService";
import { createArrayOf, createRangeArray } from "../../utils";
import { cloudfrontBaseUrl, ultigenEggPrice, ultigenEggsData, ultigenEggsIds } from "./ultigen-constants";
import { BadRequestError } from "../../errors/bad-request-error";
import { UltigenEggsBalance } from "./ultigen-eggs-balance";
import { admin } from "../../firebase/firebase";
import { ApiKeysService } from "../api-keys/api-keys-service";
import { GamesWalletsService } from "../games/games-wallets-service";
import { VouchersService } from "../vouchers/vouchers-service";
import * as fs from 'fs';
import * as path from 'path';
import csvParser from "csv-parser";
import { UltigenMonster } from "./ultigen-monster";

const filePath = path.join(__dirname, 'ultigen-data.csv');

type CSVData = {
  element: string;
  id: number;
  stage: number;
  name: string;
  walk_speed: number;
  attack_damage: number;
  aspd: number;
  health: number;
  behavior: string;
  dps: number;
};

const loadCSV = (filePath: string): Promise<CSVData[]> => {
  return new Promise((resolve, reject) => {
    const results: CSVData[] = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => {
        const parsedData: CSVData = {
          id: Number(data.id.trim()),
          element: data.element.trim(),
          stage: Number(data.stage.trim()),
          name: data.name.trim(),
          walk_speed: parseFloat(data.walk_speed.trim()),
          attack_damage: parseFloat(data.attack_damage.trim()),
          aspd: parseFloat(data.aspd.trim()),
          health: parseFloat(data.health.trim()),
          behavior: data.behavior.trim(),
          dps: parseFloat(data.dps.trim()),
        };
        results.push(parsedData);
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};


export class UltigenService {
  chainId: number;
  coingeckoService: CoingeckoService;
  userService = new UsersService();
  apiKeyService = new ApiKeysService();
  gamesWalletsService = new GamesWalletsService();
  ultigenData = null;

  constructor(chainId?: number) {
    this.chainId = chainId || 8198;
    this.coingeckoService = new CoingeckoService();
  }

  async loadUltigenData() {
    try {
      if (this.ultigenData === null) {
        const data = await loadCSV(filePath);
        this.ultigenData = data;
      }
    } catch (error) {
      console.error('Error reading CSV file:', error);
    }
  }

  async getUltigenMonstersAmounts(address: string): Promise<UltigenMonster[]> {
    const ultigen = getContract('hatchyverseUltigen', this.chainId);
    const balance = await ultigen.balanceOf(address);
    const tokensOfOwner = await Promise.all(createRangeArray(0, balance.toNumber() - 1).map((i) => {
      return ultigen.tokenOfOwnerByIndex(address, i);
    }));
    const monsterChainData = await Promise.all(tokensOfOwner.map((tokenId) => {
      return ultigen.getMonster(tokenId);
    }));
    return tokensOfOwner.map((tokenId, index) => {
      const monster = monsterChainData[index];
      const monsterId = monster[1].toNumber();
      const monsterData = this.ultigenData.find((m) => m.id === monsterId);
      if (!monsterData) {
        throw new BadRequestError(`Data not found for tokenId ${tokenId}`);
      }
      return {
        id: tokenId.toNumber(),
        name: monsterData.name,
        image: `${cloudfrontBaseUrl}ultigen/monsters/name.gif`,
        element: monsterData.element,
        monsterId: monsterData.id,
        level: monster[2].toNumber(),
        stage: monster[3].toNumber(),
        xp: monster[4].toNumber(),
        skills: [],
        walkSpeed: monsterData.walk_speed,
        attackDamage: monsterData.attack_damage,
        aspd: monsterData.aspd,
        health: monsterData.health,
        behavior: monsterData.behavior,
        dps: monsterData.dps,
      };
    });
  }

  public async getAddressessUltigenMonstersBalance(addresses: string[]): Promise<UltigenMonster[]> {
    const balanceAmounts = await Promise.all(addresses.map((address) => this.getUltigenMonstersAmounts(address)));

    // join balanceAmounts as a single array
    const allBalances = balanceAmounts.reduce((acc, balance) => {
      return acc.concat(balance);
    }
      , []);

    /*
    // create balances array
    const balances: UltigenMonstersBalance[] = Object.keys(mergedBalance).map((key) => {
      const tokenId = parseInt(key);
      const hatchy = ultigenEggsData.find((h) => h.id === tokenId);
      if (!hatchy) {
        throw new BadRequestError(`Data not found for tokenId ${tokenId}`);
      }
      return {
        amount: mergedBalance[tokenId].amount,
        id: tokenId,
        name: hatchy.name,
        image: `${cloudfrontBaseUrl}ultigen/monsters/${hatchy.name.toLowerCase()}.gif`,
        element: hatchy.element,
      };
    }).filter((b) => b !== null) as UltigenMonstersBalance[];
  
    */
    return allBalances;
  }

  public async getUltigenMonstersBalance(uid: string): Promise<UltigenMonster[]> {
    await this.loadUltigenData();

    const linkedWallets = await this.userService.getLinkedWallets(uid);
    if (linkedWallets && linkedWallets.length > 0) {
      const balance = await this.getAddressessUltigenMonstersBalance(linkedWallets.map((wallet) => wallet.address));
      return balance;
    }
    return [];
  }

  async getUltigenEggsAmounts(address: string): Promise<BigNumber[]> {
    const ultigenEggs = getContract('ultigenEggs', this.chainId);
    const amounts: BigNumber[] = await ultigenEggs.balanceOfBatch(
      createArrayOf(ultigenEggsIds.length, address),
      ultigenEggsIds
    );

    return amounts
  }

  async getAddressesEggsBalance(addresses: string[]): Promise<UltigenEggsBalance[]> {
    const balanceAmounts = await Promise.all(addresses.map((address) => this.getUltigenEggsAmounts(address)));
    // merge balanceAmounts
    const mergedBalance: {
      [key: number]: {
        amount: number;
      }
    } = {};
    balanceAmounts.forEach((balance) => {
      for (let i = 0; i < balance.length; i++) {
        const commonAmount = balance[i].toNumber();
        const index = ultigenEggsIds[i];
        // if (commonAmount > 0) {
        if (!mergedBalance[index]) {
          mergedBalance[index] = {
            amount: 0,
          }
        }
        mergedBalance[index] = {
          amount: mergedBalance[index].amount + commonAmount,
        }
        // }
      }
    });

    // create balances array
    const balances: UltigenEggsBalance[] = Object.keys(mergedBalance).map((key) => {
      const tokenId = parseInt(key);
      const hatchy = ultigenEggsData.find((h) => h.id === tokenId);
      if (!hatchy) {
        throw new BadRequestError(`Data not found for tokenId ${tokenId}`);
      }
      return {
        amount: mergedBalance[tokenId].amount,
        id: tokenId,
        name: hatchy.name,
        image: `${cloudfrontBaseUrl}ultigen/eggs/${hatchy.name.toLowerCase()}.gif`,
        element: hatchy.element,
      };
    }).filter((b) => b !== null) as UltigenEggsBalance[];

    return balances;
  }

  public async getEggsBalance(uid: string): Promise<UltigenEggsBalance[]> {
    const linkedWallets = await this.userService.getLinkedWallets(uid);
    if (linkedWallets && linkedWallets.length > 0) {
      const balance = await this.getAddressesEggsBalance(linkedWallets.map((wallet) => wallet.address));
      return balance;
    }
    return [];
  }

  public async hatchEggs(
    userId: string,
    eggType: number,
    amount: number,
  ) {
    await admin.firestore().runTransaction(async (transaction) => {
      const user = await this.userService.get(userId, transaction);
      if (!user.mainWallet) {
        throw new BadRequestError('No linked wallets found');
      }
      const ultigenEggs = getContract('ultigenEggs', this.chainId, true);
      await ultigenEggs.hatchEggsToAddress(
        user.mainWallet,
        eggType,
        amount
      );
    });
  }

  // consume hatchy voucher from user account and give eggs to user
  public async buyEggs(
    userId: string,
    eggType: number,
    amount: number,
  ) {
    await admin.firestore().runTransaction(async (transaction) => {
      const user = await this.userService.get(userId, transaction);
      const voucherService = new VouchersService(this.chainId);
      const vouchers = await voucherService.getVouchersOfUser(userId, transaction);
      if (!vouchers || vouchers.length === 0) {
        throw new BadRequestError('No vouchers found');
      }
      if (!user.mainWallet) {
        throw new BadRequestError('No linked wallets found');
      }
      const hatchyVoucher = vouchers.find((v) => v.name === "Hatchy Token" && v.amount >= ultigenEggPrice * amount);
      if (!hatchyVoucher) {
        throw new BadRequestError('Insufficient voucher balance');
      }
      await voucherService.consumeVoucher(userId, hatchyVoucher.uid, ultigenEggPrice * amount, transaction);
      await this.giveEggToUser(user.mainWallet, eggType, amount);
    });
  }

  public async giveEggWithApiKey(
    apiKey: string, email: string, assetId: string, tokenId: number, amount: number,
  ) {
    const data = await admin.firestore().runTransaction(async (transaction) => {
      const user = await this.userService.getUserByEmail(email);
      const apiKeyData = await this.apiKeyService.getApiKey(apiKey, transaction);
      const gameWallet = await this.gamesWalletsService.getGameWalletById(apiKeyData.appId, transaction);
      if (!gameWallet.balance || !gameWallet.balance[assetId] || gameWallet.balance[assetId] < amount) {
        throw new BadRequestError('Insufficient asset limit');
      }

      if (!apiKeyData.permissions || !apiKeyData.permissions.includes('rewards')) {
        throw new BadRequestError('API Key does not have permissions');
      }
      const res = await this.giveEggToUser(user.mainWallet, tokenId, amount);
      // update the balance of the api key
      await this.gamesWalletsService.consumeBalance(gameWallet, assetId, amount, transaction);

      return {
        apiKey: apiKeyData,
        balance: {
          ...gameWallet.balance,
          [assetId]: gameWallet.balance[assetId] - amount
        }
      }
    })
    return {
      ...data
    }
  }

  async giveEggToUser(userAddress: string, tokenId: number, amount: number) {
    const ultigenEggs = getContract('ultigenEggs', this.chainId, true);
    await ultigenEggs.mintEggToAddress(
      userAddress,
      tokenId,
      amount
    );
  }
}
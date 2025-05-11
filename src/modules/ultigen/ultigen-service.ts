import { BigNumber, ethers, Wallet } from "ethers";
import { getContract, getSigner } from "../contracts/networks";
import { CoingeckoService } from "../../services/CoingeckoService";
import { UsersService } from "../users/usersService";
import { createArrayOf, createRangeArray } from "../../utils";
import { availableMonsterIds, cloudfrontBaseUrl, ultigenEggPrice, ultigenEggsData, ultigenEggsIds } from "./ultigen-constants";
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
import config from "../../config";
import { Wallet as WalletUser } from "../users/wallet";

const ultigenDataFilePath = path.join(__dirname, '../../assets/ultigen-data.csv');
const levelDataFilePath = path.join(__dirname, '../../assets/ultigen-levels.csv');

type LevelsData = {
  level: number;
  stage: number;
  required_xp: number;
}

type UltigenCSVData = {
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

const loadUltigenCSV = (filePath: string): Promise<UltigenCSVData[]> => {
  return new Promise((resolve, reject) => {
    const results: UltigenCSVData[] = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => {
        const parsedData: UltigenCSVData = {
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

const loadLevelsCSV = (filePath: string): Promise<LevelsData[]> => {
  return new Promise((resolve, reject) => {
    const results: LevelsData[] = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => {
        const parsedData: LevelsData = {
          level: Number(data.level.trim()),
          stage: Number(data.stage.trim()),
          required_xp: Number(data.required_xp.trim()),
        };
        results.push(parsedData);
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));

  });
}


export class UltigenService {
  chainId: number;
  coingeckoService: CoingeckoService;
  userService = new UsersService();
  apiKeyService = new ApiKeysService();
  gamesWalletsService = new GamesWalletsService();
  ultigenData = null;
  levelsData: LevelsData[] = null;
  walletUsersCollection = admin.firestore().collection('wallet-users');

  constructor(chainId?: number) {
    this.chainId = chainId || 8198;
    this.coingeckoService = new CoingeckoService();
  }

  async loadUltigenData() {
    try {
      if (this.ultigenData === null) {
        const data = await loadUltigenCSV(ultigenDataFilePath);
        this.ultigenData = data;
      }
    } catch (error) {
      console.error('Error reading CSV file:', error);
    }
  }

  async loadLevelsData() {
    try {
      if (this.levelsData === null) {
        const data = await loadLevelsCSV(levelDataFilePath);
        this.levelsData = data;
      }
    } catch (error) {
      console.error('Error reading CSV file:', error);
    }
  }

  async evolveMonster(
    uniqueId: number,
    newMonsterId: number,
  ) {
    await this.loadLevelsData();
    const ultigen = getContract('hatchyverseUltigen', this.chainId, true);
    const monster = await this.getMonsterData(uniqueId);
    const monsterOwnerAddress = await ultigen.ownerOf(uniqueId);
    const currentXp = monster.xp;

    const dataIndex = this.levelsData.findIndex((l) => l.level === monster.level);
    const currentLevelData = this.levelsData[dataIndex];
    // if (currentXp < currentLevelData.required_xp) {
    //   throw new BadRequestError(`Monster has not enough xp to evolve`);
    // }
    // new level reached
    const nextLevelData = this.levelsData[dataIndex + 1];
    if (nextLevelData == null || nextLevelData.stage == currentLevelData.stage) {
      throw new BadRequestError(`Monster has not the required level to evolve`);
    }
    // Initialize variables for accumulated XP, new level, and new stage
    let accXP = currentXp;
    let level = currentLevelData.level;
    let currentStage = currentLevelData.stage + 1;

    // Loop through levels to determine the maximum level achievable within the current stage
    for (let i = dataIndex; i < this.levelsData.length; i++) {
      const levelData = this.levelsData[i];
      const nextLevelData = this.levelsData[i + 1];
      // If the next level is null, break the loop
      if (nextLevelData == null) {
        break;
      }

      // Stop if the next level's stage is greater than the current stage
      if (nextLevelData.stage > currentStage) {
        break;
      }

      // Deduct the required XP for the next level
      if (accXP >= levelData.required_xp) {
        accXP -= levelData.required_xp;
        level = nextLevelData.level;
      } else {
        break; // Stop leveling up if there's not enough XP for the next level
      }
    }

    // Update the monster with the new level, stage, and residual XP
    const receipt = await this.updateMonsterWithSignature(
      monsterOwnerAddress,
      uniqueId,
      newMonsterId,
      level,
      nextLevelData.stage,
      accXP // Residual XP after leveling up
    );
    await receipt.wait(1);
    const newMonsterData = await this.getMonsterData(uniqueId);
    return newMonsterData;
  }

  async giveXPToMonster(
    uniqueId: number,
    xp: number,
  ) {
    await this.loadLevelsData();
    const ultigen = getContract('hatchyverseUltigen', this.chainId);
    const monster = await this.getMonsterData(uniqueId);
    const monsterOwnerAddress = await ultigen.ownerOf(uniqueId);
    const currentXp = monster.xp;
    const newXp = currentXp + xp;

    const dataIndex = this.levelsData.findIndex((l) => l.level === monster.level);
    const currentLevelData = this.levelsData[dataIndex];

    // Initialize variables for accumulated XP, new level, and new stage
    let accXP = newXp;
    let level = currentLevelData.level;

    // Loop through levels to determine the maximum level achievable within the current stage
    for (let i = dataIndex; i < this.levelsData.length; i++) {
      const levelData = this.levelsData[i];
      const nextLevelData = this.levelsData[i + 1];
      // If the next level is null, break the loop
      if (nextLevelData == null) {
        break;
      }

      // Stop if the next level's stage is greater than the current stage
      if (nextLevelData.stage > levelData.stage) {
        break;
      }

      // Deduct the required XP for the next level
      if (accXP >= levelData.required_xp) {
        accXP -= levelData.required_xp;
        level = nextLevelData.level;
      } else {
        break; // Stop leveling up if there's not enough XP for the next level
      }
    }

    // Update the monster with the new level, stage, and residual XP
    const receipt = await this.updateMonsterWithSignature(
      monsterOwnerAddress,
      uniqueId,
      monster.monsterId,
      level,
      currentLevelData.stage,
      accXP // Residual XP after leveling up
    )
    await receipt.wait(1);
    const newMonsterData = await this.getMonsterData(uniqueId);
    return newMonsterData;
  }

  async updateMonsterWithSignature(
    address: string,
    tokenId: number,
    newMonsterId: number,
    level: number,
    stage: number,
    xp: number,
  ) {
    const internalWalletAddress = address || ethers.constants.AddressZero;
    const internalWalletData = (await this.walletUsersCollection.doc(internalWalletAddress).get()).data() as WalletUser;
    const userWallet = getSigner(this.chainId, internalWalletData.privateKey);

    const ultigenContract = getContract('hatchyverseUltigen', this.chainId, true, userWallet);
    const nonce = BigNumber.from(ethers.utils.randomBytes(32));

    const signature = await this.getUpdateMonsterSignature(
      internalWalletAddress,
      tokenId,
      newMonsterId,
      level,
      stage,
      xp,
      nonce,
    );
    const payload = [
      internalWalletAddress,
      tokenId,
      newMonsterId,
      level,
      stage,
      xp,
      nonce,
      signature
    ]

    try {
      // calculate gas limit
      let totalGasLimit = await ultigenContract.estimateGas.updateMonsterWithSignature(payload);

      // Add a buffer to the gas limit
      totalGasLimit = totalGasLimit.mul(3);

      // Fetch the current gas price from the provider
      const gasPrice = await userWallet.provider.getGasPrice();
      const totalCost = totalGasLimit.mul(gasPrice);

      // get balance of the wallet
      const balance = await userWallet.getBalance();
      if (balance.lt(totalCost)) {
        // Transfer gas amount to fromAddress
        const apiSigner = getSigner(this.chainId);
        const tx = await apiSigner.sendTransaction({
          to: userWallet.address,
          value: totalCost,
        });
        await tx.wait();
      }

      const receipt = await ultigenContract.updateMonsterWithSignature(payload);
      return receipt;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed transaction');
    }
  }

  async getUpdateMonsterSignature(
    address: string,
    tokenId: number,
    newMonsterId: number,
    level: number,
    stage: number,
    xp: number,
    nonce: BigNumber,
  ) {
    const provider = new ethers.providers.JsonRpcProvider(config.JSON_RPC_URL);
    const signer = new Wallet(config.MASTERS_SIGNER_KEY, provider);
    const hash = ethers.utils.solidityKeccak256(
      ['address', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'uint'],
      [address, tokenId, newMonsterId, level, stage, xp, nonce]);
    const signature = await signer.signMessage(ethers.utils.arrayify(hash));
    return signature;
  }

  async getMonsterData(uniqueId: number): Promise<UltigenMonster> {
    await this.loadUltigenData();
    const ultigen = getContract('hatchyverseUltigen', this.chainId);
    const monsterChainData = await ultigen.getMonster(uniqueId);
    const monsterId = monsterChainData[1].toNumber();
    const monsterData = this.ultigenData.find((m) => m.id === monsterId);
    if (!monsterData) {
      throw new BadRequestError(`Data not found for tokenId ${uniqueId}`);
    }
    return {
      id: uniqueId,
      name: monsterData.name,
      image: `${cloudfrontBaseUrl}ultigen/monsters/name.gif`,
      element: monsterData.element,
      monsterId: monsterData.id,
      level: monsterChainData[2].toNumber(),
      stage: monsterChainData[3].toNumber(),
      xp: monsterChainData[4].toNumber(),
      skills: [],
      walkSpeed: monsterData.walk_speed,
      attackDamage: monsterData.attack_damage,
      aspd: monsterData.aspd,
      health: monsterData.health,
      behavior: monsterData.behavior,
      dps: monsterData.dps,
    };
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
    const monsterData = await admin.firestore().runTransaction(async (transaction) => {
      const user = await this.userService.get(userId, transaction);
      if (!user.internalWallet) {
        throw new BadRequestError('No linked wallets found');
      }
      await this.loadUltigenData();
      const previousMonsters = await this.getUltigenMonstersAmounts(user.internalWallet);

      const ultigenEggs = getContract('ultigenEggs', this.chainId, true);
      const balance = await ultigenEggs.balanceOf(user.internalWallet, eggType);
      if (balance.toNumber() < amount) {
        throw new BadRequestError('Not enough eggs to hatch');
      }

      // generate random numbers selection in array [10000, 20000, 30000] for given amount
      const selectedMonsterIds = [];
      for (let i = 0; i < amount; i++) {
        const randomNumber = Math.floor(Math.random() * availableMonsterIds.length);
        selectedMonsterIds.push(availableMonsterIds[randomNumber]);
      }

      await this.hatchEggsOfUser(user.internalWallet, eggType, amount);
      const latestMonsters = await this.getUltigenMonstersAmounts(user.internalWallet);
      const newMonsters = latestMonsters.filter((monster) => {
        return !previousMonsters.some((prevMonster) => {
          return prevMonster.id === monster.id;
        });
      });
      return newMonsters;
    });
    return monsterData
  }

  async hatchEggsOfUser(userAddress: string, eggType: number, amount: number) {
    const internalWalletAddress = userAddress || ethers.constants.AddressZero;
    const internalWalletData = (await this.walletUsersCollection.doc(internalWalletAddress).get()).data() as WalletUser;
    const userWallet = getSigner(this.chainId, internalWalletData.privateKey);

    const ultigenEggsContract = getContract('ultigenEggs', this.chainId, true, userWallet);
    const nonce = BigNumber.from(ethers.utils.randomBytes(32));

    const balance = await ultigenEggsContract.balanceOf(userAddress, eggType);
    if (balance.toNumber() < amount) {
      throw new BadRequestError('Not enough eggs to hatch');
    }
    // generate random numbers selection in array [10000, 20000, 30000] for given amount
    const selectedMonsterIds = [];
    for (let i = 0; i < amount; i++) {
      const randomNumber = Math.floor(Math.random() * availableMonsterIds.length);
      selectedMonsterIds.push(availableMonsterIds[randomNumber]);
    }

    const signature = await this.getHatchEggsSignature(
      internalWalletAddress,
      eggType,
      BigNumber.from(amount),
      selectedMonsterIds,
      nonce,
    );
    const payload = [
      internalWalletAddress,
      eggType,
      BigNumber.from(amount),
      selectedMonsterIds,
      nonce,
      signature
    ]

    try {
      // calculate gas limit
      let totalGasLimit = await ultigenEggsContract.estimateGas.hatchEggsWithSignature(payload);

      // Add a buffer to the gas limit
      totalGasLimit = totalGasLimit.mul(3);

      // Fetch the current gas price from the provider
      const gasPrice = await userWallet.provider.getGasPrice();
      const totalCost = totalGasLimit.mul(gasPrice);

      // get balance of the wallet
      const balance = await userWallet.getBalance();
      if (balance.lt(totalCost)) {
        // Transfer gas amount to fromAddress
        const apiSigner = getSigner(this.chainId);
        const tx = await apiSigner.sendTransaction({
          to: userWallet.address,
          value: totalCost,
        });
        await tx.wait();
      }

      const receipt = await ultigenEggsContract.hatchEggsWithSignature(payload);
      await receipt.wait(1);

    } catch (error) {
      console.log('error', error);
      throw new Error('Failed transaction');
    }
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
      if (!user.internalWallet) {
        throw new BadRequestError('No linked wallets found');
      }
      const hatchyVoucher = vouchers.find((v) => v.name === "Hatchy Token" && v.amount >= ultigenEggPrice * amount);
      if (!hatchyVoucher) {
        throw new BadRequestError('Insufficient voucher balance');
      }
      await voucherService.consumeVoucher(userId, hatchyVoucher.uid, ultigenEggPrice * amount, transaction);
      await this.giveEggToUser(user.internalWallet, eggType, amount);
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
      const res = await this.giveEggToUser(user.internalWallet, tokenId, amount);
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
    const internalWalletAddress = userAddress || ethers.constants.AddressZero;
    const internalWalletData = (await this.walletUsersCollection.doc(internalWalletAddress).get()).data() as WalletUser;
    const userWallet = getSigner(this.chainId, internalWalletData.privateKey);

    const ultigenEggsContract = getContract('ultigenEggs', this.chainId, true, userWallet);
    const nonce = BigNumber.from(ethers.utils.randomBytes(32));

    const signature = await this.getMintEggsSignature(
      internalWalletAddress,
      tokenId,
      BigNumber.from(amount),
      nonce,
    );
    const payload = [
      internalWalletAddress,
      tokenId,
      BigNumber.from(amount),
      nonce,
      signature
    ]

    try {
      // calculate gas limit
      let totalGasLimit = await ultigenEggsContract.estimateGas.mintEggWithSignature(payload);

      // Add a buffer to the gas limit
      totalGasLimit = totalGasLimit.mul(3);

      // Fetch the current gas price from the provider
      const gasPrice = await userWallet.provider.getGasPrice();
      const totalCost = totalGasLimit.mul(gasPrice);

      // get balance of the wallet
      const balance = await userWallet.getBalance();
      if (balance.lt(totalCost)) {
        // Transfer gas amount to fromAddress
        const apiSigner = getSigner(this.chainId);
        const tx = await apiSigner.sendTransaction({
          to: userWallet.address,
          value: totalCost,
        });
        await tx.wait();
      }

      await ultigenEggsContract.mintEggWithSignature(payload);
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed transaction');
    }
  }

  async getMintEggsSignature(
    address: string,
    eggType: number,
    amount: BigNumber,
    nonce: BigNumber,
  ) {
    const provider = new ethers.providers.JsonRpcProvider(config.JSON_RPC_URL);
    const signer = new Wallet(config.MASTERS_SIGNER_KEY, provider);
    const hash = ethers.utils.solidityKeccak256(
      ['address', 'uint256', 'uint256', 'uint'],
      [address, eggType, amount, nonce]);

    const signature = await signer.signMessage(ethers.utils.arrayify(hash));
    return signature;
  }

  async getHatchEggsSignature(
    address: string,
    eggType: number,
    amount: BigNumber,
    monsterIds: number[],
    nonce: BigNumber,
  ) {
    const provider = new ethers.providers.JsonRpcProvider(config.JSON_RPC_URL);
    const signer = new Wallet(config.MASTERS_SIGNER_KEY, provider);
    const hash = ethers.utils.solidityKeccak256(
      ['address', 'uint256', 'uint256', 'uint256[]', 'uint256'],
      [address, eggType, amount, monsterIds, nonce]);

    const signature = await signer.signMessage(ethers.utils.arrayify(hash));
    return signature;
  }


  async transferUltigenAssets(fromWalletData: WalletUser, toAddress: string) {
    // create wallet with privateKey of fromAddress
    const chainId = 8198;

    if (!fromWalletData || !ethers.utils.isAddress(fromWalletData.address) || !fromWalletData.privateKey) {
      throw new Error('Invalid fromWalletData provided.');
    }
    if (!ethers.utils.isAddress(toAddress)) {
      throw new Error('Invalid toAddress provided.');
    }

    const fromAddress = fromWalletData.address;
    const fromWallet = getSigner(chainId, fromWalletData.privateKey);
    // instance ultigen monsters and eggs contracts
    const ultigenEggs = getContract('ultigenEggs', chainId, true, fromWallet);
    const ultigenMonsters = getContract('hatchyverseUltigen', chainId, true, fromWallet);

    // get balance of ultigen eggs and monsters for fromAddress
    const monstersBalance = await ultigenMonsters.balanceOf(fromAddress);
    const monstersTokens: BigNumber[] = await Promise.all(createRangeArray(0, monstersBalance.toNumber() - 1).map((i) => {
      return ultigenMonsters.tokenOfOwnerByIndex(fromAddress, i);
    }));

    const eggsAmounts: BigNumber[] = await ultigenEggs.balanceOfBatch(
      createArrayOf(ultigenEggsIds.length, fromAddress),
      ultigenEggsIds
    );
    // Validate if there are assets to transfer
    if (monstersTokens.length === 0 && eggsAmounts.every((amount) => amount.isZero())) {
      // console.log('No assets to transfer.');
      return;
    }

    // get required gas for transferBatch function of ultigen monsters and eggs contracts
    let totalGasLimit = BigNumber.from(0);

    if (monstersTokens.length > 0) {
      const singleGasLimit = await ultigenMonsters.estimateGas.transferFrom(fromAddress, toAddress, monstersTokens[0]);
      totalGasLimit = totalGasLimit.add(singleGasLimit.mul(monstersTokens.length));
    }


    if (eggsAmounts.some((amount) => !amount.isZero())) {
      const eggsGasLimit = await ultigenEggs.estimateGas.safeBatchTransferFrom(
        fromAddress,
        toAddress,
        ultigenEggsIds,
        eggsAmounts,
        '0x00'
      );
      totalGasLimit = totalGasLimit.add(eggsGasLimit);
    }
    // Add a buffer to the gas limit
    totalGasLimit = totalGasLimit.mul(2); // Increase buffer multiplier for safety
    // Fetch the current gas price from the provider
    const gasPrice = await fromWallet.provider.getGasPrice();
    const totalCost = totalGasLimit.mul(gasPrice);

    // Transfer gas amount to fromAddress
    const apiSigner = getSigner(chainId);
    try {
      const tx = await apiSigner.sendTransaction({
        to: fromAddress,
        value: totalCost,
      });

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      // console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    } catch (error) {
      console.error('Error transferring gas to fromAddress:', error);
      throw new Error('Failed to transfer gas to fromAddress.');
    }

    // Perform transfers with error handling
    try {
      for (const tokenId of monstersTokens) {
        await ultigenMonsters.transferFrom(fromAddress, toAddress, tokenId);
        // console.log(`Transferred monster token ID: ${tokenId.toString()}`);
      }
    } catch (error) {
      console.error('Error transferring monsters:', error);
      throw new Error('Failed to transfer monsters.');
    }

    try {
      if (eggsAmounts.some((amount) => !amount.isZero())) {
        await ultigenEggs.safeBatchTransferFrom(
          fromAddress,
          toAddress,
          ultigenEggsIds,
          eggsAmounts,
          '0x00'
        );
        // console.log('Transferred eggs successfully.');
      }
    } catch (error) {
      console.error('Error transferring eggs:', error);
      throw new Error('Failed to transfer eggs.');
    }
  }

}
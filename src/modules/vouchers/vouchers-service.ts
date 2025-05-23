import { BigNumber, ethers } from "ethers";
import { DefaultChainId, getAddress, getContract, getSigner } from "../contracts/networks";
import { BadRequestError } from "../../errors/bad-request-error";
import { NotFoundError } from "../../errors/not-found-error";
import { admin } from "../../firebase/firebase";
import { Voucher } from "./voucher";
import { VoucherClaimSignature } from "./voucher-claim-signature";
import { createArrayOf, generateSecureNonce, isEmail } from "../../utils";
import { UsersService } from "../users/usersService";
import { Asset } from "../assets/asset";
import { DepositSignature } from "./deposit-signature";
import { AssetsService } from "../assets/assets-service";
import { BatchVoucherClaimSignature } from "./batch-voucher-claim-signature";
import { VoucherLog } from "./voucher-log";
import { GamesWalletsService } from "../games/games-wallets-service";
import { Transaction } from "firebase-admin/firestore";

interface ConverterPayload {
  receiver: string
  assetType: number
  assetAddress: string
  tokenIds: BigNumber[]
  amounts: BigNumber[] // only for erc1155
  amount: BigNumber // only for erc20
}
export class VouchersService {
  chainId: number;
  vouchersCollection = admin.firestore().collection('vouchers');
  vouchersHistoryCollection = admin.firestore().collection('vouchers-logs');
  statsCollection = admin.firestore().collection('stats');
  gamesWalletsService = new GamesWalletsService();
  assetsService = new AssetsService();
  usersCollection = admin.firestore().collection('users');

  constructor(chainId?: number) {
    this.chainId = chainId || DefaultChainId;
  }

  public async getDepositSignature(body: {
    receiver: string,
    assetType: 'ERC20' | 'ERC1155' | 'ERC721',
    assetAddress: string,
    tokenIds?: number[]
    amounts?: number[]; // only for erc1155
    amount?: number; // only for erc20
  }): Promise<DepositSignature> {
    if (!ethers.utils.isAddress(body.receiver)) {
      throw new BadRequestError('Invalid address');
    }
    if (!(body.assetType === 'ERC1155' || body.assetType === 'ERC20')) {
      throw new BadRequestError('Invalid assetType');
    }
    if (body.assetType === 'ERC1155') {
      const erc1155Contract = getContract('mastersItems', this.chainId);
      const balances = await erc1155Contract.balanceOfBatch(
        createArrayOf((body.tokenIds || []).length, body.receiver),
        body.tokenIds || []
      );
      if (balances.some((balance, index) => balance.lt(body.amounts[index]))) {
        throw new BadRequestError('Insufficient balance');
      }
    }
    if (body.assetType === 'ERC20') {
      const erc20Contract = getContract('hatchy', this.chainId);
      const balance = await erc20Contract.balanceOf(body.receiver);
      if (balance.lt(body.amount)) {
        throw new BadRequestError('Insufficient balance for the amount');
      }
    }
    const amount = body.assetType == 'ERC20' ?
      ethers.utils.parseEther(body.amount.toString()) :
      undefined;
    const signer = getSigner(this.chainId);
    const secureNonce = generateSecureNonce();
    const hash = ethers.utils.solidityKeccak256(
      ['address', 'uint8', 'address', 'uint256[]', 'uint256[]', 'uint256', 'uint256'],
      [
        body.receiver,
        contractTypeToUint8(body.assetType),
        body.assetAddress,
        body.tokenIds || [],
        body.amounts || [],
        amount || 0,
        secureNonce
      ]
    );
    const signature = await signer.signMessage(ethers.utils.arrayify(hash));
    return {
      payload: [
        body.receiver,
        contractTypeToUint8(body.assetType),
        body.assetAddress,
        body.tokenIds || [],
        body.amounts || [],
        amount || 0,
        secureNonce.toString(),
      ],
      signature
    };
  }

  public async getVouchersOfUser(uid: string, transaction?: admin.firestore.Transaction): Promise<Voucher[]> {
    // const vouchers = await this.vouchersCollection.where('userId', '==', uid).get();
    const user = await new UsersService().get(uid, transaction);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    /*
    if (!user.vouchersMerged) {
      const mergedVouchers: { [key: string]: Voucher } = {};
      vouchers.docs.forEach(doc => {
        const voucher = doc.data() as Voucher;
        const key = `${voucher.contract}-${voucher.tokenId}`;
        if (mergedVouchers[key]) {
          mergedVouchers[key].amount = Number(mergedVouchers[key].amount) + Number(voucher.amount);
        } else {
          mergedVouchers[key] = voucher;
        }
      });

      const batch = admin.firestore().batch();
      Object.values(mergedVouchers).forEach(voucher => {
        const voucherRef = this.vouchersCollection.doc(voucher.uid);
        batch.update(voucherRef, { amount: voucher.amount });
      });
      // delete duplicates
      const duplicates = vouchers.docs.filter(doc => mergedVouchers[`${doc.data().contract}-${doc.data().tokenId}`].uid !== doc.id);
      duplicates.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      await admin.firestore().collection('users').doc(uid).update({ vouchersMerged: true });
    }
    */
    if (transaction) {
      const vouchers = (await transaction.get(this.vouchersCollection.where('userId', '==', uid))).docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          userId: data.userId,
          holder: data.holder,
          contract: data.contract,
          contractType: data.contractType,
          type: data.type,
          name: data.name,
          amount: data.amount,
          image: data.image,
          tokenId: data.tokenId,
          blockchainId: data.blockchainId,
          category: data.category,
          receiver: data.receiver,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
      });
      return vouchers;
    }

    return (await this.vouchersCollection.where('userId', '==', uid).get()).docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        userId: data.userId,
        holder: data.holder,
        contract: data.contract,
        contractType: data.contractType,
        type: data.type,
        name: data.name,
        amount: data.amount,
        image: data.image,
        tokenId: data.tokenId,
        blockchainId: data.blockchainId,
        category: data.category,
        receiver: data.receiver,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });
  }

  public async getVoucherById(voucherId: string): Promise<Voucher> {
    const docRef = admin.firestore().collection('vouchers').doc(voucherId);
    const data = (await docRef.get()).data();
    if (!data) {
      throw new NotFoundError('Voucher not found');
    }
    return {
      uid: voucherId,
      userId: data.userId,
      holder: data.holder,
      contract: data.contract,
      contractType: data.contractType,
      type: data.type,
      name: data.name,
      amount: data.amount,
      image: data.image,
      tokenId: data.tokenId,
      blockchainId: data.blockchainId,
      category: data.category,
      receiver: data.receiver,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  public async getVoucherClaimSignature(
    voucher: Voucher,
    address: string
  ): Promise<VoucherClaimSignature> {
    await admin.firestore().collection('vouchers').doc(voucher.uid).update({ receiver: address });

    if (voucher.contract === getAddress('eggsGen2', this.chainId)) {
      const signature = await this.getEggsSignature(voucher, address);
      const isClaimed = await this.isRewardClaimed(signature, voucher);
      if (isClaimed) {
        throw new BadRequestError('Reward already claimed');
      }
      return {
        rewardContractType: contractTypeToUint8(voucher.contractType),
        rewardHolderAddress: voucher.holder,
        rewardContract: voucher.contract,
        receiver: address,
        eggType: Number(voucher.tokenId),
        amount: voucher.amount,
        claimableUntil: 0,
        voucherId: voucher.blockchainId,
        signature
      }
    } else {
      const signature = await this.getTokenSignature(voucher, address);
      const isClaimed = await this.isRewardClaimed(signature, voucher);
      if (isClaimed) {
        throw new BadRequestError('Reward already claimed');
      }

      const amount = voucher.contractType == 'ERC20' ?
        ethers.utils.parseEther(voucher.amount.toString()) :
        voucher.amount;
      return {
        rewardContractType: contractTypeToUint8(voucher.contractType),
        rewardHolderAddress: voucher.holder || ethers.constants.AddressZero,
        rewardContract: voucher.contract,
        receiver: address,
        tokenId: voucher.tokenId || "0",
        amount,
        claimableUntil: 0,
        voucherId: voucher.blockchainId,
        signature
      }
    }
  }

  public async getVouchersByIds(voucherIds: string[]): Promise<Voucher[]> {
    return await Promise.all(voucherIds.map(id => this.getVoucherById(id)));
  }

  public async getBatchVoucherClaimSignature(
    vouchers: Voucher[],
    address: string
  ): Promise<BatchVoucherClaimSignature> {
    // set receiver on all vouchers
    const batch = admin.firestore().batch();
    vouchers.forEach(voucher => {
      const voucherRef = this.vouchersCollection.doc(voucher.uid);
      batch.update(voucherRef, { receiver: address });
    });
    await batch.commit();

    const signature = await this.getBatchSignature(vouchers, address);
    const areAllClaimed = await Promise.all(vouchers.map(v => this.isRewardClaimed(signature, v)));
    if (areAllClaimed.some(c => c)) {
      throw new BadRequestError('Reward already claimed');
    }

    const sampleVoucher = vouchers[0];
    return {
      rewardHolderAddress: sampleVoucher.holder || ethers.constants.AddressZero,
      rewardContractType: contractTypeToUint8(sampleVoucher.contractType),
      rewardContract: sampleVoucher.contract,
      receiver: address,
      tokenIds: vouchers.map(v => v.tokenId),
      amounts: vouchers.map(v => v.amount),
      claimableUntil: 0,
      voucherIds: vouchers.map(v => v.blockchainId),
      signature
    };
  }

  public async createTrade(
    userId: string,
    requestAssetsIds: string[],
    requestAmounts: number[],
    offerVoucherIds: string[],
    offerAmounts: number[],
  ) {
    /*
      1. verify that the user has the offer voucher ids and amounts 
      2. verify that the asset ids exists on the assets collection
      3. create trade document on trades collection with the array with complete data of requested assets and offered assets plus an empty array of users optional offers
    */
    const user = await new UsersService().get(userId);

    const requestAssets = await this.assetsService.getAssetsByIds(requestAssetsIds);
    const offerVouchers = await this.getVouchersByIds(offerVoucherIds);

    if (requestAssets.length !== requestAssetsIds.length) {
      throw new BadRequestError('Invalid request assets');
    }
    if (offerVouchers.length !== offerVoucherIds.length) {
      throw new BadRequestError('Invalid offer vouchers');
    }

    if (offerVouchers.some(v => v.userId !== userId)) {
      throw new BadRequestError('Offer vouchers do not belong to user');
    }

    if (offerVouchers.some(v => v.amount <= 0)) {
      throw new BadRequestError('Offer amount should be greater than 0');
    }

    const tradeRef = admin.firestore().collection('trades').doc();
    const trade = {
      uid: tradeRef.id,
      userId,
      username: user.displayName,
      requestAssets: requestAssets.map(a => ({
        uid: a.uid,
        name: a.name,
        image: a.image,
        contract: a.contract,
        contractType: a.contractType,
        category: a.category,
        amount: requestAmounts[requestAssets.indexOf(a)],
        tokenId: a.tokenId
      })),
      offerAssets: offerVouchers.map(v => ({
        uid: v.uid,
        name: v.name,
        image: v.image,
        contract: v.contract,
        contractType: v.contractType,
        category: v.category,
        amount: offerAmounts[offerVouchers.indexOf(v)],
        tokenId: v.tokenId
      })),
      usersOffers: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await tradeRef.set(trade);
    return trade;
  }

  public async consumeVoucher(
    userId: string,
    voucherId: string,
    amount: number,
    transaction?: Transaction
  ) {
    const voucher = await this.getVoucherById(voucherId);
    if (voucher.userId !== userId) {
      throw new BadRequestError('Voucher does not belong to user');
    }
    if (voucher.amount < amount) {
      throw new BadRequestError('Insufficient voucher amount');
    }
    if (transaction) {
      const voucherRef = this.vouchersCollection.doc(voucherId);
      if (voucher.amount - amount === 0) {
        transaction.delete(voucherRef);
      } else {
        transaction.update(voucherRef, { amount: voucher.amount - amount });
      }
    } else {
      if (voucher.amount - amount === 0) {
        await this.vouchersCollection.doc(voucherId).delete();
      } else {
        await this.vouchersCollection.doc(voucherId).update({ amount: voucher.amount - amount });
      }
    }
    return voucher;
  }

  public async transferVouchers(userId: string, voucherIds: string[], voucherAmounts: number[], receiverEmail: string) {
    /*
      transfer voucher amounts to the receiverEmail user
      1. if the amount after transfer is 0, delete the voucher
      2. if the receiverEmail is not a user, throw an error
      3. if the user does not have enough vouchers, throw an error
      4. if the user is trying to transfer to themselves, throw an error
      5. if the receiver user already has a voucher with that contract address and tokenId, add the amount to the existing voucher
      6. if the receiver user does not have a voucher with that contract address and tokenId, create a new voucher
    */
    const receiver = await new UsersService().getUserByEmail(receiverEmail);
    if (!receiver) {
      throw new BadRequestError('Receiver not found');
    }
    return admin.firestore().runTransaction(async (transaction) => {
      const vouchers = await this.getVouchersOfUser(userId, transaction);
      const receiverVouchers = await this.getVouchersOfUser(receiver.uid, transaction);

      // const batch = admin.firestore().batch();

      const insertedVouchers = [];
      for (let i = 0; i < voucherIds.length; i++) {
        const voucherId = voucherIds[i];
        const voucherAmount = voucherAmounts[i];
        const voucher = vouchers.find(v => v.uid === voucherId);
        if (!voucher) {
          throw new BadRequestError('Voucher not found');
        }

        if (voucher.userId !== userId) {
          throw new BadRequestError('Voucher does not belong to user');
        }

        if (voucherAmount > voucher.amount) {
          throw new BadRequestError('Voucher amount is not enough');
        }

        if (voucher.receiver === receiver.email) {
          throw new BadRequestError('Cannot transfer to yourself');
        }

        const receiverVoucher = receiverVouchers.find(v => v.contract === voucher.contract && v.tokenId === voucher.tokenId);
        if (receiverVoucher) {
          const receiverVoucherRef = this.vouchersCollection.doc(receiverVoucher.uid);
          transaction.update(receiverVoucherRef, { amount: receiverVoucher.amount + voucherAmount });
          insertedVouchers.push({
            voucher: receiverVoucher,
            amount: voucherAmount
          });
        } else {
          const newVoucherRef = this.vouchersCollection.doc();
          const newVoucher = {
            uid: newVoucherRef.id,
            userId: receiver.uid,
            holder: voucher.holder,
            contract: voucher.contract,
            contractType: voucher.contractType,
            type: voucher.type,
            name: voucher.name,
            amount: voucherAmount,
            image: voucher.image,
            tokenId: voucher.tokenId,
            blockchainId: voucher.blockchainId,
            category: voucher.category,
            receiver: voucher.receiver || null,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          };
          transaction.set(newVoucherRef, newVoucher);
          insertedVouchers.push({
            voucher: newVoucher,
            amount: voucherAmount
          });
        }

        const voucherRef = this.vouchersCollection.doc(voucherId);
        if (voucher.amount - voucherAmount === 0) {
          transaction.delete(voucherRef);
        } else {
          transaction.update(voucherRef, { amount: voucher.amount - voucherAmount });
        }
      }
      return insertedVouchers;
      // await batch.commit();
    }).then((insertedVouchers) => {
      return {
        user: receiver,
        vouchers: insertedVouchers
      }
    })

    // return {
    //   user: receiver,
    //   vouchers: insertedVouchers
    // }
    // return this.getVouchersOfUser(userId);
  }

  public async deleteBatchVouchers(vouchers: Voucher[]): Promise<Voucher[]> {
    const batch = admin.firestore().batch();
    vouchers.forEach(voucher => {
      const voucherRef = this.vouchersCollection.doc(voucher.uid);
      batch.delete(voucherRef);
    });
    await batch.commit();
    return vouchers;
  }

  public async deleteVoucher(voucher: Voucher): Promise<string> {
    const deleteReward = await this.shouldDeleteReward(voucher);
    if (deleteReward) {
      await admin.firestore().collection('vouchers').doc(voucher.uid).delete();
      return 'Reward deleted successfully'
    }
    return 'Reward not deleted';
  }

  public async giveVoucherWithApiKey(
    apiKey: string, email: string, assetId: string, amount: number, overrideTokenId?: string
  ) {
    const voucherData = await admin.firestore().runTransaction(async (transaction) => {
      //const apiKeyData = await this.apiKeyService.getApiKey(apiKey, transaction);
      const apiKeyData = {
        appId: 'test',
        permissions: ['rewards'],
        uid: 'test',
      }
      const gameWallet = await this.gamesWalletsService.getGameWalletById(apiKeyData.appId, transaction);
      if (!gameWallet.balance || !gameWallet.balance[assetId] || gameWallet.balance[assetId] < amount) {
        throw new BadRequestError('Insufficient asset limit');
      }

      if (!apiKeyData.permissions || !apiKeyData.permissions.includes('rewards')) {
        throw new BadRequestError('API Key does not have permissions');
      }
      const res = await this.giveVoucherToUser(transaction, email, assetId, amount, overrideTokenId);
      // update the balance of the api key
      await this.gamesWalletsService.consumeBalance(gameWallet, assetId, amount, transaction);

      return {
        apiKey: apiKeyData,
        balance: {
          ...gameWallet.balance,
          [assetId]: gameWallet.balance[assetId] - amount
        },
        user: res.user,
        voucherId: res.voucherId
      }
    })
    const voucher = await this.getVoucherById(voucherData.voucherId);
    return {
      ...voucherData,
      voucher
    }
  }

  public async giveVoucherToUser(
    transaction: Transaction,
    email: string,
    assetId: string,
    amount: number,
    overrideTokenId?: string,
  ) {
    try {
      // console.log(`Gave ${op.amount}x ${op.assetId} to ${op.username}`);
      const usersService = new UsersService();
      const user = isEmail(email) ? await usersService.getUserByEmail(email, transaction) : await usersService.get(email, transaction);
      if (!user) {
        throw new NotFoundError('User not found');
      }
      const assets = await admin.firestore().collection('assets').doc(assetId).get();
      if (!assets.exists) {
        throw new NotFoundError('Asset not found');
      }
      const asset = assets.data() as Asset;
      const auxTokenId = overrideTokenId || asset.tokenId;

      const receiverVouchers = await this.getVouchersOfUser(user.uid, transaction);
      const receiverVoucher = receiverVouchers.find(v => v.contract === asset.contract && v.tokenId === auxTokenId);
      let voucherId = '';
      if (receiverVoucher) {
        const receiverVoucherRef = this.vouchersCollection.doc(receiverVoucher.uid);
        transaction.update(receiverVoucherRef, { amount: receiverVoucher.amount + amount });
        voucherId = receiverVoucher.uid;
      } else {
        const newVoucherRef = this.vouchersCollection.doc();
        const newVoucher = {
          uid: newVoucherRef.id,
          userId: user.uid,
          holder: asset.holder,
          contract: asset.contract,
          contractType: asset.contractType,
          type: asset.type,
          name: asset.name,
          amount,
          image: asset.image,
          tokenId: auxTokenId,
          // blockchainId: generateSecureNonceBigInt(),
          blockchainId: ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString(),
          category: asset.category,
          receiver: null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        transaction.set(newVoucherRef, newVoucher);
        voucherId = newVoucherRef.id;
      }
      // get updated or created voucher
      // const voucher = await this.getVoucherById(voucherId);
      return {
        user: {
          uid: user.uid,
          email: user.email,
        },
        voucherId
      }
    } catch (error) {
      console.error(`Failed to give reward`, error);
      throw new BadRequestError('Failed to give reward');
    }
  }

  public async giveVoucherToUserWithoutTransaction(
    email: string,
    assetId: string,
    amount: number,
    overrideTokenId?: string,
  ) {
    try {
      const user = isEmail(email) ? await new UsersService().getUserByEmail(email) : await new UsersService().get(email);
      if (!user) {
        throw new NotFoundError('User not found');
      }
      const assets = await admin.firestore().collection('assets').doc(assetId).get();
      if (!assets.exists) {
        throw new NotFoundError('Asset not found');
      }
      const asset = assets.data() as Asset;
      const auxTokenId = overrideTokenId || asset.tokenId;
      const receiverVouchers = await this.getVouchersOfUser(user.uid);
      const receiverVoucher = receiverVouchers.find(v => v.contract === asset.contract && v.tokenId === auxTokenId);
      let voucherId = '';
      if (receiverVoucher) {
        const receiverVoucherRef = this.vouchersCollection.doc(receiverVoucher.uid);
        await receiverVoucherRef.update({ amount: receiverVoucher.amount + amount });
        voucherId = receiverVoucher.uid;
      } else {
        const newVoucherRef = this.vouchersCollection.doc();
        const newVoucher = {
          uid: newVoucherRef.id,
          userId: user.uid,
          holder: asset.holder,
          contract: asset.contract,
          contractType: asset.contractType,
          type: asset.type,
          name: asset.name,
          amount,
          image: asset.image,
          tokenId: auxTokenId,
          // blockchainId: generateSecureNonceBigInt(),
          blockchainId: ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString(),
          category: asset.category,
          receiver: null,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        await newVoucherRef.set(newVoucher);
        voucherId = newVoucherRef.id;
      }
      // get updated or created voucher
      const voucher = await this.getVoucherById(voucherId);
      return {
        user: {
          uid: user.uid,
          email: user.email,
        },
        voucher
      }
    }
    catch (error) {
      console.error(`Failed to give reward`, error);
      throw new BadRequestError('Failed to give reward');
    }
  }

  public async logVoucher(data: {
    action: VoucherLog['action'],
    vouchersData: Voucher[],
    actionUserId?: string,
    actionUserEmail?: string,
    toUserId: string,
    toUserEmail: string,
    apiKey?: string,
  }) {
    const log = {
      actionUserId: data.actionUserId,
      actionUserEmail: data.actionUserEmail,
      apiKey: data.apiKey,
      action: data.action,
      toUserId: data.toUserId,
      toUserEmail: data.toUserEmail,
      vouchersData: data.vouchersData.map(v => (
        {
          image: v.image,
          receiver: v.receiver,
          tokenId: v.tokenId,
          uid: v.uid,
          amount: v.amount,
          contract: v.contract,
          holder: v.holder,
          name: v.name,

        })),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };
    await this.vouchersHistoryCollection.add(log);
  }

  shouldDeleteReward = async (voucher: Voucher) => {
    const rewardDealerContract = getContract('hatchyRewardDealer', this.chainId);
    const isClaimed: boolean = await rewardDealerContract.UsedVoucherIds(BigInt(voucher.blockchainId));
    return isClaimed;
  }

  isRewardClaimed = async (signature: string, voucher: Voucher) => {
    const rewardDealerContract = getContract('hatchyRewardDealer', this.chainId);
    const isClaimed: boolean = await rewardDealerContract.UsedSignatures(signature);
    if (isClaimed) {
      await admin.firestore().collection('vouchers').doc(voucher.uid).delete();
    }
    return isClaimed;
  }

  getEggsSignature = async (reward: Voucher, address: string) => {
    const signer = getSigner(this.chainId);
    const hash = ethers.utils.solidityKeccak256(
      ['address', 'uint256', 'uint256', 'uint256', 'uint256'],
      [address, Number(reward.tokenId), reward.amount, 0, BigNumber.from(reward.blockchainId)]);
    const signature = await signer.signMessage(ethers.utils.arrayify(hash));
    return signature;
  }

  getTokenSignature = async (voucher: Voucher, address: string) => {
    const signer = getSigner(this.chainId);
    const amount = voucher.contractType == 'ERC20' ?
      ethers.utils.parseEther(voucher.amount.toString()) :
      voucher.amount;

    const values = [
      voucher.holder || ethers.constants.AddressZero, contractTypeToUint8(voucher.contractType), voucher.contract, address,
      voucher.tokenId || 0, amount, 0, BigNumber.from(voucher.blockchainId)
    ]

    const hash = ethers.utils.solidityKeccak256(
      ['address', 'uint8', 'address', 'address', 'uint256', 'uint256', 'uint256', 'uint256'],
      values
    );
    const signature = await signer.signMessage(ethers.utils.arrayify(hash));
    return signature;
  }

  getBatchSignature = async (
    vouchers: Voucher[],
    address: string
  ) => {
    const sampleVoucher = vouchers[0];
    const signer = getSigner(this.chainId);
    const hash = ethers.utils.solidityKeccak256(
      ['address', 'uint8', 'address', 'address', 'uint256[]', 'uint256[]', 'uint256', 'uint256[]'],
      [
        sampleVoucher.holder || ethers.constants.AddressZero,
        contractTypeToUint8(sampleVoucher.contractType),
        sampleVoucher.contract,
        address,
        vouchers.map(v => BigInt(v.tokenId)),
        vouchers.map(v => BigInt(v.amount)),
        0,
        vouchers.map(v => BigInt(v.blockchainId))
      ]
    );
    const signature = await signer.signMessage(ethers.utils.arrayify(hash));
    return signature;
  }
}

const getRandomUint256 = () => {
  return ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString()
}

const contractTypeToUint8 = (contractType: string) => {
  switch (contractType) {
    case 'ERC721':
      return 0;
    case 'ERC1155':
      return 1;
    case 'ERC20':
      return 2;
    default:
      return 0;
  }
}
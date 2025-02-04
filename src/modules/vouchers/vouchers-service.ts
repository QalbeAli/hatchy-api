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
import { ApiKeysService } from "../api-keys/api-keys-service";
import { DepositSignature } from "./deposit-signature";
import { AssetsService } from "../assets/assets-service";
import { ItemsService } from "../masters/services/ItemsService";
import { BatchVoucherClaimSignature } from "./batch-voucher-claim-signature";

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
  statsCollection = admin.firestore().collection('stats');
  apiKeyService = new ApiKeysService();
  assetsService = new AssetsService();

  constructor(chainId?: number) {
    this.chainId = chainId || DefaultChainId;
  }

  public async syncDepositedAssets(
    receiver: string, depositId: number
  ) {
    const voucherConverter = getContract('voucherConverter', this.chainId);
    const convertedAssets = await voucherConverter.getConvertedAssets(depositId) as ConverterPayload;

    if (convertedAssets.receiver !== receiver) {
      throw new BadRequestError('Receiver address does not match');
    }
    const user = await new UsersService().getUserByLinkedWallet(receiver);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const voucherStats = await this.statsCollection.doc('vouchers').get();
    if (!voucherStats.exists) {
      await this.statsCollection.doc('vouchers').set({ totalDeposits: 0 });
    }
    const totalDepositsProcessed = (await this.statsCollection.doc('vouchers').get()).data()?.totalDeposits || 0;
    const totalDeposits = await voucherConverter.totalConverts();

    if (BigInt(totalDepositsProcessed) >= (totalDeposits)) {
      throw new BadRequestError('Deposit already claimed');
    }

    if (depositId <= totalDepositsProcessed - 1) {
      throw new BadRequestError('Deposit already claimed');
    }
    const assetAddress = convertedAssets.assetAddress;

    const mainAsset = await this.assetsService.getAssetByContract(assetAddress);
    let itemsData = null;
    if (mainAsset.name === 'Masters Items') {
      itemsData = await new ItemsService().getItemsByIds(convertedAssets.tokenIds.map(t => Number(t)));
    }
    const batch = admin.firestore().batch();
    const depositedAssets = convertedAssets.tokenIds.map((tokenId, index) => {
      return {
        contract: convertedAssets.assetAddress,
        tokenId: tokenId.toString(),
        amount: Number(convertedAssets.amounts[index]),
        data: itemsData ? itemsData.find(i => i.id === Number(tokenId)) : null
      };
    });
    const vouchers = await this.getVouchersOfUser(user.uid);

    // give depositedAssets to the user in the form of vouchers by merging them if they have the same contract and tokenId and creating a new voucher if they don't
    depositedAssets.forEach(asset => {
      const voucher = vouchers.find(v => v.contract === asset.contract && v.tokenId === asset.tokenId);
      if (voucher) {
        const voucherRef = this.vouchersCollection.doc(voucher.uid);
        batch.update(voucherRef, { amount: voucher.amount + asset.amount });
      } else {
        const newVoucherRef = this.vouchersCollection.doc();
        const newVoucher = {
          uid: newVoucherRef.id,
          userId: user.uid,
          holder: mainAsset.holder,
          contract: mainAsset.contract,
          contractType: mainAsset.contractType,
          type: 'blockchain',
          name: asset.data.name,
          amount: asset.amount,
          image: asset.data.image || mainAsset.image,
          tokenId: asset.tokenId,
          blockchainId: getRandomUint256(),
          category: mainAsset.category,
          // receiver: receiver,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        batch.set(newVoucherRef, newVoucher);
      }
    });

    await batch.commit();
    await this.statsCollection.doc('vouchers').update({ totalDeposits: totalDepositsProcessed + 1 });
    return { message: 'Deposit claimed' };
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
        body.amount || 0,
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
        body.amount || 0,
        secureNonce.toString(),
      ],
      signature
    };
  }



  public async getVouchersOfUser(uid: string): Promise<Voucher[]> {
    const vouchers = await this.vouchersCollection.where('userId', '==', uid).get();
    const user = await new UsersService().get(uid);
    if (!user) {
      throw new NotFoundError('User not found');
    }

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

  public async transferVouchers(userId: string, voucherIds: string[], voucherAmounts: number[], receiverEmail: string): Promise<Voucher[]> {
    /*
      transfer voucher amounts to the receiverEmail user
      1. if the amount after transfer is 0, delete the voucher
      2. if the receiverEmail is not a user, throw an error
      3. if the user does not have enough vouchers, throw an error
      4. if the user is trying to transfer to themselves, throw an error
      5. if the receiver user already has a voucher with that contract address and tokenId, add the amount to the existing voucher
      6. if the receiver user does not have a voucher with that contract address and tokenId, create a new voucher
    */

    if (!isEmail(receiverEmail)) {
      throw new BadRequestError('Invalid email');
    }

    const receiver = await new UsersService().getUserByEmail(receiverEmail);
    if (!receiver) {
      throw new BadRequestError('Receiver not found');
    }

    const vouchers = await this.getVouchersOfUser(userId);
    const receiverVouchers = await this.getVouchersOfUser(receiver.uid);

    const batch = admin.firestore().batch();

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
        batch.update(receiverVoucherRef, { amount: receiverVoucher.amount + voucherAmount });
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
        batch.set(newVoucherRef, newVoucher);
      }

      const voucherRef = this.vouchersCollection.doc(voucherId);
      if (voucher.amount - voucherAmount === 0) {
        batch.delete(voucherRef);
      } else {
        batch.update(voucherRef, { amount: voucher.amount - voucherAmount });
      }
    }

    await batch.commit();
    return this.getVouchersOfUser(userId);
  }

  public async deleteBatchVouchers(vouchers: Voucher[]): Promise<string> {
    const batch = admin.firestore().batch();
    vouchers.forEach(voucher => {
      const voucherRef = this.vouchersCollection.doc(voucher.uid);
      batch.delete(voucherRef);
    });
    await batch.commit();
    return 'Vouchers deleted successfully';
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
    const apiKeyData = await this.apiKeyService.getApiKey(apiKey);
    if (!apiKeyData.balance[assetId] || apiKeyData.balance[assetId] < amount) {
      throw new BadRequestError('Insufficient asset limit');
    }

    if (!apiKeyData.permissions || !apiKeyData.permissions.includes('rewards')) {
      throw new BadRequestError('API Key does not have permissions');
    }
    await this.giveVoucherToUser(email, assetId, amount, overrideTokenId);
    // update the balance of the api key
    const newBalance = { ...apiKeyData.balance };
    newBalance[assetId] -= amount;
    await admin.firestore().collection('api-keys').doc(apiKeyData.uid).update({ balance: newBalance });

    return { message: 'Voucher given with API Key' };
  }

  public async giveVoucherToUser(
    email: string, assetId: string, amount: number, overrideTokenId?: string
  ) {
    const user = await new UsersService().getUserByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    const assets = await admin.firestore().collection('assets').doc(assetId).get();
    if (!assets.exists) {
      throw new NotFoundError('Asset not found');
    }
    const asset = assets.data() as Asset;
    const auxTokenId = overrideTokenId || asset.tokenId;
    if (asset.name === 'Masters Items') {
      const itemsData = await new ItemsService().getItemsByIds([Number(auxTokenId)]);
      if (!itemsData.length) {
        throw new NotFoundError('Item not found');
      }
      asset.name = itemsData[0].name;
      asset.image = itemsData[0].image;
    }

    const receiverVouchers = await this.getVouchersOfUser(user.uid);
    const receiverVoucher = receiverVouchers.find(v => v.contract === asset.contract && v.tokenId === auxTokenId);
    if (receiverVoucher) {
      const receiverVoucherRef = this.vouchersCollection.doc(receiverVoucher.uid);
      receiverVoucherRef.update({ amount: receiverVoucher.amount + amount });
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
    }
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
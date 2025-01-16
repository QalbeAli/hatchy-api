import { BigNumber, ethers } from "ethers";
import { DefaultChainId, getAddress, getContract, getSigner } from "../contracts/networks";
import { BadRequestError } from "../../errors/bad-request-error";
import { NotFoundError } from "../../errors/not-found-error";
import { admin } from "../../firebase/firebase";
import { Voucher } from "./voucher";
import { VoucherClaimSignature } from "./voucher-claim-signature";
import { isEmail } from "../../utils";
import { UsersService } from "../users/usersService";
import { Asset } from "../assets/asset";

export class VouchersService {
  chainId: number;
  vouchersCollection = admin.firestore().collection('vouchers');

  constructor(chainId?: number) {
    this.chainId = chainId || DefaultChainId;
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

  public async getVoucherClaimSignature(voucher: Voucher, address: string): Promise<VoucherClaimSignature> {
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
        rewardHolderAddress: voucher.holder,
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

  public async deleteVoucher(voucher: Voucher): Promise<string> {
    const deleteReward = await this.shouldDeleteReward(voucher);
    if (deleteReward) {
      await admin.firestore().collection('vouchers').doc(voucher.uid).delete();
      return 'Reward deleted successfully'
    }
    return 'Reward not deleted';
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
    const isClaimed: boolean = await rewardDealerContract.UsedVoucherIds(BigNumber.from(voucher.blockchainId));
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
      [address, reward.tokenId, reward.amount, 0, reward.blockchainId]);
    const signature = await signer.signMessage(ethers.utils.arrayify(hash));
    return signature;
  }

  getTokenSignature = async (voucher: Voucher, address: string) => {
    const signer = getSigner(this.chainId);
    const amount = voucher.contractType == 'ERC20' ?
      ethers.utils.parseEther(voucher.amount.toString()) :
      voucher.amount;

    const hash = ethers.utils.solidityKeccak256(
      ['address', 'uint8', 'address', 'address', 'uint256', 'uint256', 'uint256', 'uint256'],
      [voucher.holder, contractTypeToUint8(voucher.contractType), voucher.contract, address,
      voucher.tokenId || 0, amount, 0, BigNumber.from(voucher.blockchainId)]);
    const signature = await signer.signMessage(ethers.utils.arrayify(hash));
    return signature;
  }
}

const getRandomUint256 = () => {
  return ethers.BigNumber.from(ethers.utils.randomBytes(32))
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
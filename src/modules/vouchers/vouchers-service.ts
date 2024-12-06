import { BigNumber, ethers } from "ethers";
import { DefaultChainId, getAddress, getContract, getSigner } from "../contracts/networks";
import { BadRequestError } from "../../errors/bad-request-error";
import { NotFoundError } from "../../errors/not-found-error";
import { admin } from "../../firebase/firebase";
import { Voucher } from "./voucher";
import { VoucherClaimSignature } from "./voucher-claim-signature";

export class VouchersService {
  chainId: number;

  constructor(chainId?: number) {
    this.chainId = chainId || DefaultChainId;
  }

  public async getVouchersOfUser(uid: string): Promise<Voucher[]> {
    const docRef = admin.firestore().collection('vouchers').where('userId', '==', uid);
    const vouchers = (await docRef.get());
    return vouchers.docs.map((doc) => {
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
        eggType: data.eggType,
        receiver: data.receiver,
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
        eggType: voucher.tokenId,
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
        tokenId: voucher.tokenId || 0,
        amount,
        claimableUntil: 0,
        voucherId: voucher.blockchainId,
        signature
      }
    }
  }

  public async deleteVoucher(voucher: Voucher): Promise<string> {
    const deleteReward = await this.shouldDeleteReward(voucher);
    if (deleteReward) {
      await admin.firestore().collection('vouchers').doc(voucher.uid).delete();
      return 'Reward deleted successfully'
    }
    return 'Reward not deleted';
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
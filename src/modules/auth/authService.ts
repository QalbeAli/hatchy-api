import { admin } from "../../firebase/firebase";
import { User } from "../users/user";
import * as crypto from 'crypto';
import { WalletSignatureMessage } from "./walletSignatureMessage";
import { AuthCustomToken } from "./authCustomToken";
import { ethers } from "ethers";
import { Timestamp } from "firebase-admin/firestore";
import { ReferralsService } from "../referrals/referrals-service";
import config from "../../config";
import { UserMigrationData } from "../../types";
import { Voucher } from "../vouchers/voucher";
import { GameSave } from "../games/game-save";
import { isAddress } from "ethers/lib/utils";

export type UserCreationParams = Pick<
  User,
  "uid" | "email" | "displayName" | "picture" | "disabled"
>;

function generateRandomNonce(): string {
  const nonce = Math.floor(Math.random() * 1000000).toString();
  const date = new Date().getTime();
  const hash = crypto.createHash('sha256');
  hash.update(nonce + date);
  const hashed = hash.digest('hex');
  return hashed;
}

const getMessage = (address: string, nonce: string) => {
  return `Welcome to Hatchy Pocket!\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nWallet address: ${address}\n\nNonce: ${nonce}`;
}

export class AuthService {
  usersCollection = admin.firestore().collection('users');
  private referralsService: ReferralsService;
  constructor() {
    this.referralsService = new ReferralsService();
  }

  public async getWalletAuthMessage(address: string): Promise<WalletSignatureMessage> {
    const walletUserDocRef = admin.firestore().collection('wallet-users').doc(address);
    const walletUserDoc = (await walletUserDocRef.get());

    if (walletUserDoc.exists) {
      const nonce = generateRandomNonce();
      await walletUserDocRef.update({
        nonce: nonce
      });
      return {
        message: getMessage(address, nonce),
        nonce: nonce
      };
    } else {
      throw new Error("UserNotFound");
    }
  }

  public async postWalletAuthSignature(address: string, signature: string): Promise<AuthCustomToken> {
    const walletUserDocRef = admin.firestore().collection('wallet-users').doc(address);
    const walletUserDoc = (await walletUserDocRef.get());
    if (walletUserDoc.exists) {
      const wallet = walletUserDoc.data();

      const messageHash = ethers.utils.hashMessage(getMessage(address, wallet.nonce));
      const digest = ethers.utils.arrayify(messageHash);
      const recoveredAddress = ethers.utils.recoverAddress(digest, signature);

      if (address === recoveredAddress) {
        await walletUserDocRef.update({
          nonce: null
        });
        const userId = wallet.uid;
        // Create a custom token for the specified address
        const firebaseToken = await admin.auth().createCustomToken(userId);
        return {
          message: "Wallet auth success",
          token: firebaseToken
        };
      } else {
        throw new Error("InvalidSignature");
      }
    } else {
      throw new Error("WalletNotFound");
    }
  }

  public async createUser(request: any, referralCode?: string): Promise<User> {
    let referrerId = null;
    if (referralCode) {
      referrerId = await this.referralsService.validateReferralCode(referralCode);
    }

    const userCreationParams: User = {
      uid: request.user.uid,
      email: request.user.email,
      displayName: request.user.name,
      picture: request.user.picture,
      disabled: false,
      referralCount: 0,
      referralCode: request.user.uid,
      referrerId
    }
    const userRef = this.usersCollection.doc(userCreationParams.uid);
    // Use transaction to ensure atomicity
    await admin.firestore().runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const oldUserResponse = await fetch(`${config.HATCHY_API}/users/migration?email=${request.user.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: config.ADMIN_KEY,
        })
      });
      const oldUserData = await oldUserResponse.json() as UserMigrationData;
      const wallets = oldUserData.user.linkedWallets.filter((wallet) => wallet.linked).map((wallet) => {
        return wallet.username;
      });
      if (isAddress(oldUserData.user.address)) {
        wallets.push(oldUserData.user.address);
      }
      console.log(oldUserData.referrals);
      console.log(oldUserData.referrer);
      console.log(wallets);

      if (oldUserData.user) {
        const oldUser = oldUserData.user;
        if (oldUser.username) {
          userCreationParams.displayName = oldUser.username;
        }
        if (oldUser.bio) {
          userCreationParams.bio = oldUser.bio;
        }
        if (oldUser.xpPoints) {
          userCreationParams.xpPoints = oldUser.xpPoints;
        }
        if (oldUser.profilePicture) {
          userCreationParams.picture = oldUser.profilePicture;
        }
        if (oldUser.rewardReceiverAddress) {
          userCreationParams.rewardReceiverAddress = oldUser.rewardReceiverAddress;
        }
      }

      if (!userDoc.exists) {
        // Create new user document
        transaction.set(userRef, userCreationParams);

        // migrate vouchers
        for (const voucher of oldUserData.vouchers) {
          const voucherRef = admin.firestore().collection('vouchers').doc();
          const voucherData: Voucher = {
            blockchainId: ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString(),
            uid: voucherRef.id,
            amount: voucher.amount,
            category: voucher.category,
            contract: voucher.contract,
            contractType: voucher.contractType,
            holder: voucher.holder,
            name: voucher.name,
            type: voucher.type,
            userId: userRef.id,
            image: voucher.image,
            receiver: voucher.receiver,
            tokenId: voucher.tokenId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          }
          transaction.set(voucherRef, voucherData);
        }

        // migrate game saves
        for (const gameSave of oldUserData.gameSaves) {
          const gameSaveRef = admin.firestore().collection('game-saves').doc();
          const gameSaveData: GameSave = {
            ...gameSave,
            gameId: gameSave.gameId,
            userId: userRef.id,
            saveName: gameSave.saveName,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            uid: gameSaveRef.id,
          }
          delete gameSaveData.username;
          delete gameSaveData.saveId;
          delete gameSaveData.blockchainRewards;

          transaction.set(gameSaveRef, gameSaveData);
        }

        for (const address of wallets) {
          const walletUserRef = admin.firestore().collection('wallet-users').doc(address);
          transaction.set(walletUserRef, {
            uid: userRef.id,
          });
        }

        // If there's a valid referrer, update their stats
        if (referrerId) {
          const referrerRef = this.usersCollection.doc(referrerId);
          transaction.update(referrerRef, {
            referralCount: admin.firestore.FieldValue.increment(1),
            xpPoints: admin.firestore.FieldValue.increment(100)
          });

          // Create referral relationship document
          const referralRelationshipRef = admin.firestore()
            .collection('referral-relationships')
            .doc();

          transaction.set(referralRelationshipRef, {
            referrerId: referrerId,
            referredId: userCreationParams.uid,
            referralCode: referralCode,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'completed'
          });
        }
      }
    });
    return userCreationParams;
  }
}
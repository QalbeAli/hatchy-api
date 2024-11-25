import { admin } from "../firebase/firebase";
import { User } from "../users/user";
import * as crypto from 'crypto';
import { WalletSignatureMessage } from "./walletSignatureMessage";
import { AuthCustomToken } from "./authCustomToken";
import { ethers } from "ethers";

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

  public async createUser(userCreationParams: UserCreationParams): Promise<User> {
    const userDoc = await admin.firestore().collection('users').doc(userCreationParams.uid).get();
    if (!userDoc.exists) {
      await admin.firestore().collection('users').doc(userCreationParams.uid).set(userCreationParams);
    }
    return userCreationParams as User;
  }
}
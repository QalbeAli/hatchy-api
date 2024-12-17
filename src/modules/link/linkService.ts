import { ethers } from "ethers";
import { WalletSignatureMessage } from "../auth/walletSignatureMessage";
import { admin } from "../../firebase/firebase";
import * as crypto from 'crypto';
import { AuthCustomToken } from "../auth/authCustomToken";
import { User } from "../users/user";
import { NotFoundError } from "../../errors/not-found-error";
import { BadRequestError } from "../../errors/bad-request-error";

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

export class LinkService {
  public async get(uid: string): Promise<User> {
    const user = (await admin.firestore().collection('users').doc(uid).get()).data();
    return user as User;
  }

  public async getWalletLinkMessage(uid: string, address: string): Promise<WalletSignatureMessage> {
    const userId = uid;
    const userDocRef = admin.firestore().collection('users').doc(userId);
    const userDoc = (await userDocRef.get());

    if (userDoc.exists) {
      const user = userDoc.data() as User;
      const nonce = generateRandomNonce();
      const walletIndex = user.wallets?.findIndex(wallet => wallet.address === address) ?? -1;
      if (walletIndex === -1) {
        user.wallets = user.wallets ?? [];
        user.wallets.push({
          address,
          nonce,
          linked: false,
          createdAt: Date.now()
        });
      } else {
        user.wallets[walletIndex].nonce = nonce;
      }

      await userDocRef.update({
        wallets: user.wallets
      });
      return {
        message: getMessage(address, nonce),
        nonce: nonce
      };
    } else {
      throw new Error("UserNotFound");
    }
  }

  public async postWalletLinkSignature(uid: string, address: string, signature: string): Promise<AuthCustomToken> {
    const userId = uid;
    const userDocRef = admin.firestore().collection('users').doc(userId);
    const userDoc = (await userDocRef.get());

    if (userDoc.exists) {
      const user = userDoc.data() as User;
      const walletIndex = user.wallets?.findIndex(wallet => wallet.address === address) ?? -1;

      if (walletIndex === -1) {
        throw new Error("InvalidAddress");
      } else {
        const messageHash = ethers.utils.hashMessage(getMessage(address, user.wallets[walletIndex].nonce));
        const digest = ethers.utils.arrayify(messageHash);
        const recoveredAddress = ethers.utils.recoverAddress(digest, signature);

        if (address === recoveredAddress) {
          user.wallets[walletIndex].linked = true;
          await userDocRef.update({
            wallets: user.wallets
          });
          await admin.firestore().collection('wallet-users').doc(address).set({
            uid: userId
          });
          // Create a custom token for the specified address
          const firebaseToken = await admin.auth().createCustomToken(userId);
          return {
            message: "Wallet linked successfully",
            token: firebaseToken
          };
        } else {
          throw new Error("InvalidSignature");
        }
      }
    } else {
      throw new Error("UserNotFound");
    }
  }

  public async unlinkWallet(uid: string, address: string): Promise<void> {
    const userId = uid;
    const walletDocRef = admin.firestore().collection('wallet-users').doc(address);
    const walletDoc = (await walletDocRef.get());

    if (walletDoc.exists) {
      const walletData = walletDoc.data();
      if (walletData.uid === userId) {
        await walletDocRef.delete();
        const userDocRef = admin.firestore().collection('users').doc(userId);
        const userDoc = (await userDocRef.get());
        if (userDoc.exists) {
          const user = userDoc.data() as User;
          const walletIndex = user.wallets?.findIndex(wallet => wallet.address === address) ?? -1;
          if (walletIndex !== -1) {
            user.wallets.splice(walletIndex, 1);
            await userDocRef.update({
              wallets: user.wallets
            });
          }
        }
      } else {
        throw new NotFoundError("Address not found");
      }
    } else {
      throw new NotFoundError("Wallet not found");
    }
  }
}
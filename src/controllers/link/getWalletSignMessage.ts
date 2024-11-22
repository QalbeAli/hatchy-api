'use strict'
import { Response, NextFunction } from "express";
import { isAddress } from "ethers/lib/utils";
import { admin } from "../../firebase/firebase";
import { AuthorizedRequest, User } from "../../types";
import * as crypto from 'crypto';

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

export const getWalletSignMessage = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  try {

    const address = req.query.address as string;
    if (!address || !isAddress(address)) {
      return res.status(400).json({ error: "Invalid address" });
    }
    const userId = req.user?.uid;
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
      return res.status(200).json({
        message: getMessage(address, nonce),
        nonce: nonce
      });
    } else {
      return res.status(404).send();
    }
  } catch (error: any) {
    next(error);
  }
}
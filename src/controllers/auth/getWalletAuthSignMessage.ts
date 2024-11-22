'use strict'
import { Request, Response, NextFunction } from "express";
import { isAddress } from "ethers/lib/utils";
import { admin } from "../../firebase/firebase";
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

export const getWalletAuthSignMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const address = req.query.address as string;
    if (!address || !isAddress(address)) {
      return res.status(400).json({ error: "Invalid address" });
    }

    const walletUserDocRef = admin.firestore().collection('wallet-users').doc(address);
    const walletUserDoc = (await walletUserDocRef.get());

    if (walletUserDoc.exists) {
      const nonce = generateRandomNonce();
      await walletUserDocRef.update({
        nonce: nonce
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
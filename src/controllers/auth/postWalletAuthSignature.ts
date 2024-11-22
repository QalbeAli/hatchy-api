'use strict'
import { Request, Response, NextFunction } from "express";
import { isAddress } from "ethers/lib/utils";
import { admin } from "../../firebase/firebase";
import { User } from "../../types";
import { ethers } from "ethers";

const getMessage = (address: string, nonce: string) => {
  return `Welcome to Hatchy Pocket!\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nWallet address: ${address}\n\nNonce: ${nonce}`;
}

export const postWalletAuthSignature = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { address, signature } = req.body;
    if (!address || !isAddress(address)) {
      return res.status(400).json({ error: "Invalid address" });
    }
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
        return res.status(200).json({
          message: "Wallet auth success",
          token: firebaseToken
        });
      } else {
        return res.status(400).json({ error: "Invalid signature" });
      }
    } else {
      return res.status(404).send();
    }
  } catch (error: any) {
    next(error);
  }
}
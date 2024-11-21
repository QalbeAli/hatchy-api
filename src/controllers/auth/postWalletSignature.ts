'use strict'
import { Response, NextFunction } from "express";
import { isAddress } from "ethers/lib/utils";
import { admin } from "../../firebase/firebase";
import { AuthorizedRequest, User } from "../../types";
import { ethers } from "ethers";

const getMessage = (address: string, nonce: string) => {
  return `Welcome to Hatchy Pocket!\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nWallet address: ${address}\n\nNonce: ${nonce}`;
}

export const postWalletSignature = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  try {

    const { address, signature } = req.body;
    if (!address || !isAddress(address)) {
      return res.status(400).json({ error: "Invalid address" });
    }
    const userId = req.user?.uid;
    const userDocRef = admin.firestore().collection('users').doc(userId);
    const userDoc = (await userDocRef.get());

    if (userDoc.exists) {
      const user = userDoc.data() as User;
      const walletIndex = user.wallets?.findIndex(wallet => wallet.address === address) ?? -1;

      if (walletIndex === -1) {
        return res.status(400).json({ error: "Invalid address" });
      } else {
        const messageHash = ethers.utils.hashMessage(getMessage(address, user.wallets[walletIndex].nonce));
        const digest = ethers.utils.arrayify(messageHash);
        const recoveredAddress = ethers.utils.recoverAddress(digest, signature);

        if (address === recoveredAddress) {
          user.wallets[walletIndex].linked = true;
          await userDocRef.update({
            wallets: user.wallets
          });
          return res.status(200).json({
            message: "Wallet linked successfully"
          });
        } else {
          return res.status(400).json({ error: "Invalid signature" });
        }
      }

    } else {
      return res.status(404);
    }
  } catch (error: any) {
    next(error);
  }
}
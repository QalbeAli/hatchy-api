'use strict'
import { Request, Response, NextFunction } from "express";
import { isAddress } from "ethers/lib/utils";
import { admin } from "../../firebase/firebase";


function generateRandomNonce(): string {
  return Math.floor(Math.random() * 1000000).toString();
}

export const getWalletSignMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const address = req.query.address as string;
    if (!address || !isAddress(address)) {
      return res.status(400).json({ error: "Invalid address" });
    }

    // Get the user document for that address
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(address)
      .get();

    if (userDoc.exists) {
      // The user document exists already, so just return the nonce
      const existingNonce = userDoc.data()?.nonce;
      return res.status(200).json({ nonce: existingNonce });
    } else {
      // The user document does not exist, create it first
      const generatedNonce = generateRandomNonce();

      // Create an Auth user
      const createdUser = await admin.auth().createUser({
        uid: address,
      });

      // Associate the nonce with that user
      await admin.firestore().collection('users').doc(createdUser.uid).set({
        nonce: generatedNonce,
      });

      return res.status(200).json({ nonce: generatedNonce });
    }
  } catch (error: any) {
    next(error);
  }
}
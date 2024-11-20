'use strict'
import { Response, NextFunction } from "express";
import { admin } from "../../firebase/firebase";
import { AuthorizedRequest } from "../../types";

export const createUser = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.uid;
    const userRecord = await admin.auth().getUser(userId);
    const data = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      disabled: false,
    }
    await admin.firestore().collection('users').doc(userRecord.uid).set(data);
    res.json(data);
  } catch (error: any) {
    next(error);
  }
}
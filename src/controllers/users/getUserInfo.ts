'use strict'
import { Response, NextFunction } from "express";
import { admin } from "../../firebase/firebase";
import { AuthorizedRequest } from "../../types";

export const getUserInfo = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.uid; // Assuming req.user contains the authenticated user's info
    const user = (await admin.firestore().collection('users').doc(userId).get()).data();
    res.json(user);
  } catch (error: any) {
    next(error);
  }
}
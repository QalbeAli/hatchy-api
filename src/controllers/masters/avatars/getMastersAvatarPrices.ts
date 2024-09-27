"use strict";
import { Request, Response, NextFunction } from "express";
import { AvatarPricesArray } from "../../../avatar-prices";

export const getMastersAvatarPrices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.json(AvatarPricesArray);
  } catch (error) {
    next(error);
  }
};

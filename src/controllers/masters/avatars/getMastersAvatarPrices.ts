"use strict";
import { Request, Response, NextFunction } from "express";
import { AvatarPricesArray } from "../../../avatar-prices";

export const getMastersAvatarPrices = async (req: Request, res: Response, next: NextFunction) => {
  console.log("Event: ", JSON.stringify(event, null, 2));
  try {
    return AvatarPricesArray;
  } catch (error) {
    next(error);
  }
};

"use strict";
import { Request, Response, NextFunction } from "express";
import { DefaultChainId } from "../../../contracts/networks";
import { MastersService } from "../../../services/MastersService";

export const getMastersAvatarPrices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chainId = Number(req.query.chainId) || DefaultChainId;
    const mastersService = new MastersService(chainId);
    const prices = await mastersService.getAvatarsPrices();
    return res.json(prices);
  } catch (error) {
    next(error);
  }
};

"use strict";
import { Request, Response, NextFunction } from "express";
import { MastersService } from "../../services/MastersService";
import { DefaultChainId } from "../../contracts/networks";

export const getMastersGenders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chainId = Number(req.query.chainId) || DefaultChainId;
    const mastersService = new MastersService(chainId);
    const genders = await mastersService.getGenders();
    return res.json(genders);
  } catch (error) {
    next(error);
  }
};

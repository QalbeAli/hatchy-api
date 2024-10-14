"use strict";
import { Request, Response, NextFunction } from "express";
import { MastersService } from "../../../services/MastersService";
import { DefaultChainId } from "../../../contracts/networks";

export const getMintTraits = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chainId = Number(req.query.chainId) || DefaultChainId;

    const mastersService = new MastersService(chainId);
    const traits = await mastersService.getMintTraits();
    return res.json(traits);
  } catch (error) {
    next(error);
  }
};

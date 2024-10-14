"use strict";
import { Request, Response, NextFunction } from "express";
import { MastersService } from "../../../services/MastersService";
import { DefaultChainId } from "../../../contracts/networks";

export const getMastersTraitTypes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chainId = Number(req.query.chainId) || DefaultChainId;
    const mastersService = new MastersService(chainId);
    const traitTypes = await mastersService.getTraitTypes();
    return res.json(traitTypes);
  } catch (error) {
    next(error);
  }
};

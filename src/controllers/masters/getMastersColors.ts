"use strict";
import { Request, Response, NextFunction } from "express";
import { MastersService } from "../../services/MastersService";
import { DefaultChainId } from "../../contracts/networks";

export const getMastersColors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chainId = Number(req.query.chainId) || DefaultChainId;
    const typeId = req.query.typeId;
    const mastersService = new MastersService(chainId);
    const colors = await mastersService.getColors(Number(typeId));
    return res.json(colors);
  } catch (error) {
    next(error);
  }
};

"use strict";
import { Request, Response, NextFunction } from "express";
import { GetMintTraitsFilters } from "../../../models/GetMintTraitsFilters";
import { MastersService } from "../../../services/MastersService";

export const getMintTraits = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body || {};
    const { genderId, colorIds }: GetMintTraitsFilters = body;

    const mastersService = new MastersService();
    const traits = await mastersService.getMintTraits({
      colorIds,
      genderId
    });
    return traits;
  } catch (error) {
    next(error);
  }
};

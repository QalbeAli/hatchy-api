"use strict";
import { Request, Response, NextFunction } from "express";
import { MastersService } from "../../../services/MastersService";
import { DefaultChainId } from "../../../contracts/networks";

export const getTraits = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chainId = Number(req.query.chainId) || DefaultChainId;
    const gender = req.query.genderId;
    const color = req.query.colorId;
    const type = req.query.typeId;
    const mastersService = new MastersService(chainId);
    const traits = await mastersService.getAllTraits(
      // gender ? Number(gender) : undefined,
      // color ? Number(color) : undefined,
      // type ? Number(type) : undefined
    );
    return res.json(traits);
  } catch (error) {
    next(error);
  }
};

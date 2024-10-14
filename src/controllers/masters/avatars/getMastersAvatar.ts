"use strict";
import { Request, Response, NextFunction } from "express";
import { messageResponse } from "../../../utils";
import { MastersService } from "../../../services/MastersService";
import { DefaultChainId } from "../../../contracts/networks";

export const getMastersAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chainId = Number(req.query.chainId) || DefaultChainId;
    const tokenId = req.params?.tokenId;
    if (isNaN(Number(tokenId))) {
      return messageResponse(res, 400, "Invalid tokenId");
    }

    const mastersService = new MastersService(chainId);
    const avatar = await mastersService.getAvatar(Number(tokenId));
    return res.json(avatar);
  } catch (error) {
    next(error);
  }
};

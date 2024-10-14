"use strict";
import { Request, Response, NextFunction } from "express";
import { isAddress } from "ethers/lib/utils";
import { messageResponse } from "../../../utils";
import { MastersService } from "../../../services/MastersService";
import { DefaultChainId } from "../../../contracts/networks";

export const getMastersAvatarBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chainId = Number(req.query.chainId) || DefaultChainId;
    const address = req.params.address;
    if (!isAddress(address)) {
      return messageResponse(res, 404, 'Invalid address');
    }
    const mastersService = new MastersService(chainId);
    const avatarsBalance = await mastersService.getAvatarsBalance(address);
    return res.json(avatarsBalance);
  } catch (error) {
    next(error);
  }
};
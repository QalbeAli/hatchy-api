"use strict";
import { Request, Response, NextFunction } from "express";
import { isAddress } from "ethers/lib/utils";
import { MastersService } from "../../../services/MastersService";
import { messageResponse } from "../../../utils";
import { DefaultChainId } from "../../../contracts/networks";

export const getMastersAvatarImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chainId = Number(req.query.chainId) || DefaultChainId;
    const address = req.params.address;
    if (!isAddress(address)) return messageResponse(res, 400, "Invalid address");
    const mastersService = new MastersService(chainId);
    const avatarsBalance = await mastersService.getAvatarsImages(address);
    return res.json(avatarsBalance);
  } catch (error) {
    next(error);
  }
};
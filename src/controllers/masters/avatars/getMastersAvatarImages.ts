"use strict";
import { Request, Response, NextFunction } from "express";
import { isAddress } from "ethers/lib/utils";
import { MastersService } from "../../../services/MastersService";
import { messageResponse } from "../../../utils";

export const getMastersAvatarImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = req.params.address;
    if (!isAddress(address)) return messageResponse(res, 400, "Invalid address");
    const mastersService = new MastersService();
    const avatarsBalance = await mastersService.getAvatarsImages(address);
    return avatarsBalance;
  } catch (error) {
    next(error);
  }
};
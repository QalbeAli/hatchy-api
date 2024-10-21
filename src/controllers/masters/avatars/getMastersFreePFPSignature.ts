"use strict";
import { Request, Response, NextFunction } from "express";
import { isAddress } from "ethers/lib/utils";
import { messageResponse } from "../../../utils";
import { MastersService } from "../../../services/MastersService";
import { DefaultChainId } from "../../../contracts/networks";

export const getMastersFreePFPSignature = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chainId = Number(req.query.chainId) || DefaultChainId;
    const {
      receiver,
      traits,
    } = req.body;
    if (!isAddress(receiver)) {
      return messageResponse(res, 400, "Invalid address");
    }
    const mastersService = new MastersService(chainId);

    const validTraits = await mastersService.isValidTraits(traits);
    if (!validTraits) {
      return messageResponse(res, 400, "Invalid traits");
    }
    const signatureData = await mastersService.getAvatarFreeMintSignature(receiver, traits);
    return res.json(signatureData);
  } catch (error) {
    next(error);
  }
};

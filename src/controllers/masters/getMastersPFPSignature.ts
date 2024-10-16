"use strict";
import { Request, Response, NextFunction } from "express";
import { isAddress } from "ethers/lib/utils";
import { messageResponse } from "../../utils";
import { MastersService } from "../../services/MastersService";
import { DefaultChainId } from "../../contracts/networks";

export const getMastersPFPSignature = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chainId = Number(req.query.chainId) || DefaultChainId;
    const {
      receiver,
      traits,
      currency,
      payWithTicket
    } = req.body;
    if (!isAddress(receiver)) {
      return messageResponse(res, 400, "Invalid address");
    }
    const mastersService = new MastersService(chainId);

    const validTraits = await mastersService.isValidTraits(traits);
    if (!validTraits) {
      return messageResponse(res, 400, "Invalid traits");
    }

    if (payWithTicket === true) {
      //return messageResponse(400, "Pay with ticket must be true or undefined");
      const signatureData = await mastersService.getAvatarMintSignature(receiver, traits, currency, true);
      return res.json(signatureData);
    } else {
      const price = await mastersService.getAvatarPrice(currency);
      if (!price) {
        return messageResponse(res, 400, "Invalid currency");
      }
      const signatureData = await mastersService.getAvatarMintSignature(receiver, traits, currency, false);
      return res.json(signatureData);
    }
  } catch (error) {
    next(error);
  }
};

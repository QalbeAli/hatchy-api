"use strict";
import { Request, Response, NextFunction } from "express";
import { isAddress } from "ethers/lib/utils";
import { ethers } from "ethers";
import { messageResponse } from "../../utils";
import { MastersService } from "../../services/MastersService";
import { getAvatarPrice } from "../../avatar-prices";

export const getMastersPFPSignature = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      receiver,
      traits,
      // currency,
      // payWithTicket
    } = req.body;
    if (!isAddress(receiver)) {
      return messageResponse(res, 400, "Invalid address");
    }
    const mastersService = new MastersService();

    const validTraits = await mastersService.isValidTraits(traits);
    if (!validTraits) {
      return messageResponse(res, 400, "Invalid traits");
    }

    const currency = ethers.constants.AddressZero;
    if (!getAvatarPrice(currency)) {
      return messageResponse(res, 400, "Invalid currency");
    }

    // if (payWithTicket === false) {
    //   return messageResponse(400, "Pay with ticket must be true or undefined");
    // }
    const payWithTicket = true;

    const signatureData = await mastersService.getAvatarMintSignature(receiver, traits, currency, payWithTicket);
    return res.json(signatureData);
  } catch (error) {
    next(error);
  }
};

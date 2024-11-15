'use strict'
import { Request, Response, NextFunction } from "express";
import { isAddress } from 'ethers/lib/utils';
import { DefaultChainId } from "../../contracts/networks";
import { messageResponse } from "../../utils";
import { Gen2Service } from "../../services/Gen2Service";
import { ethers } from "ethers";

export const getGen2SaleSignature = async (req: Request, res: Response, next: NextFunction) => {
  const chainId = DefaultChainId;
  const gen2Service = new Gen2Service(chainId);

  try {
    const { eggType, amount, referral, receiver } = req.body;
    if (!isAddress(receiver) || (referral && !isAddress(referral))) {
      return messageResponse(res, 400, 'Invalid address');
    }
    if (!Number.isInteger(amount) || amount <= 0) {
      return messageResponse(res, 400, 'Invalid amount');
    }
    if (!Number.isInteger(eggType) || ![0, 1].includes(eggType)) {
      return messageResponse(res, 400, 'Invalid egg type');
    }
    const signatureData = await gen2Service.getGen2SaleSignature(eggType, amount, referral || ethers.constants.AddressZero, receiver);
    return res.json(signatureData);
  } catch (error) {
    next(error);
  }
}
'use strict'
import { Request, Response, NextFunction } from "express";
import { isAddress } from 'ethers/lib/utils';
import { LootboxesService } from "../../../services/LootboxesService";
import { messageResponse } from "../../../utils";

export const getMastersLootboxSignature = async (req: Request, res: Response, next: NextFunction) => {
  const lootboxesService = new LootboxesService();
  try {
    const { lootboxId, amount, receiver, currency, payWithTicket } = req.body;
    if (!isAddress(receiver)) {
      return messageResponse(res, 400, 'Invalid address');
    }
    if (!Number.isInteger(amount) || amount <= 0) {
      return messageResponse(res, 400, 'Invalid amount');
    }

    const lootbox = await lootboxesService.getLootboxById(Number(lootboxId));
    if (!lootbox || !lootbox.active) {
      return messageResponse(res, 404, 'Lootbox not found');
    }

    if (!lootbox.prices.find(price => price.currency === currency)) {
      return messageResponse(res, 400, 'Invalid currency');
    }

    const lootboxSignatureData = await lootboxesService.getLootboxSignatureData(lootbox, amount, receiver, currency, payWithTicket);
    return lootboxSignatureData;
  } catch (error) {
    next(error);
  }
}
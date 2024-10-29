'use strict'
import { Request, Response, NextFunction } from "express";
import { isAddress } from 'ethers/lib/utils';
import { LootboxesService } from "../../../services/LootboxesService";
import { messageResponse } from "../../../utils";
import { DefaultChainId } from "../../../contracts/networks";

export const getMastersLootboxJPSignature = async (req: Request, res: Response, next: NextFunction) => {
  const chainId = Number(req.query.chainId) || DefaultChainId;
  const lootboxesService = new LootboxesService(chainId);
  try {
    const { lootboxId, amount, receiver } = req.body;
    if (!isAddress(receiver)) {
      return messageResponse(res, 400, 'Invalid address');
    }
    if (!Number.isInteger(amount) || amount <= 0) {
      return messageResponse(res, 400, 'Invalid amount');
    }

    const lootbox = await lootboxesService.getLootboxById(Number(lootboxId));
    if (!lootbox || !lootbox.active || lootboxId == 2 || lootboxId == 4) {
      return messageResponse(res, 404, 'Lootbox not found');
    }

    const lootboxSignatureData = await lootboxesService.getLootboxJPSignatureData(lootbox, amount, receiver);
    return res.json(lootboxSignatureData);
  } catch (error) {
    next(error);
  }
}
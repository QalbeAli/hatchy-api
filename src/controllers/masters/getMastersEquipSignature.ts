'use strict'
import { Request, Response, NextFunction } from "express";
import { isAddress } from 'ethers/lib/utils';
import { EquipService } from '../../services/EquipService';
import { messageResponse } from '../../utils';

export const getMastersEquipSignature = async (req: Request, res: Response, next: NextFunction) => {
  const equipService = new EquipService();
  try {
    const { itemIds, owner, tokenId } = req.body;
    if (!isAddress(owner)) {
      return messageResponse(res, 400, 'Invalid address');
    }
    if (!itemIds || tokenId == null || isNaN(tokenId)) {
      return messageResponse(res, 400, 'Invalid itemIds or tokenId');
    }
    const equipSignatureData = await equipService.getEquipItemsSignatureData(owner, itemIds, tokenId);
    return res.json(equipSignatureData);
  } catch (error) {
    next(error);
  }
}
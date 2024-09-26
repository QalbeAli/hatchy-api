'use strict'
import { Request, Response, NextFunction } from "express";
import { isAddress } from 'ethers/lib/utils';
import { messageResponse } from "../../../utils";
import { ItemsService } from "../../../services/ItemsService";

export const getMastersItemsBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = req.params.address;
    if (!isAddress(address)) return messageResponse(res, 400, 'Invalid address');
    const itemsService = new ItemsService();
    const itemsBalance = await itemsService.getItemsBalance(address);
    return itemsBalance;
  } catch (error) {
    next(error);
  }
}
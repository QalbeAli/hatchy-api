'use strict'
import { Request, Response, NextFunction } from "express";
import { ItemsService } from '../../../services/ItemsService';

export const getMastersItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenId = req.params.tokenId;

    const itemsService = new ItemsService();
    const item = await itemsService.getItemById(Number(tokenId));
    return item;
  } catch (error) {
    next(error);
  }
}
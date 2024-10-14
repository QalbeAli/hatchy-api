'use strict'
import { Request, Response, NextFunction } from "express";
import { ItemsService } from '../../../services/ItemsService';
import { DefaultChainId } from "../../../contracts/networks";

export const getMastersItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenId = req.params.tokenId;
    const chainId = Number(req.query.chainId) || DefaultChainId;
    const itemsService = new ItemsService(chainId);
    const item = await itemsService.getItemById(Number(tokenId));
    return res.json(item);
  } catch (error) {
    next(error);
  }
}
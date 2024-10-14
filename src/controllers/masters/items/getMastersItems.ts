'use strict'
import { Request, Response, NextFunction } from "express";
import { ItemsService } from "../../../services/ItemsService";
import { DefaultChainId } from "../../../contracts/networks";

export const getMastersItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chainId = Number(req.query.chainId) || DefaultChainId;
    const itemsService = new ItemsService(chainId);
    const item = await itemsService.getAllItems();
    return res.json(item);
  } catch (error) {
    next(error);
  }
}
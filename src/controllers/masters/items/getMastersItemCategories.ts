"use strict";
import { Request, Response, NextFunction } from "express";
import { ItemsService } from "../../../services/ItemsService";
import { DefaultChainId } from "../../../contracts/networks";

export const getMastersItemCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chainId = Number(req.query.chainId) || DefaultChainId;
    const itemsService = new ItemsService(chainId);
    const categories = await itemsService.getItemCategories();
    return res.json(categories);
  } catch (error) {
    next(error);
  }
};

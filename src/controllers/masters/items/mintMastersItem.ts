'use strict'
import { Request, Response, NextFunction } from "express";
import { ItemsService } from "../../../services/ItemsService";

export const mintMastersItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;
    // const itemsService = new ItemsService();
    // const item = await itemsService.getAllItems();
    // return res.json(item);
    return res.json({
      message: `Minted item #${body.itemId}`
    })
  } catch (error) {
    next(error);
  }
}
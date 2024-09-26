'use strict'
import { Request, Response, NextFunction } from "express";
import { ItemsService } from "../../../services/ItemsService";

export const getMastersItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itemsService = new ItemsService();
    const item = await itemsService.getAllItems();
    return res.json(item);
  } catch (error) {
    next(error);
  }
}
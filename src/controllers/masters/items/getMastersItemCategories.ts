"use strict";
import { Request, Response, NextFunction } from "express";
import { ItemsService } from "../../../services/ItemsService";

export const getMastersItemCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itemsService = new ItemsService();
    const categories = await itemsService.getItemCategories();
    return res.json(categories);
  } catch (error) {
    next(error);
  }
};

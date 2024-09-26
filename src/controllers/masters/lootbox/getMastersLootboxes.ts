'use strict'
import { Request, Response, NextFunction } from "express";
import { LootboxesService } from "../../../services/LootboxesService";

export const getMastersLootboxes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gameId = req.query.gameId as string;
    const lootboxesService = new LootboxesService();
    const lootboxes = await lootboxesService.getLootboxes(gameId);
    return lootboxes;
  } catch (error) {
    next(error);
  }
}
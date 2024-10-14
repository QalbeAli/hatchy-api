'use strict'
import { Request, Response, NextFunction } from "express";
import { LootboxesService } from "../../../services/LootboxesService";
import { DefaultChainId } from "../../../contracts/networks";

export const getMastersLootboxes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chainId = Number(req.query.chainId) || DefaultChainId;
    const gameId = req.query.gameId as string;
    const lootboxesService = new LootboxesService(chainId);
    const lootboxes = await lootboxesService.getLootboxes(gameId);
    return res.json(lootboxes);
  } catch (error) {
    next(error);
  }
}
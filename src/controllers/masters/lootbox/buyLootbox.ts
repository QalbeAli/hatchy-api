'use strict'
import { Request, Response, NextFunction } from "express";
import { getUsername, messageResponse } from "../../../utils";
import { isAddress } from "ethers/lib/utils";
import { ItemsService } from "../../../services/ItemsService";
import UsersService from "../../../services/UsersService";
import { LootboxesService } from "../../../services/LootboxesService";
import { GameSavesService } from "../../../services/GameSavesService";

function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

export const buyLootbox = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lootboxId, amount, currency, saveId } = req.body;
    const chainId = 33669900; // Number(req.query.chainId) || DefaultChainId;
    const lootboxesService = new LootboxesService(chainId);
    const itemsService = new ItemsService(chainId);
    const gameSaves = new GameSavesService();

    const token = req.headers.authorization;
    const decoded = parseJwt(token);
    const username = await getUsername(decoded);
    const user = await UsersService.getUserById(username);

    if (!Number.isInteger(amount) || amount <= 0) {
      return messageResponse(res, 400, 'Invalid Amount');
    }

    if (!user.rewardReceiverAddress || !isAddress(user.rewardReceiverAddress)) {
      return messageResponse(res, 400, 'Invalid receiver address');
    }

    const lootbox = await lootboxesService.getLootboxById(Number(lootboxId));
    if (!lootbox || !lootbox.active || !lootbox.gameId) {
      return messageResponse(res, 404, 'Lootbox not found');
    }

    const lootboxPrice = lootbox.prices.find(price => price.currency === currency);
    if (!lootboxPrice) {
      return messageResponse(res, 400, 'Invalid currency');
    }

    const receiverAddress = user.rewardReceiverAddress;

    const selectedItemIds = await lootboxesService.getRandomSelectedItems(lootbox, amount, receiverAddress);
    const gameSaveExists = await gameSaves.gameSaveExists(saveId, username);
    if (!gameSaveExists) {
      return messageResponse(res, 401, 'Game Save not found');
    }
    const totalPrice = Number(lootboxPrice.price) * amount;
    await gameSaves.consumeCurrency(saveId, currency, totalPrice);
    const tx = await itemsService.mintRewardItem(receiverAddress, selectedItemIds, Array.from({ length: selectedItemIds.length }, () => 1));
    console.log(`tx Hash: ${tx.hash}`);
    const items = await itemsService.getItemsByIds(selectedItemIds);
    // transform the items array using the selectedItemIds so each item has the amount, the selectedItemIds can be [1, 1, 2, 3] for example
    // and the items array can be [{id: 1}, {id: 2}, {id: 3}]
    // the transformed array should be [{id: 1, amount: 2}, {id: 2, amount: 1}, {id: 3, amount: 1}]
    const itemsWithAmount = items.map((item) => {
      return {
        ...item,
        amount: selectedItemIds.filter((itemId) => itemId === item.id).length
      }
    });

    return res.json(itemsWithAmount);
  } catch (error) {
    next(error);
  }
}
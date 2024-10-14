'use strict'
import { Request, Response, NextFunction } from "express";
import { isValidAPIKey, messageResponse } from "../../../utils";
import { ApiKeysService } from "../../../services/ApiKeysService";
import { isAddress } from "ethers/lib/utils";
import { ItemsService } from "../../../services/ItemsService";
import { DefaultChainId } from "../../../contracts/networks";

export const mintMastersItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { apiKey, clientId, itemId, receiver, amount } = req.body;
    const chainId = Number(req.query.chainId) || DefaultChainId;
    if (amount <= 0) {
      return messageResponse(res, 400, 'Amount must be greater than 0');
    }

    if (!isAddress(receiver)) {
      return messageResponse(res, 400, 'Invalid receiver address');
    }

    const keyData = await isValidAPIKey(apiKey, clientId, 'masters-items');
    if (!keyData.valid) {
      return messageResponse(res, 401, 'Invalid API key');
    }
    const updateData = {};

    if (keyData.key.mastersItemsLimit <= 0 || keyData.key.mastersItemsLimit < amount) {
      return messageResponse(res, 401, 'Masters items limit reached');
    }
    updateData['mastersItemsLimit'] = keyData.key.mastersItemsLimit - amount;
    const apiKeysService = new ApiKeysService();
    await apiKeysService.updateApiKey(clientId, updateData);

    const itemsService = new ItemsService(chainId);
    const item = await itemsService.getItemById(Number(itemId));
    if (!item) {
      return messageResponse(res, 400, 'Invalid item id');
    }
    const tx = await itemsService.mintRewardItem(receiver, [itemId], [amount])
    console.log(`tx Hash: ${tx.hash}`);
    return res.json({
      message: `Minted item #${itemId}`
    })
  } catch (error) {
    next(error);
  }
}
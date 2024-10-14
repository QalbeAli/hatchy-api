'use strict'
import { Request, Response, NextFunction } from "express";
import { isAddress } from 'ethers/lib/utils';
import { messageResponse } from "../../../utils";
import { ItemsService } from "../../../services/ItemsService";
import { DefaultChainId } from "../../../contracts/networks";

export const getMastersItemsBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = req.params.address;
    const chainId = Number(req.query.chainId) || DefaultChainId;
    if (!isAddress(address)) return messageResponse(res, 400, 'Invalid address');
    const itemsService = new ItemsService(chainId);
    const itemsBalance = await itemsService.getItemsBalance(address);
    return res.json(itemsBalance);
  } catch (error) {
    console.log(error);
    next(error);
  }
}
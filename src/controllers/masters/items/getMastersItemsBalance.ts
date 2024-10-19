'use strict'
import { Request, Response, NextFunction } from "express";
import { isAddress } from 'ethers/lib/utils';
import { messageResponse } from "../../../utils";
import { ItemsService } from "../../../services/ItemsService";
import { DefaultChainId } from "../../../contracts/networks";
import { subnetChainId } from "../../../constants";

function mergeArrays(arr1: any[], arr2: any[]) {
  const mergedMap = new Map();
  // Add all items from the first array to the map
  arr1.forEach(item => {
    mergedMap.set(item.id, { ...item });
  });
  // Iterate over the second array
  arr2.forEach(item => {
    if (mergedMap.has(item.id)) {
      // If the item exists in both arrays, increase the balance
      mergedMap.get(item.id).balance += item.balance;
    } else {
      // Otherwise, add the item
      mergedMap.set(item.id, { ...item });
    }
  });
  // Convert the map back to an array
  return Array.from(mergedMap.values());
}

export const getMastersItemsBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = req.params.address;
    const chainId = Number(req.query.chainId) || DefaultChainId;
    const includeSubnet = req.query.includeSubnet === 'true' ? true : false;

    if (!isAddress(address)) return messageResponse(res, 400, 'Invalid address');
    const itemsService = new ItemsService(chainId);
    const itemsBalance = await itemsService.getItemsBalance(address);
    if (!includeSubnet) return res.json(itemsBalance);

    const itemsServiceSubnet = new ItemsService(subnetChainId);
    const itemsBalanceSubnet = await itemsServiceSubnet.getItemsBalance(address);
    const mergedItemsBalance = mergeArrays(itemsBalance, itemsBalanceSubnet);
    return res.json(mergedItemsBalance);
  } catch (error) {
    console.log(error);
    next(error);
  }
}
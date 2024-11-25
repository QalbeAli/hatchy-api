import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  Tags,
} from "tsoa";
import { DefaultChainId } from "../contracts/networks";
import { MastersService } from "../services/MastersService";
import { MastersTrait } from "./models/MastersTrait";
import { ItemsService } from "../services/ItemsService";
import { ItemCategory } from "./models/ItemCategory";
import { MastersItem } from "./models/MastersItem";
import { isAddress } from "ethers/lib/utils";
import { subnetChainId } from "../constants";
import { isValidAPIKey } from "../utils";
import { ApiKeysService } from "../services/ApiKeysService";
import { MastersItemBalance } from "./models/MastersItemBalance";

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

@Route("masters")
@Tags("Masters")
export class ItemsController extends Controller {
  @Post("items/mint")
  public async mintMastersItem(
    @Body() body: {
      apiKey: string,
      clientId: string,
      itemId: number,
      receiver: string,
      amount: number,
    },
    @Query() chainId?: number,
  ): Promise<{
    message: string
  }> {
    const { apiKey, clientId, itemId, receiver, amount } = body;
    if (amount <= 0) {
      this.setStatus(400);
      return // messageResponse(res, 400, 'Amount must be greater than 0');
    }

    if (!isAddress(receiver)) {
      this.setStatus(400);
      return // messageResponse(res, 400, 'Invalid receiver address');
    }

    const keyData = await isValidAPIKey(apiKey, clientId, 'masters-items');
    if (!keyData.valid) {
      this.setStatus(401);
      return // messageResponse(res, 401, 'Invalid API key');
    }
    const updateData = {};

    if (keyData.key.mastersItemsLimit <= 0 || keyData.key.mastersItemsLimit < amount) {
      this.setStatus(401);
      return // messageResponse(res, 401, 'Masters items limit reached');
    }
    updateData['mastersItemsLimit'] = keyData.key.mastersItemsLimit - amount;
    const apiKeysService = new ApiKeysService();
    await apiKeysService.updateApiKey(clientId, updateData);

    const itemsService = new ItemsService(chainId || DefaultChainId);
    const item = await itemsService.getItemById(Number(itemId));
    if (!item) {
      this.setStatus(400);
      return // messageResponse(res, 400, 'Invalid item id');
    }
    const tx = await itemsService.mintRewardItem(receiver, [itemId], [amount])
    console.log(`tx Hash: ${tx.hash}`);
    return {
      message: `Minted item #${itemId}`
    }
  }

  @Get("items/categories")
  public async getMastersItemCategories(
    @Query() chainId?: number,
  ): Promise<ItemCategory[]> {
    const itemsService = new ItemsService(chainId || DefaultChainId);
    const categories = await itemsService.getItemCategories();
    return categories as ItemCategory[];
  }

  @Get("items/balance/{address}")
  public async getMastersItemsBalance(
    @Path() address: string,
    @Query() chainId?: number,
    @Query() includeSubnet?: boolean,
  ): Promise<MastersItemBalance[]> {
    if (!isAddress(address)) {
      this.setStatus(400);
      return; // messageResponse(res, 400, 'Invalid address');     
    }
    const itemsService = new ItemsService(chainId || DefaultChainId);
    const itemsBalance = await itemsService.getItemsBalance(address);
    if (!includeSubnet) return itemsBalance;

    const itemsServiceSubnet = new ItemsService(subnetChainId);
    const itemsBalanceSubnet = await itemsServiceSubnet.getItemsBalance(address);
    const mergedItemsBalance = mergeArrays(itemsBalance, itemsBalanceSubnet);
    return mergedItemsBalance;
  }

  @Get("items/{tokenId}")
  public async getMastersItem(
    @Path() tokenId: string,
    @Query() chainId?: number,
  ): Promise<MastersItem> {
    const tokenIdNumber = Number(tokenId.length >= 64 ?
      `0x${tokenId}` :
      tokenId
    );
    const itemsService = new ItemsService(chainId || DefaultChainId);
    const item = await itemsService.getItemById(tokenIdNumber);
    return ({
      ...item,
      attributes: [
        {
          "trait_type": "Rarity",
          "value": item.rarity
        },
        {
          "trait_type": "Effects",
          "value": item.effects || "None"
        },
        {
          "trait_type": "Category",
          "value": item.category.name || "None"
        }
      ]
    } as unknown) as MastersItem;
  }

  @Get("items")
  public async getMastersItems(
    @Query() chainId?: number,
  ): Promise<MastersItem[]> {
    const itemsService = new ItemsService(chainId || DefaultChainId);
    const items = await itemsService.getAllItems();
    return (items as unknown) as MastersItem[];
  }
}
import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { DefaultChainId, getAddress } from "../contracts/networks";
import { ItemsService } from "./services/ItemsService";
import { ItemCategory } from "./models/ItemCategory";
import { MastersItem } from "./models/MastersItem";
import { isAddress } from "ethers/lib/utils";
import { subnetChainId } from "../../constants";
import { isValidAPIKey } from "../../utils";
import { ApiKeysService } from "../../services/ApiKeysService";
import { MastersItemBalance } from "./models/MastersItemBalance";
import { UsersService } from "../users/usersService";
import { NotFoundError } from "../../errors/not-found-error";
import { BadRequestError } from "../../errors/bad-request-error";
import { VouchersService } from "../vouchers/vouchers-service";

function mergeItems(arr: any[]) {
  const mergedMap = new Map();
  // Add all items from the flattened array to the map
  arr.forEach(item => {
    if (mergedMap.has(item.id)) {
      // If the item exists in both arrays, increase the balance
      mergedMap.get(item.id).balance += item.balance;
    } else {
      // Otherwise, add the item
      mergedMap.set(item.id, { ...item });
    }
  });
  // Convert the map back to an array
  const finalArray = Array.from(mergedMap.values());
  return finalArray;
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
      throw new BadRequestError("Invalid address");
    }
    const itemsService = new ItemsService(chainId || DefaultChainId);
    const itemsBalance = await itemsService.getItemsBalance(address);
    if (!includeSubnet) return itemsBalance;

    const itemsServiceSubnet = new ItemsService(subnetChainId);
    const itemsBalanceSubnet = await itemsServiceSubnet.getItemsBalance(address);

    const mergedItemsBalance = mergeItems(
      itemsBalance.concat(itemsBalanceSubnet)
    );
    return mergedItemsBalance;
  }

  @Security("jwt")
  @Get("items/balance")
  public async getAccountMastersItemsBalance(
    @Request() request: any,
    @Query() chainId?: number,
    @Query() includeSubnet?: boolean,
    @Query() includeVouchers?: boolean,
  ): Promise<MastersItemBalance[]> {
    const linkedWallets = await new UsersService().getLinkedWallets(request.user.uid);
    if (!linkedWallets || linkedWallets.length === 0) {
      throw new NotFoundError("No linked wallet found for the user");
    }
    const itemsService = new ItemsService(chainId || DefaultChainId);
    const balancePromises = linkedWallets.map(w => itemsService.getItemsBalance(w.address));
    const itemsBalanceArray = await Promise.all(balancePromises);
    if (includeVouchers) {
      const vouchersService = new VouchersService(chainId || DefaultChainId);
      const vouchers = await vouchersService.getVouchersOfUser(request.user.uid);
      const mastersItemsVouchers = vouchers.filter(v => v.contract === getAddress("mastersItems", chainId || DefaultChainId));
      const itemsData = await itemsService.getItemsByIds(mastersItemsVouchers.map(v => Number(v.tokenId)));
      itemsBalanceArray.push(itemsData.map(v => ({
        ...v,
        balance: mastersItemsVouchers.find(m => Number(m.tokenId) === v.id)?.amount || 0
      })));
    }

    if (!includeSubnet) return mergeItems(itemsBalanceArray.flat());

    const itemsServiceSubnet = new ItemsService(subnetChainId);
    const balancePromisesSubnet = linkedWallets.map(w => itemsServiceSubnet.getItemsBalance(w.address));
    const itemsBalanceArraySubnet = await Promise.all(balancePromisesSubnet);
    return mergeItems(itemsBalanceArray.flat().concat(itemsBalanceArraySubnet.flat()));
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
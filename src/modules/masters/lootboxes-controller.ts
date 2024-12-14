import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { LootboxesService } from "./services/LootboxesService";
import { DefaultChainId } from "../contracts/networks";
import { MastersLootbox } from "./models/MastersLootbox";
import { ItemsService } from "./services/ItemsService";
import { isAddress } from "ethers/lib/utils";
import { MastersLootboxSignature } from "./models/MastersLootboxSignature";
import { MastersLootboxJoepegsSignature } from "./models/MastersLootboxJoepegsSignature";
import { MastersItem } from "./models/MastersItem";
import { UsersService } from "../users/usersService";
import { BadRequestError } from "../../errors/bad-request-error";
import { NotFoundError } from "../../errors/not-found-error";
import { GamesSavesService } from "../games/games-saves-service";

@Route("masters")
@Tags("Masters")
export class LootboxesController extends Controller {
  @Security("jwt")
  @Post("lootbox/buy")
  public async buyLootbox(
    @Request() request,
    @Body() body: {
      lootboxId: number,
      amount: number,
      currency: string,
      saveId: string
    }
  ): Promise<MastersItem[]> {
    const chainId = 33669900;
    const lootboxesService = new LootboxesService(chainId);
    const itemsService = new ItemsService(chainId);
    const gameSaves = new GamesSavesService();
    const { lootboxId, amount, currency, saveId } = body;

    const usersService = new UsersService();
    const user = await usersService.get(request.user.uid);

    if (!Number.isInteger(amount) || amount <= 0) {
      throw new BadRequestError('Invalid amount');
    }

    if (!user.rewardReceiverAddress || !isAddress(user.rewardReceiverAddress)) {
      throw new BadRequestError('Invalid receiver address');
    }

    const lootbox = await lootboxesService.getLootboxById(Number(lootboxId));
    if (!lootbox || !lootbox.active || !lootbox.gameId) {
      throw new NotFoundError('Lootbox not found');
    }

    const lootboxPrice = lootbox.prices.find(price => price.currency === currency);
    if (!lootboxPrice) {
      throw new BadRequestError('Invalid currency');
    }

    const receiverAddress = user.rewardReceiverAddress;

    const selectedItemIds = await lootboxesService.getRandomSelectedItems(lootbox, amount, receiverAddress);
    const gameSave = await gameSaves.getGameSaveById(saveId);
    if (!gameSave || gameSave.userId !== user.uid) {
      throw new NotFoundError('Game Save not found');
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

    return ((itemsWithAmount as unknown) as MastersItem[]);
  }

  @Post("lootbox/joepegs")
  public async getMastersLootboxJPSignature(
    @Body() request: {
      lootboxId: number,
      amount: number,
      receiver: string,
    },
    @Query() chainId?: number,
  ): Promise<MastersLootboxJoepegsSignature> {
    const { lootboxId, amount, receiver } = request;
    const lootboxesService = new LootboxesService(chainId || DefaultChainId);
    if (!isAddress(receiver)) {
      this.setStatus(400);
      return // messageResponse(res, 400, 'Invalid address');
    }
    if (!Number.isInteger(amount) || amount <= 0) {
      this.setStatus(400);
      return // messageResponse(res, 400, 'Invalid amount');
    }

    const lootbox = await lootboxesService.getLootboxById(Number(lootboxId));
    if (!lootbox || !lootbox.active || lootboxId == 2 || lootboxId == 4) {
      this.setStatus(404);
      return // messageResponse(res, 404, 'Lootbox not found');
    }

    const lootboxSignatureData = await lootboxesService.getLootboxJPSignatureData(lootbox, amount, receiver);
    return ((lootboxSignatureData as unknown) as MastersLootboxJoepegsSignature);
  }

  @Get("lootbox")
  public async getMastersLootboxes(
    @Query() chainId?: number,
    @Query() gameId?: string,
  ): Promise<MastersLootbox[]> {
    const lootboxesService = new LootboxesService(chainId || DefaultChainId);
    const lootboxes = await lootboxesService.getLootboxes(gameId);
    return (lootboxes as unknown) as MastersLootbox[];
  }

  @Post("lootbox")
  public async getMastersLootboxSignature(
    @Body() request: {
      lootboxId: number,
      receiver: string,
      amount: number,
      currency: string,
      payWithTicket?: boolean
    },
    @Query() chainId?: number,
  ): Promise<MastersLootboxSignature> {
    const { lootboxId, amount, receiver, currency, payWithTicket } = request;
    const lootboxesService = new LootboxesService(chainId || DefaultChainId);
    // const { lootboxId, amount, receiver, currency, payWithTicket } = req.body;
    if (!isAddress(receiver)) {
      this.setStatus(400);
      return // messageResponse(res, 400, 'Invalid address');
    }
    if (!Number.isInteger(amount) || amount <= 0) {
      this.setStatus(400);
      return // messageResponse(res, 400, 'Invalid amount');
    }

    const lootbox = await lootboxesService.getLootboxById(Number(lootboxId));
    if (!lootbox || !lootbox.active) {
      this.setStatus(404);
      return // messageResponse(res, 404, 'Lootbox not found');
    }

    if (!lootbox.prices.find(price => price.currency === currency)) {
      this.setStatus(400);
      return // messageResponse(res, 400, 'Invalid currency');
    }

    const lootboxSignatureData = await lootboxesService.getLootboxSignatureData(lootbox, amount, receiver, currency, payWithTicket);
    return ((lootboxSignatureData as unknown) as MastersLootboxSignature);
  }

}
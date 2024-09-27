import { ItemsService } from "./ItemsService";
import { MastersLootbox } from "../entities/MastersLootbox";
import seedrandom from 'seedrandom';
import { BigNumber, ethers } from "ethers";
import { Loaded } from "@mikro-orm/core";
import { DI } from "..";
import { HatchyTicketsContract, MastersItemsContract } from "../contracts/contracts";
import config from "../config";

export class LootboxesService {
  async getLootboxes(gameId?: string) {
    const lootboxes = await DI.mastersLootboxes.findAll({
      where: {
        active: true,
        gameId: gameId
      },
      populate: ['prices', 'genderId']
    });
    return lootboxes;
  }

  async getLootboxById(id: number) {
    const lootbox = await DI.mastersLootboxes.findOne(id, {
      fields: ['id', 'active', 'ticketId', 'prices', 'itemWeights.item.id', 'itemWeights.weight'],
      populate: ['prices', 'itemWeights', 'itemWeights.item']
    });
    return lootbox;
  }

  async getLootboxSignatureData(
    lootbox: Loaded<MastersLootbox, "itemWeights" | "prices" | "itemWeights.item", "active" | "prices" | "id" | "ticketId" | "itemWeights.weight" | "itemWeights.item.id", never>,
    amount: number,
    receiver: string,
    currency: string,
    payWithTicket: boolean
  ) {
    const itemsService = new ItemsService();
    const mintedItems = await MastersItemsContract.mintedItems(receiver);
    const seed = `${receiver}-${mintedItems}-${config.RANDOM_SEED}`;
    const rng = seedrandom(seed);

    const itemIdsSelection: number[] = [];
    const totalWeight = lootbox.itemWeights.reduce((sum, itemWeight) => sum + itemWeight.weight, 0);
    for (let i = 0; i < amount; i++) {
      let random = rng() * totalWeight;
      for (const itemWeight of lootbox.itemWeights) {
        random -= itemWeight.weight;
        if (random <= 0) {
          itemIdsSelection.push(itemWeight.item.id);
          break;
        }
      }
    }
    const nonce = BigNumber.from(ethers.utils.randomBytes(32));
    const amounts = Array.from({ length: itemIdsSelection.length }, () => 1);

    if (payWithTicket) {
      const ticketsBalance = await HatchyTicketsContract.balanceOf(receiver, lootbox.ticketId);
      if (ticketsBalance.eq(0)) {
        throw new Error("No tickets available to mint item");
      }
      const price = ethers.utils.parseUnits("0", 18);
      const currencyAddress = ethers.constants.AddressZero;
      const [signature, items] = await Promise.all([
        itemsService.getTokenSignature(
          itemIdsSelection,
          amounts,
          receiver,
          nonce,
          currencyAddress,
          price,
          true,
          lootbox.ticketId
        ),
        itemsService.getItemsByIds(itemIdsSelection)
      ]);

      return {
        receiver,
        tokenIds: itemIdsSelection,
        items,
        amounts,
        nonce,
        claimableUntil: 0,
        currency: currencyAddress, // lootboxPrice.address,
        price, // price.toString(),
        decimals: 18, // lootboxPrice?.decimals,
        payWithTicket: true,
        ticketId: lootbox.ticketId,
        signature
      }
    } else {
      const lootboxPrice = lootbox.prices.find(price => price.currency === currency);
      const singleLootboxPrice = ethers.utils.parseUnits(lootboxPrice?.price, lootboxPrice.decimals);
      const price = singleLootboxPrice.mul(amount);
      const [signature, items] = await Promise.all([
        itemsService.getTokenSignature(itemIdsSelection, amounts, receiver, nonce, lootboxPrice.address, price, false, 0),
        itemsService.getItemsByIds(itemIdsSelection)
      ]);

      return {
        receiver,
        tokenIds: itemIdsSelection,
        items,
        amounts,
        nonce,
        claimableUntil: 0,
        currency: lootboxPrice.address,
        price: price.toString(),
        decimals: lootboxPrice?.decimals,
        payWithTicket: false,
        ticketId: 0,
        signature
      }
    }
  }
}
import { ItemsService } from "./ItemsService";
import { MastersLootbox } from "../entities/MastersLootbox";
import seedrandom from 'seedrandom';
import { BigNumber, ethers } from "ethers";
import { Loaded } from "@mikro-orm/core";
import { DI } from "..";
import config from "../config";
import { DefaultChainId, getContract } from "../contracts/networks";

export class LootboxesService {
  chainId: number;

  constructor(chainId?: number) {
    this.chainId = chainId || DefaultChainId;
  }

  async getLootboxes(gameId?: string) {
    const lootboxes = await DI.mastersLootboxes.findAll({
      where: {
        active: true,
        gameId: gameId,
        chainId: this.chainId
      },
      populate: ['prices', 'genderId']
    });
    return lootboxes;
  }

  async getLootboxById(id: number) {
    const lootbox = await DI.mastersLootboxes.findOne(id, {
      fields: ['id', 'active', 'ticketId', 'prices', 'itemWeights.item.id', 'itemWeights.weight', 'gameId'],
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
    const itemsService = new ItemsService(this.chainId);
    const itemsContract = getContract('mastersItems', this.chainId);
    const ticketsContract = getContract('hatchyTickets', this.chainId);
    const mintedItems = await itemsContract.mintedItems(receiver);
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
      const ticketsBalance = await ticketsContract.balanceOf(receiver, lootbox.ticketId);
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

  async getLootboxJPSignatureData(
    lootbox: Loaded<MastersLootbox, "itemWeights" | "prices" | "itemWeights.item", "active" | "prices" | "id" | "ticketId" | "itemWeights.weight" | "itemWeights.item.id", never>,
    amount: number,
    receiver: string
  ) {
    const itemsService = new ItemsService(this.chainId);
    const itemsContract = getContract('mastersItems', this.chainId);
    const joepegsContract = getContract('joepegsTickets', this.chainId);
    const mintedItems = await itemsContract.mintedItems(receiver);
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

    const ticketsBalance = await joepegsContract.balanceOf(receiver, lootbox.ticketId);
    if (ticketsBalance.eq(0)) {
      throw new Error("No tickets available to mint item");
    }
    const [signature, items] = await Promise.all([
      itemsService.getJPTicketSignature(
        itemIdsSelection,
        amounts,
        receiver,
        nonce,
      ),
      itemsService.getItemsByIds(itemIdsSelection)
    ]);

    return {
      receiver,
      tokenIds: itemIdsSelection,
      items,
      amounts,
      nonce,
      signature
    }
  }



  async getRandomSelectedItems(
    lootbox: Loaded<MastersLootbox, "itemWeights" | "prices" | "itemWeights.item", "active" | "prices" | "id" | "ticketId" | "itemWeights.weight" | "itemWeights.item.id", never>,
    amount: number,
    receiver: string,
  ) {
    const itemsContract = getContract('mastersItems', this.chainId);
    const mintedItems = await itemsContract.mintedItems(receiver);
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
    return itemIdsSelection;
  }
}
import { BigNumber, Wallet, ethers } from "ethers";
import { DI } from "../../.."
import { CreateItemParams } from "../../../models/CreateItemParams";
import config from "../../../config";
import { DefaultChainId, getContract } from "../../contracts/networks";

export class ItemsService {
  chainId: number;

  constructor(chainId?: number) {
    this.chainId = chainId || DefaultChainId;
  }

  async addItem(item: CreateItemParams) {
    const itemsWithSameCategory = await DI.items.find({ category: item.categoryId });

    const category = await DI.itemCategories.findOne({ id: item.categoryId });
    const traitId = itemsWithSameCategory.length + 1;

    const newItem = DI.items.create({
      name: item.name || `${category.name} ${traitId}`,
      description: item.description,
      image: item.image,
      frontImage: item.frontImage,
      backImage: item.backImage,
      maskImage: item.maskImage,
      category: item.categoryId,
      gender: item.genderId,
    });
    await DI.items.insert(newItem);
    return newItem;
  }

  async getItemById(id: number) {
    const item = await DI.items.findOne(
      { id },
      {
        populate: ['category', 'gender']
      }
    );
    return item;
  }

  async getAllItems() {
    const items = await DI.items.findAll(
      {
        populate: ['category', 'category.type', 'category.type.layers', 'gender']
      }
    );
    return items;
  }

  async getItemsCount() {
    const items = await DI.items.count();
    return items;
  }

  async getItemIds(gender: number) {
    const ids = await DI.items.find(
      {
        $or: [
          {
            gender
          },
          {
            gender: null
          }
        ]
      },
      {
        fields: ['id']
      }
    );
    return ids;
  }

  async getItems() {
    const items = await DI.items.findAll();
    return items;
  };

  async getItemsByIds(ids: number[]) {
    const items = await DI.items.find({ id: { $in: ids } }, {
      populate: ['category', 'category.type', 'category.type.layers', 'gender']
    });
    return items;
  }

  async getTokenSignature(
    itemIds: number[],
    amounts: number[],
    receiver: string,
    nonce: BigNumber,
    currencyAddress: string,
    price: BigNumber,
    payWithTicket: boolean,
    ticketId: number
  ) {
    const provider = new ethers.providers.JsonRpcProvider(config.JSON_RPC_URL);
    const signer = new Wallet(config.MASTERS_SIGNER_KEY, provider);
    const hash = ethers.utils.solidityKeccak256(
      ['address', 'uint256[]', 'uint256[]', 'uint256', 'uint256', 'address', 'uint256', 'bool', 'uint256'],
      [receiver, itemIds, amounts, nonce, 0, currencyAddress, price, payWithTicket, ticketId]);

    const signature = await signer.signMessage(ethers.utils.arrayify(hash));
    return signature;
  }

  async getJPTicketSignature(
    itemIds: number[],
    amounts: number[],
    receiver: string,
    nonce: BigNumber,
  ) {
    const provider = new ethers.providers.JsonRpcProvider(config.JSON_RPC_URL);
    const signer = new Wallet(config.MASTERS_SIGNER_KEY, provider);
    const hash = ethers.utils.solidityKeccak256(
      ['address', 'uint256[]', 'uint256[]', 'uint256'],
      [receiver, itemIds, amounts, nonce]);

    const signature = await signer.signMessage(ethers.utils.arrayify(hash));
    return signature;
  }

  async getItemsBalance(address: string) {
    const items = await DI.items.findAll({
      populate: ['category', 'category.type', 'category.type.layers', 'gender']
    });
    const itemsContract = getContract('mastersItems', this.chainId);
    const balance: BigNumber[] = await itemsContract.balanceOfBatch(
      Array(items.length).fill(address),
      items.map((i) => i.id)
    );

    const itemsBalance = [];
    balance.forEach((b, i) => {
      if (b.gt(0)) {
        itemsBalance.push({
          balance: b.toNumber(),
          ...items[i]
        });
      }
    });
    return itemsBalance;
  }

  async getItemCategories() {
    try {
      const categories = await DI.itemCategories.findAll({
        fields: ['id', 'name'],
      });
      return categories;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async mintRewardItem(receiver: string, ids: number[], amounts: number[]) {
    console.log(receiver, ids, amounts, this.chainId);
    const itemsContract = getContract('mastersItems', this.chainId, true);
    const tx = await itemsContract.mintRewardItem(receiver, ids, amounts);
    return tx;
  }
}
import { BigNumber, Wallet, ethers } from "ethers";
import { MastersItemsContract, MastersPFPContract } from "../contracts/contracts";
import { createArrayOf } from "../utils";
import { DI } from "..";


const bodyTraitType = 1;
export class EquipService {
  async getLootboxes() {
    const lootboxes = await DI.mastersLootboxes.findAll({
      where: {
        active: true
      },
    });
    return lootboxes;
  }

  async getLootboxById(id: number) {
    const lootbox = await DI.mastersLootboxes.findOne(id);
    return lootbox;
  }

  async getEquipItemsSignatureData(owner: string, itemIds: number[], tokenId: number) {
    const [_owner, balances, _equippedItems] = await Promise.all([
      MastersPFPContract.ownerOf(tokenId),
      MastersItemsContract.balanceOfBatch(
        createArrayOf(itemIds.length, owner),
        itemIds
      ),
      MastersPFPContract.getEquippedItems(tokenId)
    ]);

    if (ethers.utils.getAddress(_owner) !== ethers.utils.getAddress(owner)) {
      throw new Error("Invalid owner of token");
    }

    const equippedItems = _equippedItems.map(item => Number(item)).filter((item) => item !== 0);
    for (let i = 0; i < balances.length; i++) {
      const balance = balances[i];
      const itemId = itemIds[i];
      if (
        !equippedItems.includes(itemId)
        && balance.lt(1)
      ) {
        throw new Error("Insufficient balance to equip items");
      }
    }

    // get gender
    const traits: number[] = await MastersPFPContract.getTraits(tokenId);
    const nonNullTraits = traits.map(trait => Number(trait)).filter((trait) => trait !== 0);
    const bodyTrait = await DI.traits.find(
      {
        id: { $in: nonNullTraits },
        type: bodyTraitType
      }
    );
    const gender = bodyTrait[0].gender.id;

    // validate items
    const items = await DI.items.findAll({
      where: {
        id: { $in: itemIds }
      },
      populate: ['category', 'category.type', 'category.type.layers', 'gender']
    });
    if (items.length !== itemIds.length) {
      throw new Error("Invalid item ids");
    }
    const types = new Set();
    const itemIdsPositioned = Array.from({ length: 20 }, () => 0);
    for (const item of items) {
      if (item.gender && item.gender.id !== gender) {
        throw new Error("Invalid genre");
      }
      if (types.has(item.category.type.id)) {
        throw new Error("Duplicate item types");
      }
      types.add(item.category.type.id);
      itemIdsPositioned[item.category.type.id] = item.id;
    }

    const provider = new ethers.providers.JsonRpcProvider(process.env.JSON_RPC_URL);
    const signer = new Wallet(process.env.MASTERS_SIGNER_KEY, provider);
    const nonce = BigNumber.from(ethers.utils.randomBytes(32));

    const hash = ethers.utils.solidityKeccak256(
      ['address', 'uint256', 'uint256[]', 'uint256'],
      [owner, tokenId, itemIdsPositioned, nonce]);
    const signature = await signer.signMessage(ethers.utils.arrayify(hash));

    return {
      owner,
      itemIds: itemIdsPositioned,
      tokenId,
      nonce,
      signature
    }
  }
}
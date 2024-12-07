import { MastersLootbox } from './MastersLootbox';

export class LootboxPrice {
  lootbox?: MastersLootbox;
  currency!: string;
  price!: string;
  decimals!: number;
  address!: string;
  image!: string;
}